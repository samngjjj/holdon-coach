// ============================================================
// HoldOn Coach — Plan Selector Modal (課表切換器)
// 支援推拉腿 (PPL)、二分化 (Upper/Lower)、五分化 (Bro Split)
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Check, X, Sparkles, Shield, Flame } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { WORKOUT_PLANS } from '@/data/exercises';

interface PlanSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanSelectorModal({ isOpen, onClose }: PlanSelectorModalProps) {
  const { session, selectPlan } = useWorkoutStore();

  if (!isOpen) return null;

  const handleSelect = (planId: string) => {
    selectPlan(planId);
    onClose();
  };

  const categories = [
    { key: 'PPL', label: '推拉腿 (PPL)' },
    { key: 'UpperLower', label: '二分化 (Upper / Lower)' },
    { key: 'BroSplit', label: '五分化 (Bro Split)' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl my-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">選擇訓練計畫分化</h2>
                <p className="text-xs text-zinc-400">系統內建運動科學經典課表與關節保護防線</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Plan Categories & Cards */}
          <div className="mt-5 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const plans = WORKOUT_PLANS.filter((p) => p.category === cat.key);
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                      {cat.label}
                    </span>
                    <div className="h-px bg-zinc-800 flex-1" />
                  </div>

                  <div className="space-y-2.5">
                    {plans.map((p) => {
                      const isCurrent = session.plan_id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelect(p.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-orange-500/10 border-orange-500/80 shadow-md shadow-orange-500/10'
                              : 'bg-zinc-800/40 hover:bg-zinc-800/80 border-zinc-800'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white truncate">
                                  {p.name}
                                </h3>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                                    進行中
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                                {p.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2.5">
                                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-orange-400" />
                                  {p.targetFocus}
                                </span>
                                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                                  <Shield className="w-3 h-3 text-emerald-400" />
                                  {p.exercises.length} 個動作模組
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
