export interface MusicStateData {
  label: string;
  intensity: number; // 0-100
  looping: boolean;
  stems: string[];
}

export interface TransitionData {
  label: string;
  duration: number; // ms
  syncPoint: "immediate" | "next-bar" | "next-beat" | "custom";
  fadeType: "crossfade" | "sting" | "cut" | "bridge";
}
