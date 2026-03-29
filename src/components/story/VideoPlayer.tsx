import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import type { BriefingData } from '@/data/stories';

type Phase = 'idle' | 'generating' | 'playing';

const slides = (b: BriefingData) => [
  { title: 'BREAKING', text: b.title, dur: 4000 },
  { title: 'KEY FACTS', text: b.keyFacts.slice(0, 3).join(' · '), dur: 4000 },
  { title: 'TIMELINE', text: b.timeline.slice(-3).map(t => `${t.date}: ${t.event}`).join('\n'), dur: 5000 },
  { title: 'IMPACT', text: b.impactAnalysis, dur: 4000 },
  { title: 'OUTLOOK', text: b.futureOutlook, dur: 4000 },
  { title: 'WATCH NEXT', text: b.watchNext.slice(0, 3).join(' · '), dur: 3000 },
];

const VideoPlayer = ({ briefing }: { briefing: BriefingData }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [genProgress, setGenProgress] = useState(0);

  const generate = () => {
    setPhase('generating');
    setGenProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        clearInterval(iv);
        setGenProgress(100);
        setTimeout(() => playVideo(), 500);
      } else {
        setGenProgress(p);
      }
    }, 300);
  };

  const playVideo = () => {
    setPhase('playing');
    setCurrentSlide(0);
    const s = slides(briefing);
    let i = 0;
    const next = () => {
      i++;
      if (i < s.length) {
        setCurrentSlide(i);
        setTimeout(next, s[i].dur);
      } else {
        setTimeout(() => setPhase('idle'), 1000);
      }
    };
    setTimeout(next, s[0].dur);
  };

  const s = slides(briefing);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="relative aspect-video bg-background flex items-center justify-center overflow-hidden">
        {/* Ambient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/10" />

        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            <button
              onClick={generate}
              className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 hover:bg-primary/30 transition-colors glow-gold"
            >
              <Play className="w-8 h-8 text-primary ml-1" />
            </button>
            <h3 className="font-serif text-lg font-semibold mb-1">Generate Video Summary</h3>
            <p className="text-muted-foreground text-sm font-sans">AI-powered 30-second news reel</p>
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="font-sans text-sm text-muted-foreground mb-3">Generating video summary...</p>
            <div className="w-64 h-1.5 rounded-full bg-muted/30 overflow-hidden mx-auto">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${genProgress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-mono">{Math.round(genProgress)}%</p>
          </motion.div>
        )}

        {phase === 'playing' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/50" />
              <div className="relative z-10 text-center max-w-2xl">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-3 py-1 rounded bg-primary/20 text-primary text-xs font-sans font-bold uppercase tracking-widest mb-4"
                >
                  {s[currentSlide].title}
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="font-serif text-lg sm:text-2xl font-semibold leading-relaxed text-foreground"
                >
                  {s[currentSlide].text}
                </motion.p>
              </div>
              {/* Progress dots */}
              <div className="absolute bottom-6 flex gap-1.5">
                {s.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
