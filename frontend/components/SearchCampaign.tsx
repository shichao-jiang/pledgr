import { useState, useEffect } from "react";
import { checkEvents } from "../../backend/quickstart";

export function SearchCampaign({
  onCampaignsUpdate,
}: {
  campaigns: any[];
  onCampaignsUpdate: (updatedCampaigns: any[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [initialCampaignsState, setInitialCampaignsState] = useState<any[]>([]);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchInitialCampaigns = async () => {
      const test = await checkEvents();
      if (test) {
        setInitialCampaignsState(test);
      } else {
        console.log("No events found or invalid response.");
      }
    };

    fetchInitialCampaigns();
  }, [onCampaignsUpdate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      // Reset to initial campaigns only if the query is empty
      onCampaignsUpdate(initialCampaignsState);
      return;
    }

    const filteredCampaigns = initialCampaignsState.filter((campaign) =>
      campaign.title.toLowerCase().includes(value.toLowerCase()),
    );

    // Update the parent with filtered campaigns
    onCampaignsUpdate(filteredCampaigns);
  };

  return (
    <div className="flex items-center justify-center p-4 w-full">
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6 6" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search campaigns..."
          value={query}
          onChange={handleSearch}
          className="w-full rounded-full border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        />
      </div>
    </div>
  );
}
