import { useEffect, useRef, useState } from "react";

/**
 * Neko cat animation
 *
 * Sprite sheet and animation concept based on oneko.js by adryd325
 * https://github.com/adryd325/oneko.js
 *
 * Original Neko software (1989) by Naoshi Watanabe.
 * oneko.gif sprite from the classic X11 neko port.
 */

// Sprite positions from oneko.js (col, row) — each frame is 32x32px
const SPRITES = {
  idle: [[-3, -3]],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  alert: [[-7, -3]],
} as const;

type SpriteName = keyof typeof SPRITES;

const NEKO_SIZE = 32;

// Sequences: sleeping when no issues, grooming when issues exist
const IDLE_SEQUENCE: SpriteName[] = [
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "tired",
  "tired",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
  "sleeping",
];
const ACTIVE_SEQUENCE: SpriteName[] = [
  "idle",
  "idle",
  "idle",
  "idle",
  "alert",
  "alert",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "scratchSelf",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
  "idle",
];

type Props = {
  buttonX: number;
  buttonY: number;
  buttonSize: number;
  hasIssues: boolean;
  spriteUrl?: string;
  baseUrl: string;
};

export default function NekoButton({
  buttonX,
  buttonY,
  buttonSize,
  hasIssues,
  spriteUrl,
  baseUrl,
}: Props) {
  const url = spriteUrl ?? `${baseUrl}/oneko.gif`;

  const [bgPos, setBgPos] = useState(`${-3 * NEKO_SIZE}px ${-3 * NEKO_SIZE}px`);
  const seqIndexRef = useRef(0);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  // Cat sits centered on top of the button, clamped to viewport
  const catX = buttonX + buttonSize / 2 - NEKO_SIZE / 2;
  const catY = Math.max(0, buttonY - NEKO_SIZE + 6);

  // Debug: log position to confirm rendering
  // console.log('[Neko] rendering at', catX, catY, 'button at', buttonX, buttonY);

  useEffect(() => {
    seqIndexRef.current = 0;
    frameRef.current = 0;
  }, [hasIssues]);

  useEffect(() => {
    function tick(ts: number) {
      if (!lastTsRef.current) lastTsRef.current = ts;
      if (ts - lastTsRef.current > 150) {
        // ~6.5fps — slow, relaxed
        lastTsRef.current = ts;

        const seq = hasIssues ? ACTIVE_SEQUENCE : IDLE_SEQUENCE;
        const sName = seq[seqIndexRef.current % seq.length];
        const frames = SPRITES[sName] as readonly (readonly [number, number])[];
        const [col, row] = frames[frameRef.current % frames.length];
        setBgPos(`${col * NEKO_SIZE}px ${row * NEKO_SIZE}px`);

        frameRef.current += 1;
        // advance sequence every N frames per sprite
        if (frameRef.current >= frames.length) {
          frameRef.current = 0;
          seqIndexRef.current += 1;
          if (seqIndexRef.current >= seq.length) seqIndexRef.current = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasIssues]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: catX,
        top: catY,
        width: NEKO_SIZE,
        height: NEKO_SIZE,
        backgroundImage: `url(${url})`,
        backgroundPosition: bgPos,
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        imageRendering: "pixelated",
        pointerEvents: "none",
        zIndex: 1001,
      }}
    />
  );
}
