import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/App.css";

export function CreateCampaignDescription() {
  const [campaignDescription, setCampaignDescription] = useState<string>();
  const [campaignTitle, setCampaignTitle] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCampaignDescription = localStorage.getItem("campaignDescription");
    const savedCampaignTitle = localStorage.getItem("campaignTitle");
    if (savedCampaignDescription) setCampaignDescription(savedCampaignDescription);
    if (savedCampaignTitle) setCampaignTitle(savedCampaignTitle);
  }, []);
  useEffect(() => {
    if (campaignDescription !== null && campaignDescription !== undefined) {
      localStorage.setItem("campaignDescription", campaignDescription.toString());
    }
    if (campaignTitle !== null && campaignTitle !== undefined) {
      localStorage.setItem("campaignTitle", campaignTitle.toString());
    }
  }, [campaignDescription, campaignTitle]);

  return (
    <div className="relative">
      {/* Blur effect when modal is active */}
      <div className="flex w-full h-screen" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="left flex flex-col items-center justify-center space-y-4">
          <span
            onClick={() => navigate("/")}
            className="absolute top-7 left-7 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 mr-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15v-10.5" />
            </svg>
            <span
              className="ml-1 text-2xl text-blue-500 cursor-pointer hover:underline flex items-center"
              style={{ marginTop: "6%" }}
            >
              Pledgr
            </span>
          </span>
          <h1 className="text-1xl" style={{ marginTop: "35%" }}>
            2 of 4
          </h1>
          <h1 className="text-5xl font-bold text-center">Tell Us Why You're Campaigning</h1>
          <div className="text-gray-400 text-left mt-12 mb-10 px-4" style={{ marginTop: "10%" }}>
            <p className="mb-6">Some ideas to help you start writing:</p>
            <ul className="list-disc list-inside space-y-4">
              <li>Introduce yourself and what you're raising funds for</li>
              <li>Describe why it's important to you</li>
              <li>Explain how the funds will be used</li>
            </ul>
          </div>
        </div>
        <div className="right flex flex-col h-full w-full">
          {/* Starting Goal and Input at 60% height */}
          <div className="flex flex-col space-y-4 w-4/5 mx-auto mt-auto">
            <h1 className="font-bold">Your Campaign Title:</h1>
            <Input
              placeholder="I wish to contribute to..."
              value={campaignTitle || ""}
              onChange={(e) => setCampaignTitle(e.target.value)}
            />
            <h1 className="font-bold">Your Story:</h1>
            <textarea
              placeholder="Hi, my name is Tyler. I'm starting a campaign to..."
              value={campaignDescription || ""}
              onChange={(e) => setCampaignDescription(e.target.value)}
              className="w-full p-2 border rounded-md bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ height: "30vh", resize: "none" }}
            />
          </div>

          {/* Buttons at the bottom */}
          <div className="flex flex-col w-full px-4 mt-auto">
            <div className="relative w-full h-1 bg-gray-200 rounded-full mb-4">
              <div
                className="absolute top-0 left-0 h-1 bg-blue-400 rounded-full"
                style={{ width: "50%" }} // Adjust width based on the current step
              ></div>
            </div>
          </div>
          <div className="flex justify-end justify-between w-full">
            <Button variant={"lightGrey"} className="self-start" onClick={() => navigate("/create")}>
              Back
            </Button>
            <Button
              className="self-end"
              onClick={() => navigate("/image")}
              disabled={!campaignTitle || !campaignDescription}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
