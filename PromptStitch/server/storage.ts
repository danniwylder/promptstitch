import { 
  type Prompt, 
  type InsertPrompt, 
  type Category, 
  type InsertCategory,
  type UsageHistory,
  type InsertUsageHistory,
  type Settings,
  type UpdateSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Prompts
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: string): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt>;
  deletePrompt(id: string): Promise<boolean>;
  searchPrompts(query: string): Promise<Prompt[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
  
  // Usage History
  getUsageHistory(): Promise<UsageHistory[]>;
  addUsageHistory(usage: InsertUsageHistory): Promise<UsageHistory>;
  
  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: UpdateSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private prompts: Map<string, Prompt> = new Map();
  private categories: Map<string, Category> = new Map();
  private usageHistory: Map<string, UsageHistory> = new Map();
  private settings: Settings;

  constructor() {
    this.settings = {
      id: "settings",
      theme: "dark",
      autoSave: true,
      syncEnabled: false,
      syncProvider: null,
      exportFormat: "json",
      particleEffects: true,
      soundEffects: false,
      updatedAt: new Date(),
    };

    // Initialize default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories: Category[] = [
      {
        id: randomUUID(),
        name: "Coding & Development",
        description: "Spells for software creation and debugging",
        icon: "fas fa-code",
        color: "#00FFFF",
        parentId: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Creative Writing",
        description: "Incantations for literary creation",
        icon: "fas fa-feather-alt",
        color: "#FF6B9D",
        parentId: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Research & Analysis",
        description: "Divination tools for knowledge gathering",
        icon: "fas fa-search",
        color: "#8B5CF6",
        parentId: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Business & Marketing",
        description: "Commercial alchemy and persuasion magic",
        icon: "fas fa-chart-line",
        color: "#22C55E",
        parentId: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Education & Learning",
        description: "Wisdom transmission and knowledge spells",
        icon: "fas fa-graduation-cap",
        color: "#FFB347",
        parentId: null,
        createdAt: new Date(),
      },
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  // Prompts
  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.prompts.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = randomUUID();
    const now = new Date();
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      tags: insertPrompt.tags || [],
      isFavorite: insertPrompt.isFavorite || false,
      isArchived: insertPrompt.isArchived || false,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      lastUsedAt: null,
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async updatePrompt(id: string, updates: Partial<InsertPrompt>): Promise<Prompt> {
    const existing = this.prompts.get(id);
    if (!existing) {
      throw new Error("Prompt not found");
    }
    const updated: Prompt = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.prompts.set(id, updated);
    return updated;
  }

  async deletePrompt(id: string): Promise<boolean> {
    return this.prompts.delete(id);
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.prompts.values()).filter(prompt =>
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.content.toLowerCase().includes(lowerQuery) ||
      prompt.description?.toLowerCase().includes(lowerQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) {
      throw new Error("Category not found");
    }
    const updated: Category = {
      ...existing,
      ...updates,
    };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Usage History
  async getUsageHistory(): Promise<UsageHistory[]> {
    return Array.from(this.usageHistory.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async addUsageHistory(insertUsage: InsertUsageHistory): Promise<UsageHistory> {
    const id = randomUUID();
    const usage: UsageHistory = {
      ...insertUsage,
      id,
      timestamp: new Date(),
    };
    this.usageHistory.set(id, usage);

    // Update prompt usage count
    const prompt = this.prompts.get(insertUsage.promptId);
    if (prompt) {
      await this.updatePrompt(prompt.id, {
        usageCount: prompt.usageCount + 1,
        lastUsedAt: new Date(),
      });
    }

    return usage;
  }

  // Settings
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(updates: UpdateSettings): Promise<Settings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date(),
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
