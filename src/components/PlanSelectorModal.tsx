// ============================================================
// HoldOn Coach — Plan Selector Modal (Clean White Theme)
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Check, X, Shield, Flame } from 'lucide-react';
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
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl my-8 overflow-hidden text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00D09C] flex items-center justify-center text-white shadow-sm">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">選擇訓練計畫分化</h2>
                <p className="text-xs text-slate-400">內建經典分化與雙重漸進關節保護防線</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Plan Categories & Cards */}
          <div className="mt-5 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const plans = WORKOUT_PLANS.filter((p) => p.category === cat.key);
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A87E]">
                      {cat.label}
                    </span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>

                  <div className="space-y-2">
                    {plans.map((p) => {
                      const isCurrent = session.plan_id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelect(p.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-emerald-50/70 border-[#00D09C] ring-1 ring-[#00D09C]/40 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100/70 border-slate-100'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                  {p.name}
                                </h3>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D09C] text-white">
                                    進行中
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                {p.description}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                  <Flame className="w-3 h-3 text-[#FF6B4A]" />
                                  {p.targetFocus}
                                </span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                                  <Shield className="w-3 h-3 text-[#00A87E]" />
                                  {p.exercises.length} 個動作
                                </span>
                              </div>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                                isCurrent
                                  ? 'bg-[#00D09C] text-white'
                                  : 'border border-slate-300'
                              }`}
                            >
                              {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
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
