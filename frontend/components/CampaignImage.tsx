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

export function CreateCampaignImage() {
  const [campaignImage, setCampaignImage] = useState<String>();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Blur effect when modal is active */}
      <div className="flex w-full" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="left flex flex-col items-center justify-center space-y-4">
        <span
    onClick={() => navigate("/")}
    className="absolute top-7 left-7 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-8 h-8 mr-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5"
      />
    </svg>
    <span className="ml-1 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center" style={{ marginTop: "6%" }}>Pledgr</span>
  </span>
          <h1 className="text-1xl">3 of 4</h1>
          <h1 className="text-5xl font-bold">Add Media</h1>
          <p className="text-gray-400">A strong, high-quality image creates a connection and makes your page more visually appealing.</p>
        </div>
        <div className="right flex flex-col h-full">
  {/* Starting Goal and Input at 60% height */}
  <div className="flex flex-col space-y-4 w-4/5 mx-auto" style={{ marginTop: "20%" }}>
  <h1 className="font-bold">Upload A Cover Image:</h1>
  <Input placeholder="Description" onChange={(e) => setCampaignImage(e.target.value)} />
</div>

  {/* Buttons at the bottom */}
  <div className="flex justify-between w-full mt-auto p-4">
    <Button className="self-start" onClick={() => navigate("/description")}>Back</Button>
    <Button className="self-end" onClick={() => navigate("/image")} disabled={!campaignImage}>Continue</Button>
  </div>
</div>
        </div>
      </div>
  );
}