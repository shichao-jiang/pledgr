import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

async function check_events() {
    // Create a new Aptos client with Testnet configuration
    const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
    const aptos = new Aptos(config);

    aptos.getModuleEventsByEventType(
        {
        eventType: "0x187cbc10c7d40c131e9d9491a5f56bfa2ecce8831ad7b85621622c9ae5b70174::campaign_manager::CampaignCreatedEvent",
        }
    ).then((events) => {
        console.log(events);
        console.log("Events fetched successfully");
    });
}

check_events();