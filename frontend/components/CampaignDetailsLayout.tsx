import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeaderDetailPage } from "@/components/HeaderDetailPage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ContributionForm } from "./ContributorPageLayout";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { ConnectWalletDialog } from "@/components/WalletSelector"

export function CampaignDetails() {
  const { connected } = useWallet()
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    // Fetch campaign info by ID (you can replace this with actual API or state logic)
    const allCampaigns = JSON.parse(localStorage.getItem("initialCampaigns") || "[]");
    const found = allCampaigns.find((c: any) => String(c.id) === id);
    setCampaign(found);
  }, [id]);

  if (!campaign) return <div>Loading campaign...</div>;

  return (
    <>
    <HeaderDetailPage/>
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Banner Image */}
      <div className="w-full aspect-[16/5] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${campaign.imageUrl})` }}></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side (Title, Description) */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{campaign.description}</p>
        </div>

        {/* Right Side (Contributor Info + Contribute Button) */}
        <div className="w-full lg:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            {/* Raised Amount Info on the left */}
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                ${campaign.raised.toLocaleString()} raised
              </h2>
              <p className="text-sm text-gray-500">
                ${campaign.goal.toLocaleString()} goal · {campaign.amount_donations} donations 
              </p>  
            </div>

            {/* Circular Progress on the right */}
            <div className="w-20 h-20">
              <CircularProgressbar
                value={Math.min((campaign.raised / campaign.goal) * 100, 100)}
                text={`${Math.round(Math.min((campaign.raised / campaign.goal) * 100, 100))}%`}
                styles={buildStyles({
                  textColor: "#111827",       // text-gray-900
                  pathColor: "#3b82f6",       // blue-500
                  trailColor: "#e5e7eb",      // gray-200
                  textSize: "16px",
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Status:</span>
              <span>{campaign.status}</span>
            </div>
            <div className="flex justify-between text-sm">  
              <span className="font-medium">End Date:</span>
              <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
            </div>

            <div className="mt-6">
              {/* <Button className="w-full">Contribute</Button> */}
              <Button className="w-full" onClick={() => setShowForm(true)}>Contribute</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showForm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>

          <ContributionForm
            campaign={{
                campaign_num: campaign.campaign_num,
                id: campaign.id,
                imageUrl: campaign.imageUrl,
                title: campaign.title,
                description: campaign.description,
                recipientAddress: campaign.recipientAddress,
                token: campaign.token,
                raised: campaign.raised,
                amount_donations: campaign.amount_donations,
                goal: campaign.goal,
            }}
            onSubmit={(token, amount) => {
              console.log("Submitting contribution:", { token, amount });
              setShowForm(false);
            }}
            close={() => setShowForm(false)} // 👈 added
          />
        </div>
      </div>
    )}
    </>
  );
}
