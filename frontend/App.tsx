import { Header } from "@/components/Header";
import { CreateCampaign } from "./components/CampaignLayout";
import { CreateCampaignDescription } from "./components/CampaignDescription";
import { CreateCampaignImage } from "./components/CampaignImage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CampaignsGrid } from "./components/CampaignGridLayout";
import { CampaignDetails } from "./components/CampaignDetailsLayout";
import { CreateCampaignWallet } from "./components/CampaignWallet";
import { CreateCampaignReview } from "./components/CapaignReview";
import { useState, useEffect } from "react";
import { checkEvents } from "../backend/quickstart";

function Home() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const test = await checkEvents();
      if (test) {
        const updatedCampaigns = test;
        console.log("updatedCampaigns", updatedCampaigns);
        setCampaigns(updatedCampaigns);
      } else {
        console.log("No events found or invalid response.");
      }
      setLoading(false);
    };

    // Fetch events immediately
    fetchEvents();

    // Run fetchEvents every 5 seconds
    // const intervalId = setInterval(fetchEvents, 5000);

    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

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
      {loading ? ( // Use a ternary operator for conditional rendering
        <div
          className="text-gray-400 text-2xl flex items-center justify-center h-screen"
          style={{ marginBottom: "40%" }}
        >
          <p>Loading...</p>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <CampaignsGrid campaigns={campaigns} />
        </div>
      )}
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
