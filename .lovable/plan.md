

# ET Story OS — AI-Native Business News Intelligence Platform

## Overview
A premium, futuristic business news intelligence platform with two main pages: a cinematic intro landing page and an AI-powered news homepage. Users browse hot stories, select one, and enter an immersive AI briefing experience with role-based insights, interactive graphs, audio narration, video generation, and live Q&A.

## Page 1: Introductory Landing Page
- Dark, editorial hero section with large serif typography and subtle grain/gradient textures
- Animated headline: "The Future of Business Intelligence"
- Brand statement and 3 feature highlights with icons
- Featured headline ticker strip
- "Enter Story OS" CTA button with glow animation
- Smooth scroll-based fade-in animations throughout
- Premium feel inspired by ET Prime / Bloomberg / The Information

## Page 2: Homepage — Hot News Feed
- Top search bar with glass-morphism styling (search by company, sector, keyword, topic)
- Grid of hot news story cards, each with:
  - Bold headline, 1-2 line summary, category tag, timestamp
  - Right-aligned thumbnail image
  - Hover lift/glow animation
- Featured large card for the Iran-Israel-USA geopolitical demo story
- Section headers: "Breaking Now", "Trending", "Markets"
- 8-10 demo stories across geopolitics, tech, markets, startups

## Page 3: Story Intelligence Mode (activated on card click)
Full-screen AI briefing environment with tabbed/sectioned layout:

### AI Story Briefing Panel
- Structured output: Summary, Key Facts, Key Entities, Impact Analysis, Timeline, Contrarian View, Future Outlook, What to Watch Next
- Visually rich cards/sections with icons and color coding
- Uses Lovable AI (Gemini) via edge function to generate structured briefings

### Role-Based Intelligence
- Role selector bar: Investor, Founder, Student, Journalist, Analyst, General Reader
- Selecting a role re-prompts the AI to reframe the briefing for that persona
- Visual indicator of active role with smooth transition

### Interactive Entity Graph
- Built with a force-directed graph library (e.g., react-force-graph or custom SVG)
- Nodes: companies, people, countries, sectors
- Edges: affects, responds to, influences, competes with
- Click a node to see details in a side panel
- Animated entrance with spring physics

### Ask the Story (Q&A Chat)
- Contextual chat panel anchored to the current story + role
- Suggested quick questions as chips
- Streaming AI responses via Lovable AI edge function
- Markdown-rendered answers

### Audio Briefing
- Edge function generates an audio script, then uses ElevenLabs TTS to produce narration
- Play/pause controls, progress bar, waveform visualization
- Professional voice (e.g., Brian or Daniel from ElevenLabs)

### Video Summary
- Simulated "generating video" workflow with cinematic progress animation
- Displays a styled text-overlay video-like presentation (animated slides showing key facts, timeline, entities)
- Built with Framer Motion animated sequence to simulate a 30-second news reel within the browser

### Simulate New Update
- Button that triggers AI to generate a new development
- Appends to timeline, updates sentiment, refreshes graph and briefing
- Toast notification: "Breaking: Story has evolved"

## Tech Stack
- React + TypeScript + Tailwind CSS + shadcn/ui
- Framer Motion for all animations
- Recharts or react-force-graph for the entity graph
- Lovable Cloud + Supabase edge functions for AI (Lovable AI Gateway)
- ElevenLabs TTS via edge function for audio narration
- React Router for page navigation
- react-markdown for AI response rendering

## Design System
- Dark theme with deep navy/charcoal background (#0a0e1a)
- Accent: warm gold (#d4a853) for premium feel
- Secondary accent: electric blue (#3b82f6) for interactive elements
- Typography: Inter for body, Playfair Display for editorial headlines
- Glass-morphism cards with subtle borders
- Smooth micro-animations on every interaction

## AI Architecture
- Edge function receives story topic + role, calls Lovable AI with structured tool-calling to return JSON briefing
- Separate edge function for Q&A streaming
- Separate edge function for ElevenLabs TTS
- All prompts shaped server-side; client sends only topic + role + question

## User Flow
1. Land on intro page → click "Enter Story OS"
2. Browse hot news cards on homepage → search or click a story
3. Enter story intelligence mode → see AI briefing, switch roles, explore graph
4. Ask follow-up questions in chat → hear audio → watch video summary
5. Click "Simulate Update" → story evolves live

