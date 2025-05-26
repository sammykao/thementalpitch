
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface Question {
  id: string;
  text: string;
  enabled: boolean;
  section: "pregame" | "postgame";
  isCustom?: boolean;
}

type FormValues = {
  newQuestion: string;
  section: "pregame" | "postgame";
};

const GameQuestions = () => {
  // Default questions based on the designs
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "What are three things I can control today that will help me perform my best?", enabled: true, section: "pregame" },
    { id: "2", text: "What external factors could distract me from playing my best?", enabled: true, section: "pregame" },
    { id: "3", text: "How will I respond to mistakes in a way that keeps me focused?", enabled: true, section: "pregame" },
    { id: "4", text: "Was I fully engaged in the game? YES or NO", enabled: true, section: "postgame" },
    { id: "5", text: "Right now, how do I feel I played?", enabled: true, section: "postgame" },
    { id: "6", text: "What are three things I did well?", enabled: true, section: "postgame" },
    { id: "7", text: "What's one thing I want to work on based on today's game?", enabled: true, section: "postgame" },
    { id: "8", text: "Do I think how I played will affect the rest of my day? What if I played the opposite of how I played?", enabled: true, section: "postgame" },
    { id: "9", text: "How did I feel playing against the player I was matched up against?", enabled: true, section: "postgame" },
    { id: "10", text: "How'd you feel in your team's system against the system you were against?", enabled: true, section: "postgame" },
    { id: "11", text: "How do I feel about my playing time today? If I don't feel great about it, how can I work with my coaches to change it, without disrespecting their decision?", enabled: true, section: "postgame" },
  ]);

  const [activeSection, setActiveSection] = useState<"pregame" | "postgame">("pregame");

  const form = useForm<FormValues>({
    defaultValues: {
      newQuestion: "",
      section: "pregame"
    },
  });

  // Load saved questions from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("gameQuestions");
    if (savedQuestions) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions);
        
        // Check if the playing time question exists in the saved questions
        const playingTimeQuestionExists = parsedQuestions.some((q: Question) => q.id === "11");
        
        if (!playingTimeQuestionExists) {
          // If it doesn't exist in local storage, add it to the parsed questions
          parsedQuestions.push({
            id: "11",
            text: "How do I feel about my playing time today? If I don't feel great about it, how can I work with my coaches to change it, without disrespecting their decision?",
            enabled: true,
            section: "postgame"
          });
        }
        
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error("Error parsing saved questions:", error);
        // If there's an error parsing, use the default questions
        localStorage.removeItem("gameQuestions");
      }
    }
  }, []);

  // Toggle a question's enabled status
  const toggleQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    ));
  };

  // Add a new custom question
  const addQuestion = (formValues: FormValues) => {
    if (formValues.newQuestion.trim() === "") {
      toast.error("Question cannot be empty");
      return;
    }
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: formValues.newQuestion,
      enabled: true,
      section: activeSection,
      isCustom: true
    };
    
    setQuestions([...questions, newQuestion]);
    form.reset({ 
      newQuestion: "", 
      section: activeSection 
    });
    toast.success("Question added");
  };

  // Delete a custom question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Question deleted");
  };

  // Save questions to localStorage
  const saveQuestions = () => {
    localStorage.setItem("gameQuestions", JSON.stringify(questions));
    toast.success("Game questions saved successfully!");
  };

  // Update form section when active section changes
  useEffect(() => {
    form.setValue("section", activeSection);
  }, [activeSection, form]);

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
              <h2 className="text-2xl font-bold">GAME QUESTIONS</h2>
              <div className="w-6"></div>
            </div>
            
            <div className="w-full bg-[#193175] rounded-lg p-4 mb-6">
              <h3 className="text-center text-lg font-bold mb-4 bg-[#3056b7] py-1 rounded-lg">
                Choose which questions you want to answer before and after your games.
              </h3>
              
              <div className="space-y-4">
                <h4 className="font-bold">PREGAME</h4>
                {questions
                  .filter(q => q.section === "pregame")
                  .map((question) => (
                    <div 
                      key={question.id}
                      className="flex justify-between items-center border border-[#3056b7] p-3 rounded-lg"
                    >
                      <p className="flex-1 text-sm">{question.text}</p>
                      <div className="flex items-center ml-2">
                        {question.isCustom && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-1 text-red-500 hover:text-red-400 hover:bg-red-950"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            ×
                          </Button>
                        )}
                        <Switch
                          checked={question.enabled}
                          onCheckedChange={() => toggleQuestion(question.id)}
                          className="ml-2"
                        />
                      </div>
                    </div>
                  ))
                }
                
                <div className="mt-6 mb-6 border-t border-[#3056b7] pt-4">
                  <h4 className="font-semibold mb-2">Add Your Own Pregame Question:</h4>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(addQuestion)} className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="newQuestion"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Type your question here..."
                                className="bg-[#1A1F2C] border-[#3056b7] text-white"
                                {...field}
                                onFocus={() => setActiveSection("pregame")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="bg-[#3056b7] hover:bg-[#2d4cab]"
                        onClick={() => setActiveSection("pregame")}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </form>
                  </Form>
                </div>
                
                <h4 className="font-bold mt-6">POST-GAME</h4>
                {questions
                  .filter(q => q.section === "postgame")
                  .map((question) => (
                    <div 
                      key={question.id}
                      className="flex justify-between items-center border border-[#3056b7] p-3 rounded-lg"
                    >
                      <p className="flex-1 text-sm">{question.text}</p>
                      <div className="flex items-center ml-2">
                        {question.isCustom && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 mr-1 text-red-500 hover:text-red-400 hover:bg-red-950"
                            onClick={() => deleteQuestion(question.id)}
                          >
                            ×
                          </Button>
                        )}
                        <Switch
                          checked={question.enabled}
                          onCheckedChange={() => toggleQuestion(question.id)}
                          className="ml-2"
                        />
                      </div>
                    </div>
                  ))
                }

                <div className="mt-6 border-t border-[#3056b7] pt-4">
                  <h4 className="font-semibold mb-2">Add Your Own Post-Game Question:</h4>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(addQuestion)} className="flex space-x-2">
                      <FormField
                        control={form.control}
                        name="newQuestion"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Type your question here..."
                                className="bg-[#1A1F2C] border-[#3056b7] text-white"
                                {...field}
                                onFocus={() => setActiveSection("postgame")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="bg-[#3056b7] hover:bg-[#2d4cab]"
                        onClick={() => setActiveSection("postgame")}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </form>
                  </Form>
                </div>
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
                onClick={saveQuestions}
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

export default GameQuestions;
