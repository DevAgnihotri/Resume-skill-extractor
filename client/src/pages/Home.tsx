import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import ResumeInputForm from "@/components/ResumeInputForm";
import SampleResume from "@/components/SampleResume";
import Loader from "@/components/Loader";
import { FileInfo } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ExtractSkillsResponse } from "@shared/schema";
import gsap from "gsap";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState<string | undefined>(undefined);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Refs for GSAP animations
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  
  // GSAP animations setup
  useEffect(() => {
    // Create a timeline
    const tl = gsap.timeline();
    
    // Animate title with text reveal effect
    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Animate subtitle
    tl.from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4");
    
    // Create background parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
      const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
      
      gsap.to(".parallax-bg", {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: "power1.out"
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Handle using the sample resume template
  const handleUseTemplate = (text: string) => {
    setResumeText(text);
    // Scroll to the form
    const formElement = document.getElementById('resume-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExtractSkills = async (resumeText: string | undefined, fileInfo: FileInfo | undefined) => {
    try {
      setIsLoading(true);
      
      // Create FormData for file upload or JSON for text
      let response;
      
      if (resumeText) {
        // Send text as JSON
        response = await fetch("/api/skills/extract", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: resumeText }),
          credentials: "include",
        });
      } else if (fileInfo) {
        // Send file as FormData
        const formData = new FormData();
        const fileInput = document.getElementById("resume-file") as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          formData.append("file", fileInput.files[0]);
          
          response = await fetch("/api/skills/extract", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
        } else {
          throw new Error("Failed to access the uploaded file");
        }
      } else {
        throw new Error("Please enter resume text or upload a file");
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }

      const data: ExtractSkillsResponse = await response.json();
      
      // Store the extracted skills in localStorage to access on the results page
      localStorage.setItem("extractedSkills", JSON.stringify(data));
      
      // Navigate to results page
      setLocation("/results");
    } catch (error) {
      console.error("Failed to extract skills:", error);
      toast({
        title: "Error extracting skills",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Background elements */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl parallax-bg"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl parallax-bg"></div>
      
      <div className="text-center mb-12">
        <h2 ref={titleRef} className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-foreground mb-4 animate-fade-up relative inline-block" style={{animationDelay: '0.1s'}}>
          Extract <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">Skills</span> from Your Resume
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/30 transform scale-x-0 animate-reveal"></span>
        </h2>
        <p ref={subtitleRef} className="text-foreground/70 max-w-2xl mx-auto text-lg animate-fade-up" style={{animationDelay: '0.3s'}}>
          Upload your resume or paste the text below. Our AI will identify and extract relevant skills to help improve your job search.
        </p>
      </div>

      <div id="resume-form">
        <ResumeInputForm onSubmit={handleExtractSkills} isLoading={isLoading} resumeText={resumeText} />
      </div>
      
      {/* Sample Resume Section */}
      <SampleResume onUseTemplate={handleUseTemplate} />
      
      {/* Features Section */}
      <div className="mt-20 mb-8 relative animate-fade-up" style={{animationDelay: '1.3s'}}>
        <h3 className="text-2xl font-display font-semibold text-center mb-12 text-foreground">How It Works</h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background p-8 border border-border/20 text-center group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border/50 text-primary mb-6 relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h4 className="font-display text-xl mb-3 text-foreground/90 relative z-10">01. Upload Resume</h4>
            <p className="text-foreground/70 relative z-10">Upload your resume as PDF or simply paste the text from your document</p>
          </div>
          
          <div className="bg-background p-8 border border-border/20 text-center group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border/50 text-primary mb-6 relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-display text-xl mb-3 text-foreground/90 relative z-10">02. AI Processing</h4>
            <p className="text-foreground/70 relative z-10">Our advanced NLP engine analyzes your resume to identify key professional skills</p>
          </div>
          
          <div className="bg-background p-8 border border-border/20 text-center group hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border/50 text-primary mb-6 relative z-10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h4 className="font-display text-xl mb-3 text-foreground/90 relative z-10">03. Get Results</h4>
            <p className="text-foreground/70 relative z-10">View and categorize your extracted skills as interactive, filterable tags</p>
          </div>
        </div>
      </div>

      <Loader isLoading={isLoading} />
    </div>
  );
};

export default Home;
