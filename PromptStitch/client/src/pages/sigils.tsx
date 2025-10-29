import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, Copy, Search, Filter, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";

export default function Sigils() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("usage");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: usageHistory = [] } = useQuery({
    queryKey: ["/api/usage-history"],
  });

  const updatePromptMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      apiRequest("PATCH", `/api/prompts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
    },
  });

  const addUsageMutation = useMutation({
    mutationFn: (data: { promptId: string; target?: string }) =>
      apiRequest("POST", "/api/usage-history", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/usage-history"] });
    },
  });

  // Filter to only favorite prompts
  const favoritePrompts = prompts.filter((prompt: any) => prompt.isFavorite && !prompt.isArchived);

  const getPromptPower = (prompt: any) => {
    // Calculate "power" based on usage count and recency
    const baseUsage = prompt.usageCount || 0;
    const recentUsage = usageHistory.filter((usage: any) => 
      usage.promptId === prompt.id && 
      new Date(usage.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    return baseUsage + (recentUsage * 2);
  };

  const sortPrompts = (prompts: any[]) => {
    switch (sortBy) {
      case "usage":
        return prompts.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      case "power":
        return prompts.sort((a, b) => getPromptPower(b) - getPromptPower(a));
      case "recent":
        return prompts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case "alphabetical":
        return prompts.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return prompts;
    }
  };

  const filteredSigils = sortPrompts(favoritePrompts.filter((prompt: any) => {
    const matchesSearch = searchQuery === "" || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || prompt.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }));

  const handleCopyPrompt = async (prompt: any) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      addUsageMutation.mutate({ promptId: prompt.id, target: "clipboard" });
      toast({
        title: "Sacred Sigil Invoked",
        description: `"${prompt.title}" has been copied and is ready to manifest`,
      });
    } catch (error) {
      toast({
        title: "Invocation Failed",
        description: "Unable to copy sigil to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromSigils = (prompt: any) => {
    updatePromptMutation.mutate({
      id: prompt.id,
      isFavorite: false,
    });
    toast({
      title: "Sigil Dismissed",
      description: `"${prompt.title}" has been removed from your sacred collection`,
    });
  };

  const getPowerLevel = (prompt: any) => {
    const power = getPromptPower(prompt);
    if (power >= 20) return { level: "Legendary", color: "text-sacred-gold", icon: "fas fa-crown" };
    if (power >= 10) return { level: "Mythic", color: "text-ethereal-pink", icon: "fas fa-gem" };
    if (power >= 5) return { level: "Rare", color: "text-mystic-purple", icon: "fas fa-star" };
    if (power >= 2) return { level: "Common", color: "text-neon-cyan", icon: "fas fa-circle" };
    return { level: "Novice", color: "text-ancient-green", icon: "fas fa-dot-circle" };
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
            Sigils
          </h1>
          <p className="text-gray-300 text-lg">
            Your most powerful spells and sacred shortcuts blessed by ancient wisdom
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="glow-border rounded-2xl p-6 mb-8 bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-cyan">{favoritePrompts.length}</div>
              <div className="text-sm text-gray-400">Sacred Sigils</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ethereal-pink">
                {favoritePrompts.reduce((total, prompt) => total + (prompt.usageCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Total Invocations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sacred-gold">
                {favoritePrompts.filter(prompt => getPromptPower(prompt) >= 10).length}
              </div>
              <div className="text-sm text-gray-400">Mythic+ Sigils</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-ancient-green">
                {Math.round(favoritePrompts.reduce((total, prompt) => total + (prompt.usageCount || 0), 0) / Math.max(favoritePrompts.length, 1))}
              </div>
              <div className="text-sm text-gray-400">Avg. Power</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="glow-border rounded-2xl p-6 mb-8 bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sacred sigils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-midnight/50 border-sacred-gold/30 text-white placeholder:text-gray-400"
                data-testid="input-search-sigils"
              />
            </div>

            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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

            <Select onValueChange={setSortBy}>
              <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white">
                <SelectValue placeholder="Sort by Usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">Most Used</SelectItem>
                <SelectItem value="power">Highest Power</SelectItem>
                <SelectItem value="recent">Recently Updated</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="sacred-button border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setSortBy("usage");
              }}
              data-testid="button-clear-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Sigils Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading sacred sigils...</p>
          </div>
        ) : filteredSigils.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <i className="fas fa-star text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-mystical text-gray-400 mb-2">No Sacred Sigils</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory 
                ? "No sigils match your current filters" 
                : "Mark your favorite spells as sigils to access them quickly"}
            </p>
            <Link href="/invocations">
              <Button className="sacred-button" data-testid="button-browse-spells">
                <Star className="h-4 w-4 mr-2" />
                Browse Spells to Favorite
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
            {filteredSigils.map((prompt: any, index: number) => {
              const category = categories.find((cat: any) => cat.id === prompt.categoryId);
              const powerLevel = getPowerLevel(prompt);
              
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    {/* Power Level Indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        variant="outline" 
                        className={`${powerLevel.color} border-current bg-midnight/50 backdrop-blur-sm`}
                      >
                        <i className={`${powerLevel.icon} mr-1 text-xs`} />
                        {powerLevel.level}
                      </Badge>
                    </div>

                    {/* Mystical Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sacred-gold/5 via-transparent to-mystic-purple/5 pointer-events-none" />
                    
                    <CardHeader>
                      <div className="flex items-start justify-between pr-16">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-ethereal-pink to-sacred-gold flex items-center justify-center"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <i className="fas fa-star text-white text-lg sigil-icon" />
                          </motion.div>
                          <div>
                            <CardTitle className="font-mystical text-sacred-gold text-lg">
                              {prompt.title}
                            </CardTitle>
                            {category && (
                              <Badge 
                                variant="outline" 
                                className="mt-1 border-sacred-gold/50 text-sacred-gold text-xs"
                              >
                                <i className={`${category.icon} mr-1`} />
                                {category.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {prompt.description || prompt.content.substring(0, 120) + "..."}
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
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {prompt.usageCount || 0} uses
                          </div>
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            {getPromptPower(prompt)} power
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCopyPrompt(prompt)}
                          className="sacred-button flex-1 text-sm"
                          disabled={addUsageMutation.isPending}
                          data-testid={`button-invoke-${prompt.id}`}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Invoke Sigil
                        </Button>
                        <Button
                          onClick={() => handleRemoveFromSigils(prompt)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          data-testid={`button-remove-${prompt.id}`}
                        >
                          <Star className="h-4 w-4 fill-current" />
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
          <Link href="/invocations">
            <Button
              size="lg"
              className="sacred-button rounded-full w-16 h-16 shadow-lg"
              data-testid="button-fab-browse"
            >
              <Star className="text-xl" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
