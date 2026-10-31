// ============================================================
// HoldOn Coach — Hard Limit Warning Modal
// Blocks dangerous weight requests
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';

export default function HardLimitWarning() {
  const { showHardLimitWarning, dismissHardLimitWarning } = useWorkoutStore();

  if (!showHardLimitWarning) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-red-950/80 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full border-2 border-red-500/50 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ repeat: 2, duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/20 mb-4"
        >
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </motion.div>

        <h2 className="text-xl font-bold text-red-400 mb-2">
          ⛔ 教練先別加！
        </h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          這個重量超出安全肌肥大訓練區間。
          <br />
          我們不是在比力量舉，先把 8–12 下推穩推滿！
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={dismissHardLimitWarning}
          className="w-full py-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-white font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          了解，維持安全重量
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
