import { useState } from "react";
import { Skill } from "@shared/schema";
import { SkillCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillTagsProps {
  skills: Skill[];
}

const SkillTags = ({ skills }: SkillTagsProps) => {
  const [activeFilter, setActiveFilter] = useState<SkillCategory>("all");
  
  const filterSkills = (category: SkillCategory) => {
    setActiveFilter(category);
  };

  const filteredSkills = activeFilter === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeFilter);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "technical":
        return "bg-blue-50 text-primary border-blue-100 hover:bg-blue-100";
      case "soft":
        return "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100";
      case "languages":
        return "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100";
      default:
        return "bg-blue-50 text-primary border-blue-100 hover:bg-blue-100";
    }
  };

  return (
    <div>
      {/* Skills Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => filterSkills("all")}
          >
            All Skills
          </Button>
          <Button
            variant={activeFilter === "technical" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => filterSkills("technical")}
          >
            Technical
          </Button>
          <Button
            variant={activeFilter === "soft" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => filterSkills("soft")}
          >
            Soft Skills
          </Button>
          <Button
            variant={activeFilter === "languages" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => filterSkills("languages")}
          >
            Languages
          </Button>
        </div>
      </div>
      
      {/* Skill Tags */}
      <div className="mb-4">
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`skill-tag px-3 py-2 rounded-lg flex items-center border transition cursor-pointer ${getCategoryColor(skill.category)}`}
                    >
                      <span>{skill.name}</span>
                      {skill.description && (
                        <InfoIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </TooltipTrigger>
                  {skill.description && (
                    <TooltipContent>
                      <p>{skill.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No skills found in this category</div>
        )}
      </div>
      
      {/* Skills Count */}
      <div className="text-sm text-gray-600 border-t pt-4">
        Found <span className="font-semibold text-primary">{skills.length}</span> skills in your resume
      </div>
    </div>
  );
};

export default SkillTags;
