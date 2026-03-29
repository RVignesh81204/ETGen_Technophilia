import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, ArrowRight, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { demoStories, type Story } from '@/data/stories';

const sectionConfig = {
  breaking: { label: 'Breaking Now', icon: Zap },
  trending: { label: 'Trending', icon: TrendingUp },
  markets: { label: 'Markets & Economy', icon: BarChart3 },
};

const StoryCard = ({ story, index, onClick }: { story: Story; index: number; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 * index, duration: 0.5 }}
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="glass rounded-xl overflow-hidden cursor-pointer group hover:border-primary/40 transition-all"
  >
    <div className="flex gap-4 p-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider bg-primary/10 text-primary">
            {story.category}
          </span>
          <span className="text-muted-foreground text-xs font-sans flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {story.timestamp}
          </span>
        </div>
        <h3 className="font-serif text-base font-semibold leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
          {story.headline}
        </h3>
        <p className="text-muted-foreground text-sm font-sans line-clamp-2 leading-relaxed">{story.summary}</p>
      </div>
      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
        <img src={story.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    </div>
  </motion.div>
);

const FeaturedCard = ({ story, onClick }: { story: Story; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.6 }}
    whileHover={{ y: -4 }}
    onClick={onClick}
    className="glass rounded-xl overflow-hidden cursor-pointer group hover:border-primary/40 transition-all glow-gold col-span-full"
  >
    <div className="flex flex-col sm:flex-row">
      <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
        <img src={story.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-destructive/20 text-destructive">
            Breaking
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider bg-primary/10 text-primary">
            {story.category}
          </span>
          <span className="text-muted-foreground text-xs font-sans flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {story.timestamp}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
          {story.headline}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed mb-4">{story.summary}</p>
        <div className="flex items-center gap-2 text-primary font-sans text-sm font-semibold">
          Analyze with AI <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </motion.div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return demoStories;
    const q = search.toLowerCase();
    return demoStories.filter(s =>
      s.headline.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }, [search]);

  const featured = filtered.find(s => s.featured);
  const sections = (['breaking', 'trending', 'markets'] as const).map(key => ({
    ...sectionConfig[key],
    key,
    stories: filtered.filter(s => s.section === key && !s.featured),
  }));

  const openStory = (story: Story) => navigate(`/story/${story.id}`);

  return (
    <div className="min-h-screen bg-background grain">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs font-sans">ET</span>
            </div>
            <span className="font-serif text-lg font-semibold">Story OS</span>
          </div>
          <div className="relative w-full max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search companies, sectors, events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          <span className="text-muted-foreground text-xs font-sans hidden md:block whitespace-nowrap">March 29, 2026</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Featured */}
        {featured && <FeaturedCard story={featured} onClick={() => openStory(featured)} />}

        {/* Sections */}
        {sections.map(sec => (
          sec.stories.length > 0 && (
            <section key={sec.key} className="mt-10">
              <div className="flex items-center gap-2 mb-5">
                <sec.icon className="w-4 h-4 text-primary" />
                <h2 className="font-serif text-xl font-semibold">{sec.label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sec.stories.map((s, i) => (
                  <StoryCard key={s.id} story={s} index={i} onClick={() => openStory(s)} />
                ))}
              </div>
            </section>
          )
        ))}
      </main>
    </div>
  );
};

export default HomePage;
