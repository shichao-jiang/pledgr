import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress-bar";

export function CampaignBox({ campaign }: { campaign: any }) {
  const progressPercent = (campaign.raised / campaign.goal) * 100;

  return (
    <div className="campaign-box">
      <img className="campaign-image" src={campaign.imageUrl} alt={campaign.title} />
      <div className="campaign-content">
        <h3 className="campaign-title">{campaign.title}</h3>
        <p className="campaign-description">{campaign.description}</p>
        <div className="campaign-buttons">
          {/* Progress Bar */}
          <div className="mt-6 flex flex-col w-full max-w-md mx-auto">
            <Progress value={progressPercent} className="w-[250px] mb-3 h-3 justify-left rounded-full bg-gray-200" />
            <p className="text-xs font-bold text-gray-600 justify-left">
              {campaign.raised.toLocaleString()}APT raised of {campaign.goal.toLocaleString()}APT{" "}
              <span className="font-normal px-3">Currency: Aptos</span>
            </p>
            {/* <p className="text-xs text-gray-500 italic">Status: {campaign.status}</p> */}
          </div>
          <div className="mt-6 flex justify-end w-2/3">
            <Link to={`/campaign/${campaign.id}`}>
              <Button className="w-[100px] max-w-[220px] text-sm h-8">Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
