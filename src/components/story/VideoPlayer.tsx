import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, Pause, RotateCcw } from 'lucide-react';
import type { BriefingData } from '@/data/stories';

type Phase = 'idle' | 'generating' | 'playing' | 'finished';

const buildSlides = (b: BriefingData) => [
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
  const [totalProgress, setTotalProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const progressRef = useRef<ReturnType<typeof setInterval>>();

  // Reset when briefing changes
  useEffect(() => {
    setPhase('idle');
    setCurrentSlide(0);
    setGenProgress(0);
    setTotalProgress(0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [briefing.title]);

  const generate = () => {
    setPhase('generating');
    setGenProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 5;
      if (p >= 100) {
        clearInterval(iv);
        setGenProgress(100);
        setTimeout(() => playVideo(), 400);
      } else {
        setGenProgress(p);
      }
    }, 250);
  };

  const playVideo = () => {
    setPhase('playing');
    setCurrentSlide(0);
    setTotalProgress(0);
    const s = buildSlides(briefing);
    const totalDuration = s.reduce((acc, sl) => acc + sl.dur, 0);
    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTotalProgress(Math.min((elapsed / totalDuration) * 100, 100));
    }, 100);

    let i = 0;
    const next = () => {
      i++;
      if (i < s.length) {
        setCurrentSlide(i);
        timerRef.current = setTimeout(next, s[i].dur);
      } else {
        setTimeout(() => {
          if (progressRef.current) clearInterval(progressRef.current);
          setTotalProgress(100);
          setPhase('finished');
        }, 800);
      }
    };
    timerRef.current = setTimeout(next, s[0].dur);
  };

  const replay = () => {
    setPhase('idle');
    setCurrentSlide(0);
    setTotalProgress(0);
  };

  const s = buildSlides(briefing);
  const images = briefing.slideImages || [briefing.imageUrl];

  const getSlideImage = (idx: number) => {
    return images[idx % images.length];
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="relative aspect-video bg-background flex items-center justify-center overflow-hidden">

        {phase === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            {/* Thumbnail preview */}
            <div className="absolute inset-0 -z-10">
              <img
                src={briefing.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-20 blur-sm"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>
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
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Ken Burns background image */}
                <motion.img
                  src={getSlideImage(currentSlide)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.0, x: 0, y: 0 }}
                  animate={{
                    scale: 1.15,
                    x: currentSlide % 2 === 0 ? 20 : -20,
                    y: currentSlide % 3 === 0 ? 10 : -10,
                  }}
                  transition={{ duration: (s[currentSlide]?.dur || 4000) / 1000, ease: 'linear' }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12">
                  <div className="relative z-10 text-center max-w-2xl">
                    <motion.span
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block px-4 py-1.5 rounded bg-primary/30 text-primary text-xs font-sans font-bold uppercase tracking-widest mb-5 backdrop-blur-sm border border-primary/20"
                    >
                      {s[currentSlide].title}
                    </motion.span>
                    <motion.p
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="font-serif text-lg sm:text-2xl font-semibold leading-relaxed text-white drop-shadow-lg"
                    >
                      {s[currentSlide].text}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute bottom-10 z-20 flex gap-1.5">
              {s.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-primary scale-125' : i < currentSlide ? 'bg-primary/50' : 'bg-white/30'}`} />
              ))}
            </div>

            {/* Bottom progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${totalProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </>
        )}

        {phase === 'finished' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center">
            <div className="absolute inset-0 -z-10">
              <img
                src={briefing.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-15 blur-sm"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />
            </div>
            <button
              onClick={replay}
              className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4 hover:bg-primary/30 transition-colors glow-gold"
            >
              <RotateCcw className="w-6 h-6 text-primary" />
            </button>
            <h3 className="font-serif text-lg font-semibold mb-1">Video Complete</h3>
            <p className="text-muted-foreground text-sm font-sans">Click to replay</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
