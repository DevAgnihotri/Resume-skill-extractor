import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileInfo } from "@/lib/types";
import { SearchIcon, UploadCloudIcon, FileTextIcon, XCircleIcon } from "lucide-react";
import { resumeInputSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ResumeInputFormProps {
  onSubmit: (resumeText: string | undefined, file: FileInfo | undefined) => void;
  isLoading: boolean;
  resumeText?: string;
}

const ResumeInputForm = ({ onSubmit, isLoading, resumeText: initialResumeText }: ResumeInputFormProps) => {
  const [resumeText, setResumeText] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<FileInfo | undefined>(undefined);
  const { toast } = useToast();
  
  // Update resumeText if initialResumeText changes (from sample resume)
  useEffect(() => {
    if (initialResumeText) {
      setResumeText(initialResumeText);
    }
  }, [initialResumeText]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is a PDF, DOC, or DOCX
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    // Store file information
    setFileInfo({
      name: file.name,
    });

    // Reset textarea if a file is uploaded
    setResumeText("");
  };

  const removeFile = () => {
    setFileInfo(undefined);
    // Reset the file input
    const fileInput = document.getElementById("resume-file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = () => {
    try {
      // Validate that either text or file is provided
      resumeInputSchema.parse({
        text: resumeText,
        fileContent: fileInfo ? "dummy" : undefined, // We don't read file content here, just validate something is provided
      });

      onSubmit(resumeText || undefined, fileInfo);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Please provide either resume text or upload a file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background border border-border/20 p-8 mb-12 animate-fade-up" style={{animationDelay: '0.5s'}}>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Left Column: Text Input */}
        <div className="animate-fade-up" style={{animationDelay: '0.7s'}}>
          <h3 className="text-xl font-display font-semibold mb-6 text-foreground/90">Paste Resume Text</h3>
          <div className="mb-4">
            <Textarea
              id="resume-text"
              placeholder="Paste your resume content here..."
              className="h-64 resize-none bg-background border-border/50 focus:border-primary focus:ring-primary/20"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={!!fileInfo || isLoading}
            />
          </div>
        </div>

        {/* Right Column: File Upload */}
        <div className="animate-fade-up" style={{animationDelay: '0.9s'}}>
          <h3 className="text-xl font-display font-semibold mb-6 text-foreground/90">Upload Resume File</h3>
          
          <div 
            className={`border border-dashed p-8 text-center transition-all duration-300
              ${fileInfo ? 'border-primary bg-accent/30' : 'border-border/50 hover:border-primary hover:bg-accent/10'}`}
          >
            <div className="mb-6">
              <UploadCloudIcon className="h-14 w-14 mx-auto text-foreground/40" />
            </div>
            <p className="text-foreground/80 mb-4 font-medium">Drag & drop your resume or click to browse</p>
            <p className="text-foreground/50 text-sm mb-6">Supported formats: PDF, DOC, DOCX</p>
            
            <div className="relative">
              <Button
                variant="outline"
                className="relative border-border/50 hover:border-primary hover:bg-accent/20 transition-all duration-300"
                disabled={!!resumeText || isLoading}
              >
                Choose File
                <input
                  type="file"
                  id="resume-file"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={!!resumeText || isLoading}
                />
              </Button>
            </div>
            
            {/* File info display */}
            {fileInfo && (
              <div className="mt-6 animate-fade-up">
                <div className="flex items-center justify-center text-sm">
                  <FileTextIcon className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-foreground/90 font-medium">{fileInfo.name}</span>
                  <button 
                    className="ml-3 text-destructive hover:text-destructive/80 transition-colors"
                    onClick={removeFile}
                    disabled={isLoading}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-10 text-center animate-fade-up" style={{animationDelay: '1.1s'}}>
        <Button 
          className="px-10 py-6 h-auto text-lg font-medium relative group overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
          onClick={handleSubmit}
          disabled={isLoading || (!resumeText && !fileInfo)}
        >
          <span className="relative z-10 flex items-center">
            <SearchIcon className="mr-3 h-5 w-5" />
            Extract Skills
          </span>
          <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
        </Button>
      </div>
    </div>
  );
};

export default ResumeInputForm;
