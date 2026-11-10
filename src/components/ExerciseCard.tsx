// ============================================================
// HoldOn Coach — Exercise Focus Card (Screen 3: 訓練提示 - 30 Days Challenge Minimalist Clean Style)
// 極簡白底大卡片、動態運動軌跡示範、醒目綠色目標計數、大圓形打勾按鈕與關節防護煞車
// ============================================================

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertTriangle,
  Mic,
  MicOff,
  Video,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Edit3,
  Layers,
  ArrowDownCircle,
  Sparkles,
  Volume2,
  Plus,
  Clock,
  Trash2,
  Minus,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useVoiceListener } from '@/hooks/useVoiceListener';
import RPEInput from './RPEInput';
import PainInput from './PainInput';
import PlanEditorModal from './PlanEditorModal';
import ExerciseIllustration from './ExerciseIllustration';
import ChangeNotificationBanner from './ChangeNotificationBanner';

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
    resetSession,
    totalVolumeKg,
    setHistory,
    addSetToCurrentExercise,
    removeSetFromCurrentExercise,
    updateSetRecordInHistory,
    updateCurrentExerciseTarget,
  } = useWorkoutStore();

  const exercise = session.exercises[currentExerciseIndex];
  const [completedReps, setCompletedReps] = useState(exercise?.target_load.reps || 10);
  const [lastVoiceText, setLastVoiceText] = useState<string>('');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Track previous target weight to power directional pop animations & inline diff badge
  const prevTargetWeightRef = useRef<number | null>(null);
  const [weightDeltaInfo, setWeightDeltaInfo] = useState<{
    prev: number;
    current: number;
    delta: number;
  } | null>(null);

  useEffect(() => {
    if (!exercise) return;
    const currentWeight = exercise.target_load.weight_kg;
    if (prevTargetWeightRef.current !== null && prevTargetWeightRef.current !== currentWeight) {
      const prev = prevTargetWeightRef.current;
      const delta = Math.round((currentWeight - prev) * 10) / 10;
      setWeightDeltaInfo({ prev, current: currentWeight, delta });
      const timer = setTimeout(() => setWeightDeltaInfo(null), 4500);
      prevTargetWeightRef.current = currentWeight;
      return () => clearTimeout(timer);
    }
    prevTargetWeightRef.current = currentWeight;
  }, [exercise?.target_load.weight_kg]);

  // Per-set inline editing states for typing freedom (KG & REPS)
  const [editingWeight, setEditingWeight] = useState<Record<number, string>>({});
  const [editingReps, setEditingReps] = useState<Record<number, string>>({});
  const [customSetLoads, setCustomSetLoads] = useState<Record<number, { weight?: number; reps?: number }>>({});

  const exerciseRecords = setHistory.filter((r) => r.exerciseId === exercise?.exercise_id);

  // Reset local editing when switching exercises
  useEffect(() => {
    setEditingWeight({});
    setEditingReps({});
    setCustomSetLoads({});
  }, [exercise?.exercise_id]);

  // Synchronize stepper and custom set loads whenever set advances or target reps calibrate
  useEffect(() => {
    if (customSetLoads[currentSet]) {
      const nextCustom = customSetLoads[currentSet];
      if (nextCustom.weight !== undefined) {
        updateCurrentExerciseTarget({ weight_kg: nextCustom.weight });
      }
      if (nextCustom.reps !== undefined) {
        setCompletedReps(nextCustom.reps);
        updateCurrentExerciseTarget({ reps: nextCustom.reps });
      }
    } else if (exercise?.target_load?.reps) {
      setCompletedReps(exercise.target_load.reps);
    }
  }, [currentSet, currentExerciseIndex, exercise?.exercise_id]);

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

  // Handle set completion trigger
  const handleComplete = () => {
    setShowRPEInput(true);
  };

  const handleRPESubmit = (rpe: number) => {
    const currentWeight =
      editingWeight[currentSet] !== undefined && !isNaN(parseFloat(editingWeight[currentSet]))
        ? parseFloat(editingWeight[currentSet])
        : exercise.target_load.weight_kg;

    completeSet(completedReps, rpe, currentWeight);

    // Clean up local draft for this completed set
    setEditingWeight((prev) => {
      const next = { ...prev };
      delete next[currentSet];
      return next;
    });
    setEditingReps((prev) => {
      const next = { ...prev };
      delete next[currentSet];
      return next;
    });
  };

  // Editable input handlers
  const handleWeightInputChange = (
    setNum: number,
    rawVal: string,
    isDone: boolean,
    isCurrent: boolean
  ) => {
    setEditingWeight((prev) => ({ ...prev, [setNum]: rawVal }));
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed) && parsed >= 0) {
      if (isDone) {
        updateSetRecordInHistory(exercise.exercise_id, setNum, { weight_kg: parsed });
      } else if (isCurrent) {
        updateCurrentExerciseTarget({ weight_kg: parsed });
      } else {
        setCustomSetLoads((prev) => ({
          ...prev,
          [setNum]: { ...prev[setNum], weight: parsed },
        }));
      }
    }
  };

  const handleWeightBlur = (setNum: number) => {
    setEditingWeight((prev) => {
      const next = { ...prev };
      delete next[setNum];
      return next;
    });
  };

  const handleRepsInputChange = (
    setNum: number,
    rawVal: string,
    isDone: boolean,
    isCurrent: boolean
  ) => {
    setEditingReps((prev) => ({ ...prev, [setNum]: rawVal }));
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed > 0) {
      if (isDone) {
        updateSetRecordInHistory(exercise.exercise_id, setNum, { reps_completed: parsed });
      } else if (isCurrent) {
        setCompletedReps(parsed);
        updateCurrentExerciseTarget({ reps: parsed });
      } else {
        setCustomSetLoads((prev) => ({
          ...prev,
          [setNum]: { ...prev[setNum], reps: parsed },
        }));
      }
    }
  };

  const handleRepsBlur = (setNum: number) => {
    setEditingReps((prev) => {
      const next = { ...prev };
      delete next[setNum];
      return next;
    });
  };

  const handleDeleteSet = (setNum: number) => {
    if (exercise.total_sets <= 1) return;
    removeSetFromCurrentExercise(setNum);
    setEditingWeight((prev) => {
      const next = { ...prev };
      delete next[setNum];
      return next;
    });
    setEditingReps((prev) => {
      const next = { ...prev };
      delete next[setNum];
      return next;
    });
  };

  const isNeutral = safetyTier >= 1 || exercise.grip_type.includes('中立') || exercise.grip_type.includes('對握');

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 pb-24 text-slate-800 flex flex-col">
      {/* 1. Top Exercise Pill Switcher Bar (Screen 4 inspired) */}
      <div className="mb-2">
        <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Layers className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>切換動作 ({currentExerciseIndex + 1}/{session.exercises.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={reverseExercisesOrder}
              className="text-[11px] font-semibold text-slate-600 hover:text-[#00D09C] bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
              title="前後次序調轉"
            >
              <RotateCcw className="w-3 h-3 text-[#00D09C]" />
              <span>前後調轉</span>
            </button>
            <button
              onClick={() => setShowPlanEditorModal(true)}
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#FF6B4A]" />
              <span>修改課表</span>
            </button>
          </div>
        </div>

        {/* Scrollable Pills with mouse-wheel and touch horizontal scroll support */}
        <div
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 touch-pan-x"
          style={{ scrollbarWidth: 'none' }}
        >
          {session.exercises.map((ex, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            return (
              <button
                key={`${ex.exercise_id}_${idx}`}
                onClick={() => jumpToExercise(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#00D09C] text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span>{ex.exercise_name}</span>
                <span className={`text-[10px] ${isCurrent ? 'text-white/90' : 'text-slate-400'}`}>
                  {ex.target_load.weight_kg}kg
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Focus Card (Screen 3: 訓練提示 - Exact White Viewport Replica) */}
      <div
        className={`w-full bg-white rounded-3xl shadow-md border overflow-hidden transition-all duration-500 relative flex flex-col ${
          safetyTier === 2
            ? 'border-rose-400 ring-4 ring-rose-200'
            : safetyTier === 1
            ? 'border-amber-400 ring-4 ring-amber-200'
            : 'border-slate-200/90'
        }`}
      >
        {/* Progress Bar Line along the very top edge (Signature Screen 3 feature) */}
        <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full bg-[#00D09C]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* Card Header: Back Arrow, Set Indicator, Orange Camera Video Button */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          {/* Back button */}
          <button
            onClick={resetSession}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="返回課表"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Set Tracker Pill */}
          <div className="text-center">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              第 {currentSet} / {exercise.total_sets} 組
            </span>
          </div>

          {/* Orange Camera Video Button (Screen 3 Feature!) */}
          <button
            onClick={() => setShowVideoModal(!showVideoModal)}
            className="w-9 h-9 rounded-full bg-[#FF6B4A] hover:bg-[#FF5530] text-white flex items-center justify-center shadow-md shadow-orange-500/30 transition-transform active:scale-95"
            title="查看發力角度與示範"
          >
            <Video className="w-4 h-4 fill-white" />
          </button>
        </div>

        {/* Safety Intervention Notice (if active) */}
        <AnimatePresence>
          {safetyTier === 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 border-y border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-xs font-bold"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>⚠️ Tier-1 關節防護：更換為對握中立握法，重量下調 20%！</span>
            </motion.div>
          )}
          {safetyTier === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 border-y border-rose-200 px-4 py-2 flex items-center gap-2 text-rose-800 text-xs font-bold"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>🛑 Tier-2 強制換機：已自動切換為坐姿機械式胸推機固定軌跡保護！</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real-time Change Notification Banner (原本是什麼並更改了什麼) */}
        <div className="px-4 pt-1.5">
          <ChangeNotificationBanner />
        </div>

        {/* Central Visual Demonstration Area (Motion Trajectory with Blue Arrows) */}
        <div className="relative w-full h-52 bg-slate-50/60 border-b border-slate-100 flex items-center justify-center px-4 overflow-hidden">
          <ExerciseIllustration
            exerciseId={exercise.exercise_id}
            exerciseName={exercise.exercise_name}
            isNeutralGrip={isNeutral}
            className="w-full h-full"
          />

          {/* Biomechanical Form Cue Badge */}
          <div className="absolute bottom-2 inset-x-4 flex justify-center">
            <span className="bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
              💡 {exercise.media.cue}
            </span>
          </div>
        </div>

        {/* Dynamic Calibration Banner (Double Progression RPE Result) */}
        {lastAdjustment && (
          <div className="px-5 pt-3">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C] shrink-0" />
              <span className="font-semibold">{lastAdjustment.summary}</span>
            </div>
          </div>
        )}

        {/* Exercise Name & Big Mint Green Count (Signature Screen 3 Style) */}
        <div className="p-5 text-center flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`${exercise.exercise_id}_${exercise.exercise_name}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="text-2xl font-black text-slate-900 tracking-tight mb-1"
            >
              {exercise.exercise_name}
            </motion.h2>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {exercise.grip_type}
            </span>
            <span className="text-xs text-slate-400">
              • 目標推滿 12 下解鎖升重
            </span>
          </div>

          {/* HUGE VIBRANT GREEN TARGET LOAD DISPLAY (Screen 3: 'x 12' / '16kg × 12') */}
          <div className="my-2 flex flex-col items-center">
            {/* Inline Animated Before/After Weight Diff Pill */}
            <AnimatePresence>
              {weightDeltaInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -6 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold shadow-2xs mb-1.5 transition-all ${
                    weightDeltaInfo.delta < 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  <span className="line-through opacity-70 font-mono">{weightDeltaInfo.prev}kg</span>
                  <span className="font-bold">➔</span>
                  <span className="font-mono font-black">{weightDeltaInfo.current}kg</span>
                  <span
                    className={`text-[10px] px-1 rounded font-mono font-black ${
                      weightDeltaInfo.delta < 0
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {weightDeltaInfo.delta > 0 ? `+${weightDeltaInfo.delta}` : weightDeltaInfo.delta}kg
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={`${exercise.target_load.weight_kg}_${exercise.target_load.reps}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-[#00D09C] font-black text-4xl sm:text-5xl tracking-tight tabular-nums flex items-baseline justify-center gap-2 overflow-hidden py-0.5"
            >
              <div className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={exercise.target_load.weight_kg}
                    initial={{
                      y: weightDeltaInfo && weightDeltaInfo.delta < 0 ? -22 : 22,
                      opacity: 0,
                      scale: 0.85,
                    }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{
                      y: weightDeltaInfo && weightDeltaInfo.delta < 0 ? 22 : -22,
                      opacity: 0,
                      scale: 0.85,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="inline-block"
                  >
                    {exercise.target_load.weight_kg}kg
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-2xl text-slate-300 font-light">×</span>
              <div className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={exercise.target_load.reps}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="inline-block"
                  >
                    {exercise.target_load.reps}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              目標配重與次數
            </p>
          </div>

          {/* ============================================================ */}
          {/* Hevy Signature Multi-Set Log Table (Image 4 像素級神還原) */}
          {/* ============================================================ */}
          <div className="w-full mt-3 mb-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Live Metrics Header Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1 text-sky-600">
                <Clock className="w-3.5 h-3.5" />
                <span>訓練中</span>
              </span>
              <span className="font-mono text-slate-600">
                當日累積：<b className="text-slate-900">{totalVolumeKg}kg</b>
              </span>
              <span className="font-mono text-slate-600">
                總組數：<b className="text-[#00A87E]">{setHistory.length} 組</b>
              </span>
            </div>

            {/* Table Header: SET | PREVIOUS | KG | REPS | RPE | ✓ | DEL */}
            <div className="grid grid-cols-12 gap-1 py-1.5 px-2 bg-slate-100/60 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center items-center">
              <div className="col-span-1 text-center">組別</div>
              <div className="col-span-3 text-center">上次紀錄</div>
              <div className="col-span-2 text-center">公斤</div>
              <div className="col-span-2 text-center">次數</div>
              <div className="col-span-2 text-center">RPE</div>
              <div className="col-span-1 text-center">完成</div>
              <div className="col-span-1 text-center">刪除</div>
            </div>

            {/* Table Rows with Freely Editable Weight & Reps */}
            <div className="divide-y divide-slate-100 px-1.5 py-1">
              {Array.from({ length: exercise.total_sets }).map((_, idx) => {
                const setNum = idx + 1;
                const historyItem = exerciseRecords.find((r) => r.setNumber === setNum);
                const isDone = !!historyItem;
                const isCurrent = setNum === currentSet;
                const isWarmup = setNum === 1 && exercise.total_sets >= 4;

                const displayWeight =
                  editingWeight[setNum] !== undefined
                    ? editingWeight[setNum]
                    : isDone
                    ? `${historyItem.weight_kg}`
                    : isCurrent
                    ? `${exercise.target_load.weight_kg}`
                    : `${customSetLoads[setNum]?.weight ?? exercise.target_load.weight_kg}`;

                const displayReps =
                  editingReps[setNum] !== undefined
                    ? editingReps[setNum]
                    : isDone
                    ? `${historyItem.reps_completed}`
                    : isCurrent
                    ? `${completedReps}`
                    : `${customSetLoads[setNum]?.reps ?? exercise.target_load.reps}`;

                return (
                  <div
                    key={setNum}
                    className={`grid grid-cols-12 gap-1 py-1.5 px-1 rounded-xl items-center text-xs transition-all my-0.5 ${
                      isDone
                        ? 'bg-[#00D09C]/15 border border-[#00D09C]/30 text-slate-900'
                        : isCurrent
                        ? 'bg-slate-50/90 border-2 border-[#00D09C] ring-2 ring-[#00D09C]/15 shadow-2xs'
                        : 'text-slate-400'
                    }`}
                  >
                    {/* Set Tag */}
                    <div className="col-span-1 flex justify-center font-black">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                          isDone
                            ? 'bg-[#00D09C] text-slate-950'
                            : isCurrent
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isWarmup ? 'W' : setNum}
                      </span>
                    </div>

                    {/* Previous record */}
                    <div className="col-span-3 text-center text-[11px] font-mono text-slate-400 truncate">
                      {Math.max(10, exercise.target_load.weight_kg - 2)}kg × 10
                    </div>

                    {/* KG Input (Freely Editable) */}
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        min="0"
                        max="500"
                        value={displayWeight}
                        onChange={(e) => handleWeightInputChange(setNum, e.target.value, isDone, isCurrent)}
                        onBlur={() => handleWeightBlur(setNum)}
                        onFocus={(e) => e.target.select()}
                        aria-label={`第 ${setNum} 組重量(公斤)`}
                        className={`w-full py-1 px-0.5 rounded-lg text-center font-mono font-bold text-xs transition-all outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDone
                            ? 'bg-white/90 border border-emerald-300 text-emerald-950 font-black shadow-2xs focus:ring-2 focus:ring-[#00D09C]'
                            : isCurrent
                            ? 'bg-white border-2 border-[#00D09C] text-slate-900 font-black shadow-2xs focus:ring-2 focus:ring-[#00D09C]'
                            : 'bg-slate-100/90 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80 focus:bg-white focus:border-[#00D09C] focus:ring-2 focus:ring-[#00D09C]/30'
                        }`}
                      />
                    </div>

                    {/* REPS Input (Freely Editable) */}
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="number"
                        inputMode="numeric"
                        step="1"
                        min="1"
                        max="100"
                        value={displayReps}
                        onChange={(e) => handleRepsInputChange(setNum, e.target.value, isDone, isCurrent)}
                        onBlur={() => handleRepsBlur(setNum)}
                        onFocus={(e) => e.target.select()}
                        aria-label={`第 ${setNum} 組次數`}
                        className={`w-full py-1 px-0.5 rounded-lg text-center font-mono font-bold text-xs transition-all outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDone
                            ? 'bg-white/90 border border-emerald-300 text-emerald-950 font-black shadow-2xs focus:ring-2 focus:ring-[#00D09C]'
                            : isCurrent
                            ? 'bg-white border-2 border-[#00D09C] text-slate-900 font-black shadow-2xs focus:ring-2 focus:ring-[#00D09C]'
                            : 'bg-slate-100/90 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80 focus:bg-white focus:border-[#00D09C] focus:ring-2 focus:ring-[#00D09C]/30'
                        }`}
                      />
                    </div>

                    {/* RPE */}
                    <div className="col-span-2 text-center">
                      <span
                        className={`px-1 py-0.5 rounded text-[10px] font-mono font-bold block truncate ${
                          isDone
                            ? 'bg-white/80 text-emerald-800 shadow-2xs'
                            : isCurrent
                            ? 'bg-slate-200 text-slate-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {isDone ? `RPE ${historyItem.rpe}` : 'RPE 8'}
                      </span>
                    </div>

                    {/* Checkmark Button */}
                    <div className="col-span-1 flex justify-center">
                      {isDone ? (
                        <div className="w-5 h-5 rounded-md bg-[#00D09C] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <button
                          type="button"
                          onClick={handleComplete}
                          className="w-5 h-5 rounded-md bg-[#00D09C] hover:bg-[#00B98A] text-white flex items-center justify-center shadow-sm cursor-pointer active:scale-90 transition-transform"
                          title="完成當前組"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>
                      ) : (
                        <div className="w-5 h-5 rounded-md border border-slate-200" />
                      )}
                    </div>

                    {/* Delete Set Button */}
                    <div className="col-span-1 flex justify-center">
                      {exercise.total_sets > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteSet(setNum)}
                          className="w-5 h-5 rounded-md hover:bg-rose-100/80 text-slate-300 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer group"
                          title={`刪除第 ${setNum} 組`}
                        >
                          <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        </button>
                      ) : (
                        <span className="w-5 h-5 block" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions: + 新增一組 & - 刪除一組 */}
            <div className="p-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={addSetToCurrentExercise}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-98"
              >
                <Plus className="w-3.5 h-3.5 text-[#00D09C]" />
                <span>+ 新增一組 (Add Set)</span>
              </button>
              <button
                type="button"
                onClick={() => removeSetFromCurrentExercise()}
                disabled={exercise.total_sets <= 1}
                className={`flex-1 py-1.5 px-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                  exercise.total_sets <= 1
                    ? 'bg-slate-100/60 border-slate-200/60 text-slate-300 cursor-not-allowed'
                    : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 cursor-pointer active:scale-98'
                }`}
                title={exercise.total_sets <= 1 ? '最少需保留 1 組' : '刪除最後一組'}
              >
                <Minus className="w-3.5 h-3.5 text-rose-500" />
                <span>- 刪除一組 (Remove Set)</span>
              </button>
            </div>
          </div>

          {/* Actual Reps Stepper Counter */}
          <div className="flex items-center gap-3 mt-2 mb-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 px-3">
            <button
              onClick={() => {
                const nextReps = Math.max(1, completedReps - 1);
                setCompletedReps(nextReps);
                updateCurrentExerciseTarget({ reps: nextReps });
              }}
              className="w-8 h-8 rounded-xl bg-white text-slate-600 font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              −
            </button>
            <div className="px-2 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">實際完成</span>
              <span className="text-lg font-black text-slate-800 tabular-nums">
                {completedReps} <span className="text-xs font-normal text-slate-500">下</span>
              </span>
            </div>
            <button
              onClick={() => {
                const nextReps = Math.min(30, completedReps + 1);
                setCompletedReps(nextReps);
                updateCurrentExerciseTarget({ reps: nextReps });
              }}
              className="w-8 h-8 rounded-xl bg-white text-slate-600 font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            >
              +
            </button>
          </div>

          {/* 3. Bottom Controls: < [BIG GREEN CHECKMARK BUTTON] > (Exact Screen 3 Replica!) */}
          <div className="w-full flex items-center justify-center gap-8 pt-2 pb-1">
            {/* Previous set arrow */}
            <button
              onClick={() => {
                const nextReps = Math.max(1, completedReps - 1);
                setCompletedReps(nextReps);
                updateCurrentExerciseTarget({ reps: nextReps });
              }}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="調降次數"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* BIG VIBRANT GREEN ROUND CHECKMARK BUTTON */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleComplete}
              className="w-20 h-20 rounded-full bg-[#00D09C] hover:bg-[#00B887] text-white shadow-xl shadow-emerald-500/35 flex items-center justify-center transition-all cursor-pointer"
              title="完成當前組數"
            >
              <Check className="w-10 h-10 stroke-[3]" />
            </motion.button>

            {/* Next set arrow */}
            <button
              onClick={() => {
                const nextReps = Math.min(30, completedReps + 1);
                setCompletedReps(nextReps);
                updateCurrentExerciseTarget({ reps: nextReps });
              }}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="提高次數"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* 4. HoldOn Coach Smart Safety Safeguards (Clean Minimalist Pills) */}
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Pain Alert Button */}
          <button
            onClick={() => setShowPainInput(true)}
            className="flex-1 py-2 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>⚠️ 痛感煞車</span>
          </button>

          {/* Manual Drop Weight Button */}
          <button
            onClick={() => dropWeightManually('手動回報有點硬')}
            className="flex-1 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>有點硬 降重</span>
          </button>

          {/* Voice Listener Button */}
          <button
            onClick={toggleVoice}
            className={`py-2 px-3 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              isListening
                ? 'bg-emerald-500 border-emerald-500 text-white animate-pulse'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="語音喊「推完了」、「有點硬」、「痛」"
          >
            {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isListening ? '監聽中' : '語音'}</span>
          </button>
        </div>
      </div>

      {/* Voice Prompt Helper Hint */}
      <div className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <span>🎙️ 語音可直接喊：「推完了」、「有點硬」、「肩膀痛」、「再休30秒」</span>
        {lastVoiceText && (
          <span className="text-[#00D09C] font-semibold ml-1">
            (聽到: &quot;{lastVoiceText}&quot;)
          </span>
        )}
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
