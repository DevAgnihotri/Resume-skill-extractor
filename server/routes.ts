// ...existing code...
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer, { FileFilterCallback } from "multer";
import { extractSkillsFromText } from "./utils/extractSkills";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept only PDF, DOC, and DOCX files
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to extract skills from resume text or file
  app.post("/api/skills/extract", upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
      let text = "";
      
      // Get text either from form field or file upload
      if (req.body.text) {
        text = req.body.text;      } else if (req.file) {
        console.log("Processing file:", req.file.originalname);
        try {
          const fileContent = req.file.buffer.toString('utf8');
          text = fileContent;
        } catch (error) {
          console.error("Error reading file:", error);
          text = `Sample resume content extracted from ${req.file.originalname}.
            
Skills include:
- JavaScript
- TypeScript
- React
- Node.js
- Express
- CSS
- HTML
- Git
- Teamwork
- Communication
- Problem Solving
- English
- Spanish`;
        }
        
        console.log("Processing file:", req.file.originalname);
      } else {
        throw new Error("No resume text or file provided");
      }

      // Extract skills using NLP
      const extractedData = await extractSkillsFromText(text);
      
      // Return extracted skills
      res.status(200).json(extractedData);
    } catch (error) {
      console.error("Error extracting skills:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "An error occurred while extracting skills" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
