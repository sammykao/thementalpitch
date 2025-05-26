
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad, UserCheck, HeartPulse, Dumbbell, Image } from "lucide-react";

const EditQuestions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1A1F2C] text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="rounded-lg p-4 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Link to="/settings">
                <Button variant="ghost" className="text-white p-0 h-auto">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold">EDIT QUESTIONS</h2>
              <div className="w-6"></div>
            </div>
            
            <div className="w-full bg-[#193175] rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-6 text-center">
                Select which question set to edit:
              </h3>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-[#3056b7] hover:bg-[#2d4cab] text-white font-bold rounded-md py-3 flex items-center"
                  onClick={() => navigate("/settings/game-questions")}
                >
                  <Gamepad className="mr-2 h-5 w-5" />
                  <span>GAME QUESTIONS</span>
                </Button>
                
                <Button 
                  className="w-full bg-[#3056b7] hover:bg-[#2d4cab] text-white font-bold rounded-md py-3 flex items-center"
                  onClick={() => navigate("/settings/training-questions")}
                >
                  <UserCheck className="mr-2 h-5 w-5" />
                  <span>TRAINING QUESTIONS</span>
                </Button>
                
                <Button 
                  className="w-full bg-[#3056b7] hover:bg-[#2d4cab] text-white font-bold rounded-md py-3 flex items-center"
                  onClick={() => navigate("/settings/rehab-questions")}
                >
                  <HeartPulse className="mr-2 h-5 w-5" />
                  <span>REHAB QUESTIONS</span>
                </Button>
                
                <Button 
                  className="w-full bg-[#3056b7] hover:bg-[#2d4cab] text-white font-bold rounded-md py-3 flex items-center"
                  onClick={() => navigate("/settings/lift-questions")}
                >
                  <Dumbbell className="mr-2 h-5 w-5" />
                  <span>LIFT QUESTIONS</span>
                </Button>
                
                <Button 
                  className="w-full bg-[#3056b7] hover:bg-[#2d4cab] text-white font-bold rounded-md py-3 flex items-center"
                  onClick={() => navigate("/settings/imagery-settings")}
                >
                  <Image className="mr-2 h-5 w-5" />
                  <span>IMAGERY SETTINGS</span>
                </Button>
              </div>
            </div>
            
            <div className="w-full flex justify-between mt-4">
              <Link to="/settings">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
                  BACK
                </Button>
              </Link>
              
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white px-8"
                onClick={() => navigate("/settings")}
              >
                DONE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuestions;
