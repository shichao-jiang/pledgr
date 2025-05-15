// CampaignsGrid.tsx

import React from 'react';
import { CampaignBox } from '@/components/CampaignBoxLayout';  // Import the CampaignBox component

interface Campaign {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  recipientAddress: string;
  token: string;
  // tokenAmount: number; // consider renaming to `goal` for clarity
  raised: number;       // amount actually raised
  goal: number;         // fundraising target
  status: 'active' | 'completed' | 'failed';
  endDate: string;
}

interface CampaignsGridProps {
  campaigns: Campaign[];
}

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

// grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8 w-full max-w-7xl mx-auto
