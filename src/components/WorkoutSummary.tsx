// ============================================================
// HoldOn Coach — Post-Workout Summary Screen (練後熱量與趨勢結算)
// 包含總容量噸數、PR 紀錄、代謝營養加碼、直接連動【飲食記錄】與【專屬 AI 教練】
// 極簡白底 + 薄荷綠風格
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
  ShieldCheck,
  ChevronRight,
  Bot,
  Sparkles,
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
    <div className="w-full min-h-screen bg-[#F1F5F9] pb-28 text-slate-900">
      {/* Hero Header */}
      <div className="relative overflow-hidden pt-8 pb-5 px-4 text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00D09C] to-emerald-600 mb-3.5 shadow-xl shadow-[#00D09C]/25 text-white">
            <Trophy className="w-10 h-10" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-[#00D09C]/15 border border-[#00D09C]/30 text-[#00A87E] text-xs font-black mb-2">
            🏆 今日訓練結算 • 雙重漸進完美達標！
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            練得太漂亮了，{session.user_name}！
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            恪守「教練先別加」雙重漸進邏輯，關節零代償，肌纖維深度刺激！
          </p>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4">
        {/* Total Volume Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#00D09C]" />
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                當日累積總訓練量 (Volume)
              </span>
            </div>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              新 PR 突破！
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-[#0B132B] tabular-nums tracking-tight">
              {displayVolume.toLocaleString()}
            </span>
            <span className="text-xl text-slate-400 font-bold">kg</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            課表：{session.plan_name} • 完整完成所有動作模組
          </p>
        </motion.div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 text-center shadow-sm">
            <TrendingUp className="w-4 h-4 text-[#00D09C] mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalSets}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">總組數 (Sets)</p>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 text-center shadow-sm">
            <Flame className="w-4 h-4 text-[#FF6B4A] mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalReps}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">總推舉次數</p>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 text-center shadow-sm">
            <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.avgRPE}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">平均自覺強度</p>
          </div>
        </div>

        {/* Link 1: Go to Diet Tracker */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('diet')}
          className="bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-[#FF6B4A]/50 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#FF6B4A] flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-slate-900 group-hover:text-[#FF6B4A] transition-colors">
                  前往【飲食記錄】填寫練後餐
                </p>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FF6B4A] text-white font-black">
                  +{dietRecord.workoutBonusCalories}kcal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                今日訓練已自動加碼 +{dietRecord.workoutBonusProtein}g 蛋白質與碳水，點此記下超商外食！
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF6B4A] transition-colors shrink-0" />
        </motion.div>

        {/* Link 2: Ask Dedicated AI Coach */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('chat')}
          className="bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-[#00D09C] transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00D09C]/15 text-[#00A87E] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-[#00A87E] transition-colors">
                向專屬 AI 隨身教練提問
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                AI 已讀取你今日的 {displayVolume}kg 容量與飲食缺口，為你量身解答！
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#00A87E] transition-colors shrink-0" />
        </motion.div>

        {/* Link 3: View Real Progression Curve */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('progress')}
          className="bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                查看 8 週真實週期進步曲線
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                波浪訓練量、臥推階梯升重、減量週超量恢復走勢圖
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
        </motion.div>

        {/* Fatigue Notice */}
        {totalExtensionSeconds > 0 && (
          <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 flex items-center gap-3">
            <span className="text-2xl">😮‍💨</span>
            <div>
              <p className="text-xs text-amber-800 font-bold">
                組間彈性展延累積 +{totalExtensionSeconds} 秒
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                已自動記入「疲勞觀察指標」，若持續展延將在下週主動推薦減量週 (Deload)。
              </p>
            </div>
          </div>
        )}

        {/* Exercise Details Breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00D09C]" />
            <span>動作明細與配重歷程</span>
          </h2>

          <div className="space-y-2.5">
            {session.exercises.map((ex, i) => {
              const records = stats.exerciseGroups[ex.exercise_id] || [];
              return (
                <div
                  key={ex.exercise_id + i}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">
                      {i + 1}. {ex.exercise_name}
                    </span>
                    <span className="text-xs text-[#00A87E] font-mono font-bold">
                      {ex.target_load.weight_kg}kg × {ex.target_load.reps}下
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {records.length > 0 ? (
                      records.map((r, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white text-slate-700 border border-slate-200 shadow-2xs"
                        >
                          第{r.setNumber}組: {r.weight_kg}kg×{r.reps_completed} (RPE {r.rpe})
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
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
            className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            換個課表 / 開始下一場訓練
          </motion.button>
        </div>
      </div>
    </div>
  );
}
