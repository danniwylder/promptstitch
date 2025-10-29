import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SacredLogo from "@/components/sacred-geometry/sacred-logo";
import SacredCard from "@/components/ui/sacred-card";
import { Button } from "@/components/ui/button";
import MysticalIcon from "@/components/sacred-geometry/mystical-icons";
import { SACRED_QUOTES } from "@/lib/constants";

export default function Home() {
  const { data: prompts = [] } = useQuery<any[]>({
    queryKey: ["/api/prompts"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: usageHistory = [] } = useQuery<any[]>({
    queryKey: ["/api/usage-history"],
  });

  const { data: settings } = useQuery<any>({
    queryKey: ["/api/settings"],
  });

  const favoritePrompts = prompts.filter((p: any) => p.isFavorite);
  const drafts = prompts.filter((p: any) => !p.content.trim());

  const quote = SACRED_QUOTES[0]; // Use the Jim Morrison quote as requested

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Sacred Logo and Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block relative">
              <SacredLogo size="lg" />
              <motion.h1 
                className="font-mystical text-6xl font-semibold bg-gradient-to-r from-sacred-gold via-neon-cyan to-ethereal-pink bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                the Ritual
              </motion.h1>
              <p className="font-mystical text-lg text-gray-300 mt-2">Ancient Prompt Sanctum</p>
            </div>
          </motion.div>
          
          {/* Mystical Quote */}
          <motion.div 
            className="text-center mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="font-mystical text-2xl text-sacred-gold mb-2">Weave your prompts into reality</p>
            <blockquote className="italic text-gray-400 border-l-2 border-sacred-gold pl-4 ml-8 mb-4">
              "{quote.text}"
              <cite className="block text-sm mt-2 text-neon-cyan">- {quote.author}</cite>
            </blockquote>
          </motion.div>
        </div>
      </header>

      {/* Navigation Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SacredCard
            title="Invocations"
            description="Your spell library with sacred incantations ready to cast into the digital realm"
            icon="invocations"
            href="/invocations"
            gradientFrom="from-ethereal-pink"
            gradientTo="to-mystic-purple"
            stats={`${prompts.length} prompts ready`}
            data-testid="card-invocations"
          />

          <SacredCard
            title="Ilk"
            description="Mystical categories organized like grimoire chapters of forbidden knowledge"
            icon="ilk"
            href="/ilk"
            gradientFrom="from-ancient-green"
            gradientTo="to-mystic-purple"
            stats={`${categories.length} sacred categories`}
            data-testid="card-ilk"
          />

          <SacredCard
            title="Alchemy"
            description="The sacred workshop for crafting new spells and transmuting ideas into power"
            icon="alchemy"
            href="/alchemy"
            gradientFrom="from-sacred-gold"
            gradientTo="to-ethereal-pink"
            stats={`${drafts.length} works in progress`}
            data-testid="card-alchemy"
          />

          <SacredCard
            title="Settings"
            description="Ritual preferences, tome import/export, and mystical configurations"
            icon="settings"
            href="/settings"
            gradientFrom="from-mystic-purple"
            gradientTo="to-neon-cyan"
            stats={settings?.syncEnabled ? "✓ Sync enabled" : "Sync disabled"}
            data-testid="card-settings"
          />

          <SacredCard
            title="Threads"
            description="Chronicle of past spell workings and ritual history through time"
            icon="threads"
            href="/threads"
            gradientFrom="from-neon-cyan"
            gradientTo="to-ancient-green"
            stats={`${usageHistory.length} past rituals`}
            data-testid="card-threads"
          />

          <SacredCard
            title="Sigils"
            description="Your most powerful spells and sacred shortcuts blessed by ancient wisdom"
            icon="sigils"
            href="/sigils"
            gradientFrom="from-ethereal-pink"
            gradientTo="to-sacred-gold"
            stats={`${favoritePrompts.length} sacred favorites`}
            data-testid="card-sigils"
          />
        </motion.div>

        {/* Conflux Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="glow-border rounded-3xl p-12 bg-gradient-to-br from-midnight/90 to-forest/70 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-ethereal-pink rounded-full"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px var(--neon-cyan)",
                      "0 0 40px var(--ethereal-pink)",
                      "0 0 20px var(--neon-cyan)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="absolute inset-2 bg-midnight rounded-full flex items-center justify-center">
                  <MysticalIcon icon="conflux" size="lg" className="text-sacred-gold mx-auto" />
                </div>
              </div>
              
              <h2 className="font-mystical text-4xl font-semibold text-sacred-gold mb-6">Conflux</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The ethereal bridge for cross-dimensional synchronization between realms of mobile and desktop
              </p>
              
              {/* Sync Status Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <motion.div 
                  className="sacred-button rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="fas fa-mobile-alt text-2xl text-neon-cyan mb-3" />
                  <h3 className="font-mystical text-lg text-sacred-gold mb-2">Android Realm</h3>
                  <p className="text-sm text-ancient-green">✓ Connected</p>
                  <p className="text-xs text-gray-400">Last sync: 2 min ago</p>
                </motion.div>
                
                <motion.div 
                  className="sacred-button rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="fas fa-desktop text-2xl text-ethereal-pink mb-3" />
                  <h3 className="font-mystical text-lg text-sacred-gold mb-2">Chrome Extension</h3>
                  <p className="text-sm text-ancient-green">✓ Connected</p>
                  <p className="text-xs text-gray-400">Last sync: 1 min ago</p>
                </motion.div>
                
                <motion.div 
                  className="sacred-button rounded-xl p-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <i className="fas fa-cloud text-2xl text-mystic-purple mb-3" />
                  <h3 className="font-mystical text-lg text-sacred-gold mb-2">Cloud Sanctum</h3>
                  <p className="text-sm text-ancient-green">✓ Synchronized</p>
                  <p className="text-xs text-gray-400">All data preserved</p>
                </motion.div>
              </div>

              <Button
                onClick={() => window.location.href = '/conflux'}
                size="lg"
                className="sacred-button px-8"
                data-testid="button-conflux"
              >
                Enter Conflux Realm
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Button 
            onClick={() => window.location.href = '/alchemy'}
            className="sacred-button px-6 py-3"
            data-testid="button-create-spell"
          >
            <i className="fas fa-plus mr-2"></i>
            Craft New Spell
          </Button>
          
          <Button 
            variant="secondary"
            className="sacred-button px-6 py-3"
            data-testid="button-import-grimoire"
          >
            <i className="fas fa-download mr-2"></i>
            Import Grimoire
          </Button>
          
          <Button 
            variant="secondary"
            className="sacred-button px-6 py-3"
            data-testid="button-export-collection"
          >
            <i className="fas fa-upload mr-2"></i>
            Export Collection
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-t border-sacred-gold/30 pt-8">
            <p className="font-mystical text-sacred-gold mb-2">Where Ancient Wisdom Meets Digital Sorcery</p>
            <p className="text-sm text-gray-400">
              the Ritual v1.0 - Ancient Prompt Sanctum
              <span className="mx-2">•</span>
              <span className="text-neon-cyan">Connected to the Ethereal Network</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
