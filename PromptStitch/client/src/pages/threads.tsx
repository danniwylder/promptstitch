import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Calendar, Target, Clock, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";
import { AI_TARGETS } from "@/lib/constants";
import { format, isToday, isYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default function Threads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: usageHistory = [], isLoading } = useQuery({
    queryKey: ["/api/usage-history"],
  });

  const { data: prompts = [] } = useQuery({
    queryKey: ["/api/prompts"],
  });

  const getPromptTitle = (promptId: string) => {
    const prompt = prompts.find((p: any) => p.id === promptId);
    return prompt?.title || "Unknown Spell";
  };

  const getPromptById = (promptId: string) => {
    return prompts.find((p: any) => p.id === promptId);
  };

  const filterByDate = (usage: any) => {
    const usageDate = new Date(usage.timestamp);
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return isToday(usageDate);
      case "yesterday":
        return isYesterday(usageDate);
      case "this-week":
        return usageDate >= startOfWeek(now) && usageDate <= endOfWeek(now);
      case "this-month":
        return usageDate >= startOfMonth(now) && usageDate <= endOfMonth(now);
      default:
        return true;
    }
  };

  const filteredHistory = usageHistory.filter((usage: any) => {
    const prompt = getPromptById(usage.promptId);
    const matchesSearch = searchQuery === "" || 
      getPromptTitle(usage.promptId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (usage.target && usage.target.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTarget = !selectedTarget || usage.target === selectedTarget;
    const matchesDate = filterByDate(usage);
    
    return matchesSearch && matchesTarget && matchesDate && prompt;
  });

  const getTargetInfo = (target: string) => {
    return AI_TARGETS.find(t => t.id === target) || { 
      id: target, 
      name: target, 
      icon: "fas fa-magic" 
    };
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return format(date, "MMM dd");
    }
  };

  const getUniqueTargets = () => {
    const targets = usageHistory.map((usage: any) => usage.target).filter(Boolean);
    return [...new Set(targets)];
  };

  const getTotalUsages = () => usageHistory.length;

  const getUniqueSpells = () => {
    const promptIds = usageHistory.map((usage: any) => usage.promptId);
    return new Set(promptIds).size;
  };

  const getMostUsedTarget = () => {
    const targetCounts = usageHistory.reduce((acc: any, usage: any) => {
      if (usage.target) {
        acc[usage.target] = (acc[usage.target] || 0) + 1;
      }
      return acc;
    }, {});
    
    const mostUsed = Object.entries(targetCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0];
    return mostUsed ? mostUsed[0] : null;
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
            Threads
          </h1>
          <p className="text-gray-300 text-lg">
            Chronicle of past spell workings and ritual history through time
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-neon-cyan">{getTotalUsages()}</div>
              <div className="text-sm text-gray-400">Total Castings</div>
            </CardContent>
          </Card>
          
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-ethereal-pink">{getUniqueSpells()}</div>
              <div className="text-sm text-gray-400">Unique Spells</div>
            </CardContent>
          </Card>
          
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-ancient-green">{getUniqueTargets().length}</div>
              <div className="text-sm text-gray-400">AI Realms</div>
            </CardContent>
          </Card>
          
          <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-sacred-gold">
                {getMostUsedTarget() ? getTargetInfo(getMostUsedTarget()).name : "None"}
              </div>
              <div className="text-sm text-gray-400">Favored Realm</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
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
                placeholder="Search ritual history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-midnight/50 border-sacred-gold/30 text-white placeholder:text-gray-400"
                data-testid="input-search-history"
              />
            </div>

            <Select onValueChange={setSelectedTarget}>
              <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white">
                <SelectValue placeholder="Filter by realm..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Realms</SelectItem>
                {getUniqueTargets().map((target) => {
                  const targetInfo = getTargetInfo(target);
                  return (
                    <SelectItem key={target} value={target}>
                      <div className="flex items-center gap-2">
                        <i className={`${targetInfo.icon} text-sm`} />
                        {targetInfo.name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select onValueChange={setDateFilter}>
              <SelectTrigger className="bg-midnight/50 border-sacred-gold/30 text-white">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="sacred-button border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10"
              onClick={() => {
                setSearchQuery("");
                setSelectedTarget(null);
                setDateFilter("all");
              }}
              data-testid="button-clear-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* History List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-sacred-gold border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading ritual chronicles...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <i className="fas fa-history text-6xl text-gray-600 mb-4" />
            <h3 className="text-xl font-mystical text-gray-400 mb-2">No Ritual History</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedTarget || dateFilter !== "all" 
                ? "No rituals match your current filters" 
                : "Start casting spells to build your chronicle"}
            </p>
            <Link href="/invocations">
              <Button className="sacred-button" data-testid="button-start-casting">
                <i className="fas fa-magic mr-2" />
                Begin Your First Ritual
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredHistory.map((usage: any, index: number) => {
              const prompt = getPromptById(usage.promptId);
              const targetInfo = getTargetInfo(usage.target || "clipboard");
              
              return (
                <motion.div
                  key={usage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glow-border bg-gradient-to-br from-midnight/80 to-forest/60 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-mystical text-lg text-sacred-gold">
                              {getPromptTitle(usage.promptId)}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-sacred-gold/50 text-sacred-gold"
                            >
                              <i className={`${targetInfo.icon} mr-1 text-xs`} />
                              {targetInfo.name}
                            </Badge>
                          </div>
                          
                          {prompt?.description && (
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {prompt.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTimeAgo(usage.timestamp)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(usage.timestamp), "MMM dd, yyyy 'at' HH:mm")}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Link href={`/invocations`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-sacred-gold/50 text-sacred-gold hover:bg-sacred-gold/10"
                              data-testid={`button-view-spell-${usage.id}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {usage.metadata && Object.keys(usage.metadata).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-sacred-gold/20">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Ritual Metadata</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(usage.metadata).map(([key, value]) => (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="text-xs bg-mystic-purple/20 text-mystic-purple border-mystic-purple/30"
                              >
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination could be added here for large datasets */}
        {filteredHistory.length > 0 && (
          <motion.div 
            className="mt-8 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Showing {filteredHistory.length} of {usageHistory.length} ritual records
          </motion.div>
        )}
      </div>
    </div>
  );
}
