export interface Story {
  id: string;
  headline: string;
  summary: string;
  category: string;
  timestamp: string;
  imageUrl: string;
  featured?: boolean;
  section: 'breaking' | 'trending' | 'markets';
}

export const demoStories: Story[] = [
  {
    id: 'iran-israel-usa',
    headline: 'US Mediates Tense Standoff as Iran-Israel Tensions Escalate Over Nuclear Program',
    summary: 'Washington deploys diplomatic envoys as Tehran accelerates uranium enrichment beyond agreed thresholds, raising fears of a regional conflict that could reshape global energy markets.',
    category: 'Geopolitics',
    timestamp: '12 min ago',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop',
    featured: true,
    section: 'breaking',
  },
  {
    id: 'nvidia-earnings',
    headline: 'NVIDIA Surpasses $4 Trillion Market Cap After Record AI Chip Demand',
    summary: 'Data center revenue surges 240% as hyperscalers race to build next-gen AI infrastructure.',
    category: 'Markets',
    timestamp: '28 min ago',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop',
    section: 'breaking',
  },
  {
    id: 'rbi-rate',
    headline: 'RBI Holds Rates Steady Amid Global Uncertainty, Signals Cautious Easing Ahead',
    summary: 'Governor Das cites geopolitical risks and food inflation as key factors behind the pause.',
    category: 'Economy',
    timestamp: '45 min ago',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop',
    section: 'markets',
  },
  {
    id: 'openai-gpt5',
    headline: 'OpenAI Launches GPT-5 with Autonomous Agent Capabilities',
    summary: 'New model can execute multi-step tasks, browse the web, and write production code autonomously.',
    category: 'Tech',
    timestamp: '1 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    section: 'trending',
  },
  {
    id: 'tata-semiconductor',
    headline: 'Tata Group Breaks Ground on $11B Semiconductor Fab in Gujarat',
    summary: 'India\'s largest chipmaking facility targets 28nm production by 2027 with TSMC technology license.',
    category: 'Industry',
    timestamp: '2 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
    section: 'trending',
  },
  {
    id: 'saudi-ipo',
    headline: 'Saudi Aramco Subsidiary Plans $30B Renewable Energy IPO',
    summary: 'Kingdom accelerates diversification play with the largest clean energy listing in Middle East history.',
    category: 'Energy',
    timestamp: '3 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
    section: 'markets',
  },
  {
    id: 'ai-regulation-eu',
    headline: 'EU Enforces AI Act Phase 2: Strict Rules for Foundation Models Take Effect',
    summary: 'Big Tech faces mandatory transparency requirements and bias audits for large language models.',
    category: 'Regulation',
    timestamp: '4 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    section: 'trending',
  },
  {
    id: 'startup-unicorn',
    headline: 'Indian SaaS Startup Zeptomail Hits $5B Valuation in Series E',
    summary: 'Enterprise email infrastructure company grows 3x YoY as businesses move away from legacy platforms.',
    category: 'Startups',
    timestamp: '5 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    section: 'trending',
  },
  {
    id: 'china-trade',
    headline: 'China Retaliates with 45% Tariffs on US Agricultural Exports',
    summary: 'Trade war escalation hits American farmers hardest as soybean and corn futures plunge.',
    category: 'Trade',
    timestamp: '6 hr ago',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
    section: 'markets',
  },
];

export interface BriefingData {
  title: string;
  summary: string;
  keyFacts: string[];
  keyEntities: { name: string; type: string; role: string }[];
  timeline: { date: string; event: string }[];
  sentiment: string;
  impactAnalysis: string;
  contrarianView: string;
  futureOutlook: string;
  watchNext: string[];
  suggestedQuestions: string[];
  graphNodes: { id: string; label: string; type: string }[];
  graphEdges: { source: string; target: string; label: string }[];
  audioScript: string;
}

