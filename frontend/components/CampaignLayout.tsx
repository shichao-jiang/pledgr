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
import { sleep } from "@aptos-labs/ts-sdk";

export function CreateCampaign() {
  const { account, connected, disconnect, wallet } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState<number>();
  const navigate = useNavigate();
  
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  useEffect(() => {
    if (!connected) {
      setShowModal(true); // Show modal if wallet is not connected
    } else {
      setShowModal(false); // Hide modal when wallet is connected
    }
  }, [connected]);

  return (
    <div className="relative">
      {/* Blur effect when modal is active */}
      <div className={`${showModal ? "blur-sm" : ""} transition-all`}>
      <div className="flex w-full" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="left flex flex-col items-center justify-center space-y-4">
          <h1>1 of 4</h1>
          <h1 className="text-5xl font-bold">Set Your Goal</h1>
          <p className="text-gray-400">TEMP</p>
        </div>
        <div className="right flex flex-col h-full">
  {/* Starting Goal and Input at 60% height */}
  <div className="flex flex-col space-y-4 w-4/5 mx-auto" style={{ marginTop: "25%" }}>
  <h1 className="font-bold">Your Starting Goal:</h1>
  <Input placeholder="$100" onChange={(e) => setGoalAmount(parseFloat(e.target.value))} />
</div>

  {/* Buttons at the bottom */}
  <div className="flex justify-between w-full mt-auto p-4">
    <Button className="self-start" onClick={() => navigate("/")}>Back</Button>
    <Button className="self-end" onClick={() => navigate("/description")}>Continue</Button>
  </div>
</div>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="mb-4">Please connect your wallet to create a campaign.</p>
            <div className="flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
        <Button>Connect a Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} />
      </Dialog>
      <span
  onClick={() => {
    setIsDialogOpen(false); // Close the dialog
    navigate("/"); // Navigate to the "/create" route
  }}
  className="text-blue-500 cursor-pointer hover:underline"
>
  Back Home
</span>
        </div>
          </div>
        </div>
      )}
    </div>
  );
}
