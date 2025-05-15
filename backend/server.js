// server.js
import express from "express";
import fs from "fs";
import cron from "node-cron";
import { AptosClient } from "@aptos-labs/aptos";

// ─── Configuration ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const RPC_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
const CONTRACT_ADDRESS = "0xYourDeployedAddress";         // <— replace!
const MODULE_NAME = "CrowdFund";                          // your Move module name
// Resource paths
const CAMPAIGN_RESOURCE = `${CONTRACT_ADDRESS}::${MODULE_NAME}::CampaignTable`;
const CONTRIB_RESOURCE  = `${CONTRACT_ADDRESS}::${MODULE_NAME}::ContributionEvents`;
// Field names in your resources
const CREATED_HANDLE_FIELD = "handle_created";             // name you gave the CampaignCreatedEvent handle
const CONTRIB_HANDLE_FIELD  = "handle";                    // name you gave the ContributeEvent handle
// How many events to fetch per poll
const POLL_LIMIT = 1000;

// ─── State & Data Stores ─────────────────────────────────────────────────────
// Load cursor state
const statePath = "./state.json";
let state = JSON.parse(fs.readFileSync(statePath, "utf8"));
// In-memory stores
let campaigns    = {}; // { [campaignId]: { id, creator, token, goal, recipient, title, description, image_url, created_at, raised } }
let contributions = {}; // { [campaignId]: [ { contributor, amount, timestamp } ] }

// Aptos client
const client = new AptosClient(RPC_URL);

// ─── Helper: persist state.json ────────────────────────────────────────────────
function persistState() {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
}

// ─── 1) Fetch new CampaignCreatedEvent ────────────────────────────────────────
async function fetchNewCampaigns() {
  try {
    // 1a) Get the resource to access the event handle
    const resource = await client.getAccountResource(CONTRACT_ADDRESS, CAMPAIGN_RESOURCE);
    const handle   = resource.data[CREATED_HANDLE_FIELD];

    // 1b) Fetch events since lastCampaignSeq
    const events = await client.getEventsByEventHandle(
      CONTRACT_ADDRESS,
      CAMPAIGN_RESOURCE,
      CREATED_HANDLE_FIELD,
      state.lastCampaignSeq,
      POLL_LIMIT
    );
    if (!events.length) return;

    for (const evt of events) {
      const { id, creator, token, goal, recipient, title, description, image_url, timestamp } = evt.data;
      // Store metadata + initialize raised to 0
      campaigns[id] = {
        id,
        creator,
        token,
        goal: Number(goal),
        recipient,
        title,
        description,
        image_url,
        created_at: Number(timestamp),
        raised: 0,
      };
      contributions[id] = [];
      // Advance cursor
      state.lastCampaignSeq = evt.sequence_number > state.lastCampaignSeq
        ? evt.sequence_number
        : state.lastCampaignSeq;
    }
    persistState();
    console.log(`Fetched ${events.length} new campaigns`);
  } catch (e) {
    console.error("Error fetching campaigns:", e);
  }
}

// ─── 2) Fetch new ContributeEvent ─────────────────────────────────────────────
async function fetchNewContributions() {
  try {
    const resource = await client.getAccountResource(CONTRACT_ADDRESS, CONTRIB_RESOURCE);
    const handle   = resource.data[CONTRIB_HANDLE_FIELD];

    const events = await client.getEventsByEventHandle(
      CONTRACT_ADDRESS,
      CONTRIB_RESOURCE,
      CONTRIB_HANDLE_FIELD,
      state.lastContributionSeq,
      POLL_LIMIT
    );
    if (!events.length) return;

    for (const evt of events) {
      const { campaign_id, contributor, amount, timestamp } = evt.data;
      // Record the contribution
      const amt = Number(amount);
      if (!contributions[campaign_id]) contributions[campaign_id] = [];
      contributions[campaign_id].push({ contributor, amount: amt, timestamp: Number(timestamp) });
      // Update total raised
      if (campaigns[campaign_id]) {
        campaigns[campaign_id].raised += amt;
      }
      // Advance cursor
      state.lastContributionSeq = evt.sequence_number > state.lastContributionSeq
        ? evt.sequence_number
        : state.lastContributionSeq;
    }
    persistState();
    console.log(`Fetched ${events.length} new contributions`);
  } catch (e) {
    console.error("Error fetching contributions:", e);
  }
}

// ─── 3) Schedule Polling ───────────────────────────────────────────────────────
fetchNewCampaigns();
fetchNewContributions();
cron.schedule("*/15 * * * * *", () => {
  fetchNewCampaigns();
  fetchNewContributions();
});

// ─── 4) Express REST Endpoints ────────────────────────────────────────────────
const app = express();

// List all campaigns with current totals
app.get("/api/campaigns", (req, res) => {
  const list = Object.values(campaigns).map(c => ({
    ...c,
    raised: c.raised,
  }));
  res.json(list);
});

// List contributions for a specific campaign
app.get("/api/campaigns/:id/contributors", (req, res) => {
  const id = req.params.id;
  res.json(contributions[id] || []);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
