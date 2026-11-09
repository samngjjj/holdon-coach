// ============================================================
// HoldOn Coach — Muscle Recovery Heatmap (人體肌群疲勞恢復熱力圖)
// 視覺化呈現全身各大肌群超量恢復進度，直觀掌握「肌肉回血狀態」與今日排課建議
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';
import { useWorkoutStore, type MuscleGroupRecovery } from '@/stores/workoutStore';

interface MuscleRecoveryHeatmapProps {
  className?: string;
  isCompact?: boolean;
}

export default function MuscleRecoveryHeatmap({
  className = '',
  isCompact = false,
}: MuscleRecoveryHeatmapProps) {
  const {
    muscleRecoveries,
    selectedHeatmapMuscle,
    setSelectedHeatmapMuscle,
    selectPlan,
    setActiveTab,
  } = useWorkoutStore();

  const [activeView, setActiveView] = useState<'anterior' | 'posterior'>('anterior');

  // Currently focused muscle (default to first or chest)
  const currentMuscle =
    muscleRecoveries.find((m) => m.id === selectedHeatmapMuscle) ||
    muscleRecoveries.find((m) => m.id === 'chest') ||
    muscleRecoveries[0];

  // Calculate overall systemic readiness
  const avgRecovery = Math.round(
    muscleRecoveries.reduce((sum, m) => sum + m.recoveryPct, 0) / muscleRecoveries.length
  );

  const getStatusColor = (pct: number) => {
    if (pct < 40) return '#EF4444'; // Red (Fatigued)
    if (pct < 80) return '#F59E0B'; // Amber (Recovering)
    return '#00D09C'; // Mint Green (Ready)
  };

  const getStatusBg = (pct: number) => {
    if (pct < 40) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (pct < 80) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-[#00A87E] border-emerald-200';
  };

  const getStatusLabel = (pct: number) => {
    if (pct < 40) return '🔴 深度修復中';
    if (pct < 80) return '🟡 超量恢復中';
    return '🟢 蓄勢待發';
  };

  // Quick plan recommendation mapping
  const handleJumpToRoutine = (muscleId: string) => {
    if (muscleId === 'back' || muscleId === 'biceps') selectPlan('ppl_pull');
    else if (muscleId === 'quads' || muscleId === 'hamstrings_glutes') selectPlan('ppl_legs');
    else if (muscleId === 'core') selectPlan('six_pack_abs');
    else selectPlan('ppl_push');
    setActiveTab('workout');
  };

  // Helper mapping for SVG fills
  const getMuscleColor = (id: string) => {
    const m = muscleRecoveries.find((item) => item.id === id);
    return getStatusColor(m ? m.recoveryPct : 85);
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 ${className}`}>
      {/* Header Banner: Systemic Readiness */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#00D09C]" />
            <h3 className="text-base font-black text-slate-900">
              肌群超量恢復熱力圖
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C]/15 text-[#00A87E]">
              實時生理回血
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            全身綜合就緒度：<span className="font-extrabold text-[#00A87E]">{avgRecovery}%</span> • 依據運動科學 48 小時超量恢復模型
          </p>
        </div>

        {/* View Switcher: 前側 / 後側 */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveView('anterior')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeView === 'anterior'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            前側
          </button>
          <button
            onClick={() => setActiveView('posterior')}
            className={`px-3 py-1 rounded-full transition-all ${
              activeView === 'posterior'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            後側
          </button>
        </div>
      </div>

      {/* Main Body: Anatomical Heatmap & Interactive Focus Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
        {/* ============================================================ */}
        {/* 1. 2D Anatomical Vector Silhouette Heatmap */}
        {/* ============================================================ */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/70 border border-slate-100 relative">
          <div className="relative w-48 sm:w-52 h-64">
            <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-sm" fill="none">
              {/* Head */}
              <circle cx="100" cy="30" r="16" fill="#CBD5E1" />
              {/* Neck */}
              <rect x="94" y="44" width="12" height="12" rx="3" fill="#E2E8F0" />

              {activeView === 'anterior' ? (
                /* ANTERIOR (FRONT) MUSCLES */
                <g>
                  {/* Shoulders (Deltoids - Front) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('deltoids')}
                    d="M 68 56 Q 78 52 88 56 L 82 82 Q 72 78 68 56 Z"
                    fill={getMuscleColor('deltoids')}
                    className="cursor-pointer transition-colors"
                  />
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('deltoids')}
                    d="M 132 56 Q 122 52 112 56 L 118 82 Q 128 78 132 56 Z"
                    fill={getMuscleColor('deltoids')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Chest (Pectoralis Major) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('chest')}
                    d="M 75 62 Q 100 68 125 62 L 123 96 Q 100 102 77 96 Z"
                    fill={getMuscleColor('chest')}
                    className="cursor-pointer transition-colors"
                  />
                  {/* Chest Separation Line */}
                  <line x1="100" y1="64" x2="100" y2="98" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />

                  {/* Biceps */}
                  <motion.rect
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('biceps')}
                    x="62"
                    y="84"
                    width="12"
                    height="28"
                    rx="5"
                    fill={getMuscleColor('biceps')}
                    className="cursor-pointer transition-colors"
                  />
                  <motion.rect
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('biceps')}
                    x="126"
                    y="84"
                    width="12"
                    height="28"
                    rx="5"
                    fill={getMuscleColor('biceps')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Core / Abs (Rectus Abdominis) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('core')}
                    d="M 83 102 L 117 102 L 113 150 L 87 150 Z"
                    fill={getMuscleColor('core')}
                    className="cursor-pointer transition-colors"
                  />
                  {/* 6 pack cutlines */}
                  <line x1="100" y1="102" x2="100" y2="150" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
                  <line x1="86" y1="118" x2="114" y2="118" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
                  <line x1="86" y1="134" x2="114" y2="134" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />

                  {/* Forearms */}
                  <rect x="58" y="116" width="10" height="32" rx="4" fill="#94A3B8" />
                  <rect x="132" y="116" width="10" height="32" rx="4" fill="#94A3B8" />

                  {/* Quads (Quadriceps - Thighs) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('quads')}
                    d="M 76 156 Q 96 156 96 215 L 78 215 Q 70 185 76 156 Z"
                    fill={getMuscleColor('quads')}
                    className="cursor-pointer transition-colors"
                  />
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('quads')}
                    d="M 124 156 Q 104 156 104 215 L 122 215 Q 130 185 124 156 Z"
                    fill={getMuscleColor('quads')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Calves (Front Shins) */}
                  <rect x="76" y="222" width="12" height="48" rx="5" fill="#CBD5E1" />
                  <rect x="112" y="222" width="12" height="48" rx="5" fill="#CBD5E1" />
                </g>
              ) : (
                /* POSTERIOR (BACK) MUSCLES */
                <g>
                  {/* Upper Back & Traps */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('back')}
                    d="M 82 52 L 118 52 L 126 78 L 74 78 Z"
                    fill={getMuscleColor('back')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Lats (Latissimus Dorsi) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('back')}
                    d="M 75 78 Q 100 84 125 78 L 116 130 Q 100 134 84 130 Z"
                    fill={getMuscleColor('back')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Triceps (Back of arms) */}
                  <motion.rect
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('triceps')}
                    x="62"
                    y="76"
                    width="12"
                    height="32"
                    rx="5"
                    fill={getMuscleColor('triceps')}
                    className="cursor-pointer transition-colors"
                  />
                  <motion.rect
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('triceps')}
                    x="126"
                    y="76"
                    width="12"
                    height="32"
                    rx="5"
                    fill={getMuscleColor('triceps')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Glutes (Buttocks) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('hamstrings_glutes')}
                    d="M 78 140 Q 100 134 122 140 L 120 175 Q 100 182 80 175 Z"
                    fill={getMuscleColor('hamstrings_glutes')}
                    className="cursor-pointer transition-colors"
                  />
                  <line x1="100" y1="140" x2="100" y2="176" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.6" />

                  {/* Hamstrings (Back of Thighs) */}
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('hamstrings_glutes')}
                    d="M 78 180 L 96 180 L 94 220 L 76 220 Z"
                    fill={getMuscleColor('hamstrings_glutes')}
                    className="cursor-pointer transition-colors"
                  />
                  <motion.path
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedHeatmapMuscle('hamstrings_glutes')}
                    d="M 104 180 L 122 180 L 124 220 L 106 220 Z"
                    fill={getMuscleColor('hamstrings_glutes')}
                    className="cursor-pointer transition-colors"
                  />

                  {/* Calves (Back / Gastrocnemius) */}
                  <rect x="74" y="226" width="14" height="46" rx="6" fill="#94A3B8" />
                  <rect x="112" y="226" width="14" height="46" rx="6" fill="#94A3B8" />
                </g>
              )}
            </svg>

            {/* Tap instruction */}
            <span className="absolute bottom-1 text-[10px] text-slate-400 font-bold bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
              點擊部位查看回血進度
            </span>
          </div>

          {/* Quick Color Legend */}
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>修復中 (&lt;40%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>超量恢復 (40-80%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00D09C]" />
              <span>就緒 (&gt;80%)</span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Interactive Muscle Recovery Detail Card */}
        {/* ============================================================ */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-3">
          {/* Muscle Detail Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {currentMuscle.latinName}
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  {currentMuscle.name}
                </h4>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${getStatusBg(currentMuscle.recoveryPct)}`}>
                {getStatusLabel(currentMuscle.recoveryPct)} ({currentMuscle.recoveryPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
              <motion.div
                key={currentMuscle.id}
                initial={{ width: 0 }}
                animate={{ width: `${currentMuscle.recoveryPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: getStatusColor(currentMuscle.recoveryPct) }}
              />
            </div>

            {/* Context Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">距上次刺激</span>
                <span className="font-bold text-slate-800">
                  {currentMuscle.lastTrainedHoursAgo === 0 ? '剛剛完成' : `${currentMuscle.lastTrainedHoursAgo} 小時前`}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-bold">預估完全回血</span>
                <span className="font-bold text-slate-800">
                  {currentMuscle.estimatedReadyHours === 0 ? '已 100% 充血就緒' : `再需約 ${currentMuscle.estimatedReadyHours} 小時`}
                </span>
              </div>
            </div>

            {/* AI Exercise Science Tip */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-[#00A87E] block mb-0.5">
                💡 Jeff Nippard 運動生理學診斷：
              </span>
              <p>{currentMuscle.aiTip}</p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-1">
            {currentMuscle.recoveryPct >= 80 ? (
              <button
                onClick={() => handleJumpToRoutine(currentMuscle.id)}
                className="w-full py-3 rounded-2xl bg-[#00D09C] hover:bg-[#00B887] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>此部位已 100% 恢復，立即開啟專屬課表！</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="py-2.5 px-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>此肌群修復中，今日請勿強行推舉，恪守「先別加」超量恢復！</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
