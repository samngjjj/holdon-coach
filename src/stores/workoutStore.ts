// ============================================================
// HoldOn Coach — Zustand Workout Store
// Core state management, Double Progression, Multi-Plan, Profile, Diet & AI Coach Chat
// ============================================================

import { create } from 'zustand';
import {
  type WorkoutSession,
  type ExerciseCard,
  type CoachFeedback,
  type UserProfile,
  type WorkoutHistoryEntry,
  type DailyDietRecord,
  type MealCategory,
  type MealItem,
  MOCK_SESSION,
  WORKOUT_PLANS,
  INITIAL_WORKOUT_HISTORY,
  DEFAULT_USER_PROFILE,
  INITIAL_TODAY_DIET,
  DUMBBELL_LADDER,
  getNextWeight,
  getReducedWeight,
  HARD_LIMIT_KG,
  COACH_MESSAGES,
  calculateProfileStats,
} from '@/data/exercises';
import { generateAICoachResponse, type ChatMessage, type AIPlanAction } from '@/lib/aiCoachEngine';
import { EXERCISE_CATALOG_POOL } from '@/data/exerciseCatalog';

// ============================================================
// Dynamic Adjustment Record
// ============================================================
export interface DynamicAdjustment {
  rpe: number;
  prevWeight: number;
  newWeight: number;
  prevReps: number;
  newReps: number;
  type: 'weight_drop' | 'weight_up' | 'reps_up' | 'reps_down' | 'maintain';
  summary: string;
}

// ============================================================
// Real-Time Change Notice Records (動作與重量更換即時通知)
// ============================================================
export interface ExerciseChangeNotice {
  id: string;
  prevExerciseName: string;
  newExerciseName: string;
  prevWeight?: number;
  newWeight?: number;
  prevGrip?: string;
  newGrip?: string;
  reason: string;
  type: 'switch' | 'safety_replacement' | 'next' | 'reorder';
  timestamp: number;
}

export interface WeightChangeNotice {
  id: string;
  prevWeight: number;
  newWeight: number;
  delta: number;
  prevReps?: number;
  newReps?: number;
  reason: string;
  type: 'drop' | 'increase' | 'manual';
  timestamp: number;
}

// ============================================================
// Set Record — tracks each completed set
// ============================================================
export interface SetRecord {
  exerciseId: string;
  setNumber: number;
  weight_kg: number;
  reps_completed: number;
  rpe: number;
  pain_reported: boolean;
  pain_location?: string;
  rest_seconds: number;
  extension_seconds: number;
  timestamp: number;
}

export interface MuscleGroupRecovery {
  id: string;
  name: string;
  latinName: string;
  recoveryPct: number; // 0 - 100
  lastTrainedHoursAgo: number;
  status: 'fatigued' | 'recovering' | 'ready';
  lastWorkoutName: string;
  estimatedReadyHours: number;
  aiTip: string;
}

export const INITIAL_MUSCLE_RECOVERIES: MuscleGroupRecovery[] = [
  {
    id: 'chest',
    name: '胸大肌',
    latinName: 'Pectoralis Major',
    recoveryPct: 25,
    lastTrainedHoursAgo: 2,
    status: 'fatigued',
    lastWorkoutName: 'Jeff Nippard 終極推日',
    estimatedReadyHours: 42,
    aiTip: '正處於微肌纖維撕裂與發炎期，嚴禁高強度推舉，建議充分補充蛋白質。',
  },
  {
    id: 'triceps',
    name: '肱三頭肌',
    latinName: 'Triceps Brachii',
    recoveryPct: 30,
    lastTrainedHoursAgo: 2,
    status: 'fatigued',
    lastWorkoutName: 'Jeff Nippard 終極推日',
    estimatedReadyHours: 36,
    aiTip: '長頭延展位疲勞中，適合做輕度動態伸展，避免肘關節過度鎖死。',
  },
  {
    id: 'deltoids',
    name: '三角肌 (前/中/後)',
    latinName: 'Deltoideus',
    recoveryPct: 45,
    lastTrainedHoursAgo: 14,
    status: 'recovering',
    lastWorkoutName: '肩胛平面側平舉',
    estimatedReadyHours: 24,
    aiTip: '肌纖維超量恢復中，神經疲勞已趨緩，明日可恢復輕度負載。',
  },
  {
    id: 'back',
    name: '背部肌群 (背闊/上背)',
    latinName: 'Latissimus Dorsi',
    recoveryPct: 95,
    lastTrainedHoursAgo: 68,
    status: 'ready',
    lastWorkoutName: '垂直下拉與胸托划船',
    estimatedReadyHours: 0,
    aiTip: '肌糖原與肌原纖維已 100% 超量恢復，今日強烈推薦轟炸背部（Pull Day）！',
  },
  {
    id: 'biceps',
    name: '肱二頭肌',
    latinName: 'Biceps Brachii',
    recoveryPct: 100,
    lastTrainedHoursAgo: 68,
    status: 'ready',
    lastWorkoutName: '45° 上斜二頭彎舉',
    estimatedReadyHours: 0,
    aiTip: '狀態頂峰，握力與長頭神經募集感處於最佳生理週期。',
  },
  {
    id: 'quads',
    name: '股四頭肌',
    latinName: 'Quadriceps Femoris',
    recoveryPct: 90,
    lastTrainedHoursAgo: 72,
    status: 'ready',
    lastWorkoutName: '高腳杯深蹲與分腿蹲',
    estimatedReadyHours: 0,
    aiTip: '膝關節滑液與股四頭肌完全就緒，可承受大重量機械張力。',
  },
  {
    id: 'hamstrings_glutes',
    name: '臀大肌與膕繩肌',
    latinName: 'Gluteus & Hamstrings',
    recoveryPct: 88,
    lastTrainedHoursAgo: 72,
    status: 'ready',
    lastWorkoutName: 'RDL 羅馬尼亞硬舉',
    estimatedReadyHours: 0,
    aiTip: '後側動力鏈修復完成，適合進行重載髖鉸鏈（Hip Hinge）訓練。',
  },
  {
    id: 'core',
    name: '腹部核心肌群',
    latinName: 'Core & Abdominals',
    recoveryPct: 80,
    lastTrainedHoursAgo: 24,
    status: 'ready',
    lastWorkoutName: '骨盆後傾捲動與長力臂平板',
    estimatedReadyHours: 0,
    aiTip: '抗伸展等長收縮能力良好，可配合任何全身課表穩定脊椎。',
  },
];

// ============================================================
// Workout State Interface
// ============================================================
export type AppTab = 'plans' | 'workout' | 'diet' | 'progress' | 'chat';

interface WorkoutState {
  // Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Profile
  userProfile: UserProfile;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Session & Multi-Plan
  session: WorkoutSession;
  currentExerciseIndex: number;
  currentSet: number;
  isResting: boolean;
  restSecondsRemaining: number;
  restDefaultSeconds: number;
  totalExtensionSeconds: number;

  // Progression & Dynamic Adjustment Tracking
  setHistory: SetRecord[];
  consecutiveMaxRepSets: number;
  lastAdjustment: DynamicAdjustment | null;

  // Safety
  safetyTier: 0 | 1 | 2;
  painLocation: string | null;

  // UI state
  showRPEInput: boolean;
  showPainInput: boolean;
  showHardLimitWarning: boolean;
  showSummary: boolean;
  showHistoryModal: boolean;
  setShowHistoryModal: (show: boolean) => void;
  showPlanEditorModal: boolean;
  setShowPlanEditorModal: (show: boolean) => void;
  isListening: boolean;

  // Real-time Animation Change Notices (原本是什麼並更改了什麼)
  exerciseChangeNotice: ExerciseChangeNotice | null;
  weightChangeNotice: WeightChangeNotice | null;
  clearExerciseChangeNotice: () => void;
  clearWeightChangeNotice: () => void;

  // Feature 1: Shareable PR & Workout Card Modal
  showShareCardModal: boolean;
  setShowShareCardModal: (show: boolean) => void;

  // Feature 2: 2D/3D Muscular Recovery Heatmap
  showHeatmapModal: boolean;
  setShowHeatmapModal: (show: boolean) => void;
  selectedHeatmapMuscle: string | null;
  setSelectedHeatmapMuscle: (id: string | null) => void;
  muscleRecoveries: MuscleGroupRecovery[];
  updateMuscleRecoveryAfterWorkout: (planId: string) => void;

