import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPromptSchema, insertCategorySchema, insertUsageHistorySchema, updateSettingsSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prompts routes
  app.get("/api/prompts", async (req, res) => {
    try {
      const prompts = await storage.getPrompts();
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  app.get("/api/prompts/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const prompts = await storage.searchPrompts(query);
      res.json(prompts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search prompts" });
    }
  });

  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const prompt = await storage.getPrompt(req.params.id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.json(prompt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  app.post("/api/prompts", async (req, res) => {
    try {
      const validatedData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(validatedData);
      res.status(201).json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prompt data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create prompt" });
    }
  });

  app.patch("/api/prompts/:id", async (req, res) => {
    try {
      const updates = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(req.params.id, updates);
      res.json(prompt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid prompt data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Prompt not found") {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.status(500).json({ message: "Failed to update prompt" });
    }
  });

  app.delete("/api/prompts/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePrompt(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Prompt not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Usage history routes
  app.get("/api/usage-history", async (req, res) => {
    try {
      const history = await storage.getUsageHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch usage history" });
    }
  });

  app.post("/api/usage-history", async (req, res) => {
    try {
      const validatedData = insertUsageHistorySchema.parse(req.body);
      const usage = await storage.addUsageHistory(validatedData);
      res.status(201).json(usage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid usage data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record usage" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const validatedData = updateSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // AI Prompt Generator route
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const { userInput } = req.body;
      
      if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
        return res.status(400).json({ message: "userInput is required and must be a non-empty string" });
      }

      // Validate environment variables
      if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
        console.error("Missing OpenAI configuration: AI_INTEGRATIONS_OPENAI_BASE_URL or AI_INTEGRATIONS_OPENAI_API_KEY not set");
        return res.status(503).json({ 
          message: "AI service is not configured. Please ensure OpenAI integration is properly set up." 
        });
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert prompt engineer specializing in creating revolutionary, optimized prompts for AI systems. Your task is to take a user's basic request and transform it into a sophisticated, highly-effective prompt that will produce exceptional results.

Consider these key principles when crafting prompts:
1. Be specific and detailed
2. Provide context and constraints
3. Specify the desired format and structure
4. Include examples when helpful
5. Use clear, unambiguous language
6. Add role-playing elements when appropriate
7. Break complex tasks into steps
8. Specify tone, style, and audience

Transform the user's input into an optimized prompt that is clear, comprehensive, and designed to elicit the best possible AI response. Return ONLY the optimized prompt text without any preamble or explanation.`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const generatedPrompt = completion.choices[0]?.message?.content?.trim() || "";

      // Validate the response isn't empty
      if (!generatedPrompt) {
        console.error("OpenAI returned empty content");
        return res.status(500).json({ 
          message: "AI service returned an empty response. Please try again." 
        });
      }

      res.json({ 
        generatedPrompt,
        originalInput: userInput 
      });
    } catch (error: any) {
      console.error("Prompt generation error:", error);
      
      // Provide more specific error messages
      const errorMessage = error?.error?.message || error?.message || "Unknown error occurred";
      const statusCode = error?.status || 500;
      
      res.status(statusCode).json({ 
        message: "Failed to generate prompt", 
        error: errorMessage
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
