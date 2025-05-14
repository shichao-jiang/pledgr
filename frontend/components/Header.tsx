import { WalletSelector } from "./WalletSelector";
import { SearchCampaign } from "./SearchCampaign";
import { AddCampaign } from "./AddCampaign";

export function Header({
  campaigns,
  onCampaignsUpdate,
}: {
  campaigns: any[];
  onCampaignsUpdate: (updatedCampaigns: any[]) => void;
}) {
  return (
    <div className="bg-blue-500 flex items-center justify-between px-4 py-2 w-full flex-nowrap overflow-x-auto">
      <h1 className="display">Pledgr</h1>

      <div className="flex gap-2 items-center flex-wrap w-full max-w-lg">
        <SearchCampaign campaigns={campaigns} onCampaignsUpdate={onCampaignsUpdate} />
      </div>
      <div className="flex gap-2 items-center flex-nowrap">
        <AddCampaign />
        <WalletSelector />
      </div>
    </div>
  );
}
