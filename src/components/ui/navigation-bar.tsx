import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const NavigationBar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isCalendarPage = location.pathname === "/calendar";
  const isNewActivityPage = location.pathname === "/new-activity";
  
  // Handle the "+" button click to ensure it always works
  const handleAddClick = (e: React.MouseEvent) => {
    if (isNewActivityPage) {
      // If we're already on the new activity page, prevent default navigation
      // and force a refresh by going to journal and then back to new-activity
      e.preventDefault();
      console.log("Already on new activity page, refreshing");
      
      // Use a small timeout to make the navigation feel more natural
      setTimeout(() => {
        navigate("/new-activity");
      }, 10);
    }
    // Otherwise, let the Link component handle the navigation
  };
  
  return (
    <div className="w-full flex justify-between">
      <Link to={isCalendarPage ? "/journal" : "/calendar"}>
        <Button variant="outline" className="bg-[#193175] text-white border-[#3056b7] hover:bg-[#254086] rounded-lg p-2 h-14 w-14">
          <Calendar className="h-6 w-6" />
        </Button>
      </Link>
      
      <Link to="/new-activity" onClick={handleAddClick}>
        <Button variant="outline" className="bg-[#193175] text-white border-[#3056b7] hover:bg-[#254086] rounded-lg p-2 h-14 w-14">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
      
      {isAuthenticated && (
        <Link to="/profile">
          <Button variant="outline" className="bg-[#193175] text-white border-[#3056b7] hover:bg-[#254086] rounded-lg p-2 h-14 w-14">
            <User className="h-6 w-6" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default NavigationBar;
