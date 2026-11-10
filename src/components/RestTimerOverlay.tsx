// ============================================================
// HoldOn Coach — Rest Timer Overlay (Clean Minimalist Mint Green Timer)
// ============================================================

'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, SkipForward, Wind, Sparkles, Minimize2, ChevronDown } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useTimer } from '@/hooks/useTimer';

interface RestTimerOverlayProps {
  onMinimize?: () => void;
}

export default function RestTimerOverlay({ onMinimize }: RestTimerOverlayProps) {
  const {
    isResting,
    restSecondsRemaining,
    restDefaultSeconds,
    session,
    currentExerciseIndex,
    currentSet,
    lastAdjustment,
    extendRest,
    tickRest,
    endRest,
    safetyTier,
  } = useWorkoutStore();

  const exercise = session.exercises[currentExerciseIndex];

  // Timer tick
  useTimer({
    onTick: tickRest,
    isRunning: isResting,
  });

  // Play gentle chime when done
  useEffect(() => {
    if (isResting && restSecondsRemaining <= 0) {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 523.25; // C5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1);
      } catch {}
    }
  }, [isResting, restSecondsRemaining]);

  if (!isResting || !exercise) return null;

  const minutes = Math.floor(restSecondsRemaining / 60);
  const seconds = restSecondsRemaining % 60;
  const maxRest = safetyTier >= 1 ? 120 : (lastAdjustment?.rpe === 9 ? 105 : restDefaultSeconds);
  const progress = 1 - restSecondsRemaining / maxRest;
  const circumference = 2 * Math.PI * 110;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0B132B]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white overflow-y-auto"
    >
      {/* Top Bar with Minimize Button (Hevy Floating Dock) */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
          <Wind className="w-3.5 h-3.5 text-[#00D09C]" />
          <span className="text-white text-[11px] font-black uppercase tracking-wider">
            組間修復
          </span>
        </div>

        {onMinimize && (
          <button
            onClick={onMinimize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            title="縮小為底端懸浮工具列"
          >
            <ChevronDown className="w-4 h-4" />
            <span>縮小懸浮列</span>
          </button>
        )}
      </div>

      {/* Rest status label */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 mb-6 bg-white/10 px-4 py-1.5 rounded-full"
      >
        <Wind className="w-4 h-4 text-[#00D09C]" />
        <span className="text-white text-xs font-extrabold tracking-widest uppercase">
          組間呼吸修復中
        </span>
      </motion.div>

      {/* Circular Mint Green Timer */}
      <div className="relative w-56 h-56 mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
          <circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <motion.circle
            cx="120"
            cy="120"
            r="110"
            fill="none"
            stroke="#00D09C"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, progress)))}
            transition={{ duration: 0.3 }}
          />
        </svg>

        {/* Timer text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={restSecondsRemaining}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black text-white tabular-nums tracking-tight"
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </motion.span>
          <span className="text-xs text-slate-300 mt-1 font-medium">
            {restSecondsRemaining <= 0 ? '時間到！準備上陣' : '深呼吸放鬆神經'}
          </span>
        </div>
      </div>

      {/* Next set preview card (Clean white card) */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white text-slate-800 rounded-3xl p-4 w-full max-w-sm mb-4 shadow-xl border border-slate-100"
      >
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="font-extrabold text-[#00D09C] uppercase tracking-wider">下一組目標配重</span>
          <span className="text-slate-400 font-bold">
            第 {currentSet} / {exercise.total_sets} 組
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-base font-black text-slate-900 truncate pr-2">
            {exercise.exercise_name}
          </span>
          <span className="text-lg text-[#00D09C] font-black shrink-0 font-mono">
            {exercise.target_load.weight_kg}kg × {exercise.target_load.reps}下
          </span>
        </div>

        {lastAdjustment && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-[#00D09C] shrink-0" />
            <span className="font-medium text-[11px] truncate">{lastAdjustment.summary}</span>
          </div>
        )}
      </motion.div>

      {/* Coach speech */}
      <p className="text-xs text-slate-300 text-center mb-6 max-w-xs leading-relaxed font-medium">
        {session.coach_feedback.speech_text}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => extendRest(30)}
          className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4 text-[#00D09C]" />
          再喘 30 秒
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={endRest}
          className="flex-1 py-3.5 rounded-2xl bg-[#00D09C] hover:bg-[#00B887] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 active:opacity-90"
        >
          <SkipForward className="w-4 h-4" />
          立即開始下一組
        </motion.button>
      </div>
    </motion.div>
  );
}
