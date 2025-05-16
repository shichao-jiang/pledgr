import { useState } from "react";
import { checkEvents } from "../../backend/quickstart";

export function SearchCampaign({
  onCampaignsUpdate,
}: {
  campaigns: any[];
  onCampaignsUpdate: (updatedCampaigns: any[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [initialCampaignsState, setInitialCampaignsState] = useState<any[]>([]);

  //  useEffect(() => {
  //     localStorage.setItem("initialCampaigns", JSON.stringify(campaigns));
  //   }, [campaigns]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fetchEvents = async () => {
      const test = await checkEvents();
      if (test) {
        const updatedCampaigns = test;
        console.log("updatedCampaigns", updatedCampaigns);
        setInitialCampaignsState(updatedCampaigns);
      } else {
        console.log("No events found or invalid response.");
      }
    };

    // Fetch events immediately
    fetchEvents();
    const value = e.target.value;
    setQuery(value);
    //   if (query.trim() === "") {
    //     onCampaignsUpdate(initialCampaigns); // Reset to original campaigns if query is empty
    //     return;
    //   }
    const filteredCampaigns = initialCampaignsState.filter((campaign) =>
      campaign.title.toLowerCase().includes(value.toLowerCase()),
    );
    console.log("filteredCampaigns", filteredCampaigns);
    onCampaignsUpdate(filteredCampaigns); // Send filtered campaigns back to the parent
  };

  return (
    <div className="flex items-center justify-center p-4 w-full">
      <div className="relative w-full max-w-lg">
        {" "}
        {/* Increased max width */}
        <input
          type="text"
          placeholder="Search campaigns..."
          value={query}
          onChange={handleSearch}
          className="w-full rounded-full border border-gray-300 bg-white py-2 px-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
}
