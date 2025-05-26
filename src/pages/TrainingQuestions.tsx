
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
  isCustom?: boolean;
}

type FormValues = {
  newQuestion: string;
};

const TrainingQuestions = () => {
  // Default questions based on the screenshot
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "Did I feel focused during practice today?", enabled: true },
    { id: "2", text: "What were distracting external factors for me during training?", enabled: true },
    { id: "3", text: "What weakness in my game do I want to work on?", enabled: true },
    { id: "4", text: "Write down what I did well today, and my \"play of the day\":", enabled: true },
    { id: "5", text: "What'd I do when I first woke up this morning to set a positive tone for my day?", enabled: true },
    { id: "6", text: "Did I do the treatment, activation, and stretching I normally do?", enabled: true },
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      newQuestion: "",
    },
  });

  // Load saved questions from localStorage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("trainingQuestions");
    if (savedQuestions) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions);
        setQuestions(parsedQuestions);
        console.log("Loaded training questions:", parsedQuestions);
      } catch (e) {
        console.error("Error parsing training questions:", e);
      }
    } else {
      // If no saved questions, save the default ones
      localStorage.setItem("trainingQuestions", JSON.stringify(questions));
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
      isCustom: true
    };
    
    setQuestions([...questions, newQuestion]);
    form.reset();
    toast.success("Question added");
  };

  // Delete a custom question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Question deleted");
  };

  // Save questions to localStorage
  const saveQuestions = () => {
    localStorage.setItem("trainingQuestions", JSON.stringify(questions));
    console.log("Saved training questions:", questions);
    toast.success("Training questions saved!");
  };

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
              <h2 className="text-2xl font-bold">TRAINING QUESTIONS</h2>
              <div className="w-6"></div>
            </div>
            
            <div className="w-full bg-[#193175] rounded-lg p-4 mb-6">
              <h3 className="text-center text-lg font-bold mb-4 bg-[#3056b7] py-1 rounded-lg">
                Choose your post-training questions:
              </h3>
              
              <div className="space-y-4">
                {questions.map((question) => (
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
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[#3056b7] pt-4">
                <h4 className="font-semibold mb-2">Add Your Own Question:</h4>
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

export default TrainingQuestions;
