import { CampaignBox } from "@/components/CampaignBoxLayout";

export function CampaignsGrid({ campaigns }: { campaigns: any[] }) {
  return (
    <div>
      {campaigns.length > 0 ? (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <CampaignBox key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-center space-y-4 p-20">
          <p className="text-gray-500 text-5xl">Oops! No campaigns found.</p>
          <p className="text-gray-400 text-2xl">Try adjusting your search and try again.</p>
        </div>
      )}
    </div>
  );
}
