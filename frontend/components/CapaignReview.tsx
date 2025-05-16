import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/App.css";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

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

  const handleLaunchCampaign = async () => {
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
    const transaction: InputTransactionData = {
      data: {
        function:
          "0x839cae61ca88d71477e65ebf54915cb23347b444289fa9eeb6372bd64e561718::campaign_manager::create_campaign",
        functionArguments: [token, goalAmount, campaignWallet, campaignTitle, campaignDescription, [campaignImage]],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);

      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });
      navigate("/");
      // setAccountHasList(true);
    } catch (error: any) {
      //setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl w-full bg-blue-200 rounded-md p-4" style={{ backgroundColor: "#d0eaff" }}>
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

        <h1 className="text-3xl font-bold mb-2">Review Your Campaign</h1>
        <p className="text-gray-500 mb-8">Make sure everything looks good before launching.</p>

        <div className="always-scroll space-y-6 max-h-[70vh] pr-2">
          {/* Campaign Title */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-700">Campaign Title</h2>
            <p className="text-gray-600">{campaignTitle || <span className="text-red-500">No title provided</span>}</p>
          </div>

          {/* Campaign Description */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-700">Description</h2>
            <p className="text-gray-600 whitespace-pre-line break-words overflow-auto">
              {campaignDescription || <span className="text-red-500">No description provided</span>}
            </p>
          </div>

          {/* Campaign Image */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-700">Image</h2>
            {campaignImage ? (
              <a href={campaignImage} target="_blank" rel="noopener noreferrer">
                <img src={campaignImage} alt="Campaign" className="w-full h-60 object-cover rounded-md" />
              </a>
            ) : (
              <p className="text-red-500">No image provided</p>
            )}
          </div>

          {/* Goal */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-700">Goal Amount</h2>
            <p className="text-gray-600">
              {goalAmount !== undefined ? (
                `${goalAmount.toLocaleString()} APT`
              ) : (
                <span className="text-red-500">Not set</span>
              )}
            </p>
          </div>

          {/* Wallet */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-700">Campaign Wallet</h2>
            <p className="text-gray-600 break-words">
              {campaignWallet || <span className="text-red-500">No wallet address provided</span>}
            </p>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div
          className="flex justify-between items-center mt-8 sticky bottom-4 bg-gray-50 py-2"
          style={{ backgroundColor: "#d0eaff" }}
        >
          <Button onClick={() => navigate("/wallet")} variant="outline">
            Back
          </Button>
          <Button onClick={handleLaunchCampaign} disabled={transactionInProgress}>
            {transactionInProgress ? "Launching..." : "Launch Campaign"}
          </Button>
        </div>
      </div>
    </div>
    //     );
    //   return (
    //     <div className="relative">
    //       {/* Blur effect when modal is active */}
    //       <div className="flex w-full" style={{ backgroundColor: "#f0f0f0" }}>
    //         <div className="left flex flex-col items-center justify-center space-y-4">
    //           <span
    //             onClick={() => navigate("/")}
    //             className="absolute top-7 left-7 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               strokeWidth={2}
    //               stroke="currentColor"
    //               className="w-8 h-8 mr-1"
    //             >
    //               <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5" />
    //             </svg>
    //             <span
    //               className="ml-1 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
    //               style={{ marginTop: "6%" }}
    //             >
    //               Pledgr
    //             </span>
    //           </span>
    //           <h1 className="text-1xl">5 of 5</h1>
    //           <h1 className="text-5xl font-bold text-center">Review Your Campaign</h1>
    //           <p className="text-gray-400 text-center">
    //             Look over your campaign details before launcing. <br></br>You can go back to edit any of the details.
    //           </p>
    //         </div>
    //         <div className="right flex flex-col h-full w-full overflow-y-auto">
    //           <div className="space-y-6">
    //             {/* Campaign Title */}
    //             <div>
    //               <h2 className="text-lg font-semibold text-gray-700">Campaign Title</h2>
    //               <p className="text-gray-500 break-words">{campaignTitle || "No title provided"}</p>
    //             </div>

    //             {/* Campaign Description */}
    //             <div>
    //               <h2 className="text-lg font-semibold text-gray-700">Campaign Description</h2>
    //               <p className="text-gray-500 break-words">{campaignDescription || "No description provided"}</p>
    //             </div>

    //             {/* Campaign Image */}
    //             <div>
    //               <h2 className="text-lg font-semibold text-gray-700">Campaign Image</h2>
    //               {campaignImage ? (
    //                 <img src={campaignImage} alt="Campaign" className="w-full h-40 object-cover rounded-md" />
    //               ) : (
    //                 <p className="text-gray-500">No image provided</p>
    //               )}
    //             </div>

    //             {/* Goal Amount */}
    //             <div>
    //               <h2 className="text-lg font-semibold text-gray-700">Goal Amount</h2>
    //               <p className="text-gray-500 break-words">
    //                 {goalAmount ? `$${goalAmount.toLocaleString()} ${token}` : "No goal amount set"}
    //               </p>
    //             </div>

    //             {/* Campaign Wallet */}
    //             <div>
    //               <h2 className="text-lg font-semibold text-gray-700 mx-auto mt-auto">Campaign Wallet</h2>
    //               <p className="text-gray-500 break-words">{campaignWallet || "No wallet address provided"}</p>
    //             </div>
    //           </div>

    //           {/* Buttons */}
    //           <div className="flex flex-col w-full px-4 mt-auto py-4">
    //             <div className="relative w-full h-1 bg-gray-200 rounded-full mb-4">
    //               <div
    //                 className="absolute top-0 left-0 h-1 bg-blue-400 rounded-full"
    //                 style={{ width: "100%" }} // Adjust width based on the current step
    //               ></div>
    //             </div>
    //           </div>
    //           <div className="flex justify-end justify-between w-full">
    //             <Button variant={"lightGrey"} className="self-start" onClick={() => navigate("/wallet")}>
    //               Back
    //             </Button>
    //             <Button
    //               className="self-end"
    //               onClick={async () => {
    //                 if (!account) return [];
    //                 setTransactionInProgress(true);
    //                 //const config = new AptosConfig({ network: Network.DEVNET }); // Specify your own network if needed
    //                 const config = new AptosConfig({
    //                   network: Network.DEVNET,
    //                   fullnode: "https://fullnode.devnet.aptoslabs.com/v1", // DEVNET fullnode URL
    //                   faucet: "https://faucet.devnet.aptoslabs.com", // DEVNET faucet URL (if needed)
    //                 });
    //                 const aptos = new Aptos(config);

    //                 console.log(goalAmount, campaignWallet, campaignTitle, campaignDescription, [campaignImage]);
    //                 //   campaign_creator: &signer,
    //                 //         fa_metadata: Object<Metadata>,
    //                 //         goal: u64,
    //                 //         recipient: address,
    //                 //         title: String,
    //                 //         description: String,
    //                 //         image_url: vector<String>,
    //                 // const resource = await aptos.get
    //                 const transaction: InputTransactionData = {
    //                   data: {
    //                     function:
    //                       "0x839cae61ca88d71477e65ebf54915cb23347b444289fa9eeb6372bd64e561718::campaign_manager::create_campaign",
    //                     functionArguments: [
    //                       token,
    //                       goalAmount,
    //                       campaignWallet,
    //                       campaignTitle,
    //                       campaignDescription,
    //                       [campaignImage],
    //                     ],
    //                   },
    //                 };
    //                 try {
    //                   // sign and submit transaction to chain
    //                   const response = await signAndSubmitTransaction(transaction);
    //                   // wait for transaction
    //                   await aptos.waitForTransaction({ transactionHash: response.hash });
    //                   // setAccountHasList(true);
    //                 } catch (error: any) {
    //                   //setAccountHasList(false);
    //                 } finally {
    //                   setTransactionInProgress(false);
    //                   navigate("/");
    //                 }
    //               }}
    //             >
    //               Launch Campaign
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
  );
}
