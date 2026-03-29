import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Pause, Volume2, Send, RefreshCw, Zap,
  Users, TrendingUp, BookOpen, Mic, Video, MessageSquare,
  AlertTriangle, Eye, Clock, Target, Lightbulb, Shield
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { demoStories, storyBriefings, roleFramings, type BriefingData } from '@/data/stories';
import { useToast } from '@/hooks/use-toast';
import EntityGraph from '@/components/story/EntityGraph';
import VideoPlayer from '@/components/story/VideoPlayer';

const roles = [
  { id: 'general', label: 'General', icon: BookOpen },
  { id: 'investor', label: 'Investor', icon: TrendingUp },
  { id: 'founder', label: 'Founder', icon: Target },
  { id: 'student', label: 'Student', icon: Lightbulb },
  { id: 'journalist', label: 'Journalist', icon: Mic },
  { id: 'analyst', label: 'Analyst', icon: Shield },
];

/* ─── Smart Chat Response Generator ─── */
function generateChatResponse(question: string, briefing: BriefingData, role: string, storyId: string): string {
  const q = question.toLowerCase();
  const rf = roleFramings[storyId]?.[role];

  // Timeline questions
  if (q.includes('timeline') || q.includes('when') || q.includes('chronolog') || q.includes('history') || q.includes('happened')) {
    const tl = briefing.timeline.slice(-4).map(t => `**${t.date}**: ${t.event}`).join('\n');
    return `Here's the recent timeline:\n\n${tl}\n\nKey developments are accelerating. ${briefing.futureOutlook.split('.')[0]}.`;
  }

  // Impact / affect questions
  if (q.includes('impact') || q.includes('affect') || q.includes('consequence') || q.includes('mean for')) {
    return `**Impact Analysis:**\n\n${rf?.impact || briefing.impactAnalysis}\n\n**Sentiment:** ${briefing.sentiment}`;
  }

  // Contrarian / hidden / alternative view
  if (q.includes('contrarian') || q.includes('hidden') || q.includes('other side') || q.includes('alternative') || q.includes('disagree') || q.includes('opposite')) {
    return `**Contrarian Perspective:**\n\n${briefing.contrarianView}`;
  }

  // Future / outlook / predict
  if (q.includes('future') || q.includes('outlook') || q.includes('predict') || q.includes('next') || q.includes('expect') || q.includes('will')) {
    const watchItems = briefing.watchNext.slice(0, 3).map(w => `• ${w}`).join('\n');
    return `**Outlook:**\n\n${briefing.futureOutlook}\n\n**Key Things to Watch:**\n${watchItems}`;
  }

  // Entity / who / player questions
  if (q.includes('who') || q.includes('player') || q.includes('entity') || q.includes('involved') || q.includes('key')) {
    const entities = briefing.keyEntities.slice(0, 4).map(e => `• **${e.name}** (${e.type}): ${e.role}`).join('\n');
    return `**Key Entities:**\n\n${entities}`;
  }

  // Facts / details
  if (q.includes('fact') || q.includes('detail') || q.includes('data') || q.includes('number') || q.includes('statistic')) {
    const facts = briefing.keyFacts.slice(0, 4).map(f => `• ${f}`).join('\n');
    return `**Key Facts:**\n\n${facts}`;
  }

  // Risk / danger
  if (q.includes('risk') || q.includes('danger') || q.includes('worry') || q.includes('concern') || q.includes('threat')) {
    return `**Risk Assessment:**\n\n${rf?.impact || briefing.impactAnalysis}\n\n**Contrarian Take:** ${briefing.contrarianView.split('.')[0]}.`;
  }

  // Investment / portfolio / stock / buy
  if (q.includes('invest') || q.includes('portfolio') || q.includes('stock') || q.includes('buy') || q.includes('sell') || q.includes('hedge') || q.includes('trade')) {
    return `**${roles.find(r => r.id === role)?.label || 'General'} View on Investment Angle:**\n\n${rf?.impact || briefing.impactAnalysis}\n\n**Sentiment:** ${briefing.sentiment}\n\n*Note: This is AI-generated analysis, not financial advice.*`;
  }

  // Default intelligent response using role context
  return `Based on the current situation regarding **"${briefing.title}"**, here's my ${role !== 'general' ? roles.find(r => r.id === role)?.label + ' ' : ''}analysis:\n\n${rf?.summary || briefing.summary}\n\n**Key Takeaway:** ${briefing.futureOutlook.split('.')[0]}.\n\n**What to Watch:**\n${briefing.watchNext.slice(0, 3).map(w => `• ${w}`).join('\n')}`;
}

const StoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const story = demoStories.find(s => s.id === id);
  const [role, setRole] = useState('general');
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load briefing for the current story
  useEffect(() => {
    if (id && storyBriefings[id]) {
      setBriefing(storyBriefings[id]);
    }
    // Reset chat on story change
    setChatMessages([]);
    setChatInput('');
    setRole('general');
    setAudioProgress(0);
    setIsPlaying(false);
    speechSynthesis.cancel();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!story || !id) {
    navigate('/home');
    return null;
  }

  if (!briefing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">Loading briefing...</p>
      </div>
    );
  }

  const currentRoleFraming = roleFramings[id]?.[role];
  const currentQuestions = currentRoleFraming?.questions || briefing.suggestedQuestions;

  const toggleAudio = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(briefing.audioScript);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utteranceRef.current = utterance;
    setIsPlaying(true);
    setAudioProgress(0);
    const totalDur = briefing.audioScript.length * 60;
    const startTime = Date.now();
    audioIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDur) * 100, 100);
      setAudioProgress(pct);
      if (pct >= 100) {
        clearInterval(audioIntervalRef.current);
        setIsPlaying(false);
      }
    }, 200);
    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
    speechSynthesis.speak(utterance);
  };

  const sendMessage = (msg: string) => {
    if (!msg.trim()) return;
    const userMsg = msg.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoadingChat(true);

    setTimeout(() => {
      const response = generateChatResponse(userMsg, briefing, role, id);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoadingChat(false);
    }, 800 + Math.random() * 1200);
  };

  const handleChat = () => sendMessage(chatInput);

  const simulateUpdate = () => {
    const updates: Record<string, { date: string; event: string; sentiment: string }> = {
      'iran-israel-usa': { date: 'Mar 29 (Update)', event: 'BREAKING: Iran agrees to limited IAEA inspection at Natanz facility under diplomatic pressure', sentiment: 'Cautiously improving. Markets may stabilize if inspections proceed.' },
      'nvidia-earnings': { date: 'Mar 29 (Update)', event: 'BREAKING: NVIDIA announces $10B stock buyback program — largest in chip industry history', sentiment: 'Extremely bullish. Buyback signals management confidence in sustained growth.' },
      'rbi-rate': { date: 'Mar 29 (Update)', event: 'BREAKING: Food inflation drops to 5.2% on vegetable price correction — rate cut odds increase', sentiment: 'Turning dovish. Bond rally expected as rate cut probability rises to 85%.' },
      'openai-gpt5': { date: 'Mar 29 (Update)', event: 'BREAKING: Google announces Gemini 3 launch date — two weeks ahead of schedule', sentiment: 'Competition heating up. AI sector volatility increasing.' },
      'tata-semiconductor': { date: 'Mar 29 (Update)', event: 'BREAKING: ASML confirms early delivery of EUV equipment to Dholera — 3 months ahead of schedule', sentiment: 'Positive momentum. Execution confidence improving.' },
      'saudi-ipo': { date: 'Mar 29 (Update)', event: 'BREAKING: IPO final pricing set at 15% premium to initial range — massive institutional demand', sentiment: 'Extremely bullish. ESG demand exceeds expectations.' },
      'ai-regulation-eu': { date: 'Mar 29 (Update)', event: 'BREAKING: First fine issued — unnamed AI company faces €1.2B penalty for non-compliance', sentiment: 'Regulatory teeth shown. AI stocks dip 3-5% across European markets.' },
      'startup-unicorn': { date: 'Mar 29 (Update)', event: 'BREAKING: Zeptomail acquires German competitor Postmark for $200M — European expansion accelerates', sentiment: 'Bullish. Acquisition strengthens market position ahead of IPO.' },
      'china-trade': { date: 'Mar 29 (Update)', event: 'BREAKING: US announces $15B emergency farm bailout package — bipartisan support in Congress', sentiment: 'Slightly positive. Bailout cushions immediate impact but structural issues remain.' },
    };

    const update = updates[id] || updates['iran-israel-usa'];
    setBriefing(prev => prev ? ({
      ...prev,
      timeline: [...prev.timeline, { date: update.date, event: update.event }],
      sentiment: update.sentiment,
    }) : prev);
    toast({
      title: '⚡ Story Updated',
      description: update.event.replace('BREAKING: ', ''),
    });
  };

  // Related stories (excluding current, max 3)
  const relatedStories = demoStories.filter(s => s.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background grain">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px] font-sans">ET</span>
            </div>
            <span className="font-serif text-sm font-semibold">Story Intelligence</span>
          </div>
          <div className="flex-1" />
          <button
            onClick={simulateUpdate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 text-secondary text-xs font-sans font-medium hover:bg-secondary/20 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Simulate Update
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Story header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold uppercase tracking-wider bg-primary/10 text-primary">{story.category}</span>
            <span className="text-muted-foreground text-xs font-sans">{story.timestamp}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3">{briefing.title}</h1>
          <p className="text-muted-foreground font-sans leading-relaxed max-w-3xl">{briefing.summary}</p>
        </motion.div>

        {/* Role selector */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-all ${
                role === r.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <r.icon className="w-3.5 h-3.5" />
              {r.label}
            </button>
          ))}
        </motion.div>

        {/* Role insight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-xl p-4 mb-6 border-l-2 border-l-primary"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-sans text-xs font-semibold text-primary uppercase tracking-wider">
                {roles.find(r => r.id === role)?.label} Perspective
              </span>
            </div>
            <p className="text-sm font-sans text-foreground/90 leading-relaxed">
              {currentRoleFraming?.summary || briefing.summary}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Main tabs */}
        <Tabs defaultValue="briefing" className="w-full">
          <TabsList className="bg-muted/30 border border-border/50 mb-6 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="briefing" className="text-xs font-sans gap-1"><Eye className="w-3 h-3" />Briefing</TabsTrigger>
            <TabsTrigger value="graph" className="text-xs font-sans gap-1"><Target className="w-3 h-3" />Graph</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs font-sans gap-1"><MessageSquare className="w-3 h-3" />Ask</TabsTrigger>
            <TabsTrigger value="audio" className="text-xs font-sans gap-1"><Volume2 className="w-3 h-3" />Audio</TabsTrigger>
            <TabsTrigger value="video" className="text-xs font-sans gap-1"><Video className="w-3 h-3" />Video</TabsTrigger>
          </TabsList>

          {/* BRIEFING TAB */}
          <TabsContent value="briefing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Key Facts */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Key Facts</h3>
                <ul className="space-y-2">
                  {briefing.keyFacts.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm font-sans"><span className="text-primary font-bold">•</span><span className="text-foreground/85">{f}</span></li>
                  ))}
                </ul>
              </div>

              {/* Key Entities */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-secondary" /> Key Entities</h3>
                <div className="space-y-2">
                  {briefing.keyEntities.map((e, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm font-sans">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-secondary/10 text-secondary whitespace-nowrap">{e.type}</span>
                      <div><span className="font-semibold">{e.name}</span> — <span className="text-muted-foreground">{e.role}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Timeline</h3>
                <div className="space-y-3">
                  {briefing.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3 text-sm font-sans">
                      <span className="text-primary font-mono text-xs whitespace-nowrap pt-0.5">{t.date}</span>
                      <span className="text-foreground/85">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact & Sentiment — role-aware */}
              <div className="space-y-4">
                <div className="glass rounded-xl p-5">
                  <h3 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Impact Analysis</h3>
                  <p className="text-sm font-sans text-foreground/85 leading-relaxed">{currentRoleFraming?.impact || briefing.impactAnalysis}</p>
                </div>
                <div className="glass rounded-xl p-5">
                  <h3 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Sentiment</h3>
                  <p className="text-sm font-sans text-foreground/85">{briefing.sentiment}</p>
                </div>
              </div>

              {/* Contrarian View */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-primary" /> Contrarian View</h3>
                <p className="text-sm font-sans text-foreground/85 leading-relaxed">{briefing.contrarianView}</p>
              </div>

              {/* Future Outlook */}
              <div className="glass rounded-xl p-5">
                <h3 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2"><Eye className="w-4 h-4 text-secondary" /> Future Outlook</h3>
                <p className="text-sm font-sans text-foreground/85 leading-relaxed">{briefing.futureOutlook}</p>
              </div>

              {/* Watch Next */}
              <div className="glass rounded-xl p-5 col-span-full">
                <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> What to Watch Next</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {briefing.watchNext.map((w, i) => (
                    <li key={i} className="flex gap-2 text-sm font-sans"><span className="text-secondary">→</span><span className="text-foreground/85">{w}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* GRAPH TAB */}
          <TabsContent value="graph">
            <EntityGraph nodes={briefing.graphNodes} edges={briefing.graphEdges} />
          </TabsContent>

          {/* CHAT TAB */}
          <TabsContent value="chat">
            <div className="glass rounded-xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm font-sans mb-4">Ask anything about this story</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {currentQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(q)}
                          className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm font-sans ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    }`}>
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} className={j > 0 ? 'mt-1' : ''}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={k} className="font-semibold">{part.slice(2, -2)}</strong>
                              : part
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 rounded-xl px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggested questions after conversation */}
              {chatMessages.length > 0 && (
                <div className="border-t border-border/30 px-3 py-2 flex gap-1.5 overflow-x-auto">
                  {currentQuestions.slice(0, 4).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="px-2 py-1 rounded bg-muted/30 border border-border/30 text-[10px] font-sans text-muted-foreground hover:text-foreground whitespace-nowrap transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-border/50 p-3 flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Ask about this story..."
                  className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button onClick={handleChat} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Related Stories */}
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Related Stories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedStories.map(rs => (
                  <Link
                    key={rs.id}
                    to={`/story/${rs.id}`}
                    className="glass rounded-xl p-4 hover:border-primary/30 border border-transparent transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-sans font-semibold uppercase bg-primary/10 text-primary">{rs.category}</span>
                      <span className="text-muted-foreground text-[10px] font-sans">{rs.timestamp}</span>
                    </div>
                    <p className="text-sm font-serif font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{rs.headline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AUDIO TAB */}
          <TabsContent value="audio">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={toggleAudio}
                  className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors glow-gold"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold mb-1">Audio Briefing</h3>
                  <p className="text-muted-foreground text-sm font-sans">AI-narrated summary · ~1 min</p>
                </div>
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${audioProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              {/* Waveform decoration */}
              <div className="flex items-end gap-[2px] h-12 mt-6 justify-center">
                {Array.from({ length: 60 }).map((_, i) => {
                  const h = isPlaying
                    ? 8 + Math.sin(Date.now() / 200 + i * 0.5) * 20 + Math.random() * 10
                    : 4 + Math.sin(i * 0.3) * 8;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${i / 60 * 100 < audioProgress ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
              {/* Script preview */}
              <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-2">Transcript</p>
                <p className="text-sm font-sans text-foreground/70 leading-relaxed">{briefing.audioScript}</p>
              </div>
            </div>
          </TabsContent>

          {/* VIDEO TAB */}
          <TabsContent value="video">
            <VideoPlayer briefing={briefing} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StoryPage;
