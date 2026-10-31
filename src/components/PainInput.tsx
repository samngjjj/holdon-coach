// ============================================================
// HoldOn Coach — Pain Input (Body Area Selector)
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';

const PAIN_AREAS = [
  { id: 'left_shoulder', label: '左肩', emoji: '🦾' },
  { id: 'right_shoulder', label: '右肩', emoji: '🦾' },
  { id: 'left_elbow', label: '左手肘', emoji: '💪' },
  { id: 'right_elbow', label: '右手肘', emoji: '💪' },
  { id: 'left_wrist', label: '左手腕', emoji: '✋' },
  { id: 'right_wrist', label: '右手腕', emoji: '✋' },
  { id: 'lower_back', label: '下背', emoji: '🔙' },
  { id: 'chest', label: '胸口', emoji: '🫁' },
  { id: 'neck', label: '脖子', emoji: '🦒' },
];

export default function PainInput() {
  const { reportPain, setShowPainInput, safetyTier } = useWorkoutStore();

  const handleSelect = (area: string) => {
    reportPain(area);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex items-end justify-center z-40 p-4"
      onClick={() => setShowPainInput(false)}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 border border-amber-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-lg font-bold text-amber-400 mt-2">
            哪裡不舒服？
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {safetyTier === 0
              ? '教練會自動調整握法並降重保護你'
              : '持續不適將直接更換為機械式動作'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PAIN_AREAS.map((area) => (
            <motion.button
              key={area.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(area.label)}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 active:bg-amber-500/10 active:border-amber-500/30 transition-colors"
            >
              <span className="text-xl">{area.emoji}</span>
              <span className="text-xs text-zinc-400">{area.label}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => setShowPainInput(false)}
          className="w-full mt-4 py-2.5 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          取消，沒事
        </button>
      </motion.div>
    </motion.div>
  );
}
