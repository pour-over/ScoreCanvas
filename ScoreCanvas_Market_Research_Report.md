# SCORE CANVAS — INVESTOR-GRADE MARKET RESEARCH REPORT

**"The Figma for Game Audio Adaptive Music Design"**

Prepared for: Partner-level review, Pre-Seed / Series A Investment Committee
Vertical: Creative Tools + Developer Tooling
Date: March 2026
Classification: Confidential — Draft for Internal Distribution

---

## TABLE OF CONTENTS

1. [Executive Summary](#section-1-executive-summary)
2. [Industry Structure — Game Audio Production](#section-2-industry-structure--game-audio-production)
3. [Market Sizing](#section-3-market-sizing)
4. [Competitive Landscape](#section-4-competitive-landscape)
5. [Comparable Companies and Exit Analysis](#section-5-comparable-companies-and-exit-analysis)
6. [Customer Segments and Buyer Personas](#section-6-customer-segments-and-buyer-personas)
7. [The AI Layer — Market Timing and Technology Risk](#section-7-the-ai-layer--market-timing-and-technology-risk)
8. [Business Model Analysis](#section-8-business-model-analysis)
9. [Go-to-Market Strategy](#section-9-go-to-market-strategy)
10. [Risk Register](#section-10-risk-register)
11. [Investment Thesis and Recommendation](#section-11-investment-thesis-and-recommendation)
12. [Appendix](#section-12-appendix)

---

# SECTION 1: EXECUTIVE SUMMARY

## The Investor Thesis

Every major game released in the last decade — from *The Last of Us Part II* to *Elden Ring* to *Baldur's Gate 3* — ships with an adaptive music system: music that dynamically responds to player actions, emotional arcs, and game state in real time. These systems are technically complex, involving hundreds of music segments, branching transition matrices, parameter-driven mixing, and state-machine logic. They are also, without exception, designed on whiteboards, in PowerPoint, and over email chains.

There is no formal design tool for this phase of game audio production. Score Canvas proposes to fill that gap: a collaborative, node-based visual workspace — structurally comparable to Figma or Miro — purpose-built for designing adaptive music systems *before* they are implemented in audio middleware (Wwise, FMOD). It is not a DAW. It is not a middleware replacement. It is the missing design layer between the composer who creates music stems and the audio programmer who wires logic in Wwise.

**Why now?** Three converging conditions create a 2025–2026 entry window. First, the global games market reached $197 billion in 2025 (Newzoo), with audio complexity scaling faster than audio team sizes — creating acute workflow pressure. Second, AI-native creative tools have attracted unprecedented capital: Suno ($2.45B valuation, $300M ARR), ElevenLabs ($11B valuation), Cursor ($29.3B valuation reaching $2B ARR in 24 months) — proving that vertical AI-augmented design tools can reach venture scale rapidly. Third, Anthropic's Model Context Protocol (MCP) — now an industry standard with 97M+ monthly SDK downloads — creates a new infrastructure layer for connecting AI assistants to professional tools; the founder has already built a proof-of-concept MCP server for Wwise WAAPI automation, establishing first-mover positioning in this exact integration channel.

**Most compelling reason to fund:** The founder is a 17-year veteran Lead Music Designer at PlayStation Studios with shipped credits on four of the most celebrated adaptive music systems in gaming history (*Journey*, *The Last of Us Part II*, *Ghost of Tsushima*, *Marvel's Spider-Man 2*). This is not a technical founder building for an imagined user. This is the user building the tool he has needed for two decades, with direct relationship access to every major audio director in the industry.

**Single biggest risk:** Market size. The addressable buyer population for a tool exclusively targeting adaptive music system *design* is narrow — measured in thousands of seats, not millions. The venture-scale return depends on either (a) expanding the use case beyond music into broader game audio system design, or (b) the AI/API layer generating platform-level economics that transcend seat-count math. If neither expands the TAM, this is a strong lifestyle business ($3–8M ARR) but not a venture-returnable outcome at scale.

---

# SECTION 2: INDUSTRY STRUCTURE — GAME AUDIO PRODUCTION

## The Full Game Audio Production Pipeline

To understand where Score Canvas fits, an investor must understand the end-to-end workflow for getting adaptive music from a creative brief into a shipped game. The pipeline has five distinct phases, each with different personnel, tools, and failure modes.

### Phase 1: Creative Phase — Music Composition and Direction

**Who does the work:** Composers (often external/freelance), Music Directors, Music Supervisors, Audio Directors. At AAA studios, a dedicated Music Director or Audio Director oversees the musical vision. Many studios outsource composition to freelance composers or boutique audio houses (Hexany Audio, Penka Kouneva, etc.).

**Tools used today:** Digital Audio Workstations (DAWs) — Logic Pro, Pro Tools, Cubase, Nuendo, Ableton Live, Reaper. Standard notation software (Dorico, Sibelius) for orchestral scoring. Reference libraries (Spitfire Audio, Native Instruments) for mockups.

**Output:** Finished music stems — stereo or multi-channel audio files organized by instrument group, intensity layer, or narrative beat. Typically delivered as WAV files with naming conventions and a music brief document.

**Handoff failure:** The composer delivers stems optimized for *linear* listening, not interactive behavior. Stems may not be cut at musically sensible transition points. Loop points may not align with middleware requirements. The composer's *intent* for how music should adapt is communicated verbally, in a text document, or not at all. **This is where the workflow breaks.**

### Phase 2: Technical Design Phase — Adaptive Music System Architecture (THE GAP)

**Who does the work:** Music Designers, Technical Music Designers, Audio Directors, Senior Sound Designers with music implementation expertise. In AAA, this is typically 1–3 senior people. In AA and indie, it is often nobody — the sound designer or programmer makes ad hoc decisions.

**Tools used today:** This is the core problem Score Canvas addresses. The current toolkit for this phase is:

- **Whiteboard sketches** — drawn in meeting rooms, photographed on phones, lost within days
- **PowerPoint / Keynote decks** — static slides showing state diagrams, circulated via email, version-controlled by filename ("MusicSystem_v3_FINAL_realfinal.pptx")
- **Google Docs / Confluence pages** — text-based descriptions of branching logic, transition rules, and music segment assignments. These documents cannot represent the non-linear, graph-based nature of adaptive music systems.
- **Lucidchart / Mermaid / draw.io** — occasionally used for flowcharts, but these are generic diagramming tools with no understanding of music segments, transitions, states, or middleware constraints.
- **Verbal handoffs** — in many studios, the design phase is literally a conversation between the Music Director and the audio programmer, with no persistent artifact.
- **Wwise/FMOD itself** — some teams skip the design phase entirely and prototype directly in middleware. This is the equivalent of writing production code without a spec or a wireframe. It works for simple systems; it creates severe technical debt for complex ones.

**Output (ideal):** A complete specification for the adaptive music system: what music plays in each game state, how transitions occur between states, what parameters drive dynamic mixing, what the fallback behaviors are, and how the system handles edge cases (e.g., the player pauses during a transition, or two game events trigger simultaneously).

**Output (actual):** A partial, informal, inconsistently documented set of intentions that the audio programmer must interpret, fill gaps in, and frequently renegotiate during implementation.

**Why this phase is informal:** There has never been a tool designed for it. DAWs are for composing. Middleware is for implementing. The design conversation happens in the gap between these tools, and because there is no formalized environment for that conversation, it remains ad hoc at every studio regardless of budget or sophistication.

**Consequence of informality:**

- **Revision cost escalation:** When the design is in someone's head rather than in a shared visual artifact, misalignment between the composer's intent and the programmer's implementation is discovered late — often during audio QA or playtesting. At this point, changes require re-cutting stems, re-programming Wwise events, and re-testing integration. Industry practitioners estimate (no published data; based on practitioner interviews at GDC Audio Summit) that 20–40% of audio implementation time on AAA titles is spent on revisions that trace back to design-phase ambiguity.
- **Post-ship technical debt:** Adaptive music systems that were "good enough to ship" but never properly designed accumulate technical debt that affects DLC, sequels, and live-service updates. The music system for a game-as-a-service title may need to support new content for 3–5 years; without a design document, each update is an archaeology project.
- **Knowledge concentration risk:** The adaptive music system design lives in one or two people's heads. When those people leave the studio (common in an industry with high turnover), the institutional knowledge goes with them.
- **Cross-team friction:** Composers, music designers, audio programmers, and game designers all need to understand and contribute to the adaptive music system. Without a shared visual workspace, each stakeholder sees only their portion of the system. The composer doesn't know what the programmer needs; the programmer doesn't know what the designer intended; the game designer doesn't know what's musically possible.

### Phase 3: Implementation Phase — Middleware Programming

**Who does the work:** Audio Programmers, Technical Sound Designers, Audio Implementers. In AAA: 3–10 dedicated staff. In AA: 1–3, often wearing multiple hats. In indie: the one audio person, or a gameplay programmer learning Wwise.

**Tools used today:**
- **Audiokinetic Wwise** — the dominant middleware. Visual authoring environment with Event-based architecture, States, Switches, RTPCs (Real-Time Parameter Controls), Music Segments, Music Playlists, and Transition Rules. Wwise's Schematic View (introduced ~2020) provides a node-based view of audio signal flow, but it is an *implementation* view, not a *design* view. It shows what *is*, not what *should be*.
- **Firelight Technologies FMOD Studio** — the primary alternative. Graph-based timeline authoring. Strong for linear and semi-adaptive implementations. Less granular than Wwise for deeply branching music systems.
- **Custom/proprietary middleware** — some AAA studios (notably EA with its internal tools, and some Japanese studios) maintain in-house audio engines. These are declining as Wwise/FMOD capability increases.
- **Game engine audio systems** — Unity and Unreal Engine have built-in audio systems, but these are insufficient for complex adaptive music. Most professional projects integrate Wwise or FMOD via plugins.

**Handoff failure:** The implementer translates the (informal) design into middleware configuration. Every ambiguity in the design becomes a decision the implementer makes unilaterally, a question they escalate (adding latency), or a bug discovered in QA.

### Phase 4: QA and Integration

**Who does the work:** Audio QA testers, Integration Engineers, Build Engineers. Audio QA is chronically understaffed relative to visual QA — music bugs are harder to detect via automated testing and require human ears.

**Tools used today:** Custom test harnesses, Wwise Profiler, FMOD debug tools, game engine audio debuggers. No standardized audio QA framework exists across the industry.

**Key failure:** Bugs that trace back to Phase 2 design ambiguity surface here — but by this point, fixing them is 5–10x more expensive than it would have been if caught in a design review.

### Phase 5: Delivery — Mastering and Format Compliance

**Who does the work:** Audio Engineers, Mastering Engineers, Platform Compliance teams.

**Tools used today:** Pro Tools, Nuendo, middleware export tools, platform-specific validators (PlayStation TRC, Xbox XR, Nintendo Lotcheck).

**Relatively well-tooled.** This phase has mature professional workflows inherited from film and broadcast. It is not the problem Score Canvas solves.

---

## The Wwise and FMOD Middleware Duopoly

### Market Share

Audiokinetic's Wwise and Firelight Technologies' FMOD collectively dominate game audio middleware. Precise market share data is not publicly disclosed by either company, but industry estimates based on GDC surveys, job posting analysis, and shipped title credits suggest:

- **Wwise: ~65–75% of professional game audio projects** (estimate). Wwise is the de facto standard for AAA and AA production. It is required knowledge for audio job postings at Sony, Ubisoft, EA, Microsoft Studios, and most major publishers.
- **FMOD: ~20–25%** (estimate). FMOD has a strong position in the indie and mid-tier market, with meaningful AAA presence (used on titles in the *Forza*, *Tomb Raider*, and *Just Cause* franchises). Its simpler pricing model and approachable UX make it popular with smaller teams.
- **Other (custom, proprietary, Unity/Unreal native): ~5–10%** (estimate).

### Revenue Models

**Wwise:**
- Free for projects with budgets under $250K (full feature access, unlimited sounds)
- Tiered commercial licensing: Pro (budgets up to $2M), Premium, Platinum (budgets >$2M)
- Post-launch royalty option: 1% of gross sales (alternative to up-front license fee)
- Games-as-a-Service model: monthly fee based on total revenue post-launch
- Per-platform licensing required

**FMOD:**
- Free for indie developers with <$200K yearly revenue
- Per-title licensing: Basic ($6,000/title, budgets $600K–$1.8M), Premium ($18,000/title, budgets >$1.8M)
- Simpler pricing structure than Wwise, no royalty option

### Current Tooling Investment and Why It Doesn't Solve the Design Problem

**Wwise Schematic View:** Introduced as a visual node graph for audio signal flow. It is powerful for understanding and debugging *implemented* audio systems. It shows how audio objects are routed, processed, and mixed. But it is an implementation tool, not a design tool. It cannot be used before audio assets exist. It requires Wwise technical knowledge to read. It is not collaborative (no multiplayer). It does not export to documentation. It is bound to the Wwise session file.

**FMOD Studio Graph View:** Similar to Wwise Schematic View — a visual representation of the audio graph within FMOD's authoring environment. Useful for implementation, not for pre-implementation design.

**Key distinction:** These tools answer "What is the current state of our audio system?" Score Canvas answers "What *should* our adaptive music system be, and do all stakeholders agree?" This is the wireframe-to-production gap, and it is identical to the gap Figma filled for UI design (before Figma, designers handed off static mockups or jumped straight into HTML/CSS).

### Audiokinetic's AI Moves and Platform Direction Signals

Audiokinetic (now a Sony Group Company since the January 2019 acquisition) has made notable AI investments:

- **Similar Sound Search (Wwise 2025.1):** A collaboration between Sony AI and Audiokinetic. AI-powered audio-to-audio and text-to-audio search within Wwise, trained on professionally licensed sound libraries (Pro Sound Effects, BOOM Library, Strata). This is a *discovery* tool for sound effects — it helps sound designers find the right sounds faster. It does not address music design, system architecture, or collaborative workflow.
- **Strata partnership:** Strata provided training data for the Similar Sound Search model. This signals Audiokinetic's willingness to integrate AI for workflow efficiency, but their investment is clearly in the *implementation and asset management* layer, not the *design* layer.

**What this signals:** Audiokinetic is investing in AI to make Wwise stickier — improving the day-to-day experience of using Wwise, not addressing upstream workflow gaps. Their incentive structure favors deepening Wwise engagement, not building pre-Wwise design tools that could theoretically be middleware-agnostic.

### Vertical Integration Risk: Could Audiokinetic Build This?

**Could they?** Yes, technically. Audiokinetic has the engineering talent and domain knowledge.

**Would they?** This is the critical question. Three factors argue against it:

1. **Incentive misalignment:** Audiokinetic's business model is built on Wwise adoption and usage. A pre-implementation design tool that is middleware-agnostic (i.e., could export to FMOD or custom engines) doesn't serve Audiokinetic's lock-in strategy. If they built it, it would be Wwise-only, which limits its market and its value proposition.

2. **Sony ownership constraints:** Since Sony's 2019 acquisition, Audiokinetic operates as a Sony Group Company. Any product direction requires alignment with Sony's strategic priorities. Building a cross-platform design tool used by Xbox-exclusive studios is a harder internal sell at a Sony subsidiary.

3. **Focus and execution:** Audiokinetic's roadmap is focused on spatial audio, AI-assisted asset discovery, and platform support. Building a collaborative design workspace is a different product category (collaboration SaaS, not middleware), requiring different engineering skills (real-time sync, web application architecture, UX design).

**Most likely scenario:** If Score Canvas gains traction, Audiokinetic's most rational response is partnership (integration, reseller agreement, or co-marketing) rather than competing build. If Score Canvas fails to gain traction, Audiokinetic has no reason to build it. The vertical integration risk is **Medium** — real but not the most probable outcome.

---

# SECTION 3: MARKET SIZING

## Top-Down Context

### Global Games Market
- **$197 billion** global games revenue in 2025 (Newzoo), up 7.5% YoY
- Console: $45.9B | PC: $43B | Mobile: $108B
- Audio spending as a percentage of total game development budget: **3–7%** (industry rule of thumb; no published source — derived from GDC Audio Summit presentations and studio budget structures shared informally at GANG events)

### Game Development Software Tools Market
- **$498M** in 2025, projected to reach **$556M** in 2026, growing at **11.6% CAGR** through 2035
- Cloud-based and collaborative development platforms integrated in 35% of new game projects

### Game Audio Market (Middleware + Services + Tools)
- The audio engine software market, with the game audio middleware segment as the largest component, exceeded **$600M** in 2024 (Data Insights Market)
- Wwise and FMOD represent the dominant middleware revenue; services (outsourced audio studios) and tools (DAWs, plugins) constitute the remainder

### AI Audio Tools Investor Appetite (Signal, Not Direct TAM)
| Company | Latest Valuation | Latest Round | ARR/Revenue | Signal |
|---------|-----------------|--------------|-------------|--------|
| Suno | $2.45B | $250M Series C (Nov 2025) | $300M ARR (Feb 2026) | AI music generation at venture scale |
| ElevenLabs | $11B | $500M (Sept 2025) | Not disclosed | Voice + music AI, massive multiple |
| Runway ML | ~$5B | $500M Series D (Aug 2025) | $122M (2024) | AI creative tools crossing into production |
| Cursor | $29.3B ($50B target) | $2.3B (Nov 2025) | $2B ARR (Feb 2026) | AI-augmented vertical dev tools at historic multiples |
| Replit | $9B | $400M (2026) | $240M (2025) | AI coding platforms |

**What Figma's $20B acquisition attempt tells us:** In September 2022, Adobe offered ~50x revenue for Figma (~$400M ARR). The multiple was driven by Figma's network effects (collaborative multiplayer), its position as the system of record for design decisions, and its expansion potential into adjacent workflows. Score Canvas aspires to an identical structural position in game audio — the system of record for adaptive music design decisions. If it achieves even a fraction of Figma's category dominance in a much smaller addressable market, the multiple on exit would be driven by strategic value to acquirers (Audiokinetic/Sony, Epic, Unity, EA) rather than pure revenue math.

---

## Bottom-Up TAM/SAM/SOM Analysis

### Input Assumptions

**Number of game titles in active production globally per year:**

| Tier | Estimated Titles in Active Production | Basis |
|------|--------------------------------------|-------|
| AAA (budget >$50M) | 150–250 | Major publisher project counts; 15–20 major publishers × 10–15 titles each |
| AA (budget $5M–$50M) | 800–1,500 | Mid-tier studios and publisher second-tier labels |
| Indie (budget <$5M) | 15,000–20,000 | ~20,000 titles released on Steam in 2025 alone; many more in development |
| **Total** | **~16,000–22,000** | |

**Average audio staff per studio tier:**

| Tier | Audio Staff Range | Staff Using Adaptive Music Design | Notes |
|------|------------------|-----------------------------------|-------|
| AAA | 15–40 | 5–15 (music designers, audio directors, composers, audio programmers) | Large teams with dedicated music implementation |
| AA | 3–10 | 2–5 | Leaner teams; more generalists |
| Indie | 1–3 | 1–2 | Often one person wearing all audio hats |

**Percentage of titles using adaptive music systems:**

| Tier | % Using Adaptive Music | Reasoning |
|------|----------------------|-----------|
| AAA | 85–95% | Virtually all AAA console/PC titles ship with some form of adaptive music. It is an expected production value. |
| AA | 50–70% | Many AA titles invest in adaptive music; some ship with linear-only scores due to budget constraints |
| Indie | 10–25% | Most indie titles use linear music. A growing minority implement adaptive systems via Wwise/FMOD free tiers. |

**Willingness to pay — benchmark analysis:**

| Tool | Pricing | Category | Relevance |
|------|---------|----------|-----------|
| Figma | $12–75/seat/month | UI design collaboration | Direct structural analog |
| Miro | $8–16/seat/month | Visual collaboration | Comparable canvas tool |
| Notion | $8–16/seat/month | Knowledge work | PLG motion comparable |
| Wwise | Free–$18K+/title + royalties | Audio middleware | Existing spend in audio pipeline |
| FMOD | Free–$18K/title | Audio middleware | Existing spend in audio pipeline |
| Reaper | $60 perpetual | DAW | Price anchor for audio professionals |

Score Canvas pricing must be lower than middleware (it's earlier in the pipeline, lower perceived value-add until proven) but higher than generic collaboration tools (it's specialist software). **Estimated willingness to pay: $20–60/seat/month for studios, $10–20/month for individuals.**

### Segment-by-Segment Revenue Modeling

#### (a) Direct Studio Seats

| Tier | Titles × % Adaptive | Seats/Title | Total Seats | Price/Seat/Month | Annual Revenue |
|------|---------------------|-------------|-------------|------------------|----------------|
| AAA | 200 × 90% = 180 | 10 | 1,800 | $55 | $1,188,000 |
| AA | 1,000 × 60% = 600 | 3 | 1,800 | $40 | $864,000 |
| Indie | 17,000 × 15% = 2,550 | 1.5 | 3,825 | $15 | $688,500 |
| **Subtotal** | | | **7,425** | | **$2,740,500** |

#### (b) Composer / Freelancer Seats

Estimated 5,000–8,000 active game audio freelancers globally (GameSoundCon 2023 survey indicates ~7,500 professionals self-identify as full-time game audio). Of these, ~30–40% work on projects involving adaptive music.

- Addressable freelancers: ~2,500
- Conversion rate (freemium to paid): 15–25%
- Paying freelancer seats: 375–625
- Price: $15/month
- **Annual revenue: $67,500–$112,500**

#### (c) Educational Institution Licenses

Game audio programs at universities worldwide:
- **Tier 1 programs (dedicated game audio degrees):** Berklee College of Music, DigiPen Institute of Technology, NYU Steinhardt (NYU Game Center), SAE Institute (global network, ~50+ campuses), Full Sail University, Drexel University (Westphal College), IPR (Minneapolis), Expression College
- **Tier 2 programs (game audio courses within broader music/media programs):** Northwestern Michigan College, Southern Utah University, University of Michigan, USC Thornton, Columbia College Chicago, Vancouver Film School, Staffordshire University (UK), dBs Music (UK)
- **Estimated total addressable institutions:** 100–200 globally with formal game audio curriculum

| Segment | Institutions | License/Year | Annual Revenue |
|---------|-------------|--------------|----------------|
| Tier 1 | 30–50 | $1,500 | $45,000–$75,000 |
| Tier 2 | 70–150 | $800 | $56,000–$120,000 |
| **Subtotal** | **100–200** | | **$101,000–$195,000** |

#### (d) API / Integration Revenue

This is the high-variance, high-upside segment. If Score Canvas's AI design assistant and middleware export APIs generate per-call or per-export revenue:
- Estimated usage per project: 200–500 AI-assisted design queries, 50–100 middleware export operations
- Price per AI query: $0.02–$0.10 (based on Claude API costs + margin)
- Price per middleware export: $5–$25 (value-based: replacing hours of manual documentation)
- **At scale (1,000 projects/year): $200,000–$1,500,000**

This segment is speculative and dependent on the AI layer maturity. Excluded from conservative scenario.

---

### Three-Scenario Model: 5-Year ARR Potential

#### Assumptions by Scenario

| Variable | Conservative | Base | Optimistic |
|----------|-------------|------|------------|
| Market penetration by Year 5 | 5% of addressable seats | 15% of addressable seats | 30% of addressable seats |
| Average blended seat price | $25/month | $35/month | $45/month |
| Freelancer adoption | 200 paid seats | 500 paid seats | 1,200 paid seats |
| Educational institutions | 40 | 100 | 180 |
| API/Integration revenue | $0 | $300K/year | $1.5M/year |
| Expansion beyond game music | None | Early pilots in film/TV interactive | Active second vertical |

#### Year 5 ARR Projections

| Scenario | Studio Seats | Freelancer | Education | API/Integration | **Total ARR** |
|----------|-------------|------------|-----------|-----------------|---------------|
| **Conservative** | 371 seats × $25 × 12 = $111,300 | 200 × $15 × 12 = $36,000 | 40 × $1,000 = $40,000 | $0 | **~$187,000** |
| **Base** | 1,114 seats × $35 × 12 = $467,880 | 500 × $15 × 12 = $90,000 | 100 × $1,200 = $120,000 | $300,000 | **~$978,000** |
| **Optimistic** | 2,228 seats × $45 × 12 = $1,203,120 | 1,200 × $20 × 12 = $288,000 | 180 × $1,500 = $270,000 | $1,500,000 | **~$3,261,000** |

**Extrapolated with expansion into adjacent verticals (film/TV interactive scoring, themed entertainment, XR experiences):**

| Scenario | Year 5 ARR (expanded) |
|----------|----------------------|
| Conservative | $500K–$1M |
| Base | $2M–$5M |
| Optimistic | $8M–$15M |

### Honest Assessment

**The pure game audio adaptive music design TAM, on a seat-based model, is small.** At ~7,400 total addressable seats globally, with realistic penetration curves, the standalone market supports $1–3M ARR at maturity — a strong niche business, but below the $10M+ ARR threshold that venture investors typically target for Series A.

**The venture-scale thesis depends on three expansion vectors:**
1. **The AI/API layer generating platform economics** (per-query revenue, data flywheel, middleware integration fees)
2. **Expansion to adjacent use cases** (film/TV interactive scoring, themed entertainment audio design, XR spatial audio design, podcast/interactive media)
3. **Score Canvas becoming the collaboration layer for ALL game audio system design** (not just music — sound effects state machines, voice dialogue systems, ambient audio design), expanding the seat count 3–5x

If any two of these three vectors materialize, the TAM expands to $20–50M, which supports a venture-scale outcome. If none expand, this is a profitable niche tool — valuable, but not a $100M+ exit.

---

# SECTION 4: COMPETITIVE LANDSCAPE

## Quadrant Analysis

### (a) Direct Competitors — Tools That Attempt to Solve Adaptive Music Design

**The market is genuinely greenfield.**

After extensive research, no commercial software product currently exists whose primary purpose is the visual design of adaptive music systems prior to middleware implementation. This is a remarkable finding given the maturity of the game audio industry.

The closest approximation: some audio middleware consultancies (e.g., A Shell in the Pit, Power Up Audio) have developed internal Miro/Notion templates for adaptive music documentation. These are bespoke, non-productized, and not commercially available. They confirm the problem exists and that practitioners improvise solutions — but no one has built the tool.

**Assessment:** True greenfield. This is both an opportunity (no direct competition, first-mover advantage) and a risk signal (is the market too small for anyone to have bothered?).

### (b) Partial Competitors — Adjacent Tools That Could Expand

| Tool | What It Does Today | Gap vs. Score Canvas | Expansion Likelihood |
|------|-------------------|---------------------|---------------------|
| **Wwise Schematic View** | Visual node graph of implemented audio signal flow in Wwise | Implementation-only; not collaborative; requires Wwise project; no design-phase use | Low — Audiokinetic's incentive is to deepen Wwise, not pre-Wwise workflow |
| **FMOD Studio** | Timeline and graph-based audio authoring | Implementation tool; no pre-implementation design mode; no multiplayer | Low — same incentive structure as Wwise |
| **Nuendo (Steinberg)** | DAW with game audio integration features | A DAW, not a design tool; linear editing paradigm; no collaborative canvas | Very Low — DAWs are structurally wrong for this problem |
| **Miro** | General visual collaboration whiteboard | No audio-domain vocabulary; no middleware export; no music-specific node types; could theoretically add templates | Low-Medium — Miro adds industry templates but has never gone deep on a single vertical |
| **Notion** | Knowledge management / documents | Text-based; no visual graph editing; used informally for audio docs | Very Low — wrong product category |
| **Lucidchart / draw.io** | General-purpose diagramming | Generic shapes; no audio semantics; no collaboration beyond basic sharing | Low — no incentive to verticalize into game audio |
| **Mermaid** | Markdown-based diagramming | Text-to-diagram; popular with technical teams; no audio vocabulary | Very Low |

### (c) Platform Risks

| Platform | Could They Build This? | Incentive | Capability | Risk Level |
|----------|----------------------|-----------|------------|------------|
| **Audiokinetic (Wwise/Sony)** | Yes | Medium — could deepen Wwise engagement, but middleware-agnostic design tool doesn't serve lock-in | High — deep audio domain knowledge, engineering resources | **Medium** |
| **Firelight (FMOD)** | Yes | Medium — same dynamic as Audiokinetic | Medium — smaller team (~15-25 employees), AU-based | **Low-Medium** |
| **Unity** | Theoretically | Low — Unity's audio investment has been minimal since acquiring Fabric/Tazman-Audio (which has gone largely dormant) | Low — audio is not a priority; Unity is focused on rendering, monetization, AI | **Low** |
| **Epic (Unreal)** | Theoretically | Low — MetaSounds is Epic's audio priority, focused on procedural SFX, not music design | Medium — large engineering team, but no music design domain expertise | **Low** |
| **Figma** | Theoretically | Very Low — audio is not an addressable market for Figma's platform | High — Figma has the collaborative canvas technology | **Very Low** |

### (d) Substitutes — What Studios Actually Do Instead

1. **Nothing / verbal handoffs** (~40% of projects, estimate). The adaptive music system is designed in conversation, never documented, and implemented by "feel." This is the most common substitute, especially at AA and indie tier.

2. **PowerPoint / Keynote + email** (~25%). Static slide decks with state diagrams drawn in shapes. Version control is manual. No interactivity. No middleware connection.

3. **Miro / whiteboard photos** (~15%). Better than slides for visual thinking, but no audio-specific vocabulary and no persistence beyond the project.

4. **Custom internal tools** (~10%, AAA only). A handful of the largest studios (Sony Interactive, Ubisoft Montreal, EA DICE) have built internal tools for audio system documentation. These are proprietary, unmaintained, and represent exactly the internal build-vs-buy decision Score Canvas needs to win.

5. **Direct-to-middleware prototyping** (~10%). Skip design entirely, build in Wwise/FMOD, iterate through implementation. Fast for simple systems; catastrophically expensive for complex ones.

---

### Competitive Positioning Map (2x2)

```
                    HIGH Collaborative / Multiplayer Capability
                    |
                    |  Figma/Miro (generic)          ★ SCORE CANVAS (target position)
                    |
                    |
                    |
                    |
                    |  Notion/Docs (generic)          Wwise Schematic / FMOD Studio
                    |                                 (implementation tools, single-user)
                    |
                    LOW ─────────────────────────────────────────────────── HIGH
                         Specificity to Adaptive Audio Workflow
```

Score Canvas occupies the upper-right quadrant: high specificity to the adaptive audio workflow AND high collaborative capability. No existing tool occupies this space. The nearest competitors are in the lower-right (Wwise/FMOD: high specificity but no collaboration) or upper-left (Miro/Figma: high collaboration but no audio specificity).

---

# SECTION 5: COMPARABLE COMPANIES AND EXIT ANALYSIS

## Core Comparables — Design and Collaboration Tools

### Figma
- **Category:** Collaborative UI design platform
- **Founded:** 2012 | **Funding:** ~$333M total
- **Key milestone:** Adobe acquisition attempt at **$20B** (Sept 2022), ~50x ARR on ~$400M ARR. Deal terminated Dec 2023 due to EU/UK regulatory concerns.
- **Post-deal valuation:** Estimated $8.3–9B as of 2024 secondary market transactions; IPO preparation reported in 2025.
- **What drove the $20B valuation:** Network effects (multiplayer collaboration), system-of-record status in design workflows, PLG distribution (individual designers bring Figma into organizations), expansion into dev handoff (Figma Dev Mode) and whiteboarding (FigJam).
- **Lesson for Score Canvas:** A vertical design tool with strong collaboration and network effects can command extraordinary multiples. The "system of record" position is the value driver. If Score Canvas becomes where adaptive music design decisions are made and documented, it inherits this dynamic — in a much smaller market.

### Miro
- **Category:** Visual collaboration / online whiteboard
- **Founded:** 2011 | **Funding:** $476M total
- **Valuation:** **$17.5B** (Series C, Jan 2022, led by ICONIQ Capital)
- **Metrics at time of raise:** 30M users, ~100% of Fortune 100 as clients
- **Growth story:** Horizontal collaboration tool riding remote work tailwind. Expanded from design teams to product, engineering, and business strategy.
- **Lesson for Score Canvas:** Miro proves that visual collaboration tools can reach massive scale, but Miro did so by being horizontal. Score Canvas is vertical — it must either own its niche completely or find adjacencies to expand.

### Whimsical
- **Category:** Structured visual collaboration (docs, wireframes, flowcharts)
- **Founded:** 2017 | **Funding:** $30M (Series A, Nov 2021)
- **Valuation:** Not disclosed, estimated $150–250M
- **Lesson for Score Canvas:** Whimsical shows that a smaller, more focused collaboration tool can sustain a venture-backed business at a lower valuation tier. Score Canvas's likely trajectory is more Whimsical than Miro.

### Mural
- **Category:** Visual collaboration for enterprise
- **Founded:** 2011 | **Funding:** $192M total
- **Lesson for Score Canvas:** Mural's enterprise focus and ~$200M funding show the capital requirements for scaling visual collaboration into Fortune 500 accounts. Score Canvas's enterprise buyer (AAA studios) is a much smaller cohort.

### Notion
- **Category:** Connected workspace / knowledge management
- **Founded:** 2013 | **Funding:** $343M | **Valuation:** $10B (2021)
- **PLG motion:** Notion's freemium individual tier drives organizational adoption. Users bring Notion into workplaces.
- **Lesson for Score Canvas:** The freelancer-as-distribution-channel strategy directly parallels Notion's PLG motion. A freelancer who uses Score Canvas on three different studio projects introduces it to three potential enterprise accounts.

## Developer Tooling Comparables

### GitHub Copilot / Cursor / Replit
- **Cursor:** $29.3B valuation (Nov 2025), $2B ARR (Feb 2026), seeking $50B. Fastest B2B SaaS to $1B ARR in history (24 months).
- **Replit:** $9B valuation (2026), $240M revenue (2025), targeting $1B in 2026.
- **Lesson for Score Canvas:** AI-augmented vertical developer tools are commanding historically unprecedented multiples. Cursor proves that if you put AI into a professional's daily workflow tool, adoption and willingness to pay scale dramatically. Score Canvas's AI design assistant layer is the exact same thesis applied to audio production.

### Runway ML
- **Category:** AI creative tools (video generation, editing)
- **Founded:** 2018 | **Funding:** $545M+ | **Valuation:** ~$5B (Aug 2025)
- **Revenue:** $122M (2024), $300M+ projected (2025)
- **Lesson for Score Canvas:** Runway demonstrates that AI-augmented creative tools can cross from niche professional use into broader adoption. The trajectory from $49M → $122M → $300M in three years shows the growth curve possible when AI becomes genuinely useful to creative professionals.

## Game / Audio Industry Comparables

### Audiokinetic (Wwise)
- **Acquired by Sony Interactive Entertainment:** January 2019, price **undisclosed**
- **Revenue model:** Tiered licensing + royalties (see Section 2)
- **Estimated revenue:** Not publicly disclosed. Based on installed base of ~10,000+ commercial Wwise projects shipped, with tiered pricing: estimated $30–80M annual revenue (industry estimate; no published figure).
- **Strategic value to Sony:** Cross-platform audio middleware ownership; data on every game using Wwise; talent and technology for PlayStation first-party audio.
- **Lesson for Score Canvas:** Sony paid an undisclosed premium for the dominant game audio middleware. Score Canvas's design layer sits directly upstream of Wwise. Sony/Audiokinetic is the most natural acquirer.

### Firelight Technologies (FMOD)
- **Structure:** Private, Australian-based
- **Revenue:** Not disclosed. Smaller than Audiokinetic; estimated $5–15M (estimate based on per-title pricing model and ~2,000+ shipped titles).
- **Lesson for Score Canvas:** FMOD demonstrates that a game audio infrastructure company can sustain profitably at modest scale. Also a potential acquirer or integration partner.

### Fabric (Tazman-Audio)
- **Category:** Audio component system for Unity
- **Outcome:** Fabric was a Unity audio plugin developed by Tazman-Audio. While the prompt references a 2019 Unity acquisition, research indicates Tazman-Audio continued operating independently and Fabric was open-sourced. Unity's audio investments (including internal audio team hires) signal the engine company's interest in audio tooling but not aggressive acquisition in the space.
- **Lesson for Score Canvas:** Unity's sporadic audio investments (and subsequent neglect) confirm that game engine companies view audio as a secondary priority. This reduces platform risk from Unity and Epic.

### Soundtrap (Spotify Acquisition, 2017)
- **Category:** Collaborative cloud DAW
- **Acquired by Spotify:** November 2017 for an estimated **~$30M** (Breakit report; undisclosed officially)
- **Strategic rationale:** Spotify wanted creator tools to complement its distribution platform — the "democratize the music ecosystem" thesis.
- **Outcome:** Spotify sold Soundtrap back to its founders in 2023 — the acquisition did not achieve strategic goals.
- **Lesson for Score Canvas:** The Soundtrap acquisition shows that streaming/distribution companies may acquire collaborative audio creation tools for strategic reasons. More importantly, its failure shows the risk of acquisition by a non-game-audio buyer who doesn't understand the workflow. Score Canvas's exit should target game audio infrastructure companies (Audiokinetic, Unity, Epic), not general audio platforms.

### GameSynth (Tsugi)
- **Category:** Procedural audio design tool
- **Structure:** Private, Japan-based
- **Lesson for Score Canvas:** GameSynth proves that niche game audio design tools can sustain as profitable businesses. Tsugi has operated for years serving a specific segment (procedural SFX). This is a lifestyle business comparable; it does not signal venture-scale exit.

---

### Exit Path Summary

| Acquirer Profile | Strategic Rationale | Estimated Acquisition Range | Probability |
|-----------------|--------------------|-----------------------------|-------------|
| **Audiokinetic / Sony** | Upstream integration with Wwise; data on music design patterns; competitive moat | $15–80M | **High** |
| **Unity Technologies** | Audio workflow play; Unity developer ecosystem value | $10–40M | Medium |
| **Epic Games** | Unreal ecosystem; MetaSounds extension | $10–40M | Medium |
| **Adobe** | Creative tools portfolio; post-Figma strategy | $20–60M | Low-Medium |
| **Spotify / Apple Music** | Interactive music format play (long shot) | $15–50M | Low |
| **Private equity / strategic roll-up** | Game dev tools consolidation | $5–20M | Medium |

**IPO path:** Unlikely unless Score Canvas expands well beyond game audio into a broader interactive media design platform ($50M+ ARR).

---

# SECTION 6: CUSTOMER SEGMENTS AND BUYER PERSONAS

## (a) AAA Game Studios

**Profile:** Sony Interactive Entertainment, Microsoft Gaming, EA, Ubisoft, Take-Two Interactive, Activision Blizzard (Microsoft), Square Enix, Nintendo (limited external tool adoption), CD Projekt Red, Insomniac Games, Naughty Dog, Sucker Punch, Guerrilla Games.

**Who makes the buying decision:** Dual-approval structure. The **Audio Director** or **Head of Audio** champions the tool based on workflow value. **IT Procurement / Studio Technology** evaluates security, SSO, data residency, and compliance. Final approval often requires **Studio Head** or **VP of Development** sign-off for new vendor relationships, especially cloud-based SaaS.

**Procurement cycle:** 6–18 months from first demo to signed contract. Enterprise SSO (Okta, Azure AD), SOC 2 compliance, and data residency requirements are table stakes. Some studios (Sony, Microsoft) require on-premise deployment options or dedicated cloud tenancy.

**Annual software spend per audio department:** Estimated $50,000–$200,000/year including middleware licenses, DAW seats, plugin subscriptions, and specialized tools. Score Canvas at $55/seat/month × 10 seats = $6,600/year — a rounding error in this budget, but the procurement overhead may not scale with the dollar amount.

**Internal build vs. buy bias:** AAA studios have strong "build" instincts — many have internal tool teams. The bias breaks when: (a) the tool is outside the studio's core competency (audio design workflow ≠ game engine development), (b) the tool requires ongoing SaaS innovation the studio doesn't want to maintain, (c) a compelling external tool already has traction at peer studios (social proof is powerful in the insular AAA audio community).

**Key concerns:** Security, data residency (unreleased game audio is highly confidential), enterprise SSO, uptime SLAs, IP ownership guarantees (Score Canvas must not claim ownership of design data).

**Estimated segment size:** 50–80 AAA studios globally with audio departments large enough to benefit.

**CAC:** $5,000–$15,000 (founder-led sales, conference demos, referral from Audio Director network)
**LTV:** $50,000–$150,000 (multi-year contracts, expanding seat count)
**Time to revenue:** 12–24 months from first contact
**Primary distribution:** Founder network, GDC Audio Summit, Wwise User Conference

## (b) Mid-Tier / AA Studios

**Profile:** 30–200 person studios, often working with publishers (THQ Nordic, Focus Entertainment, Devolver Digital, Team17, Annapurna Interactive). Examples: Supergiant Games, Larian Studios (pre-BG3 scale), Moon Studios, Obsidian (pre-Microsoft), Double Fine.

**Who makes the buying decision:** Typically the **Audio Director** or **Lead Sound Designer** makes the call directly, with minimal procurement bureaucracy. Credit card purchase is common for tools under $500/month.

**Procurement cycle:** 1–3 months. Often a free trial → team discussion → purchase.

**Budget sensitivity:** Higher than AAA. Per-seat pricing above $50/month faces resistance. Per-team flat-rate pricing or project-based pricing may be more palatable.

**Adoption likelihood:** **High.** AA studios are the most likely early adopters:
- They feel the pain of scaling audio complexity (their games are ambitious) without AAA-scale teams
- They have enough process discipline to value a design tool
- They have low procurement friction
- Many are Wwise-first environments where Score Canvas → Wwise export has immediate value

**Estimated segment size:** 300–600 studios globally.

**CAC:** $1,000–$3,000 (content marketing, GDC presence, word of mouth in audio community)
**LTV:** $8,000–$30,000 (smaller teams, shorter contracts, but high retention if tool is essential)
**Time to revenue:** 3–6 months
**Primary distribution:** PLG (self-serve trial), Audio Implementers Discord/forums, GDC talks, Wwise community

## (c) Independent Composers and Audio Freelancers

**Profile:** Freelance composers, sound designers, and audio implementers who contract with multiple studios. The game audio freelance ecosystem is substantial — GameSoundCon's 2023 industry survey identified ~7,500 professionals in full-time game audio roles, with an estimated additional 3,000–5,000 part-time/freelance.

**Price sensitivity:** High. Individual freelancers benchmark against DAW plugin subscriptions ($10–30/month) and free tools. Score Canvas must have a **free tier** for individual use and a paid individual tier at $10–20/month.

**PLG entry point:** This is the critical growth channel. Freelancers are the entry wedge:

**KEY INSIGHT:** A freelance composer who uses Score Canvas to design an adaptive music system for Studio A, then uses it again for Studio B, then for Studio C, has just introduced Score Canvas into three studio workflows. If those studios see value, they purchase team licenses. The freelancer is both the user AND the distribution channel. This is identical to how Figma spread through design agencies and into enterprise — individual designers brought the tool in.

**Estimated segment size:** 2,000–4,000 freelancers working on adaptive music projects annually.

**CAC:** $5–$20 (content marketing, free tier, community presence)
**LTV:** $200–$600 (low per-user, but acquisition cost is near zero)
**Time to revenue:** 1–3 months (self-serve)
**Primary distribution:** Free tier, social media (game audio Twitter/X, Reddit r/GameAudio), GDC, portfolio showcase features

## (d) Educational Institutions

**Profile:** Universities and vocational programs with game audio curriculum.

**Addressable programs (partial list):**
- **Dedicated game audio degrees:** Berklee College of Music, DigiPen Institute of Technology, Full Sail University, SAE Institute (~50 global campuses), IPR (Minneapolis)
- **Game audio specializations:** NYU Steinhardt/Game Center, Drexel (Westphal College), Columbia College Chicago, USC Thornton, Vancouver Film School, Staffordshire University (UK), dBs Music (UK), University of Hertfordshire (UK), JMC Academy (Australia)
- **Music technology programs with game audio courses:** Northwestern Michigan College, Southern Utah University, University of Michigan, Berklee Online, RMIT (Australia), Aalto University (Finland)
- **Estimated total:** 100–200 institutions globally with formal game audio curriculum; ~50 with dedicated programs

**Licensing model:** Per-department or per-program, not per-seat. Academic pricing should be deeply discounted ($500–$2,000/institution/year) to maximize adoption. Students become lifelong users and future studio buyers.

**Sales cycle:** Long (6–12 months for academic procurement) but high strategic value. Academic adoption is a 5–10 year investment in market development.

**Founder advantage:** The founder has existing teaching relationships at Northwestern Michigan College and Southern Utah University. These are immediate beachhead deployments that can generate case studies and student testimonials.

**Estimated segment size:** 100–200 institutions; ~50 addressable in first 3 years.

**CAC:** $500–$2,000 (academic conference presence, direct outreach to program directors)
**LTV:** $5,000–$20,000 (multi-year institutional licenses, program lock-in)
**Time to revenue:** 6–18 months
**Primary distribution:** Academic conferences (AES, GANG Education Summit), direct founder relationships, Wwise/FMOD academic program partnerships

---

# SECTION 7: THE AI LAYER — MARKET TIMING AND TECHNOLOGY RISK

## Current State of AI in Game Audio (2025–2026)

### AI Audio Tools in Production Use at Game Studios

AI adoption in game audio is early but accelerating:

- **AI-assisted sound search:** Audiokinetic's Similar Sound Search (Wwise 2025.1), developed with Sony AI. Audio-to-audio and text-to-audio retrieval within Wwise. In production use at studios on the Wwise 2025.1 release.
- **AI-assisted sound design:** Tools like GameSynth (Tsugi) incorporate procedural generation with machine learning. Not mainstream but used by dedicated SFX teams.
- **AI voice synthesis:** ElevenLabs and Replica Studios are used for placeholder/prototype voice lines. Some indie studios ship with AI-generated minor NPC dialogue.
- **AI music generation:** Used almost exclusively for **prototyping and reference**, not for shipped game music. Legal, union, and quality concerns prevent AI-generated music from reaching final builds at any major studio.

### Industry Sentiment Toward AI-Generated Music

**GDC/BAFTA/AIAS sentiment (2025–2026):** Cautiously adversarial. The game audio community is protective of composer livelihoods. GDC Audio Summit panels on AI have been contentious. BAFTA and AIAS have not issued formal positions but their award categories implicitly value human-composed music.

**Key tension:** Game audio professionals are simultaneously excited about AI as a *workflow accelerator* (faster iteration, better tools) and hostile toward AI as a *replacement for human creativity*. This creates a very specific positioning requirement for Score Canvas:

**"Design assistance, not generation" is the safe positioning.**

Score Canvas should frame its AI layer as:
- Suggesting system architectures based on the game's genre and scope
- Analyzing existing designs for potential transition issues
- Auto-generating middleware export documentation
- Recommending design patterns from a library of proven adaptive music approaches
- **NOT generating music** (or, if integrated with Suno/Udio APIs, clearly marking this as "sketch/prototype only — not for shipped use")

### Union Pressures: SAG-AFTRA and AFM

**SAG-AFTRA Interactive Media Agreement (2025):** Ratified by 95% of members after an 11-month strike. Key AI provisions:
- Consent and disclosure requirements for AI digital replica use
- Performers can suspend consent for AI-generated material during strikes
- Usage reports required for digital replicas

**AFM (American Federation of Musicians):** The AFM has been slower to formalize AI positions for games (their primary focus is film/TV scoring). However, AFM contracts for live orchestral game scoring sessions increasingly include clauses restricting AI-generated replacement of scored material.

**Impact on Score Canvas:** Score Canvas's AI layer is **design assistance**, not **performance replacement**. It does not generate music that replaces composers; it helps designers architect systems for music that composers create. This positions it on the safe side of the union line. However, if Score Canvas integrates music generation APIs (Suno, Udio) for prototyping, even if clearly labeled as "prototype only," there is PR and community backlash risk. The recommended approach: **offer music generation API integration as an optional, enterprise-only feature, not as a default or marketed capability.**

## Music Generation API Landscape

| API | Capabilities (2026) | Commercial Game Use License | IP/Copyright Status |
|-----|---------------------|---------------------------|-------------------|
| **Suno** | Text-to-music, style transfer, 2M+ paid subscribers, $300M ARR | Licensing model under development; consumer tier allows commercial use with attribution | Actively litigated — UMG, Sony, Warner lawsuits pending |
| **Udio** | Text-to-music, remix capabilities | Settled with UMG; pivoting to fan-interactive model; Sony/Warner suits pending | Unsettled IP landscape |
| **ElevenLabs Music** | Text-to-music, launched 2025 | Enterprise API available | Trained on licensed data; lower legal risk but unproven |
| **Google MusicLM** | Research-stage, limited public access | No commercial API | Google-internal |
| **Meta AudioCraft** | Open-source music generation | Open-source license allows commercial use | Trained on licensed Meta music library; lower risk |

### IP/Copyright Risks

The fundamental legal question — **can AI-generated music be copyrighted?** — remains unresolved in the US. The Copyright Office has issued guidance that purely AI-generated content is not copyrightable, but human-directed AI assistance may qualify. For game studios, using AI-generated music in shipped titles creates:
1. Copyright ownership uncertainty (who owns the score?)
2. Litigation risk from training data rights holders
3. Union contract complications

### Safe Harbor Design for Score Canvas

Score Canvas can neutralize most copyright risk by implementing a **"sketch pad" architecture:**
- AI-generated music prototypes are watermarked and metadata-tagged as "prototype — not for distribution"
- Generated content cannot be exported to middleware; it exists only within Score Canvas for reference
- The design document exports, not the audio
- Clear UX separation between "design" (the product's core value) and "prototype audio" (an optional convenience feature)

This positions Score Canvas identically to how architects use rough sketches — the sketch informs the design, but the building is built from engineered plans, not from the sketch itself.

## MCP (Model Context Protocol) as Infrastructure

### Explaining MCP to an Investor

Model Context Protocol (MCP) is an open standard introduced by Anthropic in November 2024 that standardizes how AI applications (like Claude, ChatGPT, or custom AI agents) connect to external software tools and data sources. Think of it as **USB for AI** — before USB, every device needed a custom cable; before MCP, every AI-to-tool integration required custom code.

MCP adoption has been explosive:
- **97M+ monthly SDK downloads** (as of late 2025)
- Adopted by OpenAI, Google, Microsoft, and hundreds of developer tool companies
- Donated to the Linux Foundation's Agentic AI Foundation (Dec 2025), co-founded by Anthropic, Block, and OpenAI
- **5,800+ MCP servers** and **300+ MCP clients** available

MCP works through a client-server architecture: an MCP *server* exposes capabilities of a specific tool (e.g., Wwise), and an MCP *client* (e.g., Claude, or Score Canvas's AI assistant) consumes those capabilities through a standardized protocol. This means any AI model that speaks MCP can interact with any tool that has an MCP server — without custom integration for each pairing.

### Why MCP + WAAPI Creates a Technically Defensible Moat

**WAAPI (Wwise Authoring API)** is Audiokinetic's API for programmatic control of the Wwise authoring environment. It can create objects, set properties, configure music systems, and automate implementation tasks — but it requires detailed knowledge of Wwise's data model and is typically used only by audio programmers via scripting.

**The founder's Investigative Templater** is an MCP server that wraps WAAPI, making Wwise's full authoring API accessible to any MCP-compatible AI assistant (including Claude). This means:

1. **Score Canvas can "talk" to Wwise** through the MCP-WAAPI bridge. A design created in Score Canvas could theoretically generate Wwise session stubs automatically — translating visual design into middleware configuration.
2. **Natural language control of Wwise** becomes possible: an AI assistant connected to the MCP-WAAPI server can create Wwise objects, set up music hierarchies, and configure transitions from plain English instructions.
3. **The MCP server is open-source**, which serves multiple strategic purposes:
   - Establishes the founder as a credible voice in the Wwise automation community
   - Creates a developer community around the tool before Score Canvas launches
   - Generates usage data about how practitioners want to interact with Wwise programmatically
   - Makes it harder for competitors to claim the MCP-WAAPI integration space (first-mover in an open standard has lasting influence)

### First-Mover Advantage

As of March 2026, no other MCP server for Wwise WAAPI exists publicly. If the founder releases the Investigative Templater before competitors arrive, it becomes the reference implementation. Other tools that want to connect AI to Wwise will build on or alongside this server. Score Canvas then has a structural advantage: its AI assistant already speaks Wwise's language natively.

### Long-Term Data Flywheel

If Score Canvas captures a significant share of adaptive music design activity, the anonymous, aggregated data about how music systems are designed — what patterns are most common, what transitions are most effective, what architectures scale — becomes a unique training dataset for the AI assistant. This creates a flywheel:
1. More users → more design data → better AI suggestions
2. Better AI suggestions → more value → more users
3. Unique data asset → competitive moat → higher exit multiple

## Technology Risk Assessment

### Build Risk: Can the MVP Be Built?

**Minimum viable Score Canvas:**
- Visual node-based canvas (drag-and-drop music states, transitions, parameters)
- Real-time multiplayer collaboration (Yjs or Automerge CRDT library)
- Export to documentation (PDF, Markdown, or structured JSON)
- Basic Wwise/FMOD terminology and node types pre-built
- Web-based (browser-first, like Figma)

**Honest assessment:** This is achievable in **16–24 weeks with a 2-person team** (one full-stack engineer with canvas/collaboration experience, one designer/domain expert — the founder). The core technology stack exists: React + Canvas API (or a library like Reaflow/ReactFlow), Yjs for CRDT-based collaboration, standard web infrastructure. The founder's domain expertise de-risks the product design phase significantly — he knows exactly what the nodes, edges, and interactions should represent because he has needed this tool for 17 years.

**Risk:** The second engineer hire is critical. Finding someone with both real-time collaboration engineering experience AND willingness to work on a niche audio tool is non-trivial.

### Platform Risk: Could Figma or Miro Eat the Basic Use Case?

**Figma:** Could Figma create an "audio design" plugin or template set? Technically yes. Would they? Almost certainly not. Figma's addressable market is millions of UI/UX designers. Game audio designers number in the low thousands. The ROI doesn't justify the product investment. **Risk: Very Low.**

**Miro:** More plausible. Miro already has industry-specific templates. A "Game Audio System Design" template on Miro could capture 20–30% of the basic use case (visual diagramming of music states). However, it would lack: audio-specific node types, middleware export, AI-assisted design, integration with WAAPI/FMOD API. **Risk: Low-Medium.** Mitigation: Score Canvas must move fast past "just a canvas" into domain-specific features that a generic whiteboard cannot replicate.

### AI Displacement Risk: Could LLMs Make the Design Phase Unnecessary?

**The scenario:** An AI agent that can go from "I want epic combat music that gets more intense as the player takes damage, with a calm exploration theme that cross-fades when enemies are nearby" directly to a fully configured Wwise project — no human design phase needed.

**Assessment:** This is the most intellectually interesting risk, and the most overstated. Here's why:

1. **Adaptive music design is inherently collaborative and iterative.** It involves subjective creative judgments (what feels right?), negotiations between stakeholders (the music director wants X, the game designer needs Y), and context-specific decisions that require understanding the specific game. LLMs can assist this process; they cannot replace the human conversation.

2. **Implementation complexity is not the bottleneck.** The hard part of adaptive music design is not wiring Wwise nodes — it's deciding *what* the system should do. An LLM that auto-generates a Wwise project still needs someone to review, iterate, and approve the design. Score Canvas is where that review and iteration happen.

3. **Timeline:** Even if auto-generation becomes viable, the transition from "AI can generate a plausible Wwise project" to "AAA studios trust AI-generated music systems in shipped $200M titles" is 5–10 years. Score Canvas has a long runway.

**Risk: Medium over 5 years; Low over 2–3 years.** Mitigation: Score Canvas should *embrace* AI generation as a feature (generate a starting-point design from a prompt, then iterate collaboratively) rather than competing with it.

---

# SECTION 8: BUSINESS MODEL ANALYSIS

## Model A: SaaS Seat-Based (Figma Model)

### Revenue Mechanics
| Tier | Price | Target |
|------|-------|--------|
| Individual (Free) | $0 | Freelancers, students, evaluation |
| Individual (Pro) | $18/month | Freelancers on paid projects |
| Studio Team | $55/seat/month | AA and AAA studio teams (3–15 seats) |
| Enterprise | Custom ($70–100/seat/month) | AAA studios with SSO, data residency, SLA requirements |
| Education | $800–$1,500/institution/year | University programs |

### Margin Profile
- **Gross margin: 80–88%.** Primary COGS: cloud infrastructure (real-time collaboration sync, canvas rendering), AI API costs (Claude API for design assistant). No content delivery costs; no hardware.
- **Net margin at scale: 15–25%** after headcount, sales, marketing.

### Growth Ceiling
- Bounded by total addressable seats (~7,400 core; ~15,000 with adjacent use cases)
- At full penetration (unlikely): ~$5M–$10M ARR from seats alone
- Expansion revenue via AI API usage could push to $15M+

### Fit with Segments
- **Strong fit for AA studios and freelancers** (self-serve, low friction, predictable cost)
- **Acceptable fit for AAA** (enterprise tier with compliance features)
- **Good fit for education** (institution-level pricing)

---

## Model B: Per-Project / Per-Title (FMOD Model)

### Revenue Mechanics
- $200–$500 per shipped title that used Score Canvas in the design phase
- Free during development; payment triggered at commercial release
- Tiered by project budget (free for <$250K budget, scaling up)

### Margin Profile
- **Gross margin: 90%+** (minimal per-transaction COGS)
- Revenue is **lumpy and delayed** — payment comes 1–3 years after design begins

### Growth Ceiling
- At 1,000 titles/year × $350 average = $350K/year
- Even at aggressive adoption: $1–2M ARR
- **Too low for venture-scale returns**

### Fit with Segments
- Aligns incentives with studios (only pay when you ship)
- **Hard to audit:** How does Score Canvas verify a title used its tool? Trust-based or middleware integration-based tracking is fragile.
- Freelancers and educators excluded from revenue stream

**Assessment: Not recommended as primary model.** The per-title model works for middleware (Wwise/FMOD own the runtime) but not for a design tool (Score Canvas has no presence in the shipped product).

---

## Model C: Platform/API Hybrid (Twilio/Stripe Model)

### Revenue Mechanics
- **Free canvas** for individuals and small teams (up to 3 projects, limited collaboration)
- **Paid team plans** ($40–55/seat/month) for full collaboration, unlimited projects, export features
- **AI Design Assistant credits:** $0.05–$0.20 per AI-assisted design query (bundled or pay-as-you-go)
- **Middleware export API:** $10–$25 per project export to Wwise/FMOD session stub
- **Enterprise API:** Custom pricing for studios wanting programmatic access to Score Canvas's design engine

### Margin Profile
- **Blended gross margin: 70–80%** (lower than pure SaaS due to AI API pass-through costs)
- AI costs decrease over time as models become cheaper and Score Canvas potentially fine-tunes smaller models

### Growth Ceiling
- Higher than pure seat-based: AI usage scales with project complexity and iteration count
- A single AAA project might generate $500–$2,000 in AI query + export revenue per year, on top of seat fees
- Platform/API revenue could reach $2–5M at scale, independent of seat count

### Data Flywheel
- Usage generates adaptive music design patterns
- Aggregated (anonymized) data trains the AI assistant
- Better AI → more usage → more data → better AI
- Unique dataset becomes competitive moat and potential licensing asset

**Fit with Segments:** Strong across all segments. Free tier drives PLG. Paid team plans serve studios. AI credits scale with usage. Enterprise API serves AAA.

---

## Recommended Model: Hybrid (Model A + Model C)

**Start with seat-based SaaS (Model A) for simplicity and predictable revenue.** Add API/usage revenue (Model C) as the AI layer matures.

### Phase 1 (Year 1–2): Pure SaaS
- Free individual tier, paid team tier ($40–55/seat/month), education tier
- Focus on proving core canvas value without AI complexity

### Phase 2 (Year 2–3): Add AI Credits
- AI design assistant as a paid add-on or bundled with higher tiers
- Per-query pricing for heavy users (AAA studios)

### Phase 3 (Year 3–5): Full Platform
- Middleware export API (per-project fee)
- Enterprise API access
- Data-driven AI assistant with unique training data

### Sensitivity Table: Year 5 ARR by Seat Count and Pricing

| Paying Seats | $25/seat/month | $35/seat/month | $45/seat/month | $55/seat/month |
|--------------|---------------|---------------|---------------|---------------|
| 200 | $60K | $84K | $108K | $132K |
| 500 | $150K | $210K | $270K | $330K |
| 1,000 | $300K | $420K | $540K | $660K |
| 2,000 | $600K | $840K | $1,080K | $1,320K |
| 3,000 | $900K | $1,260K | $1,620K | $1,980K |
| 5,000* | $1,500K | $2,100K | $2,700K | $3,300K |

*5,000 seats assumes expansion into adjacent use cases beyond adaptive music.

**Add AI/API layer revenue (20–40% of seat revenue at maturity) for total ARR estimate.**

---

# SECTION 9: GO-TO-MARKET STRATEGY

## Founder Distribution Assets

### PlayStation Studios Network
The founder's 17-year tenure as Lead Music Designer at PlayStation Studios provides direct personal relationships with:
- **Audio Directors at Sony first-party studios:** Naughty Dog, Insomniac Games, Sucker Punch Productions, Guerrilla Games, Santa Monica Studio, Polyphony Digital, Bend Studio. These represent 7–10 of the most technically sophisticated audio teams in the industry.
- **Extended network:** Game audio is an insular community. The Audio Director at Naughty Dog knows the Audio Director at Ubisoft Montreal, who knows the Audio Director at DICE. A conservative estimate: the founder is 1–2 degrees of connection from **every AAA Audio Director in the Western game industry** (estimated 80–120 people globally).
- **Composer network:** Credits on *Journey* (Austin Wintory — Grammy-nominated), *The Last of Us Part II* (Gustavo Santaolalla), *Ghost of Tsushima* (Ilan Eshkeri, Shigeru Umebayashi), *Marvel's Spider-Man 2*. These composer relationships provide access to the freelance composer segment.

**Network reach estimate:** Direct access to 30–50 Audio Directors; second-degree access to 100+ across Sony, Microsoft, EA, Ubisoft, Take-Two, and major independents.

### Academic Beachhead
- Existing teaching positions at **Northwestern Michigan College** and **Southern Utah University** game audio programs
- These programs provide: beta testing with students, curriculum integration case studies, academic publications, and a pipeline of graduating students who expect Score Canvas in their professional toolkit
- **Beachhead value:** High for validation and testimonials; limited for revenue (small programs). The strategic play is using these as "proof of pedagogical value" to approach Berklee, DigiPen, and SAE.

### Credibility Signals
- **BAFTA recognition** — British Academy of Film and Television Arts games nominations/wins associated with titles the founder worked on
- **Grammy nomination** — *Journey*'s score was the first video game score nominated for a Grammy (2013). The founder's association with this milestone carries permanent industry cachet.
- **MPSE Golden Reel wins** — Motion Picture Sound Editors recognition for game audio
- These awards function as **trust signals** that collapse the credibility gap that most first-time founders face. Game audio buyers know this name.

### Open-Source as GTM
The **Investigative Templater** (MCP server for Wwise WAAPI) serves as:
1. A developer community trust signal — "this founder ships code, not just pitch decks"
2. A technical demonstration of the MCP-WAAPI integration thesis
3. A community-building tool — developers who use the Templater are pre-qualified Score Canvas prospects
4. An open-source "IP anchor" that establishes the founder's technical authority

---

## Proposed GTM Phases

### Phase 0: Pre-Launch (Months 0–6)

**Objective:** Build credibility and demand before the product exists.

**Actions:**
- Release Investigative Templater as open-source on GitHub
- Present at **GDC Audio Summit** (March, annually in San Francisco) — a 30-minute talk on "AI-Assisted Adaptive Music Design" positions the founder as a thought leader and generates awareness
- Publish 3–5 technical articles on game audio design workflow gaps (target: Gamasutra/Game Developer, A Sound Effect, Audiokinetic blog)
- Launch a waitlist with a 60-second product concept video
- Begin design partner conversations with 5–8 Audio Directors from founder's network

**Target:** 500 waitlist signups, 5 committed design partners, 1,000+ GitHub stars on Investigative Templater

### Phase 1: Launch (Months 6–12)

**Objective:** Prove product-market fit with a small, high-quality user base.

**Actions:**
- Invite-only beta with 3–5 anchor studios (non-paying or deeply discounted)
- Studio design partners should span: 1 Sony first-party, 1 non-Sony AAA, 2 AA studios, 1 educational program (NMC)
- Generate 2–3 case studies: "How [Studio] used Score Canvas to design the adaptive music system for [Game]"
- Deploy at NMC and SUU as educational pilots
- Iterate rapidly on feedback; ship weekly updates

**Target:** 50 active users, 5 studio teams, 2 published case studies, NPS >50

### Phase 2: Growth (Months 12–24)

**Objective:** General availability, PLG motion, revenue generation.

**Actions:**
- Public launch with free individual tier and paid team tier
- PLG motion: free tier for freelancers → they bring Score Canvas into studios → studio team upgrades
- First enterprise contracts with AAA studios (leveraging case studies from Phase 1)
- Educational expansion: approach Berklee, DigiPen, SAE with NMC case study
- Content marketing: YouTube tutorials, GDC talks, podcast appearances (Game Dev Podcast, Tonebenders, Beards Beats and Beverages)
- AI design assistant alpha (bundled with paid tiers, limited queries)

**Target:** 200–500 paying seats, $100K–$250K ARR, 3 enterprise contracts signed

### Phase 3: Scale (Months 24–36)

**Objective:** Platform expansion, international markets, partnership development.

**Actions:**
- AI assistant general availability with usage-based pricing
- Middleware export API launch (Wwise session stub generation)
- Pursue Audiokinetic partnership: co-marketing, Wwise Launcher integration, potential reseller agreement
- International expansion: UK game audio community (London, Brighton), Canada (Montreal, Vancouver), Japan (Tokyo — the founder's PlayStation connections reach Sony Japan)
- Expand use case: sound effects system design, voice dialogue trees, ambient audio architecture

**Target:** 1,000+ paying seats, $500K–$1M ARR, Audiokinetic partnership signed, presence in 3 international markets

---

## Distribution Risk Analysis

### What if Audiokinetic views Score Canvas as a threat?
If Audiokinetic perceives Score Canvas as a layer that could make studios middleware-agnostic (use Score Canvas to design, export to Wwise OR FMOD), they may:
- Block WAAPI access (unlikely — WAAPI is a public API and restricting it would anger the developer community)
- Build a competing feature (see Section 2 analysis — plausible but slow)
- Refuse co-marketing/partnership (most likely response if threatened)

**Mitigation:** Position Score Canvas as "Wwise-first" in early marketing. Emphasize that Score Canvas makes Wwise more valuable, not less. The FMOD export feature exists but is not the lead message. Seek partnership before Audiokinetic has reason to view Score Canvas as adversarial.

### What if AAA studios build internal tools?
Some already have. The question is whether those studios will maintain and invest in internal tools versus adopting a purpose-built external tool.
**Historical pattern:** Studios build internal tools for core competitive advantages (rendering, physics, gameplay). They buy external tools for non-competitive workflow needs (project management: Jira/Shotgrid; version control: Perforce; communication: Slack). Audio design workflow is non-competitive — every studio benefits from better-designed music systems, and no studio gains competitive advantage from their design *process* (only from the resulting *design*).

**Mitigation:** Demonstrate that Score Canvas is better, more maintained, and more innovative than any internal tool could be. The AI assistant layer is the killer differentiator — no internal tool team will build this.

### How does the PlayStation insider position help AND complicate sales?

**Helps:**
- Immediate credibility: "The person who designed the adaptive music for *The Last of Us Part II* built this tool"
- Direct access to Sony first-party studios for design partnerships
- Understanding of enterprise requirements (security, procurement, toolchain integration)

**Complicates:**
- **Non-compete / IP assignment risk:** The founder must ensure no IP overlap with PlayStation Studios work. Score Canvas must be cleanly developed post-departure (or under a side-project agreement).
- **Perception of Sony favoritism:** If Score Canvas launches with only Sony first-party case studies, Microsoft/EA/Ubisoft studios may perceive it as a "Sony tool." Mitigation: ensure Phase 1 design partners include at least one non-Sony AAA studio.
- **Post-departure network decay:** Relationships built as a colleague are different from relationships as a vendor. Some Audio Directors will champion the tool out of personal loyalty; others will require independent product validation. The founder's credibility buys ~18 months of goodwill; after that, the product must stand on its own.

---

# SECTION 10: RISK REGISTER

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|------------|
| 1 | **Market size risk** — adaptive music design TAM too small for venture-scale returns | **High** | **High** | Expand TAM via: (a) broader game audio system design (SFX, dialogue, ambient), (b) AI/API platform revenue, (c) adjacent verticals (film/TV interactive, XR). If expansion fails, pivot to profitable niche or strategic exit. |
| 2 | **Build risk** — 2-person team cannot reach MVP before funded competitor enters | **Low-Medium** | **High** | MVP is technically achievable in 20 weeks. The real risk is hiring the second engineer. Mitigation: pre-seed funding must include recruiter budget; founder's network in game dev includes engineering contacts. |
| 3 | **Platform risk** — Figma/Miro add audio templates | **Low** | **Medium** | Figma/Miro have no incentive to verticalize into a <10K user market. Even if they add templates, they lack middleware export, AI assistant, and audio-domain semantics. Score Canvas must stay 12+ months ahead on domain features. |
| 4 | **Middleware vertical integration** — Audiokinetic builds this as a Wwise feature | **Medium** | **High** | Audiokinetic's incentives favor deepening Wwise, not building pre-Wwise collaboration tools. Sony ownership constrains cross-platform ambitions. Mitigation: seek partnership early; position as Wwise-enhancing, not Wwise-competing. |
| 5 | **AI displacement risk** — LLM agents auto-generate Wwise projects, making design phase irrelevant | **Low** (2-3 years), **Medium** (5+ years) | **High** | Adaptive music design is collaborative and subjective — LLMs assist but don't replace the human design conversation. Mitigation: embrace AI as a feature (generate starting-point designs), not compete with it. |
| 6 | **Regulatory/union risk** — AI music tools face industry backlash; Score Canvas's AI layer is reputationally toxic | **Medium** | **Medium** | Position AI as "design assistance, not music generation." Separate AI sketch features from core canvas. Offer AI-free mode for studios with anti-AI policies. Let studios opt out of AI entirely. |
| 7 | **Founder concentration risk** — entire thesis rests on one person's domain expertise | **High** | **High** | Pre-seed must fund a co-founder search (ideally a technical co-founder with collaboration tool experience). Founder's educational work (published curriculum, teaching positions) creates documentation of domain knowledge. Advisory board of 2–3 Audio Directors provides institutional domain expertise beyond the founder. |
| 8 | **GTM access risk** — PlayStation Studios network decays post-departure | **Medium** | **Medium** | The game audio community is small and relationship-driven. GDC, Wwise User Conference, and online communities (Audio Implementers Discord) maintain connections. Published case studies and open-source work create founder-independent credibility. |
| 9 | **Enterprise sales cycle risk** — AAA studios buy slowly; 18-month cycle to first enterprise deal | **High** | **Medium** | Don't depend on AAA revenue for survival. The freemium + AA studio + freelancer revenue should sustain operations while enterprise deals close. Phase 1 design partners are non-paying validation, not revenue. |
| 10 | **Geographic concentration risk** — game audio talent is in LA/Seattle/London/Montreal/Tokyo; founder is in Michigan | **Medium** | **Low** | Score Canvas is a cloud product — geography matters for sales, not product. GDC (SF), BAFTA (London), and Wwise User Conference provide annual in-person touchpoints. The founder's teaching positions (Michigan) are actually an advantage for the educational beachhead. Remote-first culture in post-2020 game development reduces this risk. |

---

# SECTION 11: INVESTMENT THESIS AND RECOMMENDATION

## The Bet in One Sentence

Score Canvas bets that the $197B game industry's most creatively complex audio workflow — adaptive music system design — is ready to graduate from whiteboards and email chains into a dedicated collaborative design tool, and that the founder who designed the music systems for four of gaming's most acclaimed titles is the right person to build it.

## Three Reasons to Fund Now

**1. Founder-market fit is exceptional and non-replicable.** There are perhaps 20 people in the world with the domain expertise, industry relationships, and technical capability to build this product. This founder — with shipped credits on *Journey*, *The Last of Us Part II*, *Ghost of Tsushima*, and *Marvel's Spider-Man 2*, plus active MCP/AI development work — is the most credible among them. If he doesn't build it, the market waits 5–10 more years.

**2. The AI infrastructure moment is right.** MCP (97M+ monthly SDK downloads, Linux Foundation governance, adopted by all major AI labs) creates a standardized bridge between AI assistants and professional tools. The founder has already built the MCP-WAAPI integration. The window to be the *first* AI-connected adaptive music design tool is open now and will close within 18–24 months as the game audio industry catches up to AI integration.

**3. The market timing is favorable.** AI creative tools are attracting historic investment (Suno $2.45B, ElevenLabs $11B, Cursor $29.3B). Game audio is increasing in complexity and ambition while team sizes are constrained. The "design phase gap" is a known problem to every practitioner — what's new is that the technology (real-time collaboration, AI assistance, MCP integration) to solve it is finally mature enough.

## Three Reasons to Wait or Pass

**1. TAM ceiling.** The pure adaptive music design market may be too small for venture-scale returns. The seat math (Section 3) shows $1–3M ARR at full penetration in the core market. Venture-scale requires the expansion vectors (broader audio design, AI platform, adjacent verticals) to materialize — and those are unproven.

**2. Solo founder risk.** The company is one person. There is no technical co-founder. Pre-seed capital must fund co-founder recruitment, and if that search fails, the company cannot execute. The domain expertise that makes the founder irreplaceable is the same thing that makes the company fragile.

**3. Revenue timeline.** AA and indie revenue is achievable in 12–18 months; AAA enterprise revenue takes 24–36 months. The company will burn through pre-seed capital before enterprise contracts materialize. Bridge or seed round will be needed, and that round depends on showing traction in the smaller segments.

## The Milestone That Converts a Pass Into a Fund

**If Score Canvas demonstrates that 3+ non-Sony studios are actively using the tool in production design workflows within 9 months of beta launch, with at least one willing to convert to a paid contract**, the TAM concern is substantially de-risked. This proves that the market exists beyond the founder's personal network, that the tool solves a real workflow problem (not just a founder's personal preference), and that willingness to pay is real.

## Comparable Entry Valuations (Pre-Seed Creative Tools, 2023–2026)

| Company | Stage | Year | Valuation | Round Size | Vertical |
|---------|-------|------|-----------|------------|----------|
| Whimsical | Series A | 2021 | ~$150-250M (est.) | $30M | Visual collaboration |
| Typical pre-seed creative tool (2024–2026 vintage) | Pre-seed | 2024–2026 | $5–15M post-money | $500K–$2M | Various |
| Typical pre-seed dev tool with AI angle | Pre-seed | 2025–2026 | $8–20M post-money | $1–3M | AI-augmented dev tools |

**Score Canvas's pre-seed valuation range:** $6–12M post-money, based on:
- Solo founder (discount vs. team)
- Exceptional domain expertise and network (premium)
- Pre-product (discount)
- Active proof-of-concept code (MCP server — premium)
- Hot AI-tools market (premium)
- Narrow initial TAM (discount)

## Suggested Pre-Seed Terms

- **Check size:** $750K–$1.5M
- **Instrument:** SAFE (post-money), $8–10M cap, no discount or standard MFN
- **Use of funds:** 12–18 month runway for 2-person team (founder + senior engineer hire), cloud infrastructure, GDC presence, legal/IP
- **Ideal co-investor profile:**
  - **Strategic angel:** An Audio Director or studio executive at a non-Sony AAA studio. This person provides: validation signal, design partner relationship, and domain advisory. Targets: audio leadership at Ubisoft, EA, Microsoft Gaming, or a major independent.
  - **Institutional seed fund** with creative tools or game industry thesis: Makers Fund (games-focused VC), BITKRAFT Ventures (games + esports), Lerer Hippeau (creative tools), or a generalist seed fund with Figma/Miro in portfolio (benchmark: Kleiner Perkins' FigJam thesis).
  - **AI-focused fund:** If the AI-design-assistant layer is the primary pitch, funds like Conviction (Sarah Guo) or Amplify Partners could anchor.

## 5-Year Return Path

### Base Case Exit: Strategic Acquisition ($20–60M)

**Most likely acquirer:** Audiokinetic/Sony. Score Canvas as the upstream design layer for Wwise is a natural product extension. Acquisition would give Audiokinetic control over the pre-implementation workflow, locking studios into the Wwise ecosystem more completely.

**Timeline:** Year 3–5. Triggered by Score Canvas reaching $1–3M ARR and demonstrable adoption at 20+ studios.

**Return on $1M pre-seed at $10M cap:** $1M → $2–6M (2–6x). Modest but positive.

### Upside Case: Independent SaaS ($10M+ ARR)

**Scenario:** Score Canvas expands beyond music into full game audio system design, the AI platform generates significant usage revenue, and the tool becomes the collaboration layer for all game audio teams.

**Timeline:** Year 5–7. Requires successful Series A ($5–10M) and Series B.

**Valuation at $10M ARR (10–15x multiple):** $100–150M.

**Return on $1M pre-seed at $10M cap:** $1M → $10–15M (10–15x). Strong venture return.

### Downside Case: Asset Sale or Strategic Wind-Down

**Scenario:** TAM ceiling proves binding. Score Canvas reaches $500K–$1M ARR but cannot expand beyond niche.

**Outcome:** Asset sale (technology + customer base + domain IP) to Audiokinetic, Unity, or a game audio tools consolidator. Estimated $3–8M.

**Return on $1M pre-seed at $10M cap:** $1M → $300K–$800K (0.3–0.8x). Partial loss.

**Alternative downside:** Founder returns to AAA studio employment with Score Canvas as a side project / open-source tool. Investor loss of capital.

---

# SECTION 12: APPENDIX

## A. Glossary of Game Audio Terms for Non-Specialist Investors

| Term | Definition |
|------|-----------|
| **Adaptive music** | Music that changes dynamically based on game events, player actions, or game state. Unlike linear film scores, adaptive music must handle unpredictable player behavior and seamlessly transition between musical states. |
| **Stems** | Individual audio files representing isolated components of a musical piece (e.g., drums, strings, brass, synth layers). Stems allow middleware to independently control and mix musical elements in real time. |
| **Middleware** | Software that sits between the game engine and the audio content. Wwise and FMOD are the dominant game audio middleware platforms. They handle playback, mixing, effects processing, and the logic that determines which sounds play when. |
| **Wwise** | (Wave Works Interactive Sound Engine) Audiokinetic's game audio middleware. The industry standard for AAA game audio. Provides a visual authoring environment and runtime engine for implementing complex audio systems. |
| **FMOD** | Firelight Technologies' game audio middleware. The primary alternative to Wwise, popular with indie and mid-tier studios. Offers a timeline-based authoring approach. |
| **WAAPI** | (Wwise Authoring API) Audiokinetic's programming interface for controlling the Wwise authoring environment. Enables external tools to create, modify, and query Wwise project data programmatically. |
| **MCP** | (Model Context Protocol) Anthropic's open standard for connecting AI systems to external tools and data sources. Allows AI assistants to interact with software APIs through a standardized protocol. |
| **WAQL** | (Wwise Authoring Query Language) A query language for searching and filtering objects within a Wwise project. Similar to SQL for databases, but for audio objects. |
| **State machine** | A computational model where the system exists in one of a finite number of "states" and transitions between them based on inputs. In game audio, music states might include: "exploration," "combat," "stealth," "boss fight," with rules governing transitions between them. |
| **Music segment** | A discrete chunk of music content within middleware (e.g., a 4-bar loop, a transition sting, a stinger). Music segments are the building blocks that the adaptive music system assembles in real time. |
| **Transition matrix** | A grid defining how music transitions from any state to any other state. For a system with 10 music states, the transition matrix has 100 entries (10×10), each specifying: what music plays during the transition, how long the crossfade is, whether it waits for a musical beat boundary, etc. |
| **Music bus** | An audio signal routing channel in middleware dedicated to music content. Allows global control over music volume, effects, and ducking (reducing music volume when dialogue plays). |
| **Attenuation** | The reduction in audio volume as a function of distance between the listener and the sound source. Critical for spatial audio but less relevant for music (which is typically non-spatialized). |
| **RTPC** | (Real-Time Parameter Control) A Wwise feature that maps a game parameter (e.g., player health, time of day, proximity to danger) to an audio property (e.g., music intensity layer, filter frequency, reverb amount). RTPCs are the primary mechanism for continuous adaptive music behavior. |
| **DAW** | (Digital Audio Workstation) Software for recording, editing, and producing audio. Examples: Pro Tools, Logic Pro, Ableton Live, Reaper. DAWs are for creating music; middleware is for implementing it in games. |

## B. Game Audio Team Org Chart — Typical Configurations

### AAA Studio (200+ person game team)

```
Audio Director
├── Music Director / Music Supervisor
│   ├── Lead Music Designer / Technical Music Designer (1-2)
│   ├── Music Implementers (2-4)
│   └── External Composers (contracted, 1-5)
├── Lead Sound Designer
│   ├── Senior Sound Designers (3-5)
│   ├── Sound Designers (4-8)
│   └── Foley Artists (1-2, often contracted)
├── Audio Programmer / Technical Audio Designer
│   ├── Audio Programmers (2-4)
│   └── Audio Implementers (2-4)
├── Voice / Dialogue
│   ├── Dialogue Designer (1-2)
│   └── Voice Recording Engineer (1, often contracted)
└── Audio QA (1-3)

Total audio department: 15-40 people
```

### AA Studio (30-200 person game team)

```
Audio Director / Lead Sound Designer
├── Sound Designers (2-4)
├── Audio Implementer / Technical Sound Designer (1-2)
├── External Composer (contracted)
└── Audio QA (shared with general QA)

Total audio staff: 3-10 people
```

### Indie Studio (<30 person game team)

```
Sound Designer / Audio Generalist
├── Does everything: SFX, music implementation, mixing, QA
├── May hire a freelance composer
└── May use FMOD/Wwise free tier or game engine native audio

Total audio staff: 1-3 people (often 1)
```

## C. Current AI Audio Tool Landscape Map

| Category | Tool / Company | What It Does | Funding / Status | Gap vs. Score Canvas |
|----------|---------------|-------------|-----------------|---------------------|
| **Music Generation** | Suno | Text-to-music generation | $2.45B val, $300M ARR, Series C | Generates music, not music system designs |
| | Udio | Text-to-music generation | Series A, legal challenges | Same as Suno |
| | ElevenLabs Music | Voice + music generation | $11B val, $500M round | Same as Suno |
| | Meta AudioCraft | Open-source music generation | Meta internal | Same as Suno |
| **Sound Design** | GameSynth (Tsugi) | Procedural sound effects | Private, Japan | SFX-focused, not music design |
| **Audio Search** | Wwise Similar Sound Search | AI audio-to-audio search in Wwise | Sony AI + Audiokinetic | Asset discovery, not system design |
| **Voice** | Replica Studios | AI voice acting | Series A | Voice performance, not music |
| | ElevenLabs Voice | Voice synthesis | See above | Voice, not music design |
| **Audio Mastering** | LANDR | AI-powered audio mastering | ~$30M funding | Post-production, not design |
| **Middleware** | Wwise (Audiokinetic/Sony) | Audio implementation | Acquired by Sony 2019 | Implementation, not design |
| | FMOD (Firelight) | Audio implementation | Private, AU | Implementation, not design |
| **Music Design** | **[GAP — Score Canvas's target]** | Collaborative adaptive music system design | **No product exists** | **This is the opportunity** |

## D. Key Industry Publications, Communities, and Events

### Events
| Event | When | Where | Relevance |
|-------|------|-------|-----------|
| **GDC Audio Summit** | March, annually | San Francisco | #1 event for game audio professionals. ~500-800 audio attendees. Score Canvas's primary launch vehicle. |
| **Wwise Interactive Music Symposium (WIMS)** | Varies | Various | Audiokinetic-hosted event focused on interactive music. Direct target audience for Score Canvas. |
| **BAFTA Games Awards** | April, annually | London | Prestige recognition; the founder has associated credits. Networking with UK audio community. |
| **GANG Awards (Game Audio Network Guild)** | March (at GDC) | San Francisco | Industry awards for game audio excellence. Community building. |
| **AIAS D.I.C.E. Summit** | February, annually | Las Vegas | Academy of Interactive Arts & Sciences. Broader game industry event. |
| **MPSE Golden Reel Awards** | February, annually | Los Angeles | Motion Picture Sound Editors. Cross-industry audio recognition. |
| **AES Convention** | October, annually | Various | Audio Engineering Society. Academic and professional audio. Educational outreach opportunity. |

### Communities
| Community | Platform | Size (est.) | Relevance |
|-----------|----------|-------------|-----------|
| **Audio Implementers / Game Audio Discord** | Discord | ~5,000-10,000 members | Primary online community for technical game audio. High Score Canvas relevance. |
| **r/GameAudio** | Reddit | ~30,000 subscribers | Broader game audio community. PLG marketing channel. |
| **Wwise Community** | Audiokinetic forums | ~50,000 registered users | Wwise-specific discussions. MCP server distribution channel. |
| **GANG (Game Audio Network Guild)** | Independent | ~2,000 members | Professional network. Enterprise relationship building. |
| **Game Audio Twitter/X** | X/Twitter | Fragmented, ~10,000-20,000 active | Real-time industry conversation. Founder credibility building. |

### Publications
| Publication | Focus | Score Canvas Relevance |
|-------------|-------|----------------------|
| **Game Developer (formerly Gamasutra)** | Game development industry | Technical articles, postmortems. Content marketing channel. |
| **A Sound Effect** | Sound design community | Game audio features and reviews. Product launch PR. |
| **Sound On Sound** | Professional audio technology | Game audio coverage. AI in audio reporting. |
| **80 Level** | Game development art and tech | Audio features and tutorials. |
| **Audiokinetic Blog** | Wwise community | Technical articles and case studies. Guest post opportunity. |

## E. Primary Research Questions — Audio Director Validation Interviews

The following 10 interview questions are designed to validate or invalidate Score Canvas's core thesis. They should be asked of Audio Directors and Lead Music Designers at AAA and AA studios.

1. **Walk me through the last adaptive music system you designed. What happened between the composer finishing stems and the audio programmer starting implementation in Wwise/FMOD? How was that design phase documented?**
   *Validates: the gap exists and is real, not theoretical.*

2. **How many hours per project does your team spend on revisions that trace back to miscommunication between the music design intent and the middleware implementation? Can you give a specific example?**
   *Validates: the cost of the current informal process is measurable.*

3. **If I gave you a collaborative, visual canvas where you could design your adaptive music system with node-based states, transitions, and parameters — and it could export to Wwise session documentation — would you use it? What would it need to include for you to adopt it?**
   *Validates: willingness to adopt. The follow-up identifies must-have features.*

4. **What would you pay for this tool? Frame it relative to what you currently spend on audio middleware and DAW licenses.**
   *Validates: willingness to pay and anchors pricing.*

5. **Who else on your team would need to use this tool? Would you want your composers to be in it? Your audio programmers? Your game designers?**
   *Validates: seat expansion potential beyond the music designer.*

6. **Have you evaluated or built any internal tools for this purpose? If so, what worked and what didn't?**
   *Validates: the problem is acute enough that teams have tried to solve it. Identifies feature requirements.*

7. **How do you feel about AI assisting in the design phase — not generating music, but suggesting system architectures, identifying potential transition issues, or auto-generating documentation?**
   *Validates: AI acceptance in design (vs. generation). Identifies positioning boundaries.*

8. **If a freelance composer showed up to your project with this tool and said 'I designed the adaptive music system in Score Canvas, here's the exported documentation for your Wwise team,' would that change how you evaluate that composer?**
   *Validates: the freelancer-as-distribution-channel thesis.*

9. **What would make you NOT adopt this tool? What are the deal-breakers?**
   *Identifies: security requirements, workflow friction, feature gaps, organizational resistance.*

10. **If Audiokinetic built this as a Wwise feature, would you prefer that over a third-party tool? Why or why not?**
    *Validates: platform risk. If Audio Directors prefer a Wwise-native solution, the standalone product thesis weakens.*

---

**END OF REPORT**

---

*This report was prepared for internal investment committee review. All market size estimates are labeled as such. Cited data points reference publicly available sources as of March 2026. This document does not constitute financial advice or a recommendation to invest.*

*Research sources include: Newzoo Global Games Market Report (2025), Audiokinetic public documentation and blog, FMOD licensing page, TechCrunch, CNBC, Variety, Hollywood Reporter, GameSoundCon Industry Survey (2023), Berklee Online, DigiPen Institute of Technology, SAG-AFTRA Interactive Media Agreement (2025), Anthropic MCP documentation, Statista, SteamDB, and multiple industry analyst reports.*
