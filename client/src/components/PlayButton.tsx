import { useState, useEffect, useCallback } from "react";
import { auditionAsset, stopAudition, getPlayingAssetId, type AssetCategory } from "../audio/synth";

interface PlayButtonProps {
  /** Unique ID for this audition (node id works fine) */
  nodeId: string;
  /** Which synth category to use */
  category: AssetCategory;
  /** Musical key, e.g. "Dm", "F#m" */
  musicalKey?: string;
  /** BPM for rhythmic categories */
  bpm?: number;
  /** Optional: for transitions, plays pre-roll → transition → post-roll */
  preRoll?: { category: AssetCategory; durationMs: number };
  postRoll?: { category: AssetCategory; durationMs: number };
  /** Size variant */
  size?: "sm" | "md";
}

export function PlayButton({
  nodeId,
  category,
  musicalKey = "Am",
  bpm = 120,
  preRoll,
  postRoll,
  size = "sm",
}: PlayButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"idle" | "pre" | "main" | "post">("idle");

  // Poll for external stop (e.g. another node started playing)
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const current = getPlayingAssetId();
      if (current !== nodeId && current !== `${nodeId}-pre` && current !== `${nodeId}-post`) {
        setPlaying(false);
        setPhase("idle");
      }
    }, 200);
    return () => clearInterval(interval);
  }, [playing, nodeId]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (playing) {
        stopAudition();
        setPlaying(false);
        setPhase("idle");
        return;
      }

      setPlaying(true);

      if (preRoll) {
        // Pre-roll phase: play source state context
        setPhase("pre");
        auditionAsset({ id: `${nodeId}-pre`, category: preRoll.category, key: musicalKey, bpm });

        setTimeout(() => {
          // Main phase: play the transition itself
          setPhase("main");
          auditionAsset({ id: nodeId, category, key: musicalKey, bpm });

          if (postRoll) {
            setTimeout(() => {
              // Post-roll phase: play destination state context
              setPhase("post");
              auditionAsset({ id: `${nodeId}-post`, category: postRoll.category, key: musicalKey, bpm });

              setTimeout(() => {
                setPlaying(false);
                setPhase("idle");
              }, postRoll.durationMs);
            }, 1800); // transition duration
          } else {
            setTimeout(() => {
              setPlaying(false);
              setPhase("idle");
            }, 1800);
          }
        }, preRoll.durationMs);
      } else {
        // Simple play — just audition this category
        setPhase("main");
        const stillPlaying = auditionAsset({ id: nodeId, category, key: musicalKey, bpm });
        if (!stillPlaying) {
          setPlaying(false);
          setPhase("idle");
        } else {
          // Auto-reset when done
          const durations: Record<AssetCategory, number> = {
            intro: 3200,
            loop: ((60 / bpm) * 8 + 0.5) * 1000,
            ending: 4200,
            transition: 1700,
            stinger: 1000,
            layer: 5200,
            ambient: 5200,
          };
          setTimeout(() => {
            setPlaying(false);
            setPhase("idle");
          }, durations[category]);
        }
      }
    },
    [playing, nodeId, category, musicalKey, bpm, preRoll, postRoll],
  );

  const dim = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const iconSize = size === "sm" ? 8 : 10;

  return (
    <button
      onClick={handleClick}
      className={`${dim} rounded-full flex items-center justify-center transition-all duration-150 ${
        playing
          ? "bg-canvas-highlight/30 text-canvas-highlight ring-1 ring-canvas-highlight/50 animate-pulse"
          : "bg-canvas-bg/60 text-canvas-muted hover:text-canvas-highlight hover:bg-canvas-highlight/20"
      }`}
      title={playing ? `Stop (${phase})` : "Audition"}
    >
      {playing ? (
        // Stop icon (square)
        <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="currentColor">
          <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
        </svg>
      ) : (
        // Play icon (triangle)
        <svg width={iconSize} height={iconSize} viewBox="0 0 10 10" fill="currentColor">
          <polygon points="2,0.5 9.5,5 2,9.5" />
        </svg>
      )}
    </button>
  );
}
