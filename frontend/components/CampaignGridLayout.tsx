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
    <div className="campaigns-grid">
      {campaigns.map((campaign) => (
        <CampaignBox key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}

// grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-8 w-full max-w-7xl mx-auto
