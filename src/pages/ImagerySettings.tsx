
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Plus, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ImageryPrompt {
  id: string;
  text: string;
  enabled: boolean;
  isCustom?: boolean;
}

type FormValues = {
  newPrompt: string;
};

const ImagerySettings = () => {
  // Default prompts based on the ImageryJournal prompts
  const [prompts, setPrompts] = useState<ImageryPrompt[]>([
    { 
      id: "pass",
      text: "Visualize a successful pass that's common in your position.", 
      enabled: true 
    },
    { 
      id: "goal", 
      text: "Envision Scoring a Goal: Picture yourself receiving the ball, beating a defender, and scoring.", 
      enabled: true 
    },
    { 
      id: "defense", 
      text: "Mentally Practice Defensive Positioning: Visualize positioning yourself to intercept an opponent's pass.", 
      enabled: true 
    },
    { 
      id: "pressure", 
      text: "Simulate Handling Pressure: Visualize maintaining composure when facing a high-pressure situation.", 
      enabled: true 
    },
    { 
      id: "communication", 
      text: "Imagine Effective Communication: Picture yourself directing teammates during a set piece.", 
      enabled: true 
    },
    { 
      id: "tackle", 
      text: "Recreate a Successful Tackle: Mentally rehearse timing and executing a clean tackle.", 
      enabled: true 
    },
    { 
      id: "body", 
      text: "Visualize Positive Body Language: Imagine displaying confident body language.", 
      enabled: true 
    },
    { 
      id: "adversity", 
      text: "Envision Overcoming Adversity: Picture yourself recovering from a mistake.", 
      enabled: true 
    },
    { 
      id: "game", 
      text: "Simulate Game Scenarios: Mentally rehearse various game situations.", 
      enabled: true 
    },
    { 
      id: "best", 
      text: "Relive your best moment: Close your eyes and think about your most fun game.", 
      enabled: true 
    }
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      newPrompt: "",
    },
  });

  // Load saved prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem("imageryPrompts");
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
  }, []);

  // Toggle a prompt's enabled status
  const togglePrompt = (id: string) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === id ? { ...prompt, enabled: !prompt.enabled } : prompt
    ));
  };

  // Add a new custom prompt
  const addPrompt = (formValues: FormValues) => {
    if (formValues.newPrompt.trim() === "") {
      toast.error("Prompt cannot be empty");
      return;
    }
    
    const newPrompt: ImageryPrompt = {
      id: Date.now().toString(),
      text: formValues.newPrompt,
      enabled: true,
      isCustom: true
    };
    
    setPrompts([...prompts, newPrompt]);
    form.reset();
    toast.success("Prompt added");
  };

  // Delete a custom prompt
  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
    toast.success("Prompt deleted");
  };

  // Save prompts to localStorage
  const savePrompts = () => {
    localStorage.setItem("imageryPrompts", JSON.stringify(prompts));
    toast.success("Imagery prompts saved!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-white">
      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
        <div className="w-full mb-8">
          <div className="rounded-lg p-4 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <Link to="/settings">
                <Button variant="ghost" className="text-white p-0 h-auto">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold">IMAGERY SETTINGS</h2>
              <div className="w-6"></div>
            </div>
            
            <div className="w-full bg-[#193175] rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-4 bg-[#3056b7] py-1 rounded-lg text-center">
                Imagery Prompts
              </h3>
              
              <p className="text-sm mb-6 text-center">
                Select which prompts you want to appear in your imagery journal. 
                You can also add your own custom prompts.
              </p>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {prompts.map((prompt) => (
                  <div 
                    key={prompt.id}
                    className="flex justify-between items-center border border-[#3056b7] p-3 rounded-lg"
                  >
                    <p className="text-sm flex-1">{prompt.text}</p>
                    <div className="flex items-center">
                      {prompt.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mr-2 text-red-500 hover:text-red-400 hover:bg-red-950"
                          onClick={() => deletePrompt(prompt.id)}
                        >
                          ×
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className={`rounded-full h-8 w-8 p-0 flex items-center justify-center ${
                          prompt.enabled ? 'bg-[#3056b7]' : 'bg-transparent border border-[#3056b7]'
                        }`}
                        onClick={() => togglePrompt(prompt.id)}
                      >
                        {prompt.enabled && <X className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#3056b7] pt-4">
                <h4 className="font-semibold mb-2">Add Your Own Prompt:</h4>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(addPrompt)} className="flex space-x-2">
                    <FormField
                      control={form.control}
                      name="newPrompt"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder="Type prompt here..."
                              className="bg-background border-[#3056b7] text-white"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-[#3056b7] hover:bg-[#2d4cab]">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </form>
                </Form>
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
                onClick={savePrompts}
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

export default ImagerySettings;
