import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Edit, Trash, FolderOpen, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().default("fas fa-folder"),
  color: z.string().default("#8B5CF6"),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function Ilk() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryForm) => apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Sacred Category Created",
        description: "A new chapter has been added to your grimoire",
      });
    },
  });

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "fas fa-folder",
      color: "#8B5CF6",
    },
  });

  const onSubmit = (data: CategoryForm) => {
    createCategoryMutation.mutate(data);
  };

  const getCategoryPromptCount = (categoryId: string) => {
    return prompts.filter((prompt: any) => prompt.categoryId === categoryId && !prompt.isArchived).length;
  };

  const iconOptions = [
    { value: "fas fa-folder", label: "Folder" },
    { value: "fas fa-code", label: "Code" },
    { value: "fas fa-feather-alt", label: "Writing" },
    { value: "fas fa-search", label: "Research" },
    { value: "fas fa-chart-line", label: "Business" },
    { value: "fas fa-graduation-cap", label: "Education" },
    { value: "fas fa-magic", label: "Magic" },
    { value: "fas fa-flask", label: "Alchemy" },
    { value: "fas fa-star", label: "Favorites" },
    { value: "fas fa-fire", label: "Fire" },
    { value: "fas fa-leaf", label: "Nature" },
    { value: "fas fa-gem", label: "Gems" },
  ];

  const colorOptions = [
    { value: "#8B5CF6", label: "Mystic Purple" },
    { value: "#00FFFF", label: "Neon Cyan" },
    { value: "#FF6B9D", label: "Ethereal Pink" },
    { value: "#FFB347", label: "Sacred Gold" },
    { value: "#22C55E", label: "Ancient Green" },
    { value: "#F59E0B", label: "Amber" },
    { value: "#EF4444", label: "Crimson" },
    { value: "#3B82F6", label: "Azure" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
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
            Ilk
          </h1>
          <p className="text-gray-300 text-lg">
            Organize your spells into sacred categories and mystical chapters
          </p>
        </motion.div>

        {/* Create Category Button */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="sacred-button" data-testid="button-create-category">
                <Plus className="h-4 w-4 mr-2" />
                Create Sacred Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-midnight to-forest border-sacred-gold/30">
              <DialogHeader>
                <DialogTitle className="font-mystical text-sacred-gold text-xl">
                  Create New Category
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="bg-midnight/50 border-sacred-gold/30 text-white"
                    placeholder="Category name..."
                    data-testid="input-category-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-400 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    className="bg-midnight/50 border-sacred-gold/30 text-white"
                    placeholder="Describe this category..."
                    data-testid="input-category-description"
                  />
                </div>

                <div>
                  <Label htmlFor="icon" className="text-gray-300">Icon</Label>
                  <select
                    id="icon"
                    {...form.register("icon")}
                    className="w-full p-2 bg-midnight/50 border border-sacred-gold/30 rounded-md text-white"
                    data-testid="select-category-icon"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="color" className="text-gray-300">Color</Label>
                  <select
                    id="color"
                    {...form.register("color")}
                    className="w-full p-2 bg-midnight/50 border border-sacred-gold/30 rounded-md text-white"
                    data-testid="select-category-color"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="sacred-button flex-1"
                    disabled={createCategoryMutation.isPending}
                    data-testid="button-save-category"
                  >
                    {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-sacred-gold/50 text-sacred-gold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading sacred categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <i className="fas fa-layer-group text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-mystical text-gray-400 mb-2">No Categories Found</h3>
            <p className="text-gray-500 mb-6">
              Create your first category to organize your spells
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {categories.map((category: any, index: number) => {
              const promptCount = getCategoryPromptCount(category.id);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color + "20", border: `1px solid ${category.color}50` }}
                          >
                            <i 
                              className={`${category.icon} text-xl`}
                              style={{ color: category.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="font-mystical text-sacred-gold text-lg">
                              {category.name}
                            </CardTitle>
                            <p className="text-sm text-gray-400">
                              {promptCount} {promptCount === 1 ? 'spell' : 'spells'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-sacred-gold"
                            data-testid={`button-edit-${category.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400"
                            data-testid={`button-delete-${category.id}`}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {category.description || "A mystical collection of spells"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Scroll className="h-4 w-4" />
                          {promptCount} spells
                        </div>
                        <Link href={`/invocations?category=${category.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10"
                            data-testid={`button-view-${category.id}`}
                          >
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div 
          className="mt-12 glow-border rounded-2xl p-6 bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-mystical text-xl text-sacred-gold mb-4 text-center">
            Grimoire Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-cyan">{categories.length}</div>
              <div className="text-sm text-gray-400">Sacred Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ethereal-pink">{prompts.length}</div>
              <div className="text-sm text-gray-400">Total Spells</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ancient-green">
                {prompts.filter((p: any) => !p.isArchived).length}
              </div>
              <div className="text-sm text-gray-400">Active Spells</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
