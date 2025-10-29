import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Copy, Star, Archive, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";

export default function Invocations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const addUsageMutation = useMutation({
    mutationFn: (data: { promptId: string; target?: string }) =>
      apiRequest("POST", "/api/usage-history", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/usage-history"] });
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      apiRequest("PATCH", `/api/prompts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });

  const filteredPrompts = prompts.filter((prompt: any) => {
    const matchesSearch = searchQuery === "" || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || prompt.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory && !prompt.isArchived;
  });

  const handleCopyPrompt = async (prompt: any) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      addUsageMutation.mutate({ promptId: prompt.id, target: "clipboard" });
      toast({
        title: "Spell Copied to Clipboard",
        description: `"${prompt.title}" is ready to be cast`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy spell to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = (prompt: any) => {
    updatePromptMutation.mutate({
      id: prompt.id,
      isFavorite: !prompt.isFavorite,
    });
  };

  const handleArchive = (prompt: any) => {
    updatePromptMutation.mutate({
      id: prompt.id,
      isArchived: true,
    });
    toast({
      title: "Spell Archived",
      description: `"${prompt.title}" has been moved to the archives`,
    });
  };

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
            Invocations
          </h1>
          <p className="text-gray-300 text-lg">
            Your sacred collection of digital spells and incantations
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="glow-border rounded-2xl p-6 mb-8 bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your spells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-midnight/50 border-sacred-gold/30 text-white placeholder:text-gray-400"
                data-testid="input-search"
              />
            </div>
            <Button
              variant="outline"
              className="sacred-button border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10"
              data-testid="button-filter"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === null ? 'bg-sacred-gold text-midnight' : 'border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10'}`}
              onClick={() => setSelectedCategory(null)}
              data-testid="filter-all"
            >
              All Categories
            </Badge>
            {categories.map((category: any) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === category.id ? 'bg-sacred-gold text-midnight' : 'border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10'}`}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`filter-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <i className={`${category.icon} mr-1`} />
                {category.name}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading spells from the vault...</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <i className="fas fa-magic text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-mystical text-gray-400 mb-2">No Spells Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Your spell collection is empty"}
            </p>
            <Link href="/alchemy">
              <Button className="sacred-button" data-testid="button-create-first-spell">
                <i className="fas fa-plus mr-2" />
                Craft Your First Spell
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredPrompts.map((prompt: any, index: number) => {
              const category = categories.find((cat: any) => cat.id === prompt.categoryId);
              
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="font-mystical text-sacred-gold text-lg">
                          {prompt.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleFavorite(prompt)}
                            className={`text-sm ${prompt.isFavorite ? 'text-ethereal-pink' : 'text-gray-400'} hover:text-ethereal-pink`}
                            data-testid={`button-favorite-${prompt.id}`}
                          >
                            <Star className={`h-4 w-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleArchive(prompt)}
                            className="text-gray-400 hover:text-red-400"
                            data-testid={`button-archive-${prompt.id}`}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {category && (
                        <Badge 
                          variant="outline" 
                          className="w-fit border-sacred-gold/50 text-sacred-gold"
                        >
                          <i className={`${category.icon} mr-1`} />
                          {category.name}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {prompt.description || prompt.content.substring(0, 100) + "..."}
                      </p>
                      
                      {prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {prompt.tags.slice(0, 3).map((tag: string) => (
                            <Badge 
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-mystic-purple/20 text-mystic-purple border-mystic-purple/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-mystic-purple/20 text-mystic-purple border-mystic-purple/30">
                              +{prompt.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Used {prompt.usageCount} times
                        </div>
                        <Button
                          onClick={() => handleCopyPrompt(prompt)}
                          className="sacred-button text-sm"
                          disabled={addUsageMutation.isPending}
                          data-testid={`button-copy-${prompt.id}`}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Cast Spell
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div 
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/alchemy">
            <Button
              size="lg"
              className="sacred-button rounded-full w-16 h-16 shadow-lg"
              data-testid="button-fab-create"
            >
              <i className="fas fa-plus text-xl" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
