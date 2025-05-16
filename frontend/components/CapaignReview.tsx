import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTrigger, Dialog } from "@/components/ui/dialog";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectWalletDialog } from "@/components/WalletSelector";
import "@/App.css";
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { aptosClient } from "@/utils/aptosClient";

export function CreateCampaignReview() {
  const [campaignWallet, setCampaignWallet] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>();
  const [campaignTitle, setCampaignTitle] = useState<string>();
  const [campaignImage, setCampaignImage] = useState<string | null>(null);
  const [goalAmount, setGoalAmount] = useState<number>();
  const [token, setToken] = useState<string>();
  const navigate = useNavigate();
  const { account, signAndSubmitTransaction } = useWallet();
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  console.log("Account:", account);
  console.log("Connected:", account?.address.data.toString());

  useEffect(() => {
    const savedWallet = localStorage.getItem("campaignWallet");
    if (savedWallet) setCampaignWallet(savedWallet);
    const savedCampaignDescription = localStorage.getItem("campaignDescription");
    if (savedCampaignDescription) setCampaignDescription(savedCampaignDescription);
    const savedCampaignTitle = localStorage.getItem("campaignTitle");
    if (savedCampaignTitle) setCampaignTitle(savedCampaignTitle);
    const savedCampaignImage = localStorage.getItem("campaignImage");
    if (savedCampaignImage) setCampaignImage(savedCampaignImage);
    const savedGoalAmount = localStorage.getItem("goalAmount");
    const savedToken = localStorage.getItem("token");
    if (savedGoalAmount) setGoalAmount(parseFloat(savedGoalAmount));
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    const savedWallet = localStorage.getItem("campaignWallet");
    if (savedWallet) setCampaignWallet(savedWallet);
  }, []);
  useEffect(() => {
    if (campaignWallet !== null && campaignWallet !== undefined) {
      localStorage.setItem("campaignWallet", campaignWallet.toString());
    }
  }, [campaignWallet]);

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5" />
            </svg>
            <span
              className="ml-1 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
              style={{ marginTop: "6%" }}
            >
              Pledgr
            </span>
          </span>
          <h1 className="text-1xl">5 of 5</h1>
          <h1 className="text-5xl font-bold text-center">Review Your Campaign</h1>
          <p className="text-gray-400 text-center">
            A strong, high-quality image creates a connection and makes your page more visually appealing.
          </p>
        </div>
        <div className="right flex flex-col h-full w-full overflow-y-auto">
          <div className="space-y-6">
            {/* Campaign Title */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Campaign Title</h2>
              <p className="text-gray-500 break-words">{campaignTitle || "No title provided"}</p>
            </div>

            {/* Campaign Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Campaign Description</h2>
              <p className="text-gray-500 break-words">{campaignDescription || "No description provided"}</p>
            </div>

            {/* Campaign Image */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Campaign Image</h2>
              {campaignImage ? (
                <img src={campaignImage} alt="Campaign" className="w-full h-40 object-cover rounded-md" />
              ) : (
                <p className="text-gray-500">No image provided</p>
              )}
            </div>

            {/* Goal Amount */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Goal Amount</h2>
              <p className="text-gray-500 break-words">
                {goalAmount ? `$${goalAmount.toLocaleString()} ${token}` : "No goal amount set"}
              </p>
            </div>

            {/* Campaign Wallet */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mx-auto mt-auto">Campaign Wallet</h2>
              <p className="text-gray-500 break-words">{campaignWallet || "No wallet address provided"}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col w-full px-4 mt-auto py-4">
            <div className="relative w-full h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full"
                style={{ width: "100%" }} // Adjust width based on the current step
              ></div>
            </div>
          </div>
          <div className="flex justify-end justify-between w-full">
            <Button className="self-start" onClick={() => navigate("/wallet")}>
              Back
            </Button>
            <Button
              className="self-end"
              onClick={async () => {
                if (!account) return [];
                setTransactionInProgress(true);
                //const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
                const config = new AptosConfig({
                  network: Network.DEVNET,
                  fullnode: "https://fullnode.devnet.aptoslabs.com/v1", // DEVNET fullnode URL
                  faucet: "https://faucet.devnet.aptoslabs.com", // DEVNET faucet URL (if needed)
                });
                const aptos = new Aptos(config);

                console.log(goalAmount, campaignWallet, campaignTitle, campaignDescription, [campaignImage]);
                //   campaign_creator: &signer,
                //         fa_metadata: Object<Metadata>,
                //         goal: u64,
                //         recipient: address,
                //         title: String,
                //         description: String,
                //         image_url: vector<String>,
                // const resource = await aptos.get
                const transaction: InputTransactionData = {
                  data: {
                    function:
                      "0x48ec5a271bf9e5b66cd656480b10a90e032e7e202ff2637b91db2f5874e54f00::campaign_manager::create_campaign",
                    functionArguments: [
                      ,
                      goalAmount,
                      campaignWallet,
                      campaignTitle,
                      campaignDescription,
                      [campaignImage],
                    ],
                  },
                };
                try {
                  // sign and submit transaction to chain
                  const response = await signAndSubmitTransaction(transaction);
                  // wait for transaction
                  await aptos.waitForTransaction({ transactionHash: response.hash });
                  // setAccountHasList(true);
                } catch (error: any) {
                  //setAccountHasList(false);
                } finally {
                  setTransactionInProgress(false);
                  navigate("/");
                }
              }}
            >
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
