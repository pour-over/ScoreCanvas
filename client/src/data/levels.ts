import type { Node, Edge } from "@xyflow/react";

export interface MusicAsset {
  id: string;
  filename: string;
  category: "intro" | "loop" | "ending" | "transition" | "stinger" | "layer" | "ambient";
  duration: string;
  bpm: number;
  key: string;
  stems: string[];
}

export interface GameLevel {
  id: string;
  name: string;
  subtitle: string;
  region: string;
  nodes: Node[];
  edges: Edge[];
  assets: MusicAsset[];
}

// ─── LEVEL 1: PRIMORDIAL NEXUS ───────────────────────────────────────────────

const primordialNexusAssets: MusicAsset[] = [
  { id: "a-pn-01", filename: "mus_primordial_intro_01", category: "intro", duration: "0:32", bpm: 90, key: "Dm", stems: ["strings_pad", "choir_whisper", "synth_sub"] },
  { id: "a-pn-02", filename: "mus_primordial_explore_loop_01", category: "loop", duration: "2:08", bpm: 90, key: "Dm", stems: ["strings_arp", "woodwinds_melody", "synth_pad", "perc_light"] },
  { id: "a-pn-03", filename: "mus_primordial_explore_loop_02", category: "loop", duration: "2:08", bpm: 90, key: "Dm", stems: ["strings_arp", "harp_ostinato", "synth_pad"] },
  { id: "a-pn-04", filename: "mus_primordial_combat_loop_lo", category: "loop", duration: "1:04", bpm: 130, key: "Dm", stems: ["perc_tribal", "brass_stab", "strings_trem", "synth_bass"] },
  { id: "a-pn-05", filename: "mus_primordial_combat_loop_hi", category: "loop", duration: "1:04", bpm: 130, key: "Dm", stems: ["perc_tribal", "brass_full", "strings_fff", "synth_lead", "choir_battle"] },
  { id: "a-pn-06", filename: "mus_primordial_transition_explore_to_combat", category: "transition", duration: "0:04", bpm: 130, key: "Dm", stems: ["perc_fill", "brass_rise"] },
  { id: "a-pn-07", filename: "mus_primordial_transition_combat_to_explore", category: "transition", duration: "0:06", bpm: 90, key: "Dm", stems: ["strings_resolve", "synth_fade"] },
  { id: "a-pn-08", filename: "mus_primordial_stinger_discovery", category: "stinger", duration: "0:03", bpm: 90, key: "Dm", stems: ["harp_gliss", "chime_sparkle"] },
  { id: "a-pn-09", filename: "mus_primordial_stinger_danger", category: "stinger", duration: "0:02", bpm: 130, key: "Dm", stems: ["brass_hit", "perc_impact"] },
  { id: "a-pn-10", filename: "mus_primordial_ending_01", category: "ending", duration: "0:12", bpm: 90, key: "Dm", stems: ["strings_resolve", "choir_soft", "synth_tail"] },
  { id: "a-pn-11", filename: "mus_primordial_ambient_cave_layer", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_cave", "water_drip_musical"] },
  { id: "a-pn-12", filename: "mus_primordial_ambient_canopy_layer", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_forest", "wind_tonal"] },
];

const primordialNexusNodes: Node[] = [
  { id: "pn-intro", type: "musicState", position: { x: 60, y: 260 }, data: { label: "Level Intro", intensity: 20, looping: false, stems: ["strings_pad", "choir_whisper", "synth_sub"], asset: "mus_primordial_intro_01" } },
  { id: "pn-explore-1", type: "musicState", position: { x: 340, y: 140 }, data: { label: "Exploration A", intensity: 30, looping: true, stems: ["strings_arp", "woodwinds_melody", "synth_pad", "perc_light"], asset: "mus_primordial_explore_loop_01" } },
  { id: "pn-explore-2", type: "musicState", position: { x: 340, y: 380 }, data: { label: "Exploration B", intensity: 25, looping: true, stems: ["strings_arp", "harp_ostinato", "synth_pad"], asset: "mus_primordial_explore_loop_02" } },
  { id: "pn-trans-to-combat", type: "transition", position: { x: 620, y: 120 }, data: { label: "→ Combat", duration: 4000, syncPoint: "next-bar", fadeType: "crossfade" } },
  { id: "pn-combat-lo", type: "musicState", position: { x: 880, y: 80 }, data: { label: "Combat (Low)", intensity: 65, looping: true, stems: ["perc_tribal", "brass_stab", "strings_trem", "synth_bass"], asset: "mus_primordial_combat_loop_lo" } },
  { id: "pn-combat-hi", type: "musicState", position: { x: 880, y: 280 }, data: { label: "Combat (High)", intensity: 90, looping: true, stems: ["perc_tribal", "brass_full", "strings_fff", "synth_lead", "choir_battle"], asset: "mus_primordial_combat_loop_hi" } },
  { id: "pn-param-threat", type: "parameter", position: { x: 880, y: 470 }, data: { label: "ThreatLevel", paramName: "RTPC_ThreatLevel", minValue: 0, maxValue: 100, defaultValue: 0, description: "Driven by enemy proximity + count. Controls combat intensity crossfade." } },
  { id: "pn-trans-to-explore", type: "transition", position: { x: 620, y: 340 }, data: { label: "→ Explore", duration: 6000, syncPoint: "next-bar", fadeType: "bridge" } },
  { id: "pn-stinger-discovery", type: "stinger", position: { x: 340, y: 560 }, data: { label: "Discovery", trigger: "OnLorePickup", asset: "mus_primordial_stinger_discovery", priority: "high" } },
  { id: "pn-stinger-danger", type: "stinger", position: { x: 620, y: 560 }, data: { label: "Danger Close", trigger: "OnRaptorAggro", asset: "mus_primordial_stinger_danger", priority: "critical" } },
  { id: "pn-ending", type: "musicState", position: { x: 1140, y: 260 }, data: { label: "Level Complete", intensity: 40, looping: false, stems: ["strings_resolve", "choir_soft", "synth_tail"], asset: "mus_primordial_ending_01" } },
];

const primordialNexusEdges: Edge[] = [
  { id: "e-pn-1", source: "pn-intro", target: "pn-explore-1", animated: true, label: "Auto" },
  { id: "e-pn-2", source: "pn-intro", target: "pn-explore-2", animated: true, label: "Alt Path", style: { strokeDasharray: "5 5" } },
  { id: "e-pn-3", source: "pn-explore-1", target: "pn-trans-to-combat", animated: true },
  { id: "e-pn-4", source: "pn-explore-2", target: "pn-trans-to-combat", animated: true },
  { id: "e-pn-5", source: "pn-trans-to-combat", target: "pn-combat-lo", animated: true },
  { id: "e-pn-6", source: "pn-combat-lo", target: "pn-combat-hi", animated: true, label: "RTPC > 60", style: { stroke: "#e94560" } },
  { id: "e-pn-7", source: "pn-combat-hi", target: "pn-combat-lo", animated: true, label: "RTPC < 40", style: { stroke: "#4ecdc4" } },
  { id: "e-pn-8", source: "pn-combat-lo", target: "pn-trans-to-explore", animated: true, label: "No enemies" },
  { id: "e-pn-9", source: "pn-trans-to-explore", target: "pn-explore-1", animated: true },
  { id: "e-pn-10", source: "pn-combat-hi", target: "pn-ending", animated: true, label: "Boss defeated" },
];

// ─── LEVEL 2: VELOCIFORGE ────────────────────────────────────────────────────

const velociforgeAssets: MusicAsset[] = [
  { id: "a-vf-01", filename: "mus_velociforge_intro_01", category: "intro", duration: "0:24", bpm: 110, key: "F#m", stems: ["anvil_rhythm", "synth_industrial", "strings_tension"] },
  { id: "a-vf-02", filename: "mus_velociforge_explore_loop_01", category: "loop", duration: "1:36", bpm: 110, key: "F#m", stems: ["synth_pulse", "marimba_pattern", "bass_synth", "perc_mechanical"] },
  { id: "a-vf-03", filename: "mus_velociforge_stealth_loop_01", category: "loop", duration: "1:36", bpm: 110, key: "F#m", stems: ["synth_whisper", "perc_tick", "bass_sub"] },
  { id: "a-vf-04", filename: "mus_velociforge_combat_loop_lo", category: "loop", duration: "0:48", bpm: 150, key: "F#m", stems: ["perc_industrial", "guitar_dist", "synth_aggro", "bass_drive"] },
  { id: "a-vf-05", filename: "mus_velociforge_combat_loop_hi", category: "loop", duration: "0:48", bpm: 150, key: "F#m", stems: ["perc_industrial", "guitar_shred", "synth_aggro", "brass_power", "choir_dark"] },
  { id: "a-vf-06", filename: "mus_velociforge_transition_explore_to_stealth", category: "transition", duration: "0:03", bpm: 110, key: "F#m", stems: ["synth_filter_down", "perc_fade"] },
  { id: "a-vf-07", filename: "mus_velociforge_transition_stealth_to_combat", category: "transition", duration: "0:02", bpm: 150, key: "F#m", stems: ["perc_crash", "brass_blast"] },
  { id: "a-vf-08", filename: "mus_velociforge_transition_combat_to_explore", category: "transition", duration: "0:05", bpm: 110, key: "F#m", stems: ["guitar_resolve", "synth_release"] },
  { id: "a-vf-09", filename: "mus_velociforge_stinger_alarm", category: "stinger", duration: "0:02", bpm: 150, key: "F#m", stems: ["siren_synth", "perc_hit"] },
  { id: "a-vf-10", filename: "mus_velociforge_stinger_forge_activate", category: "stinger", duration: "0:04", bpm: 110, key: "F#m", stems: ["anvil_strike", "choir_power", "synth_rise"] },
  { id: "a-vf-11", filename: "mus_velociforge_ending_01", category: "ending", duration: "0:16", bpm: 110, key: "F#m", stems: ["guitar_clean", "strings_triumph", "synth_shimmer"] },
  { id: "a-vf-12", filename: "mus_velociforge_layer_furnace_amb", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_furnace", "metal_creak_tonal"] },
];

const velociforgeNodes: Node[] = [
  { id: "vf-intro", type: "musicState", position: { x: 60, y: 240 }, data: { label: "Forge Intro", intensity: 35, looping: false, stems: ["anvil_rhythm", "synth_industrial", "strings_tension"], asset: "mus_velociforge_intro_01" } },
  { id: "vf-explore", type: "musicState", position: { x: 340, y: 140 }, data: { label: "Forge Floor", intensity: 40, looping: true, stems: ["synth_pulse", "marimba_pattern", "bass_synth", "perc_mechanical"], asset: "mus_velociforge_explore_loop_01" } },
  { id: "vf-trans-to-stealth", type: "transition", position: { x: 340, y: 350 }, data: { label: "→ Stealth", duration: 3000, syncPoint: "next-beat", fadeType: "crossfade" } },
  { id: "vf-stealth", type: "musicState", position: { x: 600, y: 350 }, data: { label: "Raptor Stalking", intensity: 20, looping: true, stems: ["synth_whisper", "perc_tick", "bass_sub"], asset: "mus_velociforge_stealth_loop_01" } },
  { id: "vf-trans-to-combat", type: "transition", position: { x: 600, y: 140 }, data: { label: "→ Combat", duration: 2000, syncPoint: "immediate", fadeType: "sting" } },
  { id: "vf-combat-lo", type: "musicState", position: { x: 870, y: 80 }, data: { label: "Forge Fight (Low)", intensity: 70, looping: true, stems: ["perc_industrial", "guitar_dist", "synth_aggro", "bass_drive"], asset: "mus_velociforge_combat_loop_lo" } },
  { id: "vf-combat-hi", type: "musicState", position: { x: 870, y: 280 }, data: { label: "Forge Fight (High)", intensity: 95, looping: true, stems: ["perc_industrial", "guitar_shred", "synth_aggro", "brass_power", "choir_dark"], asset: "mus_velociforge_combat_loop_hi" } },
  { id: "vf-param-alert", type: "parameter", position: { x: 600, y: 530 }, data: { label: "AlertStatus", paramName: "RTPC_AlertStatus", minValue: 0, maxValue: 100, defaultValue: 0, description: "0=Undetected, 50=Suspicious, 100=Full Alert. Drives stealth→combat escalation." } },
  { id: "vf-trans-to-explore", type: "transition", position: { x: 1100, y: 200 }, data: { label: "→ Explore", duration: 5000, syncPoint: "next-bar", fadeType: "bridge" } },
  { id: "vf-stinger-alarm", type: "stinger", position: { x: 870, y: 470 }, data: { label: "Alarm Triggered", trigger: "OnDetectedByRaptor", asset: "mus_velociforge_stinger_alarm", priority: "critical" } },
  { id: "vf-stinger-forge", type: "stinger", position: { x: 340, y: 530 }, data: { label: "Forge Activated", trigger: "OnForgeInteract", asset: "mus_velociforge_stinger_forge_activate", priority: "high" } },
  { id: "vf-ending", type: "musicState", position: { x: 1100, y: 400 }, data: { label: "Forge Mastered", intensity: 50, looping: false, stems: ["guitar_clean", "strings_triumph", "synth_shimmer"], asset: "mus_velociforge_ending_01" } },
];

const velociforgeEdges: Edge[] = [
  { id: "e-vf-1", source: "vf-intro", target: "vf-explore", animated: true, label: "Auto" },
  { id: "e-vf-2", source: "vf-explore", target: "vf-trans-to-stealth", animated: true, label: "Enter raptor zone" },
  { id: "e-vf-3", source: "vf-trans-to-stealth", target: "vf-stealth", animated: true },
  { id: "e-vf-4", source: "vf-stealth", target: "vf-trans-to-combat", animated: true, label: "RTPC > 80" },
  { id: "e-vf-5", source: "vf-explore", target: "vf-trans-to-combat", animated: true, label: "Ambush" },
  { id: "e-vf-6", source: "vf-trans-to-combat", target: "vf-combat-lo", animated: true },
  { id: "e-vf-7", source: "vf-combat-lo", target: "vf-combat-hi", animated: true, label: "RTPC > 70", style: { stroke: "#e94560" } },
  { id: "e-vf-8", source: "vf-combat-hi", target: "vf-combat-lo", animated: true, label: "RTPC < 40", style: { stroke: "#4ecdc4" } },
  { id: "e-vf-9", source: "vf-combat-lo", target: "vf-trans-to-explore", animated: true, label: "All clear" },
  { id: "e-vf-10", source: "vf-trans-to-explore", target: "vf-explore", animated: true },
  { id: "e-vf-11", source: "vf-combat-hi", target: "vf-ending", animated: true, label: "Alpha Raptor defeated" },
];

// ─── LEVEL 3: CHRONO WASTES ─────────────────────────────────────────────────

const chronoWastesAssets: MusicAsset[] = [
  { id: "a-cw-01", filename: "mus_chrono_intro_01", category: "intro", duration: "0:28", bpm: 85, key: "Bbm", stems: ["synth_time_stretch", "strings_eerie", "glass_chimes"] },
  { id: "a-cw-02", filename: "mus_chrono_explore_loop_01", category: "loop", duration: "2:24", bpm: 85, key: "Bbm", stems: ["synth_arp_slow", "duduk_melody", "bass_fretless", "perc_sand"] },
  { id: "a-cw-03", filename: "mus_chrono_explore_loop_02_rift", category: "loop", duration: "2:24", bpm: 85, key: "Bbm", stems: ["synth_glitch", "duduk_distorted", "bass_warp", "perc_reverse"] },
  { id: "a-cw-04", filename: "mus_chrono_combat_loop_lo", category: "loop", duration: "1:12", bpm: 140, key: "Bbm", stems: ["perc_wardrums", "strings_staccato", "synth_growl", "bass_808"] },
  { id: "a-cw-05", filename: "mus_chrono_combat_loop_hi", category: "loop", duration: "1:12", bpm: 140, key: "Bbm", stems: ["perc_wardrums", "brass_dissonant", "strings_fff", "synth_screech", "taiko_ensemble"] },
  { id: "a-cw-06", filename: "mus_chrono_transition_explore_to_combat", category: "transition", duration: "0:04", bpm: 140, key: "Bbm", stems: ["time_whoosh", "perc_riser"] },
  { id: "a-cw-07", filename: "mus_chrono_transition_combat_to_explore", category: "transition", duration: "0:06", bpm: 85, key: "Bbm", stems: ["time_reverse_whoosh", "strings_descend"] },
  { id: "a-cw-08", filename: "mus_chrono_stinger_time_rift", category: "stinger", duration: "0:03", bpm: 85, key: "Bbm", stems: ["glass_shatter_pitched", "synth_warp"] },
  { id: "a-cw-09", filename: "mus_chrono_stinger_fossil_reveal", category: "stinger", duration: "0:04", bpm: 85, key: "Bbm", stems: ["choir_awe", "harp_cascade", "bell_resonant"] },
  { id: "a-cw-10", filename: "mus_chrono_ending_01", category: "ending", duration: "0:18", bpm: 85, key: "Bbm", stems: ["strings_hopeful", "synth_crystal", "duduk_farewell"] },
  { id: "a-cw-11", filename: "mus_chrono_layer_sandstorm", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["wind_howl_tonal", "sand_whisper"] },
  { id: "a-cw-12", filename: "mus_chrono_layer_rift_proximity", category: "ambient", duration: "4:00", bpm: 0, key: "-", stems: ["drone_temporal", "electric_crackle_tuned"] },
];

const chronoWastesNodes: Node[] = [
  { id: "cw-intro", type: "musicState", position: { x: 60, y: 240 }, data: { label: "Wastes Intro", intensity: 15, looping: false, stems: ["synth_time_stretch", "strings_eerie", "glass_chimes"], asset: "mus_chrono_intro_01" } },
  { id: "cw-explore", type: "musicState", position: { x: 340, y: 160 }, data: { label: "Desert Traverse", intensity: 30, looping: true, stems: ["synth_arp_slow", "duduk_melody", "bass_fretless", "perc_sand"], asset: "mus_chrono_explore_loop_01" } },
  { id: "cw-rift-explore", type: "musicState", position: { x: 340, y: 380 }, data: { label: "Near Time Rift", intensity: 45, looping: true, stems: ["synth_glitch", "duduk_distorted", "bass_warp", "perc_reverse"], asset: "mus_chrono_explore_loop_02_rift" } },
  { id: "cw-param-rift", type: "parameter", position: { x: 60, y: 430 }, data: { label: "RiftProximity", paramName: "RTPC_RiftProximity", minValue: 0, maxValue: 100, defaultValue: 0, description: "Distance to nearest temporal rift. Crossfades explore variants and drives glitch FX intensity." } },
  { id: "cw-trans-to-combat", type: "transition", position: { x: 620, y: 160 }, data: { label: "→ Combat", duration: 4000, syncPoint: "next-bar", fadeType: "crossfade" } },
  { id: "cw-combat-lo", type: "musicState", position: { x: 880, y: 80 }, data: { label: "Dino Encounter", intensity: 65, looping: true, stems: ["perc_wardrums", "strings_staccato", "synth_growl", "bass_808"], asset: "mus_chrono_combat_loop_lo" } },
  { id: "cw-combat-hi", type: "musicState", position: { x: 880, y: 300 }, data: { label: "Temporal Beast", intensity: 95, looping: true, stems: ["perc_wardrums", "brass_dissonant", "strings_fff", "synth_screech", "taiko_ensemble"], asset: "mus_chrono_combat_loop_hi" } },
  { id: "cw-trans-to-explore", type: "transition", position: { x: 1120, y: 200 }, data: { label: "→ Explore", duration: 6000, syncPoint: "next-bar", fadeType: "bridge" } },
  { id: "cw-stinger-rift", type: "stinger", position: { x: 620, y: 440 }, data: { label: "Rift Opens", trigger: "OnTimeRiftActivate", asset: "mus_chrono_stinger_time_rift", priority: "critical" } },
  { id: "cw-stinger-fossil", type: "stinger", position: { x: 620, y: 560 }, data: { label: "Fossil Revealed", trigger: "OnFossilDiscovery", asset: "mus_chrono_stinger_fossil_reveal", priority: "high" } },
  { id: "cw-ending", type: "musicState", position: { x: 1120, y: 400 }, data: { label: "Rift Sealed", intensity: 35, looping: false, stems: ["strings_hopeful", "synth_crystal", "duduk_farewell"], asset: "mus_chrono_ending_01" } },
];

const chronoWastesEdges: Edge[] = [
  { id: "e-cw-1", source: "cw-intro", target: "cw-explore", animated: true, label: "Auto" },
  { id: "e-cw-2", source: "cw-explore", target: "cw-rift-explore", animated: true, label: "RTPC > 50", style: { stroke: "#a855f7" } },
  { id: "e-cw-3", source: "cw-rift-explore", target: "cw-explore", animated: true, label: "RTPC < 30", style: { stroke: "#4ecdc4" } },
  { id: "e-cw-4", source: "cw-explore", target: "cw-trans-to-combat", animated: true },
  { id: "e-cw-5", source: "cw-rift-explore", target: "cw-trans-to-combat", animated: true },
  { id: "e-cw-6", source: "cw-trans-to-combat", target: "cw-combat-lo", animated: true },
  { id: "e-cw-7", source: "cw-combat-lo", target: "cw-combat-hi", animated: true, label: "Boss phase 2", style: { stroke: "#e94560" } },
  { id: "e-cw-8", source: "cw-combat-hi", target: "cw-trans-to-explore", animated: true, label: "Enemies cleared" },
  { id: "e-cw-9", source: "cw-combat-lo", target: "cw-trans-to-explore", animated: true, label: "Enemies cleared" },
  { id: "e-cw-10", source: "cw-trans-to-explore", target: "cw-explore", animated: true },
  { id: "e-cw-11", source: "cw-combat-hi", target: "cw-ending", animated: true, label: "Chrono-Rex defeated" },
];

// ─── LEVEL 4: NEON UNDERGROWTH ──────────────────────────────────────────────

const neonUndergrowthAssets: MusicAsset[] = [
  { id: "a-nu-01", filename: "mus_neon_intro_01", category: "intro", duration: "0:20", bpm: 100, key: "Em", stems: ["synth_biolum", "flute_ethereal", "rain_tuned"] },
  { id: "a-nu-02", filename: "mus_neon_explore_loop_01", category: "loop", duration: "2:00", bpm: 100, key: "Em", stems: ["kalimba_pattern", "synth_lush", "bass_warm", "perc_organic"] },
  { id: "a-nu-03", filename: "mus_neon_puzzle_loop_01", category: "loop", duration: "1:20", bpm: 100, key: "Em", stems: ["music_box_melody", "synth_minimal", "bass_pizz"] },
  { id: "a-nu-04", filename: "mus_neon_combat_loop_lo", category: "loop", duration: "0:56", bpm: 135, key: "Em", stems: ["perc_jungle", "synth_acid", "bass_growl", "strings_agitato"] },
  { id: "a-nu-05", filename: "mus_neon_combat_loop_hi", category: "loop", duration: "0:56", bpm: 135, key: "Em", stems: ["perc_jungle", "synth_acid", "brass_swarm", "choir_primal", "strings_fff"] },
  { id: "a-nu-06", filename: "mus_neon_transition_explore_to_puzzle", category: "transition", duration: "0:03", bpm: 100, key: "Em", stems: ["chime_descend", "synth_morph"] },
  { id: "a-nu-07", filename: "mus_neon_transition_any_to_combat", category: "transition", duration: "0:02", bpm: 135, key: "Em", stems: ["roar_musical", "perc_slam"] },
  { id: "a-nu-08", filename: "mus_neon_stinger_spore_burst", category: "stinger", duration: "0:03", bpm: 100, key: "Em", stems: ["synth_bloom", "chime_scatter"] },
  { id: "a-nu-09", filename: "mus_neon_ending_01", category: "ending", duration: "0:14", bpm: 100, key: "Em", stems: ["kalimba_resolve", "synth_glow", "flute_farewell"] },
  { id: "a-nu-10", filename: "mus_neon_layer_biolum_pulse", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_bioluminescent", "pulse_organic"] },
];

const neonUndergrowthNodes: Node[] = [
  { id: "nu-intro", type: "musicState", position: { x: 60, y: 240 }, data: { label: "Canopy Descent", intensity: 15, looping: false, stems: ["synth_biolum", "flute_ethereal", "rain_tuned"], asset: "mus_neon_intro_01" } },
  { id: "nu-explore", type: "musicState", position: { x: 340, y: 160 }, data: { label: "Jungle Path", intensity: 35, looping: true, stems: ["kalimba_pattern", "synth_lush", "bass_warm", "perc_organic"], asset: "mus_neon_explore_loop_01" } },
  { id: "nu-trans-to-puzzle", type: "transition", position: { x: 340, y: 380 }, data: { label: "→ Puzzle", duration: 3000, syncPoint: "next-bar", fadeType: "crossfade" } },
  { id: "nu-puzzle", type: "musicState", position: { x: 600, y: 380 }, data: { label: "Spore Puzzle", intensity: 20, looping: true, stems: ["music_box_melody", "synth_minimal", "bass_pizz"], asset: "mus_neon_puzzle_loop_01" } },
  { id: "nu-trans-to-combat", type: "transition", position: { x: 600, y: 160 }, data: { label: "→ Combat", duration: 2000, syncPoint: "immediate", fadeType: "sting" } },
  { id: "nu-combat-lo", type: "musicState", position: { x: 870, y: 80 }, data: { label: "Undergrowth Fight", intensity: 70, looping: true, stems: ["perc_jungle", "synth_acid", "bass_growl", "strings_agitato"], asset: "mus_neon_combat_loop_lo" } },
  { id: "nu-combat-hi", type: "musicState", position: { x: 870, y: 280 }, data: { label: "Apex Predator", intensity: 95, looping: true, stems: ["perc_jungle", "synth_acid", "brass_swarm", "choir_primal", "strings_fff"], asset: "mus_neon_combat_loop_hi" } },
  { id: "nu-stinger-spore", type: "stinger", position: { x: 600, y: 540 }, data: { label: "Spore Burst", trigger: "OnSporePuzzleSolve", asset: "mus_neon_stinger_spore_burst", priority: "medium" } },
  { id: "nu-ending", type: "musicState", position: { x: 1100, y: 240 }, data: { label: "Canopy Ascent", intensity: 30, looping: false, stems: ["kalimba_resolve", "synth_glow", "flute_farewell"], asset: "mus_neon_ending_01" } },
];

const neonUndergrowthEdges: Edge[] = [
  { id: "e-nu-1", source: "nu-intro", target: "nu-explore", animated: true, label: "Auto" },
  { id: "e-nu-2", source: "nu-explore", target: "nu-trans-to-puzzle", animated: true, label: "Enter spore grove" },
  { id: "e-nu-3", source: "nu-trans-to-puzzle", target: "nu-puzzle", animated: true },
  { id: "e-nu-4", source: "nu-puzzle", target: "nu-explore", animated: true, label: "Exit grove" },
  { id: "e-nu-5", source: "nu-explore", target: "nu-trans-to-combat", animated: true },
  { id: "e-nu-6", source: "nu-puzzle", target: "nu-trans-to-combat", animated: true, label: "Ambush!" },
  { id: "e-nu-7", source: "nu-trans-to-combat", target: "nu-combat-lo", animated: true },
  { id: "e-nu-8", source: "nu-combat-lo", target: "nu-combat-hi", animated: true, label: "RTPC > 70", style: { stroke: "#e94560" } },
  { id: "e-nu-9", source: "nu-combat-hi", target: "nu-combat-lo", animated: true, label: "RTPC < 35", style: { stroke: "#4ecdc4" } },
  { id: "e-nu-10", source: "nu-combat-lo", target: "nu-explore", animated: true, label: "Enemies cleared" },
  { id: "e-nu-11", source: "nu-combat-hi", target: "nu-ending", animated: true, label: "Hive Queen defeated" },
];

// ─── LEVEL 5: OBSIDIAN SPIRES ───────────────────────────────────────────────

const obsidianSpiresAssets: MusicAsset[] = [
  { id: "a-os-01", filename: "mus_obsidian_intro_01", category: "intro", duration: "0:36", bpm: 75, key: "Cm", stems: ["choir_dark_latin", "organ_deep", "strings_lament", "bell_funeral"] },
  { id: "a-os-02", filename: "mus_obsidian_explore_loop_01", category: "loop", duration: "2:40", bpm: 75, key: "Cm", stems: ["organ_ostinato", "strings_sul_pont", "synth_dark_pad", "perc_stone"] },
  { id: "a-os-03", filename: "mus_obsidian_combat_loop_lo", category: "loop", duration: "1:20", bpm: 160, key: "Cm", stems: ["taiko_massive", "brass_fanfare_dark", "strings_furioso", "synth_bass_dist"] },
  { id: "a-os-04", filename: "mus_obsidian_combat_loop_hi", category: "loop", duration: "1:20", bpm: 160, key: "Cm", stems: ["taiko_massive", "brass_fanfare_dark", "choir_full_fff", "organ_power", "strings_furioso", "synth_chaos"] },
  { id: "a-os-05", filename: "mus_obsidian_boss_intro", category: "intro", duration: "0:16", bpm: 160, key: "Cm", stems: ["choir_reveal", "brass_doom", "perc_earthquake"] },
  { id: "a-os-06", filename: "mus_obsidian_boss_loop_phase1", category: "loop", duration: "1:36", bpm: 160, key: "Cm", stems: ["everything_phase1"] },
  { id: "a-os-07", filename: "mus_obsidian_boss_loop_phase2", category: "loop", duration: "1:36", bpm: 175, key: "Cm", stems: ["everything_phase2_elevated"] },
  { id: "a-os-08", filename: "mus_obsidian_transition_explore_to_combat", category: "transition", duration: "0:04", bpm: 160, key: "Cm", stems: ["brass_doom_rise", "taiko_fill"] },
  { id: "a-os-09", filename: "mus_obsidian_stinger_spire_crumble", category: "stinger", duration: "0:05", bpm: 75, key: "Cm", stems: ["perc_rockfall_tuned", "brass_collapse", "choir_gasp"] },
  { id: "a-os-10", filename: "mus_obsidian_ending_01", category: "ending", duration: "0:24", bpm: 75, key: "Cm", stems: ["strings_redemption", "choir_major_resolve", "organ_final", "bell_hope"] },
  { id: "a-os-11", filename: "mus_obsidian_layer_lava_amb", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_magma", "bubble_pitch", "heat_shimmer_tonal"] },
];

const obsidianSpiresNodes: Node[] = [
  { id: "os-intro", type: "musicState", position: { x: 60, y: 240 }, data: { label: "Spire Approach", intensity: 25, looping: false, stems: ["choir_dark_latin", "organ_deep", "strings_lament", "bell_funeral"], asset: "mus_obsidian_intro_01" } },
  { id: "os-explore", type: "musicState", position: { x: 340, y: 240 }, data: { label: "Volcanic Halls", intensity: 40, looping: true, stems: ["organ_ostinato", "strings_sul_pont", "synth_dark_pad", "perc_stone"], asset: "mus_obsidian_explore_loop_01" } },
  { id: "os-trans-to-combat", type: "transition", position: { x: 600, y: 120 }, data: { label: "→ Combat", duration: 4000, syncPoint: "next-bar", fadeType: "crossfade" } },
  { id: "os-combat-lo", type: "musicState", position: { x: 860, y: 60 }, data: { label: "Spire Defense", intensity: 70, looping: true, stems: ["taiko_massive", "brass_fanfare_dark", "strings_furioso", "synth_bass_dist"], asset: "mus_obsidian_combat_loop_lo" } },
  { id: "os-combat-hi", type: "musicState", position: { x: 860, y: 240 }, data: { label: "Inferno Rage", intensity: 90, looping: true, stems: ["taiko_massive", "brass_fanfare_dark", "choir_full_fff", "organ_power", "strings_furioso", "synth_chaos"], asset: "mus_obsidian_combat_loop_hi" } },
  { id: "os-boss-intro", type: "musicState", position: { x: 600, y: 400 }, data: { label: "Tyrant Reveal", intensity: 80, looping: false, stems: ["choir_reveal", "brass_doom", "perc_earthquake"], asset: "mus_obsidian_boss_intro" } },
  { id: "os-boss-p1", type: "musicState", position: { x: 860, y: 420 }, data: { label: "Tyrant Phase 1", intensity: 90, looping: true, stems: ["everything_phase1"], asset: "mus_obsidian_boss_loop_phase1" } },
  { id: "os-boss-p2", type: "musicState", position: { x: 1100, y: 420 }, data: { label: "Tyrant Phase 2", intensity: 100, looping: true, stems: ["everything_phase2_elevated"], asset: "mus_obsidian_boss_loop_phase2" } },
  { id: "os-param-lava", type: "parameter", position: { x: 60, y: 420 }, data: { label: "LavaIntensity", paramName: "RTPC_LavaIntensity", minValue: 0, maxValue: 100, defaultValue: 20, description: "Driven by eruption phase timer. Affects ambient layer volume and exploration tension." } },
  { id: "os-stinger-crumble", type: "stinger", position: { x: 340, y: 500 }, data: { label: "Spire Crumbles", trigger: "OnSpireCollapse", asset: "mus_obsidian_stinger_spire_crumble", priority: "critical" } },
  { id: "os-ending", type: "musicState", position: { x: 1100, y: 240 }, data: { label: "Dawn After Fire", intensity: 30, looping: false, stems: ["strings_redemption", "choir_major_resolve", "organ_final", "bell_hope"], asset: "mus_obsidian_ending_01" } },
];

const obsidianSpiresEdges: Edge[] = [
  { id: "e-os-1", source: "os-intro", target: "os-explore", animated: true, label: "Auto" },
  { id: "e-os-2", source: "os-explore", target: "os-trans-to-combat", animated: true },
  { id: "e-os-3", source: "os-trans-to-combat", target: "os-combat-lo", animated: true },
  { id: "e-os-4", source: "os-combat-lo", target: "os-combat-hi", animated: true, label: "RTPC > 65", style: { stroke: "#e94560" } },
  { id: "e-os-5", source: "os-combat-hi", target: "os-combat-lo", animated: true, label: "RTPC < 35", style: { stroke: "#4ecdc4" } },
  { id: "e-os-6", source: "os-combat-lo", target: "os-explore", animated: true, label: "Enemies cleared" },
  { id: "e-os-7", source: "os-explore", target: "os-boss-intro", animated: true, label: "Enter throne room" },
  { id: "e-os-8", source: "os-boss-intro", target: "os-boss-p1", animated: true, label: "Auto" },
  { id: "e-os-9", source: "os-boss-p1", target: "os-boss-p2", animated: true, label: "HP < 50%", style: { stroke: "#e94560" } },
  { id: "e-os-10", source: "os-boss-p2", target: "os-ending", animated: true, label: "Obsidian Tyrant defeated" },
];

// ─── LEVEL 6: THE RIFT CITADEL ──────────────────────────────────────────────

const riftCitadelAssets: MusicAsset[] = [
  { id: "a-rc-01", filename: "mus_citadel_intro_01", category: "intro", duration: "0:40", bpm: 95, key: "Am", stems: ["orchestra_full_slow", "synth_celestial", "choir_ancient"] },
  { id: "a-rc-02", filename: "mus_citadel_explore_loop_01", category: "loop", duration: "2:48", bpm: 95, key: "Am", stems: ["strings_noble", "synth_shimmer", "harp_arpeggiate", "perc_crystal"] },
  { id: "a-rc-03", filename: "mus_citadel_combat_loop_lo", category: "loop", duration: "1:04", bpm: 170, key: "Am", stems: ["orchestra_action", "synth_power", "perc_military", "bass_cinematic"] },
  { id: "a-rc-04", filename: "mus_citadel_combat_loop_hi", category: "loop", duration: "1:04", bpm: 170, key: "Am", stems: ["orchestra_full_fff", "synth_all", "choir_epic", "perc_everything", "bass_cinematic"] },
  { id: "a-rc-05", filename: "mus_citadel_final_boss_intro", category: "intro", duration: "0:24", bpm: 170, key: "Am", stems: ["choir_prophecy", "orchestra_destiny", "synth_singularity"] },
  { id: "a-rc-06", filename: "mus_citadel_final_boss_p1", category: "loop", duration: "2:00", bpm: 170, key: "Am", stems: ["everything_final_p1"] },
  { id: "a-rc-07", filename: "mus_citadel_final_boss_p2", category: "loop", duration: "2:00", bpm: 185, key: "Am", stems: ["everything_final_p2_ascended"] },
  { id: "a-rc-08", filename: "mus_citadel_final_boss_p3", category: "loop", duration: "2:00", bpm: 200, key: "Am", stems: ["everything_final_p3_transcendent"] },
  { id: "a-rc-09", filename: "mus_citadel_victory_01", category: "ending", duration: "1:20", bpm: 95, key: "A", stems: ["orchestra_triumph", "choir_victory", "synth_aurora", "bell_celebration"] },
  { id: "a-rc-10", filename: "mus_citadel_stinger_gate_open", category: "stinger", duration: "0:05", bpm: 95, key: "Am", stems: ["brass_herald", "choir_gate", "perc_thunder"] },
  { id: "a-rc-11", filename: "mus_citadel_layer_void_amb", category: "layer", duration: "4:00", bpm: 0, key: "-", stems: ["drone_dimensional", "whisper_ancient", "crystal_resonance"] },
];

const riftCitadelNodes: Node[] = [
  { id: "rc-intro", type: "musicState", position: { x: 60, y: 280 }, data: { label: "Citadel Gates", intensity: 30, looping: false, stems: ["orchestra_full_slow", "synth_celestial", "choir_ancient"], asset: "mus_citadel_intro_01" } },
  { id: "rc-explore", type: "musicState", position: { x: 340, y: 180 }, data: { label: "Ancient Halls", intensity: 35, looping: true, stems: ["strings_noble", "synth_shimmer", "harp_arpeggiate", "perc_crystal"], asset: "mus_citadel_explore_loop_01" } },
  { id: "rc-trans-to-combat", type: "transition", position: { x: 600, y: 100 }, data: { label: "→ Combat", duration: 3000, syncPoint: "next-bar", fadeType: "crossfade" } },
  { id: "rc-combat-lo", type: "musicState", position: { x: 860, y: 40 }, data: { label: "Citadel Clash", intensity: 70, looping: true, stems: ["orchestra_action", "synth_power", "perc_military", "bass_cinematic"], asset: "mus_citadel_combat_loop_lo" } },
  { id: "rc-combat-hi", type: "musicState", position: { x: 860, y: 220 }, data: { label: "Rift Unleashed", intensity: 90, looping: true, stems: ["orchestra_full_fff", "synth_all", "choir_epic", "perc_everything", "bass_cinematic"], asset: "mus_citadel_combat_loop_hi" } },
  { id: "rc-boss-intro", type: "musicState", position: { x: 340, y: 420 }, data: { label: "The Convergence", intensity: 85, looping: false, stems: ["choir_prophecy", "orchestra_destiny", "synth_singularity"], asset: "mus_citadel_final_boss_intro" } },
  { id: "rc-boss-p1", type: "musicState", position: { x: 600, y: 420 }, data: { label: "Final Boss P1", intensity: 90, looping: true, stems: ["everything_final_p1"], asset: "mus_citadel_final_boss_p1" } },
  { id: "rc-boss-p2", type: "musicState", position: { x: 860, y: 420 }, data: { label: "Final Boss P2", intensity: 95, looping: true, stems: ["everything_final_p2_ascended"], asset: "mus_citadel_final_boss_p2" } },
  { id: "rc-boss-p3", type: "musicState", position: { x: 1100, y: 420 }, data: { label: "Final Boss P3", intensity: 100, looping: true, stems: ["everything_final_p3_transcendent"], asset: "mus_citadel_final_boss_p3" } },
  { id: "rc-stinger-gate", type: "stinger", position: { x: 60, y: 460 }, data: { label: "Gate Unsealed", trigger: "OnCitadelGateOpen", asset: "mus_citadel_stinger_gate_open", priority: "critical" } },
  { id: "rc-victory", type: "musicState", position: { x: 1100, y: 280 }, data: { label: "Victory", intensity: 60, looping: false, stems: ["orchestra_triumph", "choir_victory", "synth_aurora", "bell_celebration"], asset: "mus_citadel_victory_01" } },
];

const riftCitadelEdges: Edge[] = [
  { id: "e-rc-1", source: "rc-intro", target: "rc-explore", animated: true, label: "Auto" },
  { id: "e-rc-2", source: "rc-explore", target: "rc-trans-to-combat", animated: true },
  { id: "e-rc-3", source: "rc-trans-to-combat", target: "rc-combat-lo", animated: true },
  { id: "e-rc-4", source: "rc-combat-lo", target: "rc-combat-hi", animated: true, label: "RTPC > 60", style: { stroke: "#e94560" } },
  { id: "e-rc-5", source: "rc-combat-hi", target: "rc-combat-lo", animated: true, label: "RTPC < 30", style: { stroke: "#4ecdc4" } },
  { id: "e-rc-6", source: "rc-combat-lo", target: "rc-explore", animated: true, label: "Enemies cleared" },
  { id: "e-rc-7", source: "rc-explore", target: "rc-boss-intro", animated: true, label: "Enter sanctum" },
  { id: "e-rc-8", source: "rc-boss-intro", target: "rc-boss-p1", animated: true, label: "Auto" },
  { id: "e-rc-9", source: "rc-boss-p1", target: "rc-boss-p2", animated: true, label: "HP < 66%", style: { stroke: "#e94560" } },
  { id: "e-rc-10", source: "rc-boss-p2", target: "rc-boss-p3", animated: true, label: "HP < 33%", style: { stroke: "#e94560" } },
  { id: "e-rc-11", source: "rc-boss-p3", target: "rc-victory", animated: true, label: "Rift Lord defeated" },
];

// ─── EXPORT ─────────────────────────────────────────────────────────────────

export const levels: GameLevel[] = [
  { id: "primordial-nexus", name: "Primordial Nexus", subtitle: "Where Scales Meet Stars", region: "Act I — The Awakening", nodes: primordialNexusNodes, edges: primordialNexusEdges, assets: primordialNexusAssets },
  { id: "velociforge", name: "Velociforge", subtitle: "The Raptor Foundry", region: "Act I — The Awakening", nodes: velociforgeNodes, edges: velociforgeEdges, assets: velociforgeAssets },
  { id: "chrono-wastes", name: "Chrono Wastes", subtitle: "Sands of Shattered Time", region: "Act II — The Fracture", nodes: chronoWastesNodes, edges: chronoWastesEdges, assets: chronoWastesAssets },
  { id: "neon-undergrowth", name: "Neon Undergrowth", subtitle: "Bioluminescent Depths", region: "Act II — The Fracture", nodes: neonUndergrowthNodes, edges: neonUndergrowthEdges, assets: neonUndergrowthAssets },
  { id: "obsidian-spires", name: "Obsidian Spires", subtitle: "Throne of the Burning King", region: "Act III — The Convergence", nodes: obsidianSpiresNodes, edges: obsidianSpiresEdges, assets: obsidianSpiresAssets },
  { id: "rift-citadel", name: "The Rift Citadel", subtitle: "Where All Timelines End", region: "Act III — The Convergence", nodes: riftCitadelNodes, edges: riftCitadelEdges, assets: riftCitadelAssets },
];
