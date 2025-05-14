import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

//TO DO s

export function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    // Fetch campaign info by ID (you can replace this with actual API or state logic)
    const allCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
    const found = allCampaigns.find((c: any) => String(c.id) === id);
    setCampaign(found);
  }, [id]);

  if (!campaign) return <div>Loading campaign...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Banner Image */}
      <div className="w-full h-[400px] bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${campaign.imageUrl})` }}></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side (Title, Description) */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{campaign.description}</p>

          {/* Add other campaign details here (like progress, raised amount, etc.) */}
          <p className="text-lg text-gray-700 mb-6">
            ${campaign.raised.toLocaleString()} raised of ${campaign.goal.toLocaleString()}
          </p>
        </div>

        {/* Right Side (Contributor Info + Contribute Button) */}
        <div className="w-full lg:w-[300px] bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contributor Info</h2>
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
              <Button className="w-full">Contribute</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