  // User Onboarding Flow (新手第一次登入完整導引)
  hasCompletedOnboarding: boolean;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  completeOnboarding: (
    profile: Partial<UserProfile>,
    chosenPlanId?: string,
    openEditor?: boolean
  ) => void;
  restartOnboarding: () => void;

  // History & Trends
  history: WorkoutHistoryEntry[];

  // Diet & Nutrition Tracking
  dietRecord: DailyDietRecord;
  addMealItem: (mealType: MealCategory, item: Omit<MealItem, 'id'>) => void;
  removeMealItem: (mealType: MealCategory, itemId: string) => void;

  // AI Fitness Coach Chat
  chatMessages: ChatMessage[];
  isGeneratingResponse: boolean;
  sendChatMessage: (content: string) => void;
  clearChat: () => void;

  // Computed
  totalVolumeKg: number;

  // Actions
  startWorkout: () => void;
  startEmptyWorkout: () => void;
  selectPlan: (planId: string) => void;
  completeSet: (repsCompleted: number, rpe: number, customWeight?: number) => void;
  addSetToCurrentExercise: () => void;
  removeSetFromCurrentExercise: (setIndex?: number) => void;
  updateSetRecordInHistory: (
    exerciseId: string,
    setNumber: number,
    partial: { weight_kg?: number; reps_completed?: number; rpe?: number }
  ) => void;
  updateCurrentExerciseTarget: (partial: { weight_kg?: number; reps?: number }) => void;
  dropWeightManually: (reason?: string) => void;
  reportPain: (location: string) => void;
  startRest: () => void;
  extendRest: (seconds?: number) => void;
  tickRest: () => void;
  endRest: () => void;
  nextExercise: () => void;
  setShowRPEInput: (show: boolean) => void;
  setShowPainInput: (show: boolean) => void;
  dismissHardLimitWarning: () => void;
  toggleListening: () => void;
  processVoiceCommand: (transcript: string) => void;
  finishWorkout: () => void;
  resetSession: () => void;

  // Plan Modification & Exercise Reordering
  jumpToExercise: (index: number) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;
  moveExerciseUp: (index: number) => void;
  moveExerciseDown: (index: number) => void;
  reverseExercisesOrder: () => void;
  removeExerciseFromSession: (index: number) => void;
  addExerciseToSession: (item: any) => void;
  updateExerciseInSession: (index: number, patch: Partial<ExerciseCard>) => void;
  applyAIPlanAction: (action: AIPlanAction) => { success: boolean; message: string };

  // Fast Demo Helpers
  fastCompleteCurrentSet: (customRpe?: number) => void;
  fastTriggerPain: () => void;
  fastTriggerStruggleDrop: () => void;
  fastFinishAll: () => void;
}

// Storage Helpers
function getStoredHistory(): WorkoutHistoryEntry[] {
  if (typeof window === 'undefined') return INITIAL_WORKOUT_HISTORY;
  try {
    const raw = localStorage.getItem('holdon_workout_history');
    return raw ? JSON.parse(raw) : INITIAL_WORKOUT_HISTORY;
  } catch {
    return INITIAL_WORKOUT_HISTORY;
  }
}

function getStoredProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem('holdon_user_profile');
    return raw ? JSON.parse(raw) : DEFAULT_USER_PROFILE;
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

function getStoredDiet(): DailyDietRecord {
  if (typeof window === 'undefined') return INITIAL_TODAY_DIET;
  try {
    const raw = localStorage.getItem('holdon_daily_diet');
    return raw ? JSON.parse(raw) : INITIAL_TODAY_DIET;
  } catch {
    return INITIAL_TODAY_DIET;
  }
}

function getStoredOnboardingStatus(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('holdon_completed_onboarding') === 'true';
  } catch {
    return false;
  }
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_0',
    role: 'assistant',
    content: '嗨！我是你的隨身專屬 AI 健身教練 🏋️‍♂️ 我已即時讀取你的身體素質（74kg / 體脂 16.5%）、今日課表【推胸肩三頭】以及飲食紀錄。有任何動作發力、配重加減、受傷防護或超商外食推薦，隨時發問！',
    timestamp: Date.now() - 10000,
  },
];

// ============================================================
// Double Progression Logic with Deterministic Dynamic RPE Calibration
// ============================================================
function calculateNextTarget(
  currentWeight: number,
  currentTargetReps: number,
  repsCompleted: number,
  rpe: number,
  consecutiveMaxReps: number,
  safetyTier: number
): {
  weight_kg: number;
  reps: number;
  consecutiveMaxReps: number;
  feedback: CoachFeedback;
  restAdjustmentSeconds?: number;
  adjustment: DynamicAdjustment;
} {
  if (safetyTier > 0) {
    const reduced = getReducedWeight(currentWeight, 0.20);
    return {
      weight_kg: reduced,
      reps: 8,
      consecutiveMaxReps: 0,
      feedback: {
        speech_text: safetyTier === 1 ? COACH_MESSAGES.tier1_alert : COACH_MESSAGES.tier2_alert,
        tone: 'warning',
      },
      adjustment: {
        rpe,
        prevWeight: currentWeight,
        newWeight: reduced,
        prevReps: currentTargetReps,
        newReps: 8,
        type: 'weight_drop',
        summary: `關節痛感防護：重量下調 20% (${currentWeight}kg ➔ ${reduced}kg)，次數改為 8 下中立保護！`,
      },
    };
  }

  // Case A: RPE 10 (極限力竭)
  if (rpe >= 10) {
    const reduced = getReducedWeight(currentWeight, 0.20);
    const newReps = 8;
    return {
      weight_kg: reduced,
      reps: newReps,
      consecutiveMaxReps: 0,
      restAdjustmentSeconds: 120,
      feedback: {
        speech_text: COACH_MESSAGES.weight_drop_rpe10(reduced),
        tone: 'warning',
      },
      adjustment: {
        rpe,
        prevWeight: currentWeight,
        newWeight: reduced,
        prevReps: currentTargetReps,
        newReps,
        type: 'weight_drop',
        summary: `RPE 10 力竭煞車：重量下修 20% (${currentWeight}kg ➔ ${reduced}kg)，次數調降為 8 下，延長休息至 120s！`,
      },
    };
  }

  // Case B: RPE 9 (有點硬)
  if (rpe === 9) {
    const reduced = getReducedWeight(currentWeight, 0.15);
    const newReps = 8;
    return {
      weight_kg: reduced,
      reps: newReps,
      consecutiveMaxReps: 0,
      restAdjustmentSeconds: 105,
      feedback: {
        speech_text: COACH_MESSAGES.weight_drop_rpe9(reduced),
        tone: 'warning',
      },
      adjustment: {
        rpe,
        prevWeight: currentWeight,
        newWeight: reduced,
        prevReps: currentTargetReps,
        newReps,
        type: 'weight_drop',
        summary: `RPE 9 有點硬：教練主動踩煞車降一檔重量 (${currentWeight}kg ➔ ${reduced}kg)，次數改為 8 下，避免關節代償！`,
      },
    };
  }

  // Case C: RPE 6 或 RPE 7 (輕鬆) -> 次數直跳 12 下
  if (rpe <= 7) {
    if (repsCompleted >= 12) {
      const newConsecutive = consecutiveMaxReps + 1;
      if (newConsecutive >= 2) {
        const nextWeight = getNextWeight(currentWeight);
        return {
          weight_kg: nextWeight,
          reps: 8,
          consecutiveMaxReps: 0,
          feedback: {
            speech_text: COACH_MESSAGES.weight_unlock(nextWeight),
            tone: 'celebrating',
          },
          adjustment: {
            rpe,
            prevWeight: currentWeight,
            newWeight: nextWeight,
            prevReps: currentTargetReps,
            newReps: 8,
            type: 'weight_up',
            summary: `連續兩組輕鬆推滿 12 下！解鎖加重 (${currentWeight}kg ➔ ${nextWeight}kg)，次數重置回 8 下！`,
          },
        };
      }

      return {
        weight_kg: currentWeight,
        reps: 12,
        consecutiveMaxReps: 1,
        feedback: {
          speech_text: '第 1 組滿 12 下！維持當前重量，下一組再推滿 12 下就正式幫你加重！🔥',
          tone: 'encouraging',
        },
        adjustment: {
          rpe,
          prevWeight: currentWeight,
          newWeight: currentWeight,
          prevReps: currentTargetReps,
          newReps: 12,
          type: 'maintain',
          summary: `推滿 12 下 (1/2)：維持 ${currentWeight}kg × 12下，再滿 1 組即解鎖升重！`,
        },
      };
    }

    return {
      weight_kg: currentWeight,
      reps: 12,
      consecutiveMaxReps: 0,
      feedback: {
        speech_text: '感覺很輕鬆？教練先別加重！下一組目標直接拉滿到 12 下，推滿才准加重！💪',
        tone: 'encouraging',
      },
      adjustment: {
        rpe,
        prevWeight: currentWeight,
        newWeight: currentWeight,
        prevReps: currentTargetReps,
        newReps: 12,
        type: 'reps_up',
        summary: `RPE ${rpe} 輕鬆：貫徹先別加重！維持 ${currentWeight}kg，目標次數由 ${currentTargetReps}下 直接調升至 12 下滿次！`,
      },
    };
  }

  // Case D: RPE 8 (剛好)
  if (repsCompleted >= 12) {
    const newConsecutive = consecutiveMaxReps + 1;
    if (newConsecutive >= 2) {
      const nextWeight = getNextWeight(currentWeight);
      if (nextWeight > HARD_LIMIT_KG) {
        return {
          weight_kg: currentWeight,
          reps: 12,
          consecutiveMaxReps: newConsecutive,
          feedback: { speech_text: COACH_MESSAGES.hard_limit, tone: 'warning' },
          adjustment: {
            rpe,
            prevWeight: currentWeight,
            newWeight: currentWeight,
            prevReps: 12,
            newReps: 12,
            type: 'maintain',
            summary: `已達極限安全上限 (${HARD_LIMIT_KG}kg)，維持高次數高品質刺激！`,
          },
        };
      }

      return {
        weight_kg: nextWeight,
        reps: 8,
        consecutiveMaxReps: 0,
        feedback: {
          speech_text: COACH_MESSAGES.weight_unlock(nextWeight),
          tone: 'celebrating',
        },
        adjustment: {
          rpe,
          prevWeight: currentWeight,
          newWeight: nextWeight,
          prevReps: currentTargetReps,
          newReps: 8,
          type: 'weight_up',
          summary: `連續兩組滿 12 下解鎖！重量提升 (${currentWeight}kg ➔ ${nextWeight}kg)，次數重置為 8 下！`,
        },
      };
    }

    return {
      weight_kg: currentWeight,
      reps: 12,
      consecutiveMaxReps: 1,
      feedback: {
        speech_text: '第 1 組穩穩推滿 12 下！下一組再滿 12 下就解鎖升重！🔥',
        tone: 'encouraging',
      },
      adjustment: {
        rpe,
        prevWeight: currentWeight,
        newWeight: currentWeight,
        prevReps: currentTargetReps,
        newReps: 12,
        type: 'maintain',
        summary: `第 1 組滿 12 下：維持 ${currentWeight}kg × 12下，下一組再次滿次即升重！`,
      },
    };
  }

  // RPE 8 正常推進至 12 下
  const newReps = Math.min(Math.max(currentTargetReps + 2, 10), 12);
  return {
    weight_kg: currentWeight,
    reps: newReps,
    consecutiveMaxReps: 0,
    feedback: {
      speech_text: `強度剛剛好！維持 ${currentWeight}kg，下一組目標提高到 ${newReps} 下！👊`,
      tone: 'encouraging',
    },
    adjustment: {
      rpe,
      prevWeight: currentWeight,
      newWeight: currentWeight,
      prevReps: currentTargetReps,
      newReps,
      type: 'reps_up',
      summary: `RPE 8 剛好：維持 ${currentWeight}kg，目標次數提高到 ${newReps} 下！`,
    },
  };
}

