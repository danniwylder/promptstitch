import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Save, Eye, Code, Wand2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const promptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type PromptForm = z.infer<typeof promptSchema>;

export default function Alchemy() {
  const [, setLocation] = useLocation();
  const [currentTag, setCurrentTag] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [generatorInput, setGeneratorInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createPromptMutation = useMutation({
    mutationFn: (data: PromptForm) => apiRequest("POST", "/api/prompts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      toast({
        title: "Spell Crafted Successfully",
        description: "Your new incantation has been added to the vault",
      });
      setLocation("/invocations");
    },
  });

  const form = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      categoryId: "",
      tags: [],
    },
  });

  const watchedValues = form.watch();
  const tags = form.watch("tags") || [];

  const onSubmit = (data: PromptForm) => {
    createPromptMutation.mutate(data);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      form.setValue("tags", [...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const spellTemplates = [
    {
      name: "Code Review",
      content: `Please review the following code for:
- Best practices and code quality
- Potential bugs or security issues
- Performance optimizations
- Readability improvements

Code:
[INSERT_CODE_HERE]

Provide specific feedback and suggestions for improvement.`,
      category: "Coding & Development",
      tags: ["code-review", "programming", "debugging"]
    },
    {
      name: "Creative Writing",
      content: `Write a [GENRE] story about [TOPIC] that:
- Has a compelling protagonist with clear motivations
- Includes vivid sensory details
- Features dialogue that reveals character
- Builds to a satisfying conclusion
- Is approximately [WORD_COUNT] words

Theme: [THEME]
Setting: [SETTING]`,
      category: "Creative Writing",
      tags: ["creative-writing", "storytelling", "fiction"]
    },
    {
      name: "Research Summary",
      content: `Research and summarize information about [TOPIC]. Please:
- Provide key facts and statistics
- Include multiple perspectives on the subject
- Cite credible sources
- Highlight recent developments
- Explain implications and significance
- Format as a comprehensive but concise overview

Focus areas: [SPECIFIC_ASPECTS]`,
      category: "Research & Analysis",
      tags: ["research", "analysis", "summary"]
    }
  ];

  const applyTemplate = (template: any) => {
    form.setValue("title", template.name);
    form.setValue("content", template.content);
    form.setValue("tags", template.tags);
    const category = categories.find((cat: any) => cat.name === template.category);
    if (category) {
      form.setValue("categoryId", category.id);
    }
  };

  const generatePrompt = async () => {
    if (!generatorInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe what you need help with",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await apiRequest("POST", "/api/generate-prompt", {
        userInput: generatorInput,
      });

      // Parse the JSON response
      const data = await res.json();

      // Guard against pathological or malformed responses
      if (!data || typeof data !== 'object') {
        throw new Error("Received invalid response from server");
      }

      // Validate the response contains generated content
      if (!data.generatedPrompt || typeof data.generatedPrompt !== 'string' || !data.generatedPrompt.trim()) {
        toast({
          title: "Generation Failed",
          description: "Received empty response from AI. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Only update the form if we have valid content
      form.setValue("content", data.generatedPrompt);
      form.setValue("title", generatorInput.substring(0, 50) + (generatorInput.length > 50 ? "..." : ""));
      toast({
        title: "Spell Generated! ✨",
        description: "Your optimized prompt is ready for refinement",
      });
      setGeneratorInput("");
    } catch (error: any) {
      console.error("Prompt generation error:", error);
      
      // apiRequest throws Error objects with message format: "statusCode: errorBody"
      // Parse out the status code and error message
      const errorMessage = error?.message || "Failed to generate prompt. Please try again.";
      
      // Extract status code and body from error message
      let displayMessage = "Failed to generate prompt. Please try again.";
      
      if (errorMessage.includes("503:")) {
        displayMessage = "AI service is not available. Please ensure the OpenAI integration is properly configured.";
      } else if (errorMessage.includes(":")) {
        // Extract the body part after the status code
        const parts = errorMessage.split(":");
        if (parts.length > 1) {
          const bodyText = parts.slice(1).join(":").trim();
          try {
            // Try to parse as JSON to get the message field
            const errorData = JSON.parse(bodyText);
            displayMessage = errorData.message || bodyText;
          } catch {
            // Not JSON, use the text directly
            displayMessage = bodyText || displayMessage;
          }
        }
      }
      
      toast({
        title: "Generation Failed",
        description: displayMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/">
            <SacredLogo size="md" />
          </Link>
          <h1 className="font-mystical text-4xl font-semibold text-sacred-gold mt-4 mb-2">
            Alchemy
          </h1>
          <p className="text-gray-300 text-lg">
            The sacred workshop for crafting new spells and transmuting ideas into power
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Spell Templates Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Spell Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {spellTemplates.map((template, index) => (
                  <motion.div
                    key={template.name}
                    className="p-3 rounded-lg bg-midnight/50 border border-sacred-gold/30 cursor-pointer hover:bg-midnight/70 transition-colors"
                    onClick={() => applyTemplate(template)}
                    whileHover={{ scale: 1.02 }}
                    data-testid={`template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <h4 className="font-mystical text-sm text-sacred-gold mb-1">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      {template.content.substring(0, 60)}...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Spell Crafting Area */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mystical text-sacred-gold flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Craft New Spell
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="border-sacred-gold/50 text-sacred-gold"
                      data-testid="button-toggle-preview"
                    >
                      {isPreviewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isPreviewMode ? "Edit" : "Preview"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={isPreviewMode ? "preview" : "edit"} className="w-full">
                  <TabsContent value="edit" className="mt-0">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* AI Prompt Generator */}
                      <motion.div 
                        className="p-4 rounded-lg bg-gradient-to-r from-mystic-purple/20 to-neon-cyan/20 border border-sacred-gold/30"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="h-5 w-5 text-sacred-gold" />
                          <h3 className="font-mystical text-sacred-gold">AI Spell Generator</h3>
                        </div>
                        <p className="text-sm text-gray-300 mb-4">
                          Describe what you need and let the ritual transform it into an optimized spell
                        </p>
                        <div className="flex gap-2">
                          <Input
                            value={generatorInput}
                            onChange={(e) => setGeneratorInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                generatePrompt();
                              }
                            }}
                            placeholder="e.g., create a list of amazing bash aliases"
                            className="bg-midnight/50 border-sacred-gold/30 text-white flex-1"
                            disabled={isGenerating}
                            data-testid="input-ai-generator"
                          />
                          <Button
                            type="button"
                            onClick={generatePrompt}
                            disabled={isGenerating || !generatorInput.trim()}
                            className="bg-gradient-to-r from-sacred-gold to-neon-cyan text-midnight font-semibold"
                            data-testid="button-generate-prompt"
                          >
                            {isGenerating ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <Zap className="h-4 w-4" />
                                </motion.div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title" className="text-gray-300">Spell Name *</Label>
                          <Input
                            id="title"
                            {...form.register("title")}
                            className="bg-midnight/50 border-sacred-gold/30 text-white"
                            placeholder="Name your spell..."
                            data-testid="input-spell-title"
                          />
                          {form.formState.errors.title && (
                            <p className="text-sm text-red-400 mt-1">{form.formState.errors.title.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="category" className="text-gray-300">Sacred Category</Label>
                          <Select onValueChange={(value) => form.setValue("categoryId", value)}>
                            <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white">
                              <SelectValue placeholder="Choose a category..." />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex items-center gap-2">
                                    <i className={`${category.icon} text-sm`} style={{ color: category.color }} />
                                    {category.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Input
                          id="description"
                          {...form.register("description")}
                          className="bg-midnight/50 border-sacred-gold/30 text-white"
                          placeholder="Briefly describe what this spell does..."
                          data-testid="input-spell-description"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <Label className="text-gray-300">Mystical Tags</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="bg-midnight/50 border-sacred-gold/30 text-white"
                            placeholder="Add tags to categorize your spell..."
                            data-testid="input-add-tag"
                          />
                          <Button
                            type="button"
                            onClick={addTag}
                            variant="outline"
                            className="border-sacred-gold/50 text-sacred-gold shrink-0"
                            data-testid="button-add-tag"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-mystic-purple/20 text-mystic-purple border-mystic-purple/30 cursor-pointer"
                              onClick={() => removeTag(tag)}
                              data-testid={`tag-${tag}`}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Spell Content */}
                      <div>
                        <Label htmlFor="content" className="text-gray-300">Spell Incantation *</Label>
                        <Textarea
                          id="content"
                          {...form.register("content")}
                          className="bg-midnight/50 border-sacred-gold/30 text-white min-h-[300px] font-mono"
                          placeholder="Write your prompt here. Use [PLACEHOLDERS] for dynamic content..."
                          data-testid="textarea-spell-content"
                        />
                        {form.formState.errors.content && (
                          <p className="text-sm text-red-400 mt-1">{form.formState.errors.content.message}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          className="sacred-button flex-1"
                          disabled={createPromptMutation.isPending}
                          data-testid="button-save-spell"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {createPromptMutation.isPending ? "Crafting Spell..." : "Save Spell"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setLocation("/invocations")}
                          className="border-sacred-gold/50 text-sacred-gold"
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="space-y-6">
                      {/* Preview Header */}
                      <div className="border-b border-sacred-gold/30 pb-4">
                        <h3 className="font-mystical text-2xl text-sacred-gold">
                          {watchedValues.title || "Untitled Spell"}
                        </h3>
                        {watchedValues.description && (
                          <p className="text-gray-300 mt-2">{watchedValues.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-mystic-purple/20 text-mystic-purple">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="bg-midnight/30 rounded-lg p-4 border border-sacred-gold/20">
                        <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                          {watchedValues.content || "Your spell content will appear here..."}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
