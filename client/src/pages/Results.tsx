import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, DownloadIcon } from "lucide-react";
import SkillTags from "@/components/SkillTags";
import { ExtractSkillsResponse, Skill } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";

const Results = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Refs for GSAP animations
  const pageRef = useRef(null);
  const titleRef = useRef(null);
  const skillsContainerRef = useRef(null);
  const suggestionsContainerRef = useRef(null);

  useEffect(() => {
    // Get extracted skills from localStorage
    const extractedSkillsData = localStorage.getItem("extractedSkills");
    
    if (extractedSkillsData) {
      try {
        const parsedData: ExtractSkillsResponse = JSON.parse(extractedSkillsData);
        setSkills(parsedData.skills || []);
        setSuggestions(parsedData.suggestions || []);
      } catch (error) {
        console.error("Failed to parse skills data:", error);
        toast({
          title: "Error",
          description: "Failed to load skills data",
          variant: "destructive",
        });
        setLocation("/");
      }
    } else {
      // If no data, redirect to home
      toast({
        title: "No data found",
        description: "Please extract skills from a resume first",
      });
      setLocation("/");
    }
  }, [setLocation, toast]);
  
  // GSAP animations setup
  useEffect(() => {
    if (!skillsContainerRef.current) return;
    
    // Main animation timeline
    const tl = gsap.timeline();
    
    // Fade in page with slight zoom effect
    tl.from(pageRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.6,
      ease: "power2.out"
    });
    
    // Animate title
    tl.from(titleRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.4)"
    }, "-=0.3");
    
    // Animate skills container
    tl.from(skillsContainerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2");
    
    // Animate suggestion container if it exists
    if (suggestionsContainerRef.current) {
      tl.from(suggestionsContainerRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
    }
    
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
  }, [skills, suggestions]);

  const handleBackToHome = () => {
    setLocation("/");
  };

  const handleDownloadSkills = () => {
    try {
      // Create CSV content
      const categoryCounts = {
        technical: skills.filter(s => s.category === "technical").length,
        soft: skills.filter(s => s.category === "soft").length,
        languages: skills.filter(s => s.category === "languages").length,
      };
      
      let csvContent = "Skill,Category\n";
      
      // Add skills
      skills.forEach(skill => {
        csvContent += `"${skill.name}","${skill.category}"\n`;
      });
      
      // Add summary
      csvContent += "\nSummary\n";
      csvContent += `Total Skills,${skills.length}\n`;
      csvContent += `Technical Skills,${categoryCounts.technical}\n`;
      csvContent += `Soft Skills,${categoryCounts.soft}\n`;
      csvContent += `Languages,${categoryCounts.languages}\n`;
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "extracted-skills.csv");
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download skills:", error);
      toast({
        title: "Download failed",
        description: "Failed to download skills data",
        variant: "destructive",
      });
    }
  };

  return (
    <div ref={pageRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Background elements */}
      <div className="absolute top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl parallax-bg"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl parallax-bg"></div>
      
      <div className="mb-8 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleBackToHome}
          className="border-border/50 hover:border-primary hover:bg-accent/10 transition-all duration-300"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDownloadSkills}
          className="border-border/50 hover:border-primary hover:bg-accent/10 transition-all duration-300"
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download Skills
        </Button>
      </div>

      <div ref={skillsContainerRef} className="bg-background border border-border/20 p-8 mb-10">
        <h2 ref={titleRef} className="text-2xl font-display font-semibold mb-6 text-foreground">Extracted Skills</h2>
        
        <SkillTags skills={skills} />
      </div>
      
      {/* Skill Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div ref={suggestionsContainerRef} className="bg-background border border-border/20 p-8 mb-8">
          <h3 className="text-xl font-display font-semibold mb-6 text-foreground">Skill Improvement Suggestions</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="p-4 bg-accent/10 border border-border/30 rounded-md relative group overflow-hidden hover:border-primary/40 transition-all duration-300"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-accent/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <p className="text-foreground/80 relative z-10">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
