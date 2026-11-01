# INFO-DETECTIVE: Google AI Studio Build Prompt

Paste everything below the line into Google AI Studio (Build mode). If the first generation is cut off, send the follow-up prompts listed at the very end, one at a time.

---

You are a senior full-stack engineer and cartoon-style UI designer. Build a complete, polished, responsive, working web application called **INFO-DETECTIVE** with the tagline **"Every Answer Has a Missing Piece."**

Build the WORKING PRODUCT, not just the design. Do not stop after the landing page. Every visible button must do something meaningful.

## 1. What the product is

INFO-DETECTIVE is an AI-assisted information gap detection platform (problem statement: "Digital Dark Spot"). Search engines find information and summarizers condense it. INFO-DETECTIVE investigates: it checks what the user collected against what they NEEDED to know, and reports what is missing, conflicting, outdated, or unverified, then tells them what to verify next.

The cartoon detective theme must never interfere with the analysis functionality. It should feel like a cartoon detective game while behaving like a serious research tool.

## 2. Tech stack

- React + TypeScript (or JavaScript), Vite, Tailwind CSS or custom CSS, Framer Motion (`motion`) for animation.
- LocalStorage for saved investigations, progress, checklist state, and custom question sets.
- Structured JSON files for question templates and demo data (see section 6).
- Gemini API for AI features, called through the key AI Studio provides via environment variable. NEVER hardcode or expose an API key in frontend code. If no key is available, the app must fall back to transparent rule-based analysis and clearly label it "Rule-based demonstration analysis, not live AI research".
- Keep dependencies minimal and the file structure clean (`/src/components`, `/src/pages`, `/src/data`, `/src/lib`, `/src/assets`).

## 3. Visual identity

Cute Japanese-cartoon aesthetic inspired by the world of Shinchan. Colourful, playful, soft, welcoming. Rounded cards and buttons, hand-drawn decorative elements, speech bubbles, magnifying glasses, notebooks, stars, footprints, detective boards, clue pins. Smooth, subtle animations only. No excessive gradients, no dark or corporate-dashboard look, no clutter.

Palette: warm yellow #FFD84D, cream #FFF8E9, sky blue #8DD9F5, coral pink #FF9DAB, peach #FFC49D, lavender #C8B6F0, navy #26334A, white #FFFFFF. Status colours: red/orange = conflict, neutral grey/lavender = unresolved, green = ONLY for findings backed by supporting evidence.
Fonts: Fredoka, Baloo 2, or Nunito (Google Fonts).

