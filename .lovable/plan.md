

# Fix 4 Dynamic Issues in ET Story OS

## Problem Summary
1. Role switching doesn't change briefing content — only a static paragraph changes
2. All headlines open the same Iran-Israel briefing data
3. Video tab is just text slides with no visuals
4. Chat/Ask tab gives generic responses, suggested questions only fill input, no story recommendations

## Solution

### 1. Dynamic Briefing Data for All Stories
**File: `src/data/stories.ts`**
- Add a `BriefingData` object for each of the 8 remaining stories (NVIDIA, RBI, OpenAI, Tata, Saudi IPO, EU AI Act, Zeptomail, China Trade)
- Export a `storyBriefings: Record<string, BriefingData>` map keyed by story ID
- Each briefing includes unique keyFacts, entities, timeline, graph nodes/edges, audioScript, etc.

### 2. Role-Based Dynamic Reframing
**File: `src/data/stories.ts`**
- Add a `roleFramings: Record<string, Record<string, string>>` map — per story ID, per role
- Each story gets 6 unique role perspectives (general, investor, founder, student, journalist, analyst)
- The role framing text adapts to the specific story content

**File: `src/pages/StoryPage.tsx`**
- Replace `demoBriefing` with `storyBriefings[id]` lookup
- Replace `roleFraming[role]` with `roleFramings[id][role]` lookup
- When role changes, also update: summary framing, impact analysis emphasis, suggested questions
- Audio script and graph remain story-specific (already driven by briefing object)

### 3. Video Tab with Background Images
**File: `src/components/story/VideoPlayer.tsx`**
- Add relevant Unsplash background images per slide (mapped from story imageUrl + category-specific images)
- Each slide gets a fullscreen background image with dark overlay + text on top
- Add a cinematic Ken Burns (slow zoom/pan) effect on the background image using Framer Motion
- Add a progress bar at bottom showing elapsed time
- Add story-specific image passed as prop from StoryPage

### 4. Interactive Chat/Ask System
**File: `src/pages/StoryPage.tsx`**
- Fix suggested questions: clicking them should auto-send (not just fill input)
- Build a smarter response generator that uses the actual briefing data + role context to craft answers
- Different questions get different structured answers pulling from keyFacts, timeline, entities, contrarianView, etc.
- Add "Related Stories" recommendation section below the chat showing 3 other story cards from `demoStories` (excluding current), clickable to navigate to those stories
- Recommendations filtered by related category/section

## Technical Approach
- All data is client-side in `stories.ts` — no edge functions needed for this change
- StoryPage reads `storyBriefings[id]` and `roleFramings[id][role]` instead of hardcoded constants
- VideoPlayer receives `imageUrl` prop for background imagery
- Chat uses pattern matching on user questions against briefing fields to generate contextual responses

## Files Changed
1. `src/data/stories.ts` — add 8 briefings + role framings map
2. `src/pages/StoryPage.tsx` — dynamic briefing lookup, role framings, smart chat, related stories
3. `src/components/story/VideoPlayer.tsx` — background images with Ken Burns animation

