// ============================================================
// HoldOn Coach — Full-Screen Rest Timer Overlay (全螢幕組間休息遮罩)
// 呈現 90s~120s 倒數、+30s 展延累計、AI 教練 RPE 動態配重調配結果
// ============================================================

'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, SkipForward, Wind, Sparkles, ArrowRight } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useTimer } from '@/hooks/useTimer';

export default function RestTimerOverlay() {
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
  const circumference = 2 * Math.PI * 120;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 overflow-y-auto"
    >
      {/* Breathing background animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.05) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.12) 0%, transparent 60%)',
            'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.05) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rest label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-4"
      >
        <Wind className="w-5 h-5 text-zinc-500" />
        <span className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
          組間呼吸修復中
        </span>
      </motion.div>

      {/* Circular timer */}
      <div className="relative w-56 h-56 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
          <circle
            cx="130"
            cy="130"
            r="120"
            fill="none"
            stroke="rgb(39,39,42)"
            strokeWidth="6"
          />
          <motion.circle
            cx="130"
            cy="130"
            r="120"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, progress)))}
            transition={{ duration: 0.3 }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={restSecondsRemaining}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black text-white tabular-nums tracking-tight"
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </motion.span>
          <span className="text-xs text-zinc-500 mt-1">
            {restSecondsRemaining <= 0 ? '時間到！準備上陣' : '深呼吸放鬆神經'}
          </span>
        </div>
      </div>

      {/* Dynamic Adjustment Box (Highlighting weight & rep calibration) */}
      {lastAdjustment && (
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-orange-500/15 border border-orange-500/40 rounded-2xl p-4 w-full max-w-sm mb-4 text-left shadow-lg"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AI 動態配重調配生效</span>
          </div>
          <p className="text-xs font-semibold text-white leading-relaxed">
            {lastAdjustment.summary}
          </p>
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-orange-500/20 text-xs">
            <span className="text-zinc-400">
              重量：<b className="line-through text-zinc-500">{lastAdjustment.prevWeight}kg</b> ➔ <b className="text-orange-400 text-sm font-black">{lastAdjustment.newWeight}kg</b>
            </span>
            <span className="text-zinc-400">
              目標次數：<b className="line-through text-zinc-500">{lastAdjustment.prevReps}下</b> ➔ <b className="text-orange-400 text-sm font-black">{lastAdjustment.newReps}下</b>
            </span>
          </div>
        </motion.div>
      )}

      {/* Next set preview card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900/90 rounded-2xl p-4 w-full max-w-sm border border-zinc-800 mb-4 text-left shadow-md"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-zinc-400">下一組目標配重</span>
          <span className="text-xs text-zinc-500 font-mono">
            第 {currentSet} / {exercise.total_sets} 組
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white truncate pr-2">
            {exercise.exercise_name}
          </span>
          <span className="text-base text-orange-400 font-black shrink-0 font-mono">
            {exercise.target_load.weight_kg}kg × {exercise.target_load.reps}下
          </span>
        </div>
      </motion.div>

      {/* Coach message */}
      <p className="text-xs text-zinc-400 text-center mb-6 max-w-xs leading-relaxed">
        {session.coach_feedback.speech_text}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => extendRest(30)}
          className="flex-1 py-3.5 rounded-2xl bg-zinc-800 border border-zinc-700/60 text-zinc-300 font-medium text-xs flex items-center justify-center gap-1.5 active:bg-zinc-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          再喘 30 秒
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={endRest}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 active:opacity-90"
        >
          <SkipForward className="w-4 h-4" />
          立即開始下一組
        </motion.button>
      </div>
    </motion.div>
  );
}
