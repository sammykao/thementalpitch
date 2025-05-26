
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/ui/navigation-bar";
import { useAuth } from "../contexts/AuthContext";
import { LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        {/* Logo and Header */}
        <div className="mb-6 text-center">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/9247cf5e-e523-4cec-b0c5-b9bc2fb47e41.png" 
              alt="The Mental Pitch Logo" 
              className="w-64 mx-auto"
            />
          </div>
        </div>

        {/* Sign In and Sign Up Buttons (only if not authenticated) */}
        {!isAuthenticated && (
          <div className="w-full space-y-4 mb-6">
            <Link to="/signin" className="w-full block">
              <Button 
                className="w-full bg-[#3b5ac1] hover:bg-[#2d4cab] text-white font-bold rounded-md flex items-center justify-center"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
            
            <Link to="/signup" className="w-full block">
              <Button 
                className="w-full bg-[#3b5ac1] hover:bg-[#2d4cab] text-white font-bold rounded-md flex items-center justify-center"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        {/* Journal Button */}
        <Link to="/journal" className="w-full mb-6">
          <Button 
            className="w-full h-16 bg-[#3b5ac1] hover:bg-[#2d4cab] text-white font-bold text-2xl rounded-md"
            onClick={() => console.log("Journal button clicked, navigating to /journal")}
          >
            Your Journal
          </Button>
        </Link>

        {/* Onrise Button */}
        <a 
          href="https://www.onrise.care/get-care-now" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full mb-6"
        >
          <Button 
            className="w-full h-16 bg-[#1f3b87] hover:bg-[#152c67] text-white font-bold rounded-md flex items-center justify-center"
          >
            <img 
              src="/lovable-uploads/192498f4-ec16-4a78-ae24-34e28a4ca200.png" 
              alt="Onrise Logo" 
              className="h-12 mx-auto"
            />
          </Button>
        </a>

        {/* Settings Button */}
        <Link to="/settings" className="w-full">
          <Button 
            className="w-full bg-[#3b5ac1] hover:bg-[#2d4cab] text-white font-bold rounded-md"
          >
            Settings
          </Button>
        </Link>
      </div>
      
      {/* Navigation Bar at the bottom */}
      <div className="fixed bottom-4 w-full max-w-md px-4">
        <NavigationBar />
      </div>
    </div>
  );
};

export default Index;
