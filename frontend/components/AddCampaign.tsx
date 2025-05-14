import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AddCampaign() {
    const navigate = useNavigate();

return (
    <Button onClick={() => navigate("/create")}>Start a Campaign</Button>
  )
}