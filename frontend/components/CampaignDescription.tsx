import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectWalletDialog } from "@/components/WalletSelector";
import "@/App.css";

export function CreateCampaignDescription() {
  const [campaignDescription, setCampaignDescription] = useState<String>();
  const [campaignTitle, setCampaignTitle] = useState<String>();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Blur effect when modal is active */}
        <div className="flex w-full" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="left flex flex-col items-center justify-center space-y-4">
          <h1 className="text-1xl">2 of 4</h1>
          <h1 className="text-5xl font-bold">Tell Us Why You're Campaigning</h1>
          <p className="text-gray-400"></p>
        </div>
        <div className="right flex flex-col h-full">
  {/* Starting Goal and Input at 60% height */}
  <div className="flex flex-col space-y-4 w-4/5 mx-auto" style={{ marginTop: "20%" }}>
  <h1 className="font-bold">Your Campaign Title:</h1>
  <Input placeholder="Description" onChange={(e) => setCampaignTitle(e.target.value)} />
  <h1 className="font-bold">Your Story:</h1>
  <Input placeholder="Description" onChange={(e) => setCampaignDescription(e.target.value)} style={{ height: "30vh" }}/>
</div>

  {/* Buttons at the bottom */}
  <div className="flex justify-between w-full mt-auto p-4">
    <Button className="self-start" onClick={() => navigate("/create")}>Back</Button>
    <Button className="self-end" onClick={() => navigate("/image")}>Continue</Button>
  </div>
</div>
        </div>
      </div>
  );
}