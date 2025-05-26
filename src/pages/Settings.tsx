
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad, Dumbbell, HeartPulse, Image, UserCheck } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>
        
        <div className="w-full mb-4">
          <Button 
            className="w-full bg-[#3b5ac1] hover:bg-[#2d4cab] text-white font-bold rounded-md mb-4 flex items-center justify-start"
            onClick={() => handleNavigation("/settings/edit-questions")}
          >
            <span className="flex-1 text-left">EDIT YOUR QUESTIONS</span>
          </Button>
          
          <Button 
            className="w-full bg-[#1A1F2C] border border-gray-500 hover:bg-[#242c3d] text-white font-bold rounded-md mb-4 flex items-center"
            onClick={() => handleNavigation("/settings/game-questions")}
          >
            <Gamepad className="mr-2 h-5 w-5" />
            <span className="flex-1 text-left">GAME QUESTIONS</span>
          </Button>
          
          <Button 
            className="w-full bg-[#1A1F2C] border border-gray-500 hover:bg-[#242c3d] text-white font-bold rounded-md mb-4 flex items-center"
            onClick={() => handleNavigation("/settings/training-questions")}
          >
            <UserCheck className="mr-2 h-5 w-5" />
            <span className="flex-1 text-left">TRAINING QUESTIONS</span>
          </Button>
          
          <Button 
            className="w-full bg-[#1A1F2C] border border-gray-500 hover:bg-[#242c3d] text-white font-bold rounded-md mb-4 flex items-center"
            onClick={() => handleNavigation("/settings/rehab-questions")}
          >
            <HeartPulse className="mr-2 h-5 w-5" />
            <span className="flex-1 text-left">REHAB QUESTIONS</span>
          </Button>
          
          <Button 
            className="w-full bg-[#1A1F2C] border border-gray-500 hover:bg-[#242c3d] text-white font-bold rounded-md mb-4 flex items-center"
            onClick={() => handleNavigation("/settings/lift-questions")}
          >
            <Dumbbell className="mr-2 h-5 w-5" />
            <span className="flex-1 text-left">LIFT QUESTIONS</span>
          </Button>
          
          <Button 
            className="w-full bg-[#1A1F2C] border border-gray-500 hover:bg-[#242c3d] text-white font-bold rounded-md mb-4 flex items-center"
            onClick={() => handleNavigation("/settings/imagery-settings")}
          >
            <Image className="mr-2 h-5 w-5" />
            <span className="flex-1 text-left">IMAGERY SETTINGS</span>
          </Button>
        </div>
        
        <div className="w-full flex justify-between mt-6">
          <Link to="/">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              ← BACK
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              DONE →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