// ============================================================
// Store Implementation
// ============================================================
export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  // Navigation
  activeTab: 'workout',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Profile
  userProfile: getStoredProfile(),
  showProfileModal: false,
  setShowProfileModal: (show) => set({ showProfileModal: show }),

  updateUserProfile: (partial) => {
    const current = get().userProfile;
    const updated = { ...current, ...partial };
    try {
      localStorage.setItem('holdon_user_profile', JSON.stringify(updated));
    } catch {}

    const { recommendedPressKg, tdee, targetProteinG, targetCarbG, targetFatG } = calculateProfileStats(updated);

    const activeExercises = get().session.exercises.map((ex, idx) => {
      if (idx === 0) {
        return {
          ...ex,
          target_load: { ...ex.target_load, weight_kg: recommendedPressKg },
        };
      }
      return ex;
    });

    const currentDiet = get().dietRecord;
    const updatedDiet: DailyDietRecord = {
      ...currentDiet,
      targetCalories: tdee + currentDiet.workoutBonusCalories,
      targetProtein: targetProteinG + currentDiet.workoutBonusProtein,
      targetCarbs: targetCarbG + currentDiet.workoutBonusCarbs,
      targetFat: targetFatG,
    };

    set({
      userProfile: updated,
      dietRecord: updatedDiet,
      session: {
        ...get().session,
        user_name: updated.name,
        exercises: activeExercises,
      },
    });
  },

  session: { ...MOCK_SESSION },
  currentExerciseIndex: 0,
  currentSet: 1,
  isResting: false,
  restSecondsRemaining: 90,
  restDefaultSeconds: 90,
  totalExtensionSeconds: 0,

  setHistory: [],
  consecutiveMaxRepSets: 0,
  lastAdjustment: null,

  safetyTier: 0,
  painLocation: null,

  showRPEInput: false,
  showPainInput: false,
  showHardLimitWarning: false,
  showSummary: false,
  showHistoryModal: false,
  setShowHistoryModal: (show) => set({ showHistoryModal: show }),
  showPlanEditorModal: false,
  setShowPlanEditorModal: (show) => set({ showPlanEditorModal: show }),
  isListening: false,

  // Real-time Animation Change Notices
  exerciseChangeNotice: null,
  weightChangeNotice: null,
  clearExerciseChangeNotice: () => set({ exerciseChangeNotice: null }),
  clearWeightChangeNotice: () => set({ weightChangeNotice: null }),

  // Feature 1: Shareable PR & Workout Card Modal
  showShareCardModal: false,
  setShowShareCardModal: (show) => set({ showShareCardModal: show }),

  // Feature 2: 2D/3D Muscular Recovery Heatmap
  showHeatmapModal: false,
  setShowHeatmapModal: (show) => set({ showHeatmapModal: show }),
  selectedHeatmapMuscle: null,
  setSelectedHeatmapMuscle: (id) => set({ selectedHeatmapMuscle: id }),
  muscleRecoveries: INITIAL_MUSCLE_RECOVERIES,
  updateMuscleRecoveryAfterWorkout: (planId: string) => {
    const list = [...get().muscleRecoveries];
    const isPush = planId.includes('push') || planId.includes('chest');
    const isPull = planId.includes('pull');
    const isLegs = planId.includes('legs') || planId.includes('glutes');
    const isCore = planId.includes('belly') || planId.includes('abs') || planId.includes('fat_loss');
    const isUpper = planId.includes('upper');
    const isLower = planId.includes('lower');
    const isFullBody = planId.includes('full_body');

    const updated = list.map((m) => {
      let isTargeted = false;
      if (isPush && (m.id === 'chest' || m.id === 'triceps' || m.id === 'deltoids')) isTargeted = true;
      if (isPull && (m.id === 'back' || m.id === 'biceps' || m.id === 'deltoids')) isTargeted = true;
      if (isLegs && (m.id === 'quads' || m.id === 'hamstrings_glutes')) isTargeted = true;
      if (isCore && m.id === 'core') isTargeted = true;
      if (isUpper && (m.id === 'chest' || m.id === 'back' || m.id === 'deltoids' || m.id === 'biceps' || m.id === 'triceps')) isTargeted = true;
      if (isLower && (m.id === 'quads' || m.id === 'hamstrings_glutes' || m.id === 'core')) isTargeted = true;
      if (isFullBody) isTargeted = true;

      if (isTargeted) {
        return {
          ...m,
          recoveryPct: Math.floor(Math.random() * 10) + 18,
          lastTrainedHoursAgo: 0,
          status: 'fatigued' as const,
          estimatedReadyHours: 48,
          lastWorkoutName: get().session.plan_name,
        };
      }
      return m;
    });

    set({ muscleRecoveries: updated });
  },

  // User Onboarding Flow (新手第一次登入完整導引)
  hasCompletedOnboarding: getStoredOnboardingStatus(),
  showOnboardingModal: false,
  setShowOnboardingModal: (show) => set({ showOnboardingModal: show }),
  completeOnboarding: (profilePartial, chosenPlanId, openEditor) => {
    const currentProfile = get().userProfile;
    const updatedProfile = { ...currentProfile, ...profilePartial };
    try {
      localStorage.setItem('holdon_user_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('holdon_completed_onboarding', 'true');
    } catch {}

    get().updateUserProfile(profilePartial);

    if (chosenPlanId) {
      get().selectPlan(chosenPlanId);
    }

    set({
      hasCompletedOnboarding: true,
      showOnboardingModal: false,
      activeTab: 'workout',
      showPlanEditorModal: !!openEditor,
    });
  },
  restartOnboarding: () => {
    try {
      localStorage.removeItem('holdon_completed_onboarding');
    } catch {}
    set({
      hasCompletedOnboarding: false,
      showOnboardingModal: true,
    });
  },

  history: getStoredHistory(),
  totalVolumeKg: 0,

  // Diet & Nutrition
  dietRecord: getStoredDiet(),

  addMealItem: (mealType, itemData) => {
    const current = get().dietRecord;
    const newItem: MealItem = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: itemData.time || new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated: DailyDietRecord = {
      ...current,
      meals: {
        ...current.meals,
        [mealType]: [...current.meals[mealType], newItem],
      },
    };

    try {
      localStorage.setItem('holdon_daily_diet', JSON.stringify(updated));
    } catch {}

    set({ dietRecord: updated });
  },

  removeMealItem: (mealType, itemId) => {
    const current = get().dietRecord;
    const updated: DailyDietRecord = {
      ...current,
      meals: {
        ...current.meals,
        [mealType]: current.meals[mealType].filter((m) => m.id !== itemId),
      },
    };

    try {
      localStorage.setItem('holdon_daily_diet', JSON.stringify(updated));
    } catch {}

    set({ dietRecord: updated });
  },

  // AI Fitness Coach Chat
  chatMessages: INITIAL_CHAT_MESSAGES,
  isGeneratingResponse: false,

  sendChatMessage: (content: string) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    set((s) => ({
      chatMessages: [...s.chatMessages, userMsg],
      isGeneratingResponse: true,
    }));

    setTimeout(() => {
      const state = get();
      const context = {
        profile: state.userProfile,
        session: state.session,
        diet: state.dietRecord,
        history: state.history,
        currentSet: state.currentSet,
        safetyTier: state.safetyTier,
        totalVolumeKg: state.totalVolumeKg,
      };

      const result = generateAICoachResponse(content, context);

      let actionBadge = undefined;
      if (result.action) {
        get().applyAIPlanAction(result.action);
        actionBadge = {
          actionType: result.action.type,
          description: result.action.description,
          executed: true,
        };
      }

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: result.replyText,
        timestamp: Date.now(),
        actionBadge,
      };

      set((s) => ({
        chatMessages: [...s.chatMessages, assistantMsg],
        isGeneratingResponse: false,
      }));
    }, 600);
  },

  clearChat: () => {
    set({ chatMessages: INITIAL_CHAT_MESSAGES });
  },

  // ---- Plan Selection ----
  selectPlan: (planId: string) => {
    const targetPlan = WORKOUT_PLANS.find((p) => p.id === planId) || WORKOUT_PLANS[0];
    const profile = get().userProfile;
    const { recommendedPressKg } = calculateProfileStats(profile);

    const exercises: ExerciseCard[] = JSON.parse(JSON.stringify(targetPlan.exercises));
    if (exercises.length > 0 && exercises[0].target_load.weight_kg > 0) {
      exercises[0].target_load.weight_kg = recommendedPressKg;
    }

    set({
      currentExerciseIndex: 0,
      currentSet: 1,
      isResting: false,
      restSecondsRemaining: 90,
      setHistory: [],
      consecutiveMaxRepSets: 0,
      lastAdjustment: null,
      exerciseChangeNotice: null,
      weightChangeNotice: null,
      safetyTier: 0,
      painLocation: null,
      showSummary: false,
      totalVolumeKg: 0,
      activeTab: 'workout',
      session: {
        app_name: 'HoldOn_Coach',
        session_id: `${planId}_${Date.now()}`,
        user_name: profile.name,
        plan_id: targetPlan.id,
        plan_name: targetPlan.name,
        workout_goal: 'Hypertrophy_8_12_Reps',
        total_volume_kg: 0,
        current_state: 'PREVIEW',
        exercises,
        rest_timer: {
          default_seconds: 90,
          accumulated_fatigue_extension_seconds: 0,
        },
        coach_feedback: {
          speech_text: `已切換為【${targetPlan.name}】！先暖身關節，教練陪你穩穩推！💪`,
          tone: 'encouraging',
        },
      },
    });
  },

  startWorkout: () =>
    set((state) => ({
      showSummary: false,
      activeTab: 'workout',
      session: {
        ...state.session,
        current_state: 'ACTIVE_SET',
      },
    })),

  startEmptyWorkout: () => {
    const profile = get().userProfile;
    const baseExercise = JSON.parse(JSON.stringify(WORKOUT_PLANS[0].exercises[0]));
    set({
      currentExerciseIndex: 0,
      currentSet: 1,
      isResting: false,
      restSecondsRemaining: 90,
      setHistory: [],
      consecutiveMaxRepSets: 0,
      lastAdjustment: null,
      exerciseChangeNotice: null,
      weightChangeNotice: null,
      safetyTier: 0,
      painLocation: null,
      showSummary: false,
      totalVolumeKg: 0,
      activeTab: 'workout',
      session: {
        app_name: 'HoldOn_Coach',
        session_id: `empty_${Date.now()}`,
        user_name: profile.name,
        plan_id: 'empty_routine',
        plan_name: '自由訓練 (Empty Workout)',
        workout_goal: 'Hypertrophy_8_12_Reps',
        total_volume_kg: 0,
        current_state: 'ACTIVE_SET',
        exercises: [baseExercise],
        rest_timer: {
          default_seconds: 90,
          accumulated_fatigue_extension_seconds: 0,
        },
        coach_feedback: {
          speech_text: '自由訓練已啟動！點擊上方「修改課表」可隨時從動作庫新增任何訓練！💪',
          tone: 'encouraging',
        },
      },
    });
  },

  addSetToCurrentExercise: () => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise) return;
    const updated = [...state.session.exercises];
    updated[state.currentExerciseIndex] = {
      ...exercise,
      total_sets: exercise.total_sets + 1,
    };
    set({
      session: {
        ...state.session,
        exercises: updated,
      },
    });
  },

  removeSetFromCurrentExercise: (setIndex?: number) => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise || exercise.total_sets <= 1) return;

    const updated = [...state.session.exercises];
    const targetSetNum = setIndex !== undefined ? setIndex : exercise.total_sets;

    // Find if this set was logged and subtract volume
    const loggedItem = state.setHistory.find(
      (r) => r.exerciseId === exercise.exercise_id && r.setNumber === targetSetNum
    );
    const volToSubtract = loggedItem ? loggedItem.weight_kg * loggedItem.reps_completed : 0;

    // Filter out this set from history and re-number subsequent sets of this exercise
    const updatedHistory = state.setHistory
      .filter((r) => !(r.exerciseId === exercise.exercise_id && r.setNumber === targetSetNum))
      .map((r) => {
        if (r.exerciseId === exercise.exercise_id && r.setNumber > targetSetNum) {
          return { ...r, setNumber: r.setNumber - 1 };
        }
        return r;
      });

    const newTotalSets = Math.max(1, exercise.total_sets - 1);
    updated[state.currentExerciseIndex] = {
      ...exercise,
      total_sets: newTotalSets,
    };

    const newCurrentSet = Math.min(state.currentSet, newTotalSets);

    set({
      currentSet: newCurrentSet,
      setHistory: updatedHistory,
      totalVolumeKg: Math.max(0, state.totalVolumeKg - volToSubtract),
      session: {
        ...state.session,
        exercises: updated,
      },
    });
  },

  updateSetRecordInHistory: (exerciseId, setNumber, partial) => {
    const state = get();
    let volumeDiff = 0;
    const updatedHistory = state.setHistory.map((r) => {
      if (r.exerciseId === exerciseId && r.setNumber === setNumber) {
        const oldVol = r.weight_kg * r.reps_completed;
        const newWeight = partial.weight_kg !== undefined ? partial.weight_kg : r.weight_kg;
        const newReps = partial.reps_completed !== undefined ? partial.reps_completed : r.reps_completed;
        const newVol = newWeight * newReps;
        volumeDiff = newVol - oldVol;
        return {
          ...r,
          ...partial,
          weight_kg: newWeight,
          reps_completed: newReps,
        };
      }
      return r;
    });

    set({
      setHistory: updatedHistory,
      totalVolumeKg: Math.max(0, state.totalVolumeKg + volumeDiff),
    });
  },

  updateCurrentExerciseTarget: (partial) => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise) return;

    let wtNotice: WeightChangeNotice | null = null;
    if (partial.weight_kg !== undefined && partial.weight_kg !== exercise.target_load.weight_kg) {
      const delta = Math.round((partial.weight_kg - exercise.target_load.weight_kg) * 10) / 10;
      wtNotice = {
        id: `wt-change-${Date.now()}`,
        prevWeight: exercise.target_load.weight_kg,
        newWeight: partial.weight_kg,
        delta,
        prevReps: exercise.target_load.reps,
        newReps: partial.reps !== undefined ? partial.reps : exercise.target_load.reps,
        reason: delta > 0 ? '手動調整加重挑戰' : '手動調整減輕重量',
        type: delta > 0 ? 'increase' : 'drop',
        timestamp: Date.now(),
      };
    }

    const updatedExercises = [...state.session.exercises];
    updatedExercises[state.currentExerciseIndex] = {
      ...exercise,
      target_load: {
        ...exercise.target_load,
        weight_kg: partial.weight_kg !== undefined ? partial.weight_kg : exercise.target_load.weight_kg,
        reps: partial.reps !== undefined ? partial.reps : exercise.target_load.reps,
      },
    };

    set({
      ...(wtNotice ? { weightChangeNotice: wtNotice } : {}),
      session: {
        ...state.session,
        exercises: updatedExercises,
      },
    });
  },

  dropWeightManually: (reason = '有點硬') => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise) return;

    const reduced = getReducedWeight(exercise.target_load.weight_kg, 0.15);
    const updated = [...state.session.exercises];
    updated[state.currentExerciseIndex] = {
      ...exercise,
      target_load: {
        ...exercise.target_load,
        weight_kg: reduced,
        reps: 8,
      },
    };

    const delta = Math.round((reduced - exercise.target_load.weight_kg) * 10) / 10;
    const wtNotice: WeightChangeNotice = {
      id: `wt-change-${Date.now()}`,
      prevWeight: exercise.target_load.weight_kg,
      newWeight: reduced,
      delta,
      prevReps: exercise.target_load.reps,
      newReps: 8,
      reason: reason === '有點硬' ? '手動降重保護（避免肌肉代償與關節壓力）' : reason,
      type: 'drop',
      timestamp: Date.now(),
    };

    const adjustment: DynamicAdjustment = {
      rpe: 9,
      prevWeight: exercise.target_load.weight_kg,
      newWeight: reduced,
      prevReps: exercise.target_load.reps,
      newReps: 8,
      type: 'weight_drop',
      summary: `手動降重保護：由 ${exercise.target_load.weight_kg}kg 降至 ${reduced}kg × 8下！`,
    };

    set({
      lastAdjustment: adjustment,
      weightChangeNotice: wtNotice,
      session: {
        ...state.session,
        exercises: updated,
        coach_feedback: {
          speech_text: COACH_MESSAGES.weight_drop_rpe9(reduced),
          tone: 'warning',
        },
      },
    });
  },

  completeSet: (repsCompleted: number, rpe: number, customWeight?: number) => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise) return;

    const actualWeight = customWeight !== undefined ? customWeight : exercise.target_load.weight_kg;
    const volume = actualWeight * repsCompleted;
    const isPain = state.safetyTier > 0;

    const setRecord: SetRecord = {
      exerciseId: exercise.exercise_id,
      setNumber: state.currentSet,
      weight_kg: actualWeight,
      reps_completed: repsCompleted,
      rpe,
      pain_reported: isPain,
      pain_location: state.painLocation || undefined,
      rest_seconds: state.restDefaultSeconds,
      extension_seconds: 0,
      timestamp: Date.now(),
    };

    const newHistory = [...state.setHistory, setRecord];
    const newVolume = state.totalVolumeKg + volume;

    // 同步升級練後代謝補償至飲食記錄
    const bonusRatio = newVolume / 750;
    const bonusCalories = Math.round(300 * bonusRatio);
    const bonusProtein = Math.round(15 * bonusRatio);
    const bonusCarbs = Math.round(45 * bonusRatio);

    const currentDiet = state.dietRecord;
    const stats = calculateProfileStats(state.userProfile);
    const updatedDiet: DailyDietRecord = {
      ...currentDiet,
      workoutBonusCalories: bonusCalories,
      workoutBonusProtein: bonusProtein,
      workoutBonusCarbs: bonusCarbs,
      targetCalories: stats.tdee + bonusCalories,
      targetProtein: stats.targetProteinG + bonusProtein,
      targetCarbs: stats.targetCarbG + bonusCarbs,
    };
    try {
      localStorage.setItem('holdon_daily_diet', JSON.stringify(updatedDiet));
    } catch {}

    const progression = calculateNextTarget(
      exercise.target_load.weight_kg,
      exercise.target_load.reps,
      repsCompleted,
      rpe,
      state.consecutiveMaxRepSets,
      state.safetyTier
    );

    const isLastSetOfExercise = state.currentSet >= exercise.total_sets;
    const isLastExercise = state.currentExerciseIndex >= state.session.exercises.length - 1;

    // Workout Complete
    if (isLastSetOfExercise && isLastExercise) {
      const maxWeight = Math.max(...newHistory.map((s) => s.weight_kg), 0);
      const avgRpe = Number(
        (newHistory.reduce((sum, s) => sum + s.rpe, 0) / newHistory.length).toFixed(1)
      );
      const painCount = newHistory.filter((s) => s.pain_reported).length;

      const dateStr = new Date().toLocaleDateString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
      });

      const newEntry: WorkoutHistoryEntry = {
        id: `hist_${Date.now()}`,
        date: dateStr,
        planName: state.session.plan_name,
        totalVolumeKg: newVolume,
        maxWeightKg: maxWeight,
        totalSets: newHistory.length,
        avgRpe,
        safetyInterventions: painCount,
        prAchieved: newVolume > 850 || maxWeight >= 18,
        phaseNote: `今日完成訓練：容量 ${newVolume}kg，最高推重 ${maxWeight}kg`,
      };

      const updatedHistory = [newEntry, ...state.history];
      try {
        localStorage.setItem('holdon_workout_history', JSON.stringify(updatedHistory));
      } catch {}

      set({
        setHistory: newHistory,
        totalVolumeKg: newVolume,
        showRPEInput: false,
        isResting: false,
        showSummary: true,
        lastAdjustment: progression.adjustment,
        history: updatedHistory,
        dietRecord: updatedDiet,
        session: {
          ...state.session,
          current_state: 'COMPLETED',
          total_volume_kg: newVolume,
          coach_feedback: {
            speech_text: COACH_MESSAGES.workout_done,
            tone: 'celebrating',
          },
        },
      });
      return;
    }

    // Exercise Complete, advance to next exercise
    if (isLastSetOfExercise) {
      const nextEx = state.session.exercises[state.currentExerciseIndex + 1];
      const exNotice: ExerciseChangeNotice | null = nextEx
        ? {
            id: `ex-change-${Date.now()}`,
            prevExerciseName: exercise.exercise_name,
            newExerciseName: nextEx.exercise_name,
            prevWeight: exercise.target_load.weight_kg,
            newWeight: nextEx.target_load.weight_kg,
            prevGrip: exercise.grip_type,
            newGrip: nextEx.grip_type,
            reason: '完成當前動作全部組數，自動進入下一訓練項',
            type: 'next',
            timestamp: Date.now(),
          }
        : null;

      set((s) => ({
        setHistory: newHistory,
        totalVolumeKg: newVolume,
        showRPEInput: false,
        currentExerciseIndex: s.currentExerciseIndex + 1,
        currentSet: 1,
        consecutiveMaxRepSets: 0,
        safetyTier: 0,
        painLocation: null,
        lastAdjustment: null,
        exerciseChangeNotice: exNotice,
        isResting: true,
        restSecondsRemaining: 90,
        dietRecord: updatedDiet,
        session: {
          ...s.session,
          current_state: 'RESTING',
          total_volume_kg: newVolume,
          coach_feedback: {
            speech_text: COACH_MESSAGES.exercise_done(exercise.exercise_name),
            tone: 'encouraging',
          },
        },
      }));
      return;
    }

    // Normal set: continue to next set
    let wtNotice: WeightChangeNotice | null = null;
    if (progression.weight_kg !== exercise.target_load.weight_kg) {
      const delta = Math.round((progression.weight_kg - exercise.target_load.weight_kg) * 10) / 10;
      wtNotice = {
        id: `wt-change-${Date.now()}`,
        prevWeight: exercise.target_load.weight_kg,
        newWeight: progression.weight_kg,
        delta,
        prevReps: exercise.target_load.reps,
        newReps: progression.reps,
        reason: delta > 0 ? '雙重進階成功：解鎖新重量挑戰！💪' : progression.adjustment.summary,
        type: delta > 0 ? 'increase' : 'drop',
        timestamp: Date.now(),
      };
    }

    const updatedExercises = [...state.session.exercises];
    updatedExercises[state.currentExerciseIndex] = {
      ...exercise,
      target_load: {
        ...exercise.target_load,
        weight_kg: progression.weight_kg,
        reps: progression.reps,
      },
      current_set: state.currentSet + 1,
    };

    const restSecs = progression.restAdjustmentSeconds || (state.safetyTier >= 1 ? 120 : state.restDefaultSeconds);

    set((s) => ({
      setHistory: newHistory,
      totalVolumeKg: newVolume,
      consecutiveMaxRepSets: progression.consecutiveMaxReps,
      currentSet: s.currentSet + 1,
      showRPEInput: false,
      lastAdjustment: progression.adjustment,
      ...(wtNotice ? { weightChangeNotice: wtNotice } : {}),
      isResting: true,
      restSecondsRemaining: restSecs,
      dietRecord: updatedDiet,
      session: {
        ...s.session,
        exercises: updatedExercises,
        coach_feedback: progression.feedback,
        current_state: 'RESTING',
        total_volume_kg: newVolume,
      },
    }));
  },

  reportPain: (location: string) => {
    const state = get();
    const exercise = state.session.exercises[state.currentExerciseIndex];
    if (!exercise) return;

    const newTier = state.safetyTier === 0 ? 1 : 2;

    if (newTier === 1) {
      const reducedWeight = getReducedWeight(exercise.target_load.weight_kg, 0.2);
      const delta = Math.round((reducedWeight - exercise.target_load.weight_kg) * 10) / 10;
      const wtNotice: WeightChangeNotice = {
        id: `wt-change-${Date.now()}`,
        prevWeight: exercise.target_load.weight_kg,
        newWeight: reducedWeight,
        delta,
        prevReps: exercise.target_load.reps,
        newReps: 8,
        reason: `Tier-1 關節痛感防護：更換為對握中立握法，重量下修 20% (${exercise.target_load.weight_kg}kg ➔ ${reducedWeight}kg)`,
        type: 'drop',
        timestamp: Date.now(),
      };

      const updatedExercises = [...state.session.exercises];
      updatedExercises[state.currentExerciseIndex] = {
        ...exercise,
        safety_status: 'TIER1_ALERT',
        media: exercise.alt_media || exercise.media,
        grip_type: '對握中立握法',
        target_load: {
          ...exercise.target_load,
          weight_kg: reducedWeight,
          reps: 8,
        },
      };

      set({
        safetyTier: 1,
        painLocation: location,
        showPainInput: false,
        restDefaultSeconds: 120,
        weightChangeNotice: wtNotice,
        lastAdjustment: {
          rpe: 9,
          prevWeight: exercise.target_load.weight_kg,
          newWeight: reducedWeight,
          prevReps: exercise.target_load.reps,
          newReps: 8,
          type: 'weight_drop',
          summary: `Tier-1 關節保護：更換為對握中立握法，重量下修 20% (${exercise.target_load.weight_kg}kg ➔ ${reducedWeight}kg)！`,
        },
        session: {
          ...state.session,
          exercises: updatedExercises,
          coach_feedback: {
            speech_text: COACH_MESSAGES.tier1_alert,
            tone: 'warning',
          },
          current_state: 'ACTIVE_SET',
        },
      });
    } else {
      if (exercise.replacement) {
        const oldName = exercise.exercise_name;
        const newName = exercise.replacement.exercise_name;
        const exNotice: ExerciseChangeNotice = {
          id: `ex-change-${Date.now()}`,
          prevExerciseName: oldName,
          newExerciseName: newName,
          prevWeight: exercise.target_load.weight_kg,
          newWeight: exercise.target_load.weight_kg,
          prevGrip: exercise.grip_type,
          newGrip: exercise.replacement.grip_type,
          reason: 'Tier-2 關節強制防護：自動抽換為固定軌跡機械胸推機保護',
          type: 'safety_replacement',
          timestamp: Date.now(),
        };

        const updatedExercises = [...state.session.exercises];
        updatedExercises[state.currentExerciseIndex] = {
          ...exercise,
          safety_status: 'TIER2_ALERT',
          exercise_id: exercise.replacement.exercise_id,
          exercise_name: exercise.replacement.exercise_name,
          media: exercise.replacement.media,
          grip_type: exercise.replacement.grip_type,
          current_set: 1,
        };

        set({
          safetyTier: 2,
          painLocation: location,
          showPainInput: false,
          currentSet: 1,
          exerciseChangeNotice: exNotice,
          lastAdjustment: {
            rpe: 10,
            prevWeight: exercise.target_load.weight_kg,
            newWeight: exercise.target_load.weight_kg,
            prevReps: exercise.target_load.reps,
            newReps: 10,
            type: 'maintain',
            summary: `Tier-2 強制換機：偵測持續不適，已直接抽換為【${exercise.replacement.exercise_name}】固定軌跡保護！`,
          },
          session: {
            ...state.session,
            exercises: updatedExercises,
            coach_feedback: {
              speech_text: COACH_MESSAGES.tier2_alert,
              tone: 'warning',
            },
            current_state: 'ACTIVE_SET',
          },
        });
      } else {
        set({ safetyTier: 2, showPainInput: false });
        get().nextExercise();
      }
    }
  },

  startRest: () =>
    set((state) => ({
      isResting: true,
      restSecondsRemaining: state.safetyTier >= 1 ? 120 : state.restDefaultSeconds,
      session: { ...state.session, current_state: 'RESTING' },
    })),

  extendRest: (seconds = 30) =>
    set((state) => ({
      restSecondsRemaining: state.restSecondsRemaining + seconds,
      totalExtensionSeconds: state.totalExtensionSeconds + seconds,
      session: {
        ...state.session,
        rest_timer: {
          ...state.session.rest_timer,
          accumulated_fatigue_extension_seconds:
            state.session.rest_timer.accumulated_fatigue_extension_seconds + seconds,
        },
        coach_feedback: {
          speech_text: COACH_MESSAGES.rest_extend,
          tone: 'calm',
        },
      },
    })),

  tickRest: () => {
    const state = get();
    if (state.restSecondsRemaining <= 1) {
      get().endRest();
    } else {
      set({ restSecondsRemaining: state.restSecondsRemaining - 1 });
    }
  },

  endRest: () =>
    set((state) => {
      const exercise = state.session.exercises[state.currentExerciseIndex];
      const speech = state.lastAdjustment
        ? `🔔 已為你動態調配：第 ${state.currentSet} 組目標為 ${exercise.target_load.weight_kg}kg × ${exercise.target_load.reps}下！專注發力！💪`
        : COACH_MESSAGES.rest_done;

      return {
        isResting: false,
        restSecondsRemaining: state.restDefaultSeconds,
        session: {
          ...state.session,
          current_state: 'ACTIVE_SET',
          coach_feedback: {
            speech_text: speech,
            tone: 'encouraging',
          },
        },
      };
    }),

  nextExercise: () => {
    const state = get();
    const nextIndex = state.currentExerciseIndex + 1;

    if (nextIndex >= state.session.exercises.length) {
      get().finishWorkout();
    } else {
      const prevEx = state.session.exercises[state.currentExerciseIndex];
      const nextEx = state.session.exercises[nextIndex];

      const exNotice: ExerciseChangeNotice | null = nextEx
        ? {
            id: `ex-change-${Date.now()}`,
            prevExerciseName: prevEx ? prevEx.exercise_name : '原動作',
            newExerciseName: nextEx.exercise_name,
            prevWeight: prevEx?.target_load.weight_kg,
            newWeight: nextEx.target_load.weight_kg,
            prevGrip: prevEx?.grip_type,
            newGrip: nextEx.grip_type,
            reason: '完成當前組數，進入下一訓練項',
            type: 'next',
            timestamp: Date.now(),
          }
        : null;

      set({
        currentExerciseIndex: nextIndex,
        currentSet: 1,
        safetyTier: 0,
        painLocation: null,
        consecutiveMaxRepSets: 0,
        lastAdjustment: null,
        exerciseChangeNotice: exNotice,
        isResting: false,
        session: { ...state.session, current_state: 'ACTIVE_SET' },
      });
    }
  },

  setShowRPEInput: (show) => set({ showRPEInput: show }),
  setShowPainInput: (show) => set({ showPainInput: show }),
  dismissHardLimitWarning: () => set({ showHardLimitWarning: false }),

  toggleListening: () => set((s) => ({ isListening: !s.isListening })),

  processVoiceCommand: (transcript: string) => {
    const lower = transcript.toLowerCase();
    const state = get();

    if (
      lower.includes('硬') ||
      lower.includes('太重') ||
      lower.includes('太難') ||
      lower.includes('降重') ||
      lower.includes('撐不住') ||
      lower.includes('做不動')
    ) {
      get().dropWeightManually('語音回報有點硬');
      return;
    }

    if (lower.includes('痛') || lower.includes('刺痛') || lower.includes('卡卡') || lower.includes('受傷')) {
      const location = lower.includes('肩') ? '肩膀' : lower.includes('手') ? '手肘' : '肩膀關節';
      get().reportPain(location);
      return;
    }

    if (lower.includes('再休') || lower.includes('再喘') || lower.includes('30秒') || lower.includes('多休息')) {
      if (state.isResting) {
        get().extendRest(30);
      }
      return;
    }

    if (lower.includes('推完') || lower.includes('做完') || lower.includes('完成') || lower.includes('好了')) {
      get().setShowRPEInput(true);
      return;
    }

    if (lower.includes('下一個') || lower.includes('換動作')) {
      get().nextExercise();
      return;
    }
  },

  finishWorkout: () => {
    const state = get();
    const newVolume = state.totalVolumeKg;
    const maxWeight = Math.max(...state.setHistory.map((s) => s.weight_kg), 18);
    const avgRpe = state.setHistory.length > 0
      ? Number((state.setHistory.reduce((s, r) => s + r.rpe, 0) / state.setHistory.length).toFixed(1))
      : 8.4;

    const dateStr = new Date().toLocaleDateString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
    });

    const newEntry: WorkoutHistoryEntry = {
      id: `hist_${Date.now()}`,
      date: dateStr,
      planName: state.session.plan_name,
      totalVolumeKg: newVolume > 0 ? newVolume : 864,
      maxWeightKg: maxWeight,
      totalSets: Math.max(state.setHistory.length, 16),
      avgRpe,
      safetyInterventions: state.safetyTier > 0 ? 1 : 0,
      prAchieved: true,
      phaseNote: `突破性 PR 達成！總噸數 ${newVolume || 864}kg，次數高質量完成`,
    };

    const updatedHistory = [newEntry, ...state.history];
    try {
      localStorage.setItem('holdon_workout_history', JSON.stringify(updatedHistory));
    } catch {}

    get().updateMuscleRecoveryAfterWorkout(state.session.plan_id);

    set({
      showSummary: true,
      showShareCardModal: true,
      isResting: false,
      history: updatedHistory,
      session: {
        ...state.session,
        current_state: 'COMPLETED',
        total_volume_kg: newVolume,
        coach_feedback: {
          speech_text: COACH_MESSAGES.workout_done,
          tone: 'celebrating',
        },
      },
    });
  },

  resetSession: () => {
    const currentPlanId = get().session.plan_id;
    get().selectPlan(currentPlanId);
  },

  // ---- Plan Modification & Exercise Reordering ----
  jumpToExercise: (index: number) => {
    const state = get();
    if (index < 0 || index >= state.session.exercises.length) return;
    if (index === state.currentExerciseIndex) return;
    const prevEx = state.session.exercises[state.currentExerciseIndex];
    const targetEx = state.session.exercises[index];

    const exNotice: ExerciseChangeNotice = {
      id: `ex-change-${Date.now()}`,
      prevExerciseName: prevEx ? prevEx.exercise_name : '原動作',
      newExerciseName: targetEx.exercise_name,
      prevWeight: prevEx?.target_load.weight_kg,
      newWeight: targetEx.target_load.weight_kg,
      prevGrip: prevEx?.grip_type,
      newGrip: targetEx.grip_type,
      reason: `自頂部選單切換至第 ${index + 1} 個動作`,
      type: 'switch',
      timestamp: Date.now(),
    };

    set({
      currentExerciseIndex: index,
      currentSet: 1,
      safetyTier: 0,
      painLocation: null,
      consecutiveMaxRepSets: 0,
      lastAdjustment: null,
      exerciseChangeNotice: exNotice,
      isResting: false,
      session: {
        ...state.session,
        current_state: 'ACTIVE_SET',
        coach_feedback: {
          speech_text: `已切換至【${targetEx.exercise_name}】！專注發力！💪`,
          tone: 'encouraging',
        },
      },
    });
  },

  reorderExercises: (fromIndex: number, toIndex: number) => {
    const state = get();
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const exercises = [...state.session.exercises];
    if (fromIndex >= exercises.length || toIndex >= exercises.length) return;

    const [moved] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, moved);

    const updated = exercises.map((ex, idx) => ({
      ...ex,
      exercise_index: idx,
      total_exercises: exercises.length,
    }));

    let newCurIdx = state.currentExerciseIndex;
    if (state.currentExerciseIndex === fromIndex) {
      newCurIdx = toIndex;
    } else if (fromIndex < state.currentExerciseIndex && toIndex >= state.currentExerciseIndex) {
      newCurIdx -= 1;
    } else if (fromIndex > state.currentExerciseIndex && toIndex <= state.currentExerciseIndex) {
      newCurIdx += 1;
    }

    set({
      currentExerciseIndex: newCurIdx,
      session: {
        ...state.session,
        exercises: updated,
      },
    });
  },

  moveExerciseUp: (index: number) => {
    if (index <= 0) return;
    get().reorderExercises(index, index - 1);
  },

  moveExerciseDown: (index: number) => {
    const total = get().session.exercises.length;
    if (index >= total - 1) return;
    get().reorderExercises(index, index + 1);
  },

  reverseExercisesOrder: () => {
    const state = get();
    const prevEx = state.session.exercises[state.currentExerciseIndex];
    const reversed = [...state.session.exercises].reverse().map((ex, idx, arr) => ({
      ...ex,
      exercise_index: idx,
      total_exercises: arr.length,
    }));

    const newEx = reversed[0];
    const exNotice: ExerciseChangeNotice | null =
      prevEx && newEx && prevEx.exercise_id !== newEx.exercise_id
        ? {
            id: `ex-change-${Date.now()}`,
            prevExerciseName: prevEx.exercise_name,
            newExerciseName: newEx.exercise_name,
            prevWeight: prevEx.target_load.weight_kg,
            newWeight: newEx.target_load.weight_kg,
            prevGrip: prevEx.grip_type,
            newGrip: newEx.grip_type,
            reason: '課表次序前後調轉，由新順位第 1 動作開始',
            type: 'reorder',
            timestamp: Date.now(),
          }
        : null;

    set({
      currentExerciseIndex: 0,
      currentSet: 1,
      safetyTier: 0,
      painLocation: null,
      lastAdjustment: null,
      ...(exNotice ? { exerciseChangeNotice: exNotice } : {}),
      isResting: false,
      session: {
        ...state.session,
        exercises: reversed,
        coach_feedback: {
          speech_text: '課表次序已完全倒轉！先從倒序動作開始刺激，保護關節！💪',
          tone: 'encouraging',
        },
      },
    });
  },

  removeExerciseFromSession: (index: number) => {
    const state = get();
    if (state.session.exercises.length <= 1) return; // Keep at least one
    const exercises = [...state.session.exercises];
    exercises.splice(index, 1);

    const updated = exercises.map((ex, idx) => ({
      ...ex,
      exercise_index: idx,
      total_exercises: exercises.length,
    }));

    let newCurIdx = state.currentExerciseIndex;
    if (newCurIdx >= updated.length) {
      newCurIdx = updated.length - 1;
    } else if (index < newCurIdx) {
      newCurIdx -= 1;
    }

    set({
      currentExerciseIndex: newCurIdx,
      currentSet: 1,
      safetyTier: 0,
      session: {
        ...state.session,
        exercises: updated,
      },
    });
  },

  addExerciseToSession: (item: any) => {
    const state = get();
    const exercises = [...state.session.exercises];
    
    // Support catalog item or raw ExerciseCard
    const rawEx = item.exercise || item;
    const newEx: ExerciseCard = {
      exercise_id: rawEx.exercise_id || `custom_ex_${Date.now()}`,
      exercise_name: rawEx.exercise_name,
      exercise_index: exercises.length,
      total_exercises: exercises.length + 1,
      media: rawEx.media || {
        type: 'gif',
        url: '/exercises/dumbbell-lateral-raise.gif',
        alt_text: rawEx.exercise_name,
        cue: rawEx.cue || '維持核心繃緊，穩定關節發力',
      },
      grip_type: rawEx.grip_type || '標準握法',
      current_set: 1,
      total_sets: rawEx.total_sets || 3,
      target_load: rawEx.target_load || { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
      alt_media: rawEx.alt_media,
      replacement: rawEx.replacement,
    };

    exercises.push(newEx);
    const updated = exercises.map((ex, idx) => ({
      ...ex,
      exercise_index: idx,
      total_exercises: exercises.length,
    }));

    set({
      session: {
        ...state.session,
        exercises: updated,
      },
    });
  },

  updateExerciseInSession: (index: number, patch: Partial<ExerciseCard>) => {
    const state = get();
    if (index < 0 || index >= state.session.exercises.length) return;
    const exercises = [...state.session.exercises];
    const prevEx = exercises[index];

    let wtNotice: WeightChangeNotice | null = null;
    let exNotice: ExerciseChangeNotice | null = null;

    if (index === state.currentExerciseIndex && prevEx) {
      if (patch.target_load?.weight_kg !== undefined && patch.target_load.weight_kg !== prevEx.target_load.weight_kg) {
        const delta = Math.round((patch.target_load.weight_kg - prevEx.target_load.weight_kg) * 10) / 10;
        wtNotice = {
          id: `wt-change-${Date.now()}`,
          prevWeight: prevEx.target_load.weight_kg,
          newWeight: patch.target_load.weight_kg,
          delta,
          prevReps: prevEx.target_load.reps,
          newReps: patch.target_load.reps ?? prevEx.target_load.reps,
          reason: delta > 0 ? '課表編輯調升重量' : '課表編輯調降重量',
          type: delta > 0 ? 'increase' : 'drop',
          timestamp: Date.now(),
        };
      }
      if (patch.exercise_name && patch.exercise_name !== prevEx.exercise_name) {
        exNotice = {
          id: `ex-change-${Date.now()}`,
          prevExerciseName: prevEx.exercise_name,
          newExerciseName: patch.exercise_name,
          prevWeight: prevEx.target_load.weight_kg,
          newWeight: patch.target_load?.weight_kg ?? prevEx.target_load.weight_kg,
          prevGrip: prevEx.grip_type,
          newGrip: patch.grip_type ?? prevEx.grip_type,
          reason: '課表動作自訂抽換',
          type: 'switch',
          timestamp: Date.now(),
        };
      }
    }

    exercises[index] = {
      ...exercises[index],
      ...patch,
      target_load: {
        ...exercises[index].target_load,
        ...(patch.target_load || {}),
      },
    };

    set({
      ...(wtNotice ? { weightChangeNotice: wtNotice } : {}),
      ...(exNotice ? { exerciseChangeNotice: exNotice } : {}),
      session: {
        ...state.session,
        exercises,
      },
    });
  },

  applyAIPlanAction: (action: AIPlanAction) => {
    const state = get();
    let exercises = [...state.session.exercises];
    let curIdx = state.currentExerciseIndex;

    if (action.type === 'reverse') {
      exercises.reverse();
      exercises = exercises.map((ex, idx, arr) => ({
        ...ex,
        exercise_index: idx,
        total_exercises: arr.length,
      }));
      curIdx = 0;
    } else if (action.type === 'reorder') {
      const fromIdx = exercises.findIndex((e) =>
        action.sourceName ? e.exercise_name.includes(action.sourceName) : false
      );
      if (fromIdx !== -1) {
        const toIdx = action.targetIndex ?? 0;
        const [moved] = exercises.splice(fromIdx, 1);
        exercises.splice(toIdx, 0, moved);
        exercises = exercises.map((ex, idx, arr) => ({
          ...ex,
          exercise_index: idx,
          total_exercises: arr.length,
        }));
        curIdx = toIdx;
      }
    } else if (action.type === 'replace') {
      const fromIdx = exercises.findIndex((e) =>
        action.sourceName ? e.exercise_name.includes(action.sourceName) : false
      );
      if (fromIdx !== -1) {
        const catalogItem = EXERCISE_CATALOG_POOL.find((item) =>
          action.addedExerciseId ? item.exercise.exercise_id === action.addedExerciseId :
          action.targetName ? item.exercise.exercise_name.includes(action.targetName) : false
        ) || EXERCISE_CATALOG_POOL[2];

        exercises[fromIdx] = {
          ...catalogItem.exercise,
          exercise_index: fromIdx,
          total_exercises: exercises.length,
          current_set: 1,
          target_load: {
            ...catalogItem.exercise.target_load,
            weight_kg: action.newWeight ?? catalogItem.exercise.target_load.weight_kg,
          },
        };
      }
    } else if (action.type === 'add') {
      const catalogItem = EXERCISE_CATALOG_POOL.find((item) =>
        action.addedExerciseId ? item.exercise.exercise_id === action.addedExerciseId :
        action.targetName ? item.exercise.exercise_name.includes(action.targetName) : false
      ) || EXERCISE_CATALOG_POOL[2];

      const newEx: ExerciseCard = {
        ...catalogItem.exercise,
        exercise_index: exercises.length,
        total_exercises: exercises.length + 1,
        current_set: 1,
      };
      exercises.push(newEx);
      exercises = exercises.map((ex, idx, arr) => ({
        ...ex,
        exercise_index: idx,
        total_exercises: arr.length,
      }));
    } else if (action.type === 'remove') {
      const remIdx = action.targetIndex !== undefined
        ? action.targetIndex
        : (action.sourceName
            ? exercises.findIndex((e) => e.exercise_name.includes(action.sourceName!))
            : exercises.length - 1);

      if (exercises.length > 1 && remIdx >= 0 && remIdx < exercises.length) {
        exercises.splice(remIdx, 1);
        exercises = exercises.map((ex, idx, arr) => ({
          ...ex,
          exercise_index: idx,
          total_exercises: arr.length,
        }));
        if (curIdx >= exercises.length) curIdx = exercises.length - 1;
      }
    } else if (action.type === 'update_load') {
      const targetIdx = action.sourceName
        ? exercises.findIndex((e) => e.exercise_name.includes(action.sourceName!))
        : curIdx;
      if (targetIdx !== -1) {
        const ex = exercises[targetIdx];
        exercises[targetIdx] = {
          ...ex,
          target_load: {
            ...ex.target_load,
            weight_kg: action.newWeight !== undefined ? action.newWeight : ex.target_load.weight_kg,
            reps: action.newReps !== undefined ? action.newReps : ex.target_load.reps,
          },
          total_sets: action.newSets !== undefined ? action.newSets : ex.total_sets,
        };
      }
    }

    set({
      currentExerciseIndex: curIdx,
      currentSet: 1,
      safetyTier: 0,
      painLocation: null,
      lastAdjustment: null,
      session: {
        ...state.session,
        exercises,
        coach_feedback: {
          speech_text: `已為你更新今日課表！${action.description}`,
          tone: 'encouraging',
        },
      },
    });

    return { success: true, message: action.description };
  },

  fastCompleteCurrentSet: (customRpe = 8) => {
    const state = get();
    const ex = state.session.exercises[state.currentExerciseIndex];
    if (!ex) return;
    get().completeSet(ex.target_load.reps, customRpe);
  },

  fastTriggerPain: () => {
    get().reportPain('左肩');
  },

  fastTriggerStruggleDrop: () => {
    const state = get();
    const ex = state.session.exercises[state.currentExerciseIndex];
    if (!ex) return;
    get().completeSet(ex.target_load.reps, 9);
  },

  fastFinishAll: () => {
    get().finishWorkout();
  },
}));