export const demoBriefing: BriefingData = {
  title: 'US Mediates Tense Standoff as Iran-Israel Tensions Escalate Over Nuclear Program',
  summary: 'The United States is intensifying diplomatic efforts as Iran accelerates uranium enrichment beyond JCPOA thresholds. Israel has signaled readiness for preemptive action, while Washington seeks a negotiated resolution to prevent regional destabilization and protect global energy supply chains.',
  keyFacts: [
    'Iran has enriched uranium to 84% purity — close to weapons-grade 90%',
    'US has deployed additional carrier strike group to the Persian Gulf',
    'Israel conducted joint military exercises with Saudi Arabia for the first time',
    'Oil prices surged 8% in the past week on escalation fears',
    'IAEA inspectors report denied access to key facilities',
    'China and Russia have blocked UN Security Council resolutions',
  ],
  keyEntities: [
    { name: 'Iran', type: 'Country', role: 'Accelerating nuclear enrichment program' },
    { name: 'Israel', type: 'Country', role: 'Threatening preemptive military action' },
    { name: 'United States', type: 'Country', role: 'Mediating diplomatic resolution' },
    { name: 'IAEA', type: 'Organization', role: 'Nuclear watchdog with limited access' },
    { name: 'Saudi Arabia', type: 'Country', role: 'Regional ally in joint exercises' },
    { name: 'Brent Crude', type: 'Commodity', role: 'Spiking on conflict fears' },
  ],
  timeline: [
    { date: 'Mar 15', event: 'IAEA reports Iran enrichment at 84% purity' },
    { date: 'Mar 18', event: 'US deploys USS Gerald Ford carrier group to Gulf' },
    { date: 'Mar 21', event: 'Israel-Saudi joint air defense exercise revealed' },
    { date: 'Mar 24', event: 'Iran denies IAEA access to Fordow facility' },
    { date: 'Mar 27', event: 'US Secretary of State begins shuttle diplomacy' },
    { date: 'Mar 29', event: 'Brent crude hits $98/barrel on escalation' },
  ],
  sentiment: 'Bearish for global markets. High geopolitical risk premium. Energy sector volatile.',
  impactAnalysis: 'A military escalation could disrupt 20% of global oil supply transiting the Strait of Hormuz, triggering a potential recession in import-dependent economies. Defense stocks rally while consumer discretionary and airlines face headwinds.',
  contrarianView: 'Despite the hawkish rhetoric, backchannels remain active. Iran\'s enrichment may be a negotiating tactic to secure sanctions relief ahead of domestic elections. The probability of actual military conflict remains below 15% according to intelligence estimates.',
  futureOutlook: 'The next 72 hours are critical. If diplomatic efforts fail, expect emergency OPEC meeting and potential coordinated SPR releases. A deal, however unlikely, would cause oil prices to drop 15-20% rapidly.',
  watchNext: [
    'IAEA emergency board meeting scheduled for April 2',
    'US Congressional vote on new Iran sanctions package',
    'Israel cabinet security briefing outcomes',
    'China\'s stance at upcoming UN Security Council session',
    'Oil futures and defense sector ETF movements',
  ],
  suggestedQuestions: [
    'What happens if diplomacy fails?',
    'How does this affect Indian energy imports?',
    'Which defense stocks benefit most?',
    'What is the historical precedent?',
    'Should I hedge my portfolio?',
    'What is the hidden angle here?',
  ],
  graphNodes: [
    { id: 'iran', label: 'Iran', type: 'country' },
    { id: 'israel', label: 'Israel', type: 'country' },
    { id: 'usa', label: 'United States', type: 'country' },
    { id: 'saudi', label: 'Saudi Arabia', type: 'country' },
    { id: 'china', label: 'China', type: 'country' },
    { id: 'russia', label: 'Russia', type: 'country' },
    { id: 'iaea', label: 'IAEA', type: 'org' },
    { id: 'opec', label: 'OPEC', type: 'org' },
    { id: 'oil', label: 'Brent Crude', type: 'commodity' },
    { id: 'defense', label: 'Defense Sector', type: 'sector' },
  ],
  graphEdges: [
    { source: 'iran', target: 'israel', label: 'threatens' },
    { source: 'usa', target: 'iran', label: 'sanctions' },
    { source: 'usa', target: 'israel', label: 'allies' },
    { source: 'saudi', target: 'israel', label: 'cooperates' },
    { source: 'china', target: 'iran', label: 'supports' },
    { source: 'russia', target: 'iran', label: 'supports' },
    { source: 'iaea', target: 'iran', label: 'monitors' },
    { source: 'iran', target: 'oil', label: 'disrupts' },
    { source: 'oil', target: 'opec', label: 'influences' },
    { source: 'iran', target: 'defense', label: 'boosts' },
  ],
  audioScript: 'Tensions in the Middle East are reaching a critical inflection point. Iran has accelerated its uranium enrichment to 84 percent purity — dangerously close to weapons-grade levels. The United States has responded by deploying an additional carrier strike group to the Persian Gulf, while Israel has signaled its readiness for preemptive military action. In a historic first, Israel and Saudi Arabia conducted joint air defense exercises, signaling a new axis of cooperation in the region. Oil prices have surged 8 percent over the past week, with Brent crude touching 98 dollars per barrel. The next 72 hours are critical as US diplomatic envoys shuttle between Tehran, Jerusalem, and Riyadh. Markets remain on edge.',
};
