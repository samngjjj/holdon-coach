// ============================================================
// HoldOn Coach — RPE Input (Rate of Perceived Exertion)
// 呈現雙重漸進配重與防護邏輯，點擊「有點硬」立即自動降重！
// ============================================================

'use client';

import { motion } from 'framer-motion';

interface RPEInputProps {
  onSubmit: (rpe: number) => void;
  onCancel: () => void;
}

const RPE_OPTIONS = [
  {
    value: 6,
    label: '超輕鬆',
    sub: '維持重量，下組次數自動上調',
    emoji: '😴',
    color: 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25',
  },
  {
    value: 7,
    label: '輕鬆',
    sub: '先別加重！優先將次數推至 12 下',
    emoji: '😎',
    color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25',
  },
  {
    value: 8,
    label: '剛好（安全肌肥大）',
    sub: '連續兩組滿 12 下才解鎖升重',
    emoji: '💪',
    color: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 hover:bg-emerald-500/30',
  },
  {
    value: 9,
    label: '有點硬（吃力）',
    sub: '🛑 教練先別加！自動為你降重一檔保護關節',
    emoji: '😤',
    color: 'bg-orange-500/20 text-orange-200 border-orange-500/50 hover:bg-orange-500/30 ring-1 ring-orange-500/30',
  },
  {
    value: 10,
    label: '極限（力竭邊緣）',
    sub: '⚠️ 教練強制踩煞車！降重 20% 延長休息',
    emoji: '🫠',
    color: 'bg-red-500/20 text-red-200 border-red-500/50 hover:bg-red-500/30 ring-1 ring-red-500/30',
  },
];

export default function RPEInput({ onSubmit, onCancel }: RPEInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white text-center mb-1">
          這組推起來感覺如何？
        </h3>
        <p className="text-xs text-zinc-400 text-center mb-5">
          感知自覺用力程度（RPE）— 教練依此動態調整配重
        </p>

        <div className="space-y-2.5">
          {RPE_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubmit(option.value)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border text-left transition-all ${option.color}`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">RPE {option.value}</span>
                  <span className="text-xs font-semibold">{option.label}</span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-0.5 opacity-90 truncate">
                  {option.sub}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 py-2 text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          取消
        </button>
      </motion.div>
    </motion.div>
  );
}
