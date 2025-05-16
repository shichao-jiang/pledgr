import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { WalletDetails } from "@/components/WalletDetails";
import { NetworkInfo } from "@/components/NetworkInfo";
import { AccountInfo } from "@/components/AccountInfo";
import { TransferAPT } from "@/components/TransferAPT";
import { MessageBoard } from "@/components/MessageBoard";
import { TopBanner } from "@/components/TopBanner";
import { CreateCampaign } from "./components/CampaignLayout";
import { CreateCampaignDescription } from "./components/CampaignDescription";
import { CreateCampaignImage} from "./components/CampaignImage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CampaignsGrid } from "./components/CampaignGridLayout";
import { CampaignDetails } from "./components/CampaignDetailsLayout";
import { CreateCampaignWallet } from "./components/CampaignWallet";
import { CreateCampaignReview } from "./components/CapaignReview";
import { useState, useEffect } from "react";
import HungerImage from "./temp_photos/pexels-henri-mathieu-5898312.jpeg";
import { checkEvents } from "../backend/quickstart";
  // Sample Data jut for now
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
    imageUrl: HungerImage,
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

interface Campaign {
  campaign_num: number;
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  recipientAddress: string;
  token: string;
  raised: number;
  amount_donations: number;
  goal: number;
}
function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]); 
  const { connected } = useWallet();

  useEffect(() => {
    const fetchEvents = async () => {
      const test = await checkEvents();
      if (test[0]) {
        const updatedCampaigns = test;
        console.log("updatedCampaigns", updatedCampaigns);
        setCampaigns(updatedCampaigns);
      } else {
        console.log("No events found or invalid response.");
      }
    };
  
    // Fetch events immediately
    fetchEvents();
    // Run fetchEvents every 5 seconds
    // const intervalId = setInterval(fetchEvents, 5000);
  
    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

  // console.log("campaigns[2].imageUrl", campaigns[2].imageUrl);

  useEffect(() => {
    localStorage.setItem("initialCampaigns", JSON.stringify(campaigns));
  }, [campaigns]);
  
  const handleCampaignsUpdate = (updatedCampaigns: any[]) => {
    setCampaigns(updatedCampaigns); // Update the state with the new campaigns
  };

  useEffect(() => {
      localStorage.removeItem("goalAmount");
      localStorage.removeItem("token");
      localStorage.removeItem("campaignDescription");
      localStorage.removeItem("campaignImage");
      localStorage.removeItem("imageSrc");
      localStorage.removeItem("campaignWallet");
      localStorage.removeItem("campaignTitle");
  });
  


  return (
    <>
      {/* <TopBanner /> */}
      <Header campaigns={campaigns} onCampaignsUpdate={handleCampaignsUpdate} />
      <div className="flex items-center justify-center flex-col">
        
        {/* {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )} */}

        {/* Display the Campaigns Grid */}
        <CampaignsGrid campaigns={campaigns} />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Optional: <TopBanner /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/description" element={<CreateCampaignDescription />} />
        <Route path="/image" element={<CreateCampaignImage />} />
        <Route path="/wallet" element={<CreateCampaignWallet />} />
        <Route path="/review" element={<CreateCampaignReview />} />
        <Route path="/campaign/:id" element={<CampaignDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
