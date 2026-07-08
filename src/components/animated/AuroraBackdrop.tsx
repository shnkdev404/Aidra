import { motion } from "motion/react";

/**
 * Subtle animated aurora — sage and gold orbs drifting behind hero content.
 * Editorial, not neon. Pointer-events off.
 */
export function AuroraBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.55 0.10 145 / 0.55), transparent 60%)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, oklch(0.75 0.13 82 / 0.5), transparent 60%)",
        }}
        animate={{ x: [0, -30, 20, 0], y: [0, -20, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.20 0.02 40) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
    </div>
  );
}
