// ============================================================
// HoldOn Coach — Pain Input (Clean White Theme)
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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={() => setShowPainInput(false)}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-lg font-black text-slate-900 mt-2">
            哪裡不舒服或卡卡的？
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {safetyTier === 0
              ? '教練會自動切換對握中立握法並降重 20% 保護關節'
              : '持續不適將強制更換為固定軌跡機械式動作'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PAIN_AREAS.map((area) => (
            <motion.button
              key={area.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(area.label)}
              className="py-3 px-2 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-center transition-colors shadow-2xs"
            >
              <span className="text-lg block mb-0.5">{area.emoji}</span>
              <span className="text-xs font-bold text-slate-700">{area.label}</span>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => setShowPainInput(false)}
          className="w-full mt-4 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          取消
        </button>
      </motion.div>
    </motion.div>
  );
}
