// ============================================================
// HoldOn Coach — RPE Input Modal (Clean White Theme)
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
    color: 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100',
  },
  {
    value: 7,
    label: '輕鬆',
    sub: '先別加重！優先將次數推至 12 下',
    emoji: '😎',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100',
  },
  {
    value: 8,
    label: '剛好（安全肌肥大）',
    sub: '連續兩組滿 12 下才解鎖升重',
    emoji: '💪',
    color: 'bg-emerald-100 text-emerald-950 border-[#00D09C] hover:bg-emerald-150 ring-1 ring-[#00D09C]',
  },
  {
    value: 9,
    label: '有點硬（吃力）',
    sub: '🛑 教練先別加！自動為你降重一檔保護關節',
    emoji: '😤',
    color: 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100 ring-1 ring-amber-300',
  },
  {
    value: 10,
    label: '極限（力竭邊緣）',
    sub: '⚠️ 教練強制踩煞車！降重 20% 延長休息',
    emoji: '🫠',
    color: 'bg-rose-50 text-rose-950 border-rose-300 hover:bg-rose-100 ring-1 ring-rose-300',
  },
];

export default function RPEInput({ onSubmit, onCancel }: RPEInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-black text-slate-900 text-center mb-1">
          這組推起來感覺如何？
        </h3>
        <p className="text-xs text-slate-400 text-center mb-5 font-medium">
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
                  <span className="font-extrabold text-sm">RPE {option.value}</span>
                  <span className="text-xs font-bold">{option.label}</span>
                </div>
                <p className="text-[11px] opacity-80 mt-0.5 truncate">
                  {option.sub}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="w-full mt-4 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors"
        >
          取消
        </button>
      </motion.div>
    </motion.div>
  );
}
