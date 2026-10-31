// ============================================================
// HoldOn Coach — Exercise Card (動作專注卡片)
// 單一畫面專注單一動作，動態雙重漸進配重、關節保護光暈與語音波紋
// ============================================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertTriangle,
  Mic,
  MicOff,
  Dumbbell,
  ArrowDownCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  Layers,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useVoiceListener } from '@/hooks/useVoiceListener';
import RPEInput from './RPEInput';
import PainInput from './PainInput';
import CoachBubble from './CoachBubble';
import PlanEditorModal from './PlanEditorModal';

export default function ExerciseCard() {
  const {
    session,
    currentExerciseIndex,
    currentSet,
    safetyTier,
    lastAdjustment,
    showRPEInput,
    showPainInput,
    showPlanEditorModal,
    setShowPlanEditorModal,
    jumpToExercise,
    reverseExercisesOrder,
    setShowRPEInput,
    setShowPainInput,
    completeSet,
    dropWeightManually,
    processVoiceCommand,
  } = useWorkoutStore();

  const exercise = session.exercises[currentExerciseIndex];
  const [completedReps, setCompletedReps] = useState(exercise?.target_load.reps || 10);
  const [lastVoiceText, setLastVoiceText] = useState<string>('');

  // Synchronize stepper whenever set advances or target reps dynamically calibrate
  useEffect(() => {
    if (exercise?.target_load?.reps) {
      setCompletedReps(exercise.target_load.reps);
    }
  }, [currentSet, currentExerciseIndex, exercise?.exercise_id, exercise?.target_load?.reps]);

  const handleVoice = useCallback(
    (transcript: string) => {
      setLastVoiceText(transcript);
      processVoiceCommand(transcript);
    },
    [processVoiceCommand]
  );

  const { isListening, isSupported, toggle: toggleVoice } = useVoiceListener({
    onTranscript: handleVoice,
  });

  if (!exercise) return null;

  const progressPct = (currentSet / exercise.total_sets) * 100;

  // Safety glow class: amber for Tier-1, red for Tier-2
  const glowClass =
    safetyTier === 2
      ? 'ring-2 ring-red-500/80 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
      : safetyTier === 1
        ? 'ring-2 ring-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.25)]'
        : 'ring-1 ring-zinc-800';

  const handleComplete = () => {
    setShowRPEInput(true);
  };

  const handleRPESubmit = (rpe: number) => {
    completeSet(completedReps, rpe);
  };

  return (
    <div className="w-full flex flex-col pb-8">
      {/* Top Header: Planned Exercises Switcher & Plan Edit Toolbar */}
      <div className="px-3 pt-3 pb-1 max-w-xl mx-auto w-full">
        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 shrink-0">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>切換已計劃動作</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ({currentExerciseIndex + 1}/{session.exercises.length})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={reverseExercisesOrder}
              className="text-[11px] font-semibold text-zinc-300 hover:text-orange-400 bg-zinc-850 hover:bg-zinc-800 px-2 py-1 rounded-lg border border-zinc-700/60 flex items-center gap-1 transition-colors"
              title="將動作次序前後完全調轉"
            >
              <RotateCcw className="w-3 h-3 text-orange-400" />
              <span>前後調轉</span>
            </button>

            <button
              onClick={() => setShowPlanEditorModal(true)}
              className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>修改課表</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Pills for ALL planned exercises */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {session.exercises.map((ex, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            return (
              <button
                key={`${ex.exercise_id}_${idx}`}
                onClick={() => jumpToExercise(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/25 ring-1 ring-orange-400'
                    : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                    isCurrent ? 'bg-black/30 text-white' : 'bg-zinc-700 text-zinc-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-medium">{ex.exercise_name}</span>
                <span
                  className={`text-[10px] font-mono ${
                    isCurrent ? 'text-white/90' : 'text-zinc-500'
                  }`}
                >
                  {ex.target_load.weight_kg}kg
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Progress bar */}
      <div className="px-4 pt-3 pb-2 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1.5">
          <span>
            動作 {exercise.exercise_index + 1} / {exercise.total_exercises}：{exercise.exercise_name}
          </span>
          <span className="font-bold text-white">
            第 {currentSet} / {exercise.total_sets} 組
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Main Focus Card */}
      <div
        className={`mx-3 sm:mx-auto max-w-xl w-full my-2 rounded-3xl bg-zinc-900/90 backdrop-blur-xl overflow-hidden transition-all duration-500 ${glowClass}`}
      >
        {/* Video / GIF Demo Area */}
        <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-6 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mb-3 shadow-inner"
            >
              <Dumbbell className="w-7 h-7 text-orange-400" />
            </motion.div>
            <p className="text-sm font-bold text-zinc-200">{exercise.media.alt_text}</p>
            <p className="text-xs text-zinc-500 mt-1">示範動態影像載入中 (gymvisual)</p>
          </div>

          {/* Safety Status Badges */}
          <AnimatePresence>
            {safetyTier === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-zinc-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
              >
                <span>⚠️ Tier-1 防護：對握中立握法 (-20% 配重)</span>
              </motion.div>
            )}
            {safetyTier === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white flex items-center gap-1.5 shadow-lg shadow-red-500/30"
              >
                <span>🛑 Tier-2 防護：已直接抽換為坐姿機械式胸推機</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grip Badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900/85 backdrop-blur-md text-zinc-300 border border-zinc-700/60">
            {exercise.grip_type}
          </div>

          {/* Biomechanical Cue Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent p-3.5 pt-8">
            <p className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <span>💡 力學口訣：</span>
              <span>{exercise.media.cue}</span>
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col gap-3.5">
          {/* Dynamic Adjustment Alert Banner */}
          {lastAdjustment && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-2xl p-3 border flex items-start gap-2.5 text-xs shadow-md ${
                lastAdjustment.type === 'weight_drop'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                  : lastAdjustment.type === 'weight_up'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-orange-500/15 border-orange-500/40 text-orange-200'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="font-bold block text-white">✨ AI 教練動態配重調配生效：</span>
                <span className="text-[11px] opacity-90 block mt-0.5">{lastAdjustment.summary}</span>
              </div>
            </motion.div>
          )}

          {/* Exercise Title & Fast Drop Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {exercise.exercise_name}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                目標：肌肥大黃金次數 8–12 Reps • 滿 12 下自動解鎖
              </p>
            </div>

            <button
              onClick={() => dropWeightManually('手動降重')}
              className="text-xs text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1.5 rounded-xl border border-orange-500/30 flex items-center gap-1 transition-all"
              title="覺得有點硬？點此手動降一檔重量"
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>有點硬？降重</span>
            </button>
          </div>

          {/* Weight × Reps Display */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-4">
              <div>
                <motion.span
                  key={exercise.target_load.weight_kg}
                  initial={{ scale: 1.2, color: '#f97316' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl font-black tabular-nums tracking-tight block"
                >
                  {exercise.target_load.weight_kg}
                </motion.span>
                <span className="text-xs text-zinc-400 block -mt-1 font-light">kg 目標配重</span>
              </div>

              <span className="text-2xl text-zinc-600 font-light">×</span>

              <div>
                <motion.span
                  key={exercise.target_load.reps}
                  initial={{ scale: 1.2, color: '#f97316' }}
                  animate={{ scale: 1, color: '#fb923c' }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl font-extrabold tabular-nums block"
                >
                  {exercise.target_load.reps}
                </motion.span>
                <span className="text-xs text-zinc-400 block -mt-1 font-light">下 目標次數</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 mt-3">
              規則：{exercise.target_load.rule}
            </p>
          </div>

          {/* Actual Rep Counter Stepper */}
          <div className="flex items-center justify-center gap-4 py-1">
            <button
              onClick={() => setCompletedReps(Math.max(1, completedReps - 1))}
              className="w-11 h-11 rounded-2xl bg-zinc-800 text-zinc-300 text-xl font-bold flex items-center justify-center active:bg-zinc-700 transition-colors border border-zinc-700/60"
            >
              −
            </button>
            <div className="text-center min-w-[100px]">
              <span className="text-xs text-zinc-500">實際完成次數</span>
              <p className="text-3xl font-black text-white tabular-nums">
                {completedReps} <span className="text-xs font-normal text-zinc-400">下</span>
              </p>
            </div>
            <button
              onClick={() => setCompletedReps(Math.min(25, completedReps + 1))}
              className="w-11 h-11 rounded-2xl bg-zinc-800 text-zinc-300 text-xl font-bold flex items-center justify-center active:bg-zinc-700 transition-colors border border-zinc-700/60"
            >
              +
            </button>
          </div>

          {/* Coach Bubble */}
          <CoachBubble
            text={session.coach_feedback.speech_text}
            tone={session.coach_feedback.tone}
          />

          {/* Voice Prompt Cue */}
          <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-orange-400" />
              <span>語音可說：「推完了」、「有點硬」、「肩膀痛」、「再休30秒」</span>
            </span>
            {lastVoiceText && (
              <span className="text-amber-400 font-medium truncate max-w-[120px]">
                聽到: &quot;{lastVoiceText}&quot;
              </span>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex gap-2.5 pt-1">
            {/* Pain Alert Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPainInput(true)}
              className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col items-center justify-center text-amber-400 hover:bg-amber-500/25 transition-colors shrink-0"
              title="回報關節刺痛或卡卡"
            >
              <AlertTriangle className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">痛感</span>
            </motion.button>

            {/* Complete Set Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleComplete}
              className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:opacity-90 transition-all"
            >
              <Check className="w-5 h-5" />
              <span>完成第 {currentSet} 組（選 RPE 調整）</span>
            </motion.button>

            {/* Voice Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleVoice}
              className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-orange-500/25 border-orange-500 text-orange-400 ring-2 ring-orange-500/40'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
              }`}
              title="切換常駐語音辨識"
            >
              {isListening ? (
                <motion.div
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <Mic className="w-5 h-5 mb-0.5" />
                </motion.div>
              ) : (
                <MicOff className="w-5 h-5 mb-0.5" />
              )}
              <span className="text-[10px] font-bold">{isListening ? '監聽中' : '語音'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* RPE & Pain Overlays */}
      <AnimatePresence>
        {showRPEInput && (
          <RPEInput
            onSubmit={handleRPESubmit}
            onCancel={() => setShowRPEInput(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPainInput && <PainInput />}
      </AnimatePresence>

      {/* Plan Editor Modal */}
      <PlanEditorModal
        isOpen={showPlanEditorModal}
        onClose={() => setShowPlanEditorModal(false)}
      />
    </div>
  );
}
