import { WalletSelector } from "./WalletSelector";
import { AddCampaign } from "./AddCampaign";
import { useNavigate } from "react-router-dom";

export function HeaderDetailPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#d0eaff] to-transparent flex items-center justify-between px-4 py-6 w-full flex-nowrap overflow-x-auto">
      <span onClick={() => navigate("/")} className="text-2xl cursor-pointer hover:underline flex items-center">
        <h1 className="display">Pledgr</h1>
      </span>

      <div className="flex gap-4 items-center flex-nowrap">
        <AddCampaign />
        <WalletSelector />
      </div>
    </div>
  );
}
