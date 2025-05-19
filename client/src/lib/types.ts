import { Skill } from "@shared/schema";

export interface FileInfo {
  name: string;
  content?: string;
}

export type SkillCategory = "all" | "technical" | "soft" | "languages";

export interface SkillsSuggestion {
  text: string;
}