**Characters (Shinchan universe only, no Doraemon or other cartoons):** Shinchan, Kazama, Nene, Masao, Bo-chan, Himawari, Misae, Hiroshi, plus family/supporting characters where relevant.
- Do NOT fabricate official artwork or claim generated art is authentic Shinchan artwork. Create an `assets/characters/` slot system: if the project owner supplies licensed artwork, it loads from there; otherwise render ORIGINAL cartoon detective characters (simple SVG, distinct designs, labelled with each character's name and role). Make swapping in licensed images a one-line config change.
- Roles: **Shinchan** = Chief Detective (welcome, guidance, completion reactions). **Kazama** = Logic Investigator (Truth Clash). **Nene** = Mystery Investigator (Invisible Questions). **Masao** = Time Investigator (Time Traveller). **Bo-chan** = Evidence Investigator (Evidence References). **Himawari** = Clue Finder (small discovery and achievement moments). **Misae** and **Hiroshi** can appear in tips, empty states, and the report footer.
- Characters must be meaningfully integrated into interactions (speech bubbles that react to real results, e.g. "Nene found 3 invisible questions!"). Animations: gentle idle bob, blinking, small bounces, speech bubbles, smooth enter/exit, reaction on investigation completion. Nothing aggressive, nothing that hurts readability, and respect `prefers-reduced-motion`.

## 4. Pages and flow

Animated progress tracker across the app: **CASE FILE → EVIDENCE COLLECTION → ANALYSIS → GAP DETECTION → VERIFICATION → FINAL REPORT.**

1. **Landing page.** Full-screen cartoon scene. Heading "INFO-DETECTIVE", tagline "Every Answer Has a Missing Piece.", description "Explore information. Discover hidden gaps. Investigate what the internet forgot to tell you." Large detective illustration, floating stars and magnifying glasses, animated intro, CTAs **START INVESTIGATION** and **HOW IT WORKS** (smooth scroll to a short how-it-works section), small feature highlights.
2. **Investigation Dashboard** (cartoon HQ). Welcome from Shinchan, New Investigation button, recent investigations, completed count, pending verification tasks, research progress, and six feature cards with unique illustrations, descriptions and action buttons: Truth Clash, Invisible Questions, Time Traveller, Evidence Collection, Confidence Compass, Final Investigation Report.
3. **New Investigation: Category and Question Selection** (NEW core feature, section 5). This comes BEFORE the free-text case file.
4. **Case File (research input).** Looks like a detective's notebook. Fields: topic, main question, research objective, optional context. Pre-filled from the chosen category where sensible. Example prompts. Option to add sources now or go to source collection.
5. **Evidence Collection.** Two methods: (A) add website URL, (B) paste source text. Each source becomes an evidence card: title, domain, URL, publication date (if available; user can enter it, never invented), retrieved/provided date, source type (official / news / third-party / user note), content preview, remove button, expandable details. Do NOT pretend browser JS can fetch any URL. If a URL cannot be retrieved (CORS etc.), show a clear message asking the user to paste the content, or use the optional serverless retrieval function if configured. Analysis uses only actual extracted/pasted text. Never invent content, dates, or citations. Support at least 3 sources. **ANALYSE EVIDENCE** button.
6. **Truth Clash (Kazama).** Side-by-side claim comparison with source references, dates, why they may conflict, what to verify. Do not auto-declare the newer source correct. Link to the supporting source.
7. **Invisible Questions (Nene).** Signature feature. For each unanswered question show: the question, why it matters, related topic, whether the info is **absent** or merely **unclear**, suggested source to verify, priority. Clearly separate: *Confirmed missing from reviewed sources*, *Not found in reviewed sources*, *May exist, needs further investigation*. Questions must derive from the user's actual objective and the supplied sources, not generic filler.
8. **Time Traveller (Masao).** Visual timeline of sources by date. Show publication date, which cycle/year each refers to, freshness warnings, recommendation to check the current official announcement. NEVER assume an undated source is outdated: label it "Undated, needs verification".
9. **Evidence References (Bo-chan).** Every finding traceable: supporting source, title, URL or supplied-source ID, exact excerpt (highlighted in the source text), source date if known, finding type. Clickable links. Never fabricate quotes, URLs or citations. Quotes must be substrings of the actual source text.
10. **Confidence Compass.** Colourful completeness dashboard with separate indicators: information coverage, important unanswered questions, potential conflicts, potentially outdated info, official sources reviewed, evidence traceability, uncertainty needing verification. Any score must be calculated from visible, explained rules (show the formula) and labelled "Estimate of research coverage, not a guarantee of truth." Do NOT show a random AI percentage as accuracy. Legend distinguishing: **Sourced facts**, **Automated comparisons**, **AI-generated suggestions**, **Unresolved uncertainties**.
11. **Final Investigation Report.** Sections: topic and objective; sources reviewed; key information found; potential gaps; possible conflicts; outdated/undated info; evidence references; completeness indicators; prioritised verification checklist (tick-able, persisted). Buttons: Download PDF (print-optimised CSS or a client-side PDF lib), Copy report, Save investigation, Return to dashboard. Plain language for normal users.

Also: smooth page transitions, hover animations on cards, animated (but not fake-delayed) loading states tied to real work, achievement notifications, friendly empty states, clear error messages, responsive nav.

## 5. NEW CORE FEATURE: Predefined Research Question Engine

The app must NOT start with only an empty input box. When the user clicks New Investigation, first show a grid of colourful category cards:

1. Education
2. Career and Employment
3. Scholarships
4. Study Abroad
5. Government Schemes
6. Shopping and Products
7. Travel
8. General Research

Selecting a category auto-loads its structured library of research questions. Example, **Scholarships**: Eligibility criteria; Application deadlines; Required documents; Financial benefits; Income restrictions; Renewal conditions; Other scholarship restrictions; Selection procedure; Application tracking; Rejection and appeal procedures.

Provide complete, sensible question libraries (8 to 12 each) for all 8 categories.

The question manager must let the user: select/deselect questions; add custom questions; remove irrelevant questions; edit question text inline; set priority (High / Medium / Low) per question. Show a count of selected questions and a "Continue to Case File" button. Custom edits persist in the investigation.

**General Research / unmatched topics:** if the topic fits no category, use General Research and offer an "Suggest follow-up questions" button that generates questions from the user's topic and objective using Gemini (or a transparent rule-based fallback). Every generated question is shown with a "💡 AI-generated suggestion" badge until the user accepts it. Never present suggestions as verified facts.

**Analysis against every selected question.** After sources are submitted, evaluate the evidence against EACH selected question and assign exactly one status:

1. ✅ **Answered with supporting evidence**
2. 🟡 **Partially answered**
3. ⚪ **Not found in reviewed sources**
4. 🔴 **Conflicting information detected**
5. 🕰️ **Potentially outdated information**
6. 🔍 **Requires further verification**

Rules for assignment (document these in code and show them in a "How we decided" expandable on each card):
- Answered: at least one source contains a relevant excerpt; store the excerpt and source ID. No excerpt, no "answered" status.
- Partially answered: relevant excerpt exists but key parts of the question are not covered.
- Not found: no relevant text in any reviewed source (say "not found in the sources you gave us", never "does not exist").
- Conflicting: two or more sources give different values for the same attribute (dates, amounts, thresholds, counts). Show both.
- Potentially outdated: the only supporting source refers to an earlier cycle/year or is clearly older than another source. Undated is NOT outdated; use "Requires further verification" instead.
- Requires further verification: only unofficial/undated sources support it, or the evidence is ambiguous.
A question can carry a primary status plus secondary flags (e.g. Answered + Outdated flag). Never invent answers or call anything verified without supporting evidence.

Results appear as colourful investigation cards (status colour, status icon, question, priority chip, short evidence-based finding, evidence excerpt with source link, suggested next verification step). Add filter chips by status and priority, and a summary strip ("7 answered, 2 partial, 3 not found, 1 conflict, 1 outdated, 2 to verify").

**Integration (mandatory, a single shared data model drives everything):**
- **Invisible Questions** shows questions with statuses Not found / Partially answered / Requires verification.
- **Truth Clash** shows questions with Conflicting status and their competing claims.
- **Time Traveller** shows questions with Outdated status and the source timeline.
- **Evidence References** lists every excerpt linked to question IDs and findings.
- **Confidence Compass** computes coverage from question statuses weighted by priority (formula visible).
- **Final Report** includes a per-question results table plus the verification checklist, auto-generated from non-green questions and ordered by priority then status severity.

Goal: help users discover not only what they already know to ask, but what they may have forgotten to investigate.

## 6. Data model and JSON files

Store templates in `/src/data/questionTemplates.json` so new categories/questions can be added without touching code:

```json
{
  "version": 1,
  "categories": [
    {
      "id": "scholarships",
      "name": "Scholarships",
      "icon": "graduation-cap",
      "character": "nene",
      "description": "Check everything before you apply.",
      "keywords": ["scholarship", "fellowship", "stipend", "grant"],
      "questions": [
        {
          "id": "sch-eligibility",
          "text": "What are the eligibility criteria?",
          "defaultPriority": "high",
          "topic": "Eligibility",
          "whyItMatters": "Applying while ineligible wastes time and can disqualify you.",
          "keywords": ["eligible", "eligibility", "criteria", "qualify", "must be"],
          "suggestedSource": "Official scholarship website or notification"
        }
      ]
    }
  ]
}
```

Also create `/src/data/sampleInvestigation.json` and a TypeScript types file covering: Investigation, Source, Question (with status, priority, isCustom, isAiSuggested), Evidence (sourceId, excerpt, startIndex, endIndex), Finding, ChecklistItem.

Keyword matching must be done on real source text (case-insensitive, sentence-level), return the matching sentence as the excerpt, and extract attributes (dates, amounts, percentages) with regex for conflict detection. If a Gemini key is available, optionally use Gemini to judge relevance, but it must return the exact excerpt, and the app must verify that the excerpt is a substring of the source text before accepting it; otherwise discard the claim.

## 7. Sample investigation (fully working demo)

Pre-load one investigation: **Scholarship Application**, three sources, ALL labelled "DEMONSTRATION DATA, not genuine verified scholarship information":
- Source A (official-style notice, 2025 cycle): eligibility, application procedure, required documents, deadline 15 December.
- Source B (third-party blog, 2026 cycle): deadline 20 December, income limit, document list.
- Source C (undated forum/user note): partial renewal hint, no appeal info.

The demo must produce at least: one conflicting claim (15 vs 20 December); two or more information gaps (e.g. renewal conditions, combining scholarships, late-document policy, income certificate validity, appeal process); one potentially outdated source (2025 vs 2026); multiple evidence references; and a prioritised verification checklist. Include a visible banner "Demo mode: sample data" and a button to start a fresh real investigation.

## 8. Responsiveness, performance, quality

Works on desktop, laptop, tablet, mobile. No horizontal scroll, overflow, overlapping characters, or unreadable text. Cartoon quality maintained at every size. Optimise assets (inline SVG preferred), no background video, no heavy 3D, no fake processing delays. Accessible: contrast, focus states, aria labels, keyboard navigation, reduced-motion support.

## 9. Do NOT build

A generic chatbot, a basic search engine, a plain summariser, a quiz site, a generic business dashboard, or a static cartoon landing page. The core must remain information gap detection.

## 10. Honesty rules (apply everywhere in UI and code)

- Never invent source content, dates, URLs, quotes or citations.
- Never declare a source correct only because it is newer.
- Never say information is verified without evidence.
- Clearly label rule-based vs AI-generated output, and demonstration data vs real data.
- Scores are coverage estimates, with the method shown.

## 11. Future scope (keep architecture extensible, do NOT build now)

Source DNA, What-If Simulator, advanced source discovery, deeper AI research, multi-language support.

## 12. Build order

1. Project scaffold, theme, fonts, routing, shared state store and types.
2. Landing page and dashboard with working navigation.
3. Question template JSON, category picker, question manager (select/edit/add/remove/priority).
4. Case file and evidence collection (add/remove sources, paste text, URL fallback).
5. Analysis engine mapping every selected question to a status with excerpts.
6. Truth Clash, Invisible Questions, Time Traveller, Evidence References views.
7. Confidence Compass with visible scoring formula.
8. Final report, checklist, PDF/copy/save, LocalStorage restore after refresh.
9. Characters, animations, achievements, empty states, polish, responsive QA.

Start now. Deliver the complete application, then list in 5 bullets how to run it, where to add new question categories, and where to plug in licensed character artwork.

---

## Follow-up prompts (use if generation is incomplete)

1. "Continue: finish the Predefined Research Question Engine (category picker, editable question manager, and per-question statuses) and wire it into Truth Clash, Invisible Questions, Time Traveller, Evidence References, Confidence Compass and the Final Report."
2. "Fix and verify: every button works, LocalStorage restores saved investigations after refresh, and the sample Scholarship investigation shows 1 conflict, 2+ gaps, 1 outdated source, and a prioritised checklist."
3. "Polish: responsive layout on mobile and tablet, character speech bubbles reacting to real results, reduced-motion support, and clear demo-data labels."
