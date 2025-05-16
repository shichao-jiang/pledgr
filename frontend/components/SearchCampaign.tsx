import { log } from "console";
import { useState, useEffect } from "react";
import { checkEvents } from "../../backend/quickstart";

export function SearchCampaign({
    campaigns,
    onCampaignsUpdate,
  }: {
    campaigns: any[];
    onCampaignsUpdate: (updatedCampaigns: any[]) => void;
  }) {
    
    const initialCampaigns = [
        {
          id: 1,
          imageUrl: 'https://via.placeholder.com/300',
          title: 'Save the Ocean',
          description: 'Join us to clean the oceans and protect marine life.',
          recipientAddress: '0x123...ocean',
          token: 'USDC',
          raised: 4200,
          goal: 10000,
          status: 'active',
          endDate: '2025-07-01',
        },
        {
          id: 2,
          imageUrl: 'https://via.placeholder.com/300',
          title: 'Plant Trees',
          description: 'Help us plant trees to fight climate change.',
          recipientAddress: '0x456...trees',
          token: 'USDC',
          raised: 8000,
          goal: 8000,
          status: 'completed',
          endDate: '2025-05-01',
        },
        {
          id: 3,
          imageUrl: 'https://via.placeholder.com/300',
          title: 'Feed the Hungry',
          description: 'Donate to provide meals to those in need.',
          recipientAddress: '0x789...hunger',
          token: 'APT',
          raised: 1500,
          goal: 5000,
          status: 'active',
          endDate: '2025-06-15',
        },
        {
          id: 4,
          imageUrl: 'https://via.placeholder.com/300',
          title: 'Save the Forests',
          description: 'Support efforts to protect and restore forests.',
          recipientAddress: '0x987...forest',
          token: 'ETH',
          raised: 2500,
          goal: 10000,
          status: 'active',
          endDate: '2025-08-30',
        },
        {
          id: 5,
          imageUrl: 'https://via.placeholder.com/300',
          title: 'Clean Water for All',
          description: 'Help provide access to clean drinking water in underserved areas.',
          recipientAddress: '0x321...water',
          token: 'DAI',
          raised: 6000,
          goal: 12000,
          status: 'active',
          endDate: '2025-09-15',
        },
      ];
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
        campaign.title.toLowerCase().includes(value.toLowerCase())
      );
      console.log("filteredCampaigns", filteredCampaigns)
      onCampaignsUpdate(filteredCampaigns); // Send filtered campaigns back to the parent
    };
  
    return (
      <div className="flex items-center justify-center p-4 w-full">
        <div className="relative w-full max-w-lg"> {/* Increased max width */}
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