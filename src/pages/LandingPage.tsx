import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, BarChart3, Globe, ArrowRight } from 'lucide-react';

const tickerHeadlines = [
  'NVIDIA hits $4T market cap',
  'Iran enrichment at 84% — IAEA alert',
  'EU AI Act Phase 2 enforced',
  'RBI holds rates steady',
  'Tata breaks ground on $11B chip fab',
  'Saudi Aramco plans $30B green IPO',
  'GPT-5 launches with agent capabilities',
  'China retaliates with 45% tariffs',
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background grain relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-sans">ET</span>
          </div>
          <span className="font-serif text-xl font-semibold text-foreground">Story OS</span>
        </div>
        <span className="text-muted-foreground text-sm font-sans hidden sm:block">AI-Native Business Intelligence</span>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-primary text-xs font-sans font-medium tracking-wider uppercase">Live Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          The Future of{' '}
          <span className="text-gradient-gold">Business</span>{' '}
          Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mb-10 font-sans leading-relaxed"
        >
          ET Story OS transforms breaking business news into interactive, AI-powered intelligence briefings. Explore stories through multiple lenses — as an investor, founder, analyst, or journalist.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/home')}
          className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-sans font-semibold text-base glow-gold transition-all"
        >
          Enter Story OS
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </section>

      {/* Feature highlights */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 pb-16"
      >
        {[
          { icon: Zap, title: 'AI Briefings', desc: 'Structured intelligence from any headline in seconds' },
          { icon: BarChart3, title: 'Role-Based Lens', desc: 'See every story through investor, founder, or analyst eyes' },
          { icon: Globe, title: 'Living Stories', desc: 'Watch stories evolve with real-time simulated updates' },
        ].map((f, i) => (
          <div key={i} className="glass rounded-xl p-6 text-center group hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm font-sans">{f.desc}</p>
          </div>
        ))}
      </motion.section>

      {/* Ticker */}
      <div className="relative z-10 border-t border-b border-border/50 py-3 overflow-hidden">
        <div className="animate-ticker flex gap-12 whitespace-nowrap">
          {[...tickerHeadlines, ...tickerHeadlines].map((h, i) => (
            <span key={i} className="text-muted-foreground text-sm font-sans flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Footer brand */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 text-center py-10 text-muted-foreground text-xs font-sans"
      >
        Powered by AI · Built for the next generation of business leaders
      </motion.div>
    </div>
  );
};

export default LandingPage;
