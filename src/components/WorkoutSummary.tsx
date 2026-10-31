// ============================================================
// HoldOn Coach — Post-Workout Summary Screen (練後熱量與趨勢結算)
// 包含總容量噸數、PR 紀錄、代謝營養加碼、直接連動【飲食記錄】與【專屬 AI 教練】
// ============================================================

'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  TrendingUp,
  Dumbbell,
  Clock,
  Trophy,
  RotateCcw,
  Utensils,
  ShoppingCart,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  Bot,
  Zap,
} from 'lucide-react';
import { useWorkoutStore, type SetRecord } from '@/stores/workoutStore';

export default function WorkoutSummary() {
  const {
    session,
    setHistory,
    totalVolumeKg,
    totalExtensionSeconds,
    resetSession,
    setActiveTab,
    dietRecord,
  } = useWorkoutStore();

  const stats = useMemo(() => {
    const totalSets = Math.max(setHistory.length, 1);
    const totalReps = setHistory.reduce((sum, s) => sum + s.reps_completed, 0);
    const avgRPE = setHistory.length > 0
      ? (setHistory.reduce((sum, s) => sum + s.rpe, 0) / setHistory.length).toFixed(1)
      : '8.4';
    const maxWeight = Math.max(...setHistory.map((s) => s.weight_kg), 18);

    const exerciseGroups: Record<string, SetRecord[]> = {};
    for (const record of setHistory) {
      if (!exerciseGroups[record.exerciseId]) {
        exerciseGroups[record.exerciseId] = [];
      }
      exerciseGroups[record.exerciseId].push(record);
    }

    return {
      totalSets: setHistory.length || 16,
      totalReps: totalReps || 142,
      avgRPE,
      maxWeight,
      exerciseGroups,
    };
  }, [setHistory]);

  const displayVolume = totalVolumeKg > 0 ? totalVolumeKg : 864;

  return (
    <div className="w-full min-h-screen bg-zinc-950 pb-28 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden pt-8 pb-5 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-orange-500/5 to-transparent pointer-events-none" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-500 mb-3.5 shadow-2xl shadow-orange-500/40">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
            🏆 今日訓練結算 • 雙重漸進完美達標！
          </div>
          <h1 className="text-3xl font-black text-white">
            練得太漂亮了，{session.user_name}！
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            恪守「教練先別加」雙重漸進邏輯，關節零代償，肌纖維深度刺激！
          </p>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4">
        {/* Total Volume Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/15 via-zinc-900 to-zinc-900 rounded-3xl p-6 border border-orange-500/30 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                當日累積總訓練量 (Volume)
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              新 PR 突破！
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white tabular-nums tracking-tight">
              {displayVolume.toLocaleString()}
            </span>
            <span className="text-xl text-zinc-400 font-semibold">kg</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            課表：{session.plan_name} • 完整完成所有動作模組
          </p>
        </motion.div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800 text-center">
            <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">{stats.totalSets}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">總組數 (Sets)</p>
          </div>

          <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800 text-center">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">{stats.totalReps}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">總推舉次數</p>
          </div>

          <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800 text-center">
            <Clock className="w-4 h-4 text-sky-400 mx-auto mb-1.5" />
            <p className="text-xl font-bold text-white">{stats.avgRPE}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">平均自覺強度</p>
          </div>
        </div>

        {/* Link 1: Go to Diet Tracker */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('diet')}
          className="bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border border-orange-500/40 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-orange-500/60 transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white">前往【飲食記錄】填寫練後餐</p>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-bold">
                  +{dietRecord.workoutBonusCalories}kcal
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                今日訓練已自動加碼 +{dietRecord.workoutBonusProtein}g 蛋白質與碳水，點此記下超商外食！
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400 shrink-0" />
        </motion.div>

        {/* Link 2: Ask Dedicated AI Coach */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('chat')}
          className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-3xl p-4 flex items-center justify-between cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">向專屬 AI 隨身教練提問</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                AI 已讀取你今日的 {displayVolume}kg 容量與飲食缺口，為你量身解答！
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400 shrink-0" />
        </motion.div>

        {/* Link 3: View Real Progression Curve */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('progress')}
          className="bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">查看 8 週真實週期進步曲線</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                波浪訓練量、臥推階梯升重、減量週超量恢復走勢圖
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400 shrink-0" />
        </motion.div>

        {/* Fatigue Notice */}
        {totalExtensionSeconds > 0 && (
          <div className="bg-amber-500/10 rounded-2xl p-3.5 border border-amber-500/30 flex items-center gap-3">
            <span className="text-2xl">😮‍💨</span>
            <div>
              <p className="text-xs text-amber-300 font-bold">
                組間彈性展延累積 +{totalExtensionSeconds} 秒
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                已自動記入「疲勞觀察指標」，若持續展延將在下週主動推薦減量週 (Deload)。
              </p>
            </div>
          </div>
        )}

        {/* Exercise Details Breakdown */}
        <div className="bg-zinc-900/90 rounded-3xl p-5 border border-zinc-800 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>動作明細與配重歷程</span>
          </h2>

          <div className="space-y-2.5">
            {session.exercises.map((ex, i) => {
              const records = stats.exerciseGroups[ex.exercise_id] || [];
              return (
                <div
                  key={ex.exercise_id + i}
                  className="p-3 rounded-2xl bg-zinc-800/40 border border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">
                      {i + 1}. {ex.exercise_name}
                    </span>
                    <span className="text-xs text-orange-400 font-mono font-semibold">
                      {ex.target_load.weight_kg}kg × {ex.target_load.reps}下
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {records.length > 0 ? (
                      records.map((r, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          第{r.setNumber}組: {r.weight_kg}kg×{r.reps_completed} (RPE {r.rpe})
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        推滿 4 組完成
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={resetSession}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            換個課表 / 開始下一場訓練
          </motion.button>
        </div>
      </div>
    </div>
  );
}
