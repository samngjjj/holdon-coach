// ============================================================
// HoldOn Coach — Change Notification Banner (動作更換與重量調整即時動畫通知)
// 呈現「原本是什麼」與「更改了什麼」之清晰前後對比卡片
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Scale,
  ArrowRight,
  X,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';

export default function ChangeNotificationBanner() {
  const {
    exerciseChangeNotice,
    weightChangeNotice,
    clearExerciseChangeNotice,
    clearWeightChangeNotice,
  } = useWorkoutStore();

  const [activeNoticeType, setActiveNoticeType] = useState<'exercise' | 'weight' | null>(null);

  // Trigger haptic & prioritize most recent notification
  useEffect(() => {
    if (exerciseChangeNotice && weightChangeNotice) {
      if (exerciseChangeNotice.timestamp >= weightChangeNotice.timestamp) {
        setActiveNoticeType('exercise');
      } else {
        setActiveNoticeType('weight');
      }
    } else if (exerciseChangeNotice) {
      setActiveNoticeType('exercise');
    } else if (weightChangeNotice) {
      setActiveNoticeType('weight');
    } else {
      setActiveNoticeType(null);
    }

    if (exerciseChangeNotice || weightChangeNotice) {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([25, 40]);
        } catch {}
      }
    }
  }, [exerciseChangeNotice, weightChangeNotice]);

  // Auto-dismiss countdown (5 seconds)
  useEffect(() => {
    if (!activeNoticeType) return;

    const timer = setTimeout(() => {
      if (activeNoticeType === 'exercise') {
        clearExerciseChangeNotice();
      } else if (activeNoticeType === 'weight') {
        clearWeightChangeNotice();
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [activeNoticeType, exerciseChangeNotice?.id, weightChangeNotice?.id, clearExerciseChangeNotice, clearWeightChangeNotice]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* Case 1: Exercise Change Notification */}
        {activeNoticeType === 'exercise' && exerciseChangeNotice && (
          <motion.div
            key={exerciseChangeNotice.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="w-full mb-3 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border-2 border-emerald-400/80 shadow-lg shadow-emerald-500/10 p-3 sm:p-4 text-slate-800 relative ring-4 ring-emerald-400/10"
          >
            {/* Header: Type, Badge, Close */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      動作已更換
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exerciseChangeNotice.type === 'safety_replacement'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {exerciseChangeNotice.type === 'safety_replacement'
                        ? '🛡️ 關節防護替代'
                        : exerciseChangeNotice.type === 'next'
                        ? '📋 進入下一動作'
                        : '🎯 課表切換'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearExerciseChangeNotice}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="關閉通知"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Before vs After Comparison Grid (原本 ➔ 更換為) */}
            <div className="grid grid-cols-11 gap-1.5 items-center bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80">
              {/* Box 1: 原本是什麼 (Before) */}
              <div className="col-span-5 bg-white rounded-lg p-2 border border-slate-200 shadow-2xs flex flex-col justify-center min-h-[58px]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    原本動作
                  </span>
                  {exerciseChangeNotice.prevWeight !== undefined && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {exerciseChangeNotice.prevWeight}kg
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-500 line-through truncate" title={exerciseChangeNotice.prevExerciseName}>
                  {exerciseChangeNotice.prevExerciseName}
                </div>
                {exerciseChangeNotice.prevGrip && (
                  <span className="text-[9px] text-slate-400 truncate">
                    {exerciseChangeNotice.prevGrip}
                  </span>
                )}
              </div>

              {/* Middle: Animated Arrow Connector */}
              <div className="col-span-1 flex justify-center">
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  className="w-5 h-5 rounded-full bg-[#00D09C]/15 text-[#00A87E] flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </motion.div>
              </div>

              {/* Box 2: 更改了什麼 (After) */}
              <div className="col-span-5 bg-emerald-50/90 rounded-lg p-2 border border-emerald-300 shadow-2xs flex flex-col justify-center min-h-[58px] ring-2 ring-emerald-400/20">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    更換為
                  </span>
                  {exerciseChangeNotice.newWeight !== undefined && (
                    <span className="text-[10px] font-mono font-black text-emerald-900 bg-white/80 px-1 rounded shadow-2xs">
                      {exerciseChangeNotice.newWeight}kg
                    </span>
                  )}
                </div>
                <div className="text-xs font-black text-slate-900 truncate" title={exerciseChangeNotice.newExerciseName}>
                  {exerciseChangeNotice.newExerciseName}
                </div>
                {exerciseChangeNotice.newGrip && (
                  <span className="text-[9px] font-semibold text-emerald-700 truncate">
                    {exerciseChangeNotice.newGrip}
                  </span>
                )}
              </div>
            </div>

            {/* Reason Explanation */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium px-1">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{exerciseChangeNotice.reason}</span>
            </div>

            {/* Countdown Progress Line */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        )}

        {/* Case 2: Weight Change Notification */}
        {activeNoticeType === 'weight' && weightChangeNotice && (
          <motion.div
            key={weightChangeNotice.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className={`w-full mb-3 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border-2 shadow-lg p-3 sm:p-4 text-slate-800 relative ring-4 ${
              weightChangeNotice.type === 'drop'
                ? 'border-amber-400/90 shadow-amber-500/10 ring-amber-400/10'
                : weightChangeNotice.type === 'increase'
                ? 'border-emerald-400/90 shadow-emerald-500/10 ring-emerald-400/10'
                : 'border-sky-400/90 shadow-sky-500/10 ring-sky-400/10'
            }`}
          >
            {/* Header: Type, Badge, Close */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    weightChangeNotice.type === 'drop'
                      ? 'bg-amber-100 text-amber-700'
                      : weightChangeNotice.type === 'increase'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {weightChangeNotice.type === 'drop' ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : weightChangeNotice.type === 'increase' ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <Scale className="w-3.5 h-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      {weightChangeNotice.type === 'drop'
                        ? '重量動態下修'
                        : weightChangeNotice.type === 'increase'
                        ? '突破升重成功'
                        : '重量手動微調'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        weightChangeNotice.type === 'drop'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : weightChangeNotice.type === 'increase'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}
                    >
                      {weightChangeNotice.type === 'drop'
                        ? '📉 降重保護'
                        : weightChangeNotice.type === 'increase'
                        ? '🚀 突破新高'
                        : '⚙️ 數值更新'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearWeightChangeNotice}
                className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="關閉通知"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Before vs After Comparison Grid (原本重量 ➔ 調整為) */}
            <div className="grid grid-cols-11 gap-1.5 items-center bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80">
              {/* Box 1: 原本重量 (Before) */}
              <div className="col-span-5 bg-white rounded-lg p-2 border border-slate-200 shadow-2xs flex flex-col items-center justify-center min-h-[58px]">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                  原本重量
                </span>
                <div className="text-sm font-black text-slate-400 line-through font-mono">
                  {weightChangeNotice.prevWeight} <span className="text-xs font-normal">kg</span>
                </div>
              </div>

              {/* Middle: Animated Arrow Connector */}
              <div className="col-span-1 flex justify-center">
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    weightChangeNotice.type === 'drop'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </motion.div>
              </div>

              {/* Box 2: 更改了什麼 (After) */}
              <div
                className={`col-span-5 rounded-lg p-2 border shadow-2xs flex flex-col items-center justify-center min-h-[58px] ${
                  weightChangeNotice.type === 'drop'
                    ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/20'
                }`}
              >
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      weightChangeNotice.type === 'drop' ? 'text-amber-800' : 'text-emerald-800'
                    }`}
                  >
                    調整為
                  </span>
                  <span
                    className={`text-[9px] font-mono font-black px-1 rounded ${
                      weightChangeNotice.delta < 0
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {weightChangeNotice.delta > 0 ? `+${weightChangeNotice.delta}` : weightChangeNotice.delta}kg
                  </span>
                </div>
                <div
                  className={`text-base font-black font-mono tracking-tight ${
                    weightChangeNotice.type === 'drop' ? 'text-amber-950' : 'text-emerald-950'
                  }`}
                >
                  {weightChangeNotice.newWeight} <span className="text-xs font-normal">kg</span>
                </div>
              </div>
            </div>

            {/* Reason Explanation */}
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium px-1">
              {weightChangeNotice.type === 'increase' ? (
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="truncate">{weightChangeNotice.reason}</span>
            </div>

            {/* Countdown Progress Line */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5.5, ease: 'linear' }}
                className={`h-full ${
                  weightChangeNotice.type === 'drop'
                    ? 'bg-amber-500'
                    : weightChangeNotice.type === 'increase'
                    ? 'bg-emerald-500'
                    : 'bg-sky-500'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
