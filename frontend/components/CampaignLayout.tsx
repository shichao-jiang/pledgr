import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectWalletDialog } from "@/components/WalletSelector";
import "@/App.css";

export function CreateCampaign() {
  const { connected } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState<number>();
  const [token, setToken] = useState<string>();
  const navigate = useNavigate();

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  useEffect(() => {
    if (!connected) {
      setShowModal(true); // Show modal if wallet is not connected
    } else {
      setShowModal(false); // Hide modal when wallet is connected
    }
    const savedGoalAmount = localStorage.getItem("goalAmount");
    const savedToken = localStorage.getItem("token");
    if (savedGoalAmount) setGoalAmount(parseFloat(savedGoalAmount));
    if (savedToken) setToken(savedToken);
  }, [connected]);

  useEffect(() => {
    if (goalAmount !== null && goalAmount !== undefined) {
      localStorage.setItem("goalAmount", goalAmount.toString());
    }
    if (token !== null && token !== undefined) {
      localStorage.setItem("token", token);
    }
  }, [goalAmount, token]);

  return (
    <div className="relative">
      {/* Blur effect when modal is active */}
      <div className={`${showModal ? "blur-sm" : ""} transition-all`}>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5" />
              </svg>
              <span
                className="ml-1 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
                style={{ marginTop: "6%" }}
              >
                Pledgr
              </span>
            </span>
            <h1>1 of 5</h1>
            <h1 className="text-5xl font-bold text-center">Set Your Goal</h1>
            <p className="text-gray-40 text-center">What amount are you aiming to raise?</p>
          </div>
          <div className="right flex flex-col h-full w-full">
            {/* Starting Goal and Input at 60% height */}
            <div className="flex flex-col space-y-4 w-4/5 mx-auto mt-auto">
              <h1 className="font-bold">Your Starting Goal:</h1>
              <div className="relative">
                <Input
                  placeholder="$100"
                  value={goalAmount || ""}
                  onChange={(e) => setGoalAmount(parseFloat(e.target.value))}
                  className="pr-20" // Add padding to the right to make space for the dropdown
                />
                <select
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-gray-500 focus:outline-none"
                  value={token}
                  onChange={(e) => setToken(e.target.value)} // Replace with your currency handling logic
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

            {/* Buttons at the bottom */}
            <div className="flex flex-col w-full px-4 mt-auto">
              <div className="relative w-full h-1 bg-gray-300 rounded-full mb-4">
                <div
                  className="absolute top-0 left-0 h-1 bg-blue-400 rounded-full"
                  style={{ width: "20%" }} // Adjust width based on the current step
                ></div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="self-end" onClick={() => navigate("/description")} disabled={!goalAmount || !token}>
                Continue
              </Button>
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
                  <Button variant={"gradient"}>Connect a Wallet</Button>
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
