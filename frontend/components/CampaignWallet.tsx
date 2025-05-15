import {
    useWallet,
    truncateAddress,
  } from "@aptos-labs/wallet-adapter-react";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { DialogTrigger, Dialog } from "@/components/ui/dialog";
  import { useEffect, useState, useCallback } from "react";
  import { useNavigate } from "react-router-dom";
  import { ConnectWalletDialog } from "@/components/WalletSelector";
  import "@/App.css";
  
  export function CreateCampaignWallet() {
    const [campaignWallet, setCampaignWallet] = useState<String>("");
    const navigate = useNavigate();
    const { account, connected, disconnect, wallet } = useWallet();
    console.log("Account:", account);
    console.log("Connected:", account?.address.data.toString());
  
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
            <h1 className="text-1xl">4 of 4</h1>
            <h1 className="text-5xl font-bold text-center">Select Wallet Address</h1>
            <p className="text-gray-400 text-center">A strong, high-quality image creates a connection and makes your page more visually appealing.</p>
          </div>
          <div className="right flex flex-col h-full w-full">
    {/* Starting Goal and Input at 60% height */}
    <div className="flex flex-col space-y-4 w-4/5 mx-auto mt-auto">
    <h1 className="font-bold">Input Wallet Address:</h1>
  <Input
    value={campaignWallet.toString() || ""}
    onChange={(e) => setCampaignWallet(e.target.value)}
    // className="pr-20" // Add padding to the right to make space for the dropdown
  />
  <Button
    className="focus:outline-none w-1/4 min-w-max ml-auto"
    onClick={() => {const hexAddress = `0x${Array.from(account?.address.data || [])
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")}`;
        setCampaignWallet(hexAddress || "Unknown");}} // Replace with your currency handling logic
  >Use Current Wallet
  </Button>
  </div>
  
    {/* Buttons at the bottom */}
    <div className="flex flex-col w-full px-4 mt-auto">
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
        <div
          className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
          style={{ width: "100%" }} // Adjust width based on the current step
        ></div>
      </div>
    </div>
    <div className="flex justify-end justify-between w-full">
      <Button className="self-start" onClick={() => navigate("/image")}>Back</Button>
      <Button className="self-end" onClick={() => navigate("/wallet")} disabled={!campaignWallet}>Create Campaign</Button>
    </div>
  </div>
          </div>
        </div>
    );
  }