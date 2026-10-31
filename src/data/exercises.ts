// ============================================================
// HoldOn Coach — Exercise Database, Multi-Plan Presets & Profile
// ============================================================

export interface ExerciseMedia {
  type: 'gif' | 'video';
  url: string;
  alt_text: string;
  cue: string;
}

export interface TargetLoad {
  weight_kg: number;
  reps: number;
  rule: string;
}

export interface ExerciseCard {
  exercise_id: string;
  exercise_name: string;
  exercise_index: number;
  total_exercises: number;
  media: ExerciseMedia;
  grip_type: string;
  current_set: number;
  total_sets: number;
  target_load: TargetLoad;
  safety_status: 'NORMAL' | 'TIER1_ALERT' | 'TIER2_ALERT';
  alt_media?: ExerciseMedia;
  replacement?: {
    exercise_id: string;
    exercise_name: string;
    media: ExerciseMedia;
    grip_type: string;
  };
}

export interface RestTimer {
  default_seconds: number;
  accumulated_fatigue_extension_seconds: number;
}

export interface CoachFeedback {
  speech_text: string;
  tone: 'encouraging' | 'warning' | 'celebrating' | 'calm';
}

export interface WorkoutSession {
  app_name: string;
  session_id: string;
  user_name: string;
  plan_id: string;
  plan_name: string;
  workout_goal: string;
  total_volume_kg: number;
  current_state: 'PREVIEW' | 'ACTIVE_SET' | 'RESTING' | 'COMPLETED' | 'SAFETY_HALT';
  exercises: ExerciseCard[];
  rest_timer: RestTimer;
  coach_feedback: CoachFeedback;
}

// ============================================================
// User Profile (身高體重年齡性別體脂)
// ============================================================
export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  weight_kg: number;
  body_fat_pct?: number;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goal: 'hypertrophy' | 'joint_safety' | 'fat_loss';
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Sam',
  gender: 'male',
  age: 28,
  height_cm: 176,
  weight_kg: 74,
  body_fat_pct: 16.5,
  experience: 'intermediate',
  goal: 'hypertrophy',
};

export function calculateProfileStats(profile: UserProfile) {
  const heightM = profile.height_cm / 100;
  const bmi = profile.weight_kg / (heightM * heightM);
  
  // BMR via Mifflin-St Jeor Formula
  let bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age;
  bmr = profile.gender === 'female' ? bmr - 161 : bmr + 5;
  const tdee = Math.round(bmr * 1.55); // 中度訓練係數

  // 基礎建議臥推起始負重
  let baselineDbPress = 14;
  if (profile.gender === 'male') {
    if (profile.experience === 'beginner') baselineDbPress = Math.max(8, Math.round(profile.weight_kg * 0.16 / 2) * 2);
    else if (profile.experience === 'intermediate') baselineDbPress = Math.max(14, Math.round(profile.weight_kg * 0.22 / 2) * 2);
    else baselineDbPress = Math.max(20, Math.round(profile.weight_kg * 0.30 / 2) * 2);
  } else {
    if (profile.experience === 'beginner') baselineDbPress = Math.max(4, Math.round(profile.weight_kg * 0.10 / 2) * 2);
    else if (profile.experience === 'intermediate') baselineDbPress = Math.max(8, Math.round(profile.weight_kg * 0.14 / 2) * 2);
    else baselineDbPress = Math.max(12, Math.round(profile.weight_kg * 0.18 / 2) * 2);
  }

  // 每日巨量營養素基準 (克)
  const targetProteinG = Math.round(profile.weight_kg * 2.0); // 2.0g/kg
  const targetFatG = Math.round((tdee * 0.25) / 9); // 25% 熱量來自優質脂肪
  const targetCarbG = Math.round((tdee - (targetProteinG * 4 + targetFatG * 9)) / 4);

  return {
    bmi: Number(bmi.toFixed(1)),
    bmr: Math.round(bmr),
    tdee,
    recommendedPressKg: baselineDbPress,
    targetProteinG,
    targetCarbG,
    targetFatG,
  };
}

// ============================================================
// Standard Dumbbell Weight Ladder (kg)
// ============================================================
export const DUMBBELL_LADDER = [
  4, 6, 8, 10, 12, 14, 16, 18, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40
];

export function getNextWeight(current: number): number {
  const idx = DUMBBELL_LADDER.indexOf(current);
  if (idx === -1) {
    const next = DUMBBELL_LADDER.find(w => w > current);
    return next ?? current;
  }
  return idx < DUMBBELL_LADDER.length - 1 ? DUMBBELL_LADDER[idx + 1] : current;
}

export function getReducedWeight(current: number, pct: number = 0.15): number {
  const idx = DUMBBELL_LADDER.indexOf(current);
  if (idx > 0) {
    return DUMBBELL_LADDER[idx - 1];
  }
  const target = current * (1 - pct);
  const candidates = DUMBBELL_LADDER.filter(w => w <= target);
  return candidates.length > 0 ? candidates[candidates.length - 1] : DUMBBELL_LADDER[0];
}

export const HARD_LIMIT_KG = 30; // Max weight for hypertrophy safety zone

// ============================================================
// Preset Workout Plans (推拉腿 PPL、二分化 Upper/Lower、五分化 Bro Split)
// ============================================================
export interface WorkoutPlanPreset {
  id: string;
  name: string;
  category: 'PPL' | 'UpperLower' | 'BroSplit';
  categoryLabel: string;
  description: string;
  targetFocus: string;
  exercises: ExerciseCard[];
}

export const WORKOUT_PLANS: WorkoutPlanPreset[] = [
  // 1. 推拉腿 - 推日 (Push)
  {
    id: 'ppl_push',
    name: '推拉腿 — 推胸肩三頭 (Push Day)',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: '專注胸大肌上部、中胸、前中三角肌與肱三頭肌，以多角度臥推為核心。',
    targetFocus: '胸肌 / 三角肌 / 三頭肌',
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '標準正握上斜啞鈴臥推動作示範',
          cue: '下放感受胸肌拉伸，手肘微收約 45 度，肩膀貼緊椅背',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 16, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
        alt_media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press-neutral.gif',
          alt_text: '對握中立握法上斜啞鈴臥推',
          cue: '掌心相對對握，大幅減輕肩峰夾擠風險',
        },
        replacement: {
          exercise_id: 'machine_chest_press',
          exercise_name: '坐姿機械式胸推機',
          media: {
            type: 'gif',
            url: '/exercises/machine-chest-press.gif',
            alt_text: '坐姿機械胸推示範',
            cue: '固定軌跡推出，專注胸肌頂峰收縮',
          },
          grip_type: '機械握把',
        },
      },
      {
        exercise_id: 'flat_db_press',
        exercise_name: '平板啞鈴臥推',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/flat-dumbbell-press.gif',
          alt_text: '平板啞鈴臥推動作示範',
          cue: '下落吸氣穩定肩胛，推起吐氣胸部夾緊',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
        alt_media: {
          type: 'gif',
          url: '/exercises/flat-dumbbell-press-neutral.gif',
          alt_text: '對握中立握法平板臥推',
          cue: '對握中立姿勢，鎖住肩關節健康',
        },
        replacement: {
          exercise_id: 'machine_chest_press',
          exercise_name: '坐姿機械式胸推機',
          media: {
            type: 'gif',
            url: '/exercises/machine-chest-press.gif',
            alt_text: '坐姿機械胸推示範',
            cue: '固定軌跡推出，專注胸肌頂峰收縮',
          },
          grip_type: '機械握把',
        },
      },
      {
        exercise_id: 'db_lateral_raise',
        exercise_name: '啞鈴側平舉',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-lateral-raise.gif',
          alt_text: '啞鈴側平舉動作示範',
          cue: '手肘微彎鉛角，舉至肩膀高度即停，勿用斜方肌甩動',
        },
        grip_type: '正握提拉',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 8, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
        alt_media: {
          type: 'gif',
          url: '/exercises/cable-lateral-raise.gif',
          alt_text: '纜繩側平舉替代動作',
          cue: '纜繩維持張力，全程關節零衝擊',
        },
      },
      {
        exercise_id: 'overhead_tricep_ext',
        exercise_name: '過頭啞鈴三頭肌伸展',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/overhead-tricep-extension.gif',
          alt_text: '啞鈴過頭三頭肌伸展動作示範',
          cue: '大臂夾緊耳側垂直向上，手肘保持穩定不外擴',
        },
        grip_type: '雙手握單啞鈴',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 12, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
        alt_media: {
          type: 'gif',
          url: '/exercises/cable-pushdown.gif',
          alt_text: '滑輪三頭下壓替代',
          cue: '滑輪向下伸展，鎖定肘關節',
        },
      },
    ],
  },

  // 2. 推拉腿 - 拉日 (Pull)
  {
    id: 'ppl_pull',
    name: '推拉腿 — 拉背二頭 (Pull Day)',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: '打造倒三角黃金比例，強化背闊肌、菱形肌、斜方中下與肱二頭肌。',
    targetFocus: '背闊肌 / 菱形肌 / 二頭肌',
    exercises: [
      {
        exercise_id: 'one_arm_db_row',
        exercise_name: '單臂啞鈴划船',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/one-arm-dumbbell-row.gif',
          alt_text: '單臂啞鈴划船示範',
          cue: '脊柱延伸平行於凳，往臀部方向弧形拉起，手肘緊貼身體',
        },
        grip_type: '對握中立',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
        alt_media: {
          type: 'gif',
          url: '/exercises/chest-supported-row.gif',
          alt_text: '胸托啞鈴划船',
          cue: '胸部貼緊斜凳，完全卸除腰椎下背壓力',
        },
        replacement: {
          exercise_id: 'lat_pulldown',
          exercise_name: '滑輪下拉機',
          media: {
            type: 'gif',
            url: '/exercises/lat-pulldown.gif',
            alt_text: '滑輪下拉示範',
            cue: '下拉至上胸，挺胸夾背',
          },
          grip_type: '寬握滑輪',
        },
      },
      {
        exercise_id: 'lat_pulldown_db',
        exercise_name: '高位滑輪下拉',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/lat-pulldown.gif',
          alt_text: '滑輪下拉動作示範',
          cue: '手肘主導向下向後拉，想像手肘插進後褲袋',
        },
        grip_type: '正握寬握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 40, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'rear_delt_fly',
        exercise_name: '俯身啞鈴飛鳥',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/rear-delt-fly.gif',
          alt_text: '俯身啞鈴飛鳥示範',
          cue: '俯身 45 度，手肘微彎向兩側展開，專注後三角肌發力',
        },
        grip_type: '掌心相對',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 6, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_incline_curl',
        exercise_name: '上斜啞鈴二頭彎舉',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-bicep-curl.gif',
          alt_text: '上斜啞鈴彎舉示範',
          cue: '背貼斜凳充分享受二頭長頭拉伸，旋後頂峰擠壓',
        },
        grip_type: '正反握轉向',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 3. 推拉腿 - 腿日 (Legs)
  {
    id: 'ppl_legs',
    name: '推拉腿 — 下肢力量 (Leg Day)',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: '強化股四頭肌、膕繩肌與臀大肌，打造強韌下肢基底與代謝引擎。',
    targetFocus: '股四頭肌 / 臀大肌 / 膕旁肌',
    exercises: [
      {
        exercise_id: 'goblet_squat',
        exercise_name: '啞鈴高腳杯深蹲',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '啞鈴高腳杯深蹲示範',
          cue: '啞鈴垂直抱於胸前，膝蓋順應腳尖方向蹲下至大腿平行',
        },
        grip_type: '托握啞鈴',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 20, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_rdl',
        exercise_name: '啞鈴羅馬尼亞硬舉 (RDL)',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-rdl.gif',
          alt_text: '啞鈴羅馬尼亞硬舉示範',
          cue: '髖關節向後折疊，背部挺直，感受大腿後側膕繩肌強烈拉伸',
        },
        grip_type: '正握垂直下放',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 22.5, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'bulgarian_split_squat',
        exercise_name: '保加利亞分腿蹲',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/bulgarian-split-squat.gif',
          alt_text: '保加利亞分腿蹲示範',
          cue: '後腳背搭於板凳，前腳踩穩重心下沉，臀肌強烈刺激',
        },
        grip_type: '雙手垂持',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'standing_calf_raise',
        exercise_name: '單腿站姿提踵',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/calf-raise.gif',
          alt_text: '站姿提踵示範',
          cue: '前腳掌著地，頂峰收縮停頓 1 秒，緩慢下放下壓小腿',
        },
        grip_type: '單手持啞鈴',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 12, reps: 15, rule: '滿 15 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 4. 二分化 - 上半身 (Upper Body)
  {
    id: 'upper_lower_upper',
    name: '二分化 — 上肢複合軀幹 (Upper Body)',
    category: 'UpperLower',
    categoryLabel: '二分化 (Upper / Lower)',
    description: '適合一週訓練 3~4 次者，高頻率刺激胸、背、肩、臂上肢全肌群。',
    targetFocus: '胸 / 背 / 肩 / 臂 全面肌群',
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '上斜啞鈴臥推示範',
          cue: '鎖定肩胛，手肘 45 度發力推起',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 16, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'one_arm_db_row',
        exercise_name: '單臂啞鈴划船',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/one-arm-dumbbell-row.gif',
          alt_text: '單臂啞鈴划船示範',
          cue: '核心收緊，手肘貼緊身軀向後拉引',
        },
        grip_type: '對握中立',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_shoulder_press',
        exercise_name: '坐姿啞鈴肩推',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-shoulder-press.gif',
          alt_text: '坐姿啞鈴肩推示範',
          cue: '背貼椅背，推至頭頂時啞鈴不互撞，保護肩關節',
        },
        grip_type: '正握微旋前',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 12, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'hammer_curl',
        exercise_name: '啞鈴錘式彎舉',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/hammer-curl.gif',
          alt_text: '啞鈴錘式彎舉示範',
          cue: '掌心相對對握，強化肱橈肌與手臂厚度',
        },
        grip_type: '中立對握',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 5. 二分化 - 下半身 (Lower Body)
  {
    id: 'upper_lower_lower',
    name: '二分化 — 下肢與核心 (Lower Body)',
    category: 'UpperLower',
    categoryLabel: '二分化 (Upper / Lower)',
    description: '深蹲與硬舉結合核心抗旋轉，建立深層肌力與體能燃脂基礎。',
    targetFocus: '下肢全肌群 / 核心核心',
    exercises: [
      {
        exercise_id: 'goblet_squat',
        exercise_name: '高腳杯深蹲',
        exercise_index: 0,
        total_exercises: 3,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '高腳杯深蹲示範',
          cue: '挺胸腰背打直，膝蓋朝第二腳趾方向打開',
        },
        grip_type: '托握啞鈴',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 20, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_rdl',
        exercise_name: '啞鈴羅馬尼亞硬舉',
        exercise_index: 1,
        total_exercises: 3,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-rdl.gif',
          alt_text: '啞鈴硬舉示範',
          cue: '推臀向後折疊，下放至膝蓋下方即可',
        },
        grip_type: '正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 22.5, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'plank_core',
        exercise_name: '平板支撐核心強化',
        exercise_index: 2,
        total_exercises: 3,
        media: {
          type: 'gif',
          url: '/exercises/plank.gif',
          alt_text: '平板支撐示範',
          cue: '手肘撐地骨盆後傾，腹肌臀部同時夾緊 45 秒',
        },
        grip_type: '徒手支撐',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 45, rule: '撐滿 45 秒即完成' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 6. 五分化 - 胸部日 (Bro Split Chest)
  {
    id: 'bro_chest',
    name: '五分化 — 胸大肌專項轟炸 (Chest Focus)',
    category: 'BroSplit',
    categoryLabel: '五分化 (Bro Split)',
    description: '經典單一部位高容量刺激，專門雕塑上胸飽滿度與中胸輪廓線。',
    targetFocus: '胸大肌上部 / 中部 / 內側',
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '上斜啞鈴臥推示範',
          cue: '上胸充血關鍵動作，手肘收緊 45 度避免肩峰碰撞',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 16, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'flat_db_press',
        exercise_name: '平板啞鈴臥推',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/flat-dumbbell-press.gif',
          alt_text: '平板臥推示範',
          cue: '推起時胸部主動夾擠，下放保持張力',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_fly',
        exercise_name: '啞鈴仰臥飛鳥',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-fly.gif',
          alt_text: '啞鈴仰臥飛鳥示範',
          cue: '肘關節微彎抱大樹動作，專注胸大肌極限拉伸',
        },
        grip_type: '對握抱球',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'pushup_burnout',
        exercise_name: '自重力竭伏地挺身',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/pushup.gif',
          alt_text: '標準伏地挺身示範',
          cue: '胸部貼地再推起，作為最後收尾充血泵感',
        },
        grip_type: '徒手手掌撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 15, rule: '推至力竭' },
        safety_status: 'NORMAL',
      },
    ],
  },
];

// ============================================================
// Real-world 8-Week Undulating Progression History (真實健身進步數據)
// 具備波浪週期化、階梯升重、減量週 (Deload)、PR 與安全介入紀錄
// ============================================================
export interface WorkoutHistoryEntry {
  id: string;
  date: string;
  planName: string;
  totalVolumeKg: number;
  maxWeightKg: number;
  totalSets: number;
  avgRpe: number;
  safetyInterventions: number;
  prAchieved: boolean;
  phaseNote?: string;
}

export const INITIAL_WORKOUT_HISTORY: WorkoutHistoryEntry[] = [
  {
    id: 'hist_01',
    date: '09/08',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 420,
    maxWeightKg: 12,
    totalSets: 12,
    avgRpe: 7.2,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '神經適應期：12kg 確立動作控制軌跡',
  },
  {
    id: 'hist_02',
    date: '09/12',
    planName: '二分化 — 上肢複合軀幹',
    totalVolumeKg: 468,
    maxWeightKg: 12,
    totalSets: 13,
    avgRpe: 7.5,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '肌耐力提升：次數推向 10 下',
  },
  {
    id: 'hist_03',
    date: '09/16',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 520,
    maxWeightKg: 12,
    totalSets: 14,
    avgRpe: 7.8,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '首次完成 12kg × 12下滿次 (1/2)',
  },
  {
    id: 'hist_04',
    date: '09/21',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 580,
    maxWeightKg: 14,
    totalSets: 14,
    avgRpe: 8.2,
    safetyInterventions: 0,
    prAchieved: true,
    phaseNote: '🏆 連續滿12下解鎖升重至 14kg',
  },
  {
    id: 'hist_05',
    date: '09/25',
    planName: '推拉腿 — 拉背二頭',
    totalVolumeKg: 630,
    maxWeightKg: 14,
    totalSets: 15,
    avgRpe: 8.4,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '14kg 肌肥大適應，次數穩定提升',
  },
  {
    id: 'hist_06',
    date: '09/30',
    planName: '五分化 — 胸大肌專項轟炸',
    totalVolumeKg: 590,
    maxWeightKg: 14,
    totalSets: 14,
    avgRpe: 8.8,
    safetyInterventions: 1,
    prAchieved: false,
    phaseNote: '⚠️ 左肩卡卡：系統觸發對握中立降重踩煞車',
  },
  {
    id: 'hist_07',
    date: '10/05',
    planName: '全身性減量週 (Deload Week)',
    totalVolumeKg: 380,
    maxWeightKg: 10,
    totalSets: 10,
    avgRpe: 6.5,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '🧘 主動減量修復週：中樞神經與關節結締組織重啟',
  },
  {
    id: 'hist_08',
    date: '10/10',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 670,
    maxWeightKg: 14,
    totalSets: 15,
    avgRpe: 7.9,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '減量後超量恢復：14kg 連續推滿 12 下 (1/2)',
  },
  {
    id: 'hist_09',
    date: '10/15',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 710,
    maxWeightKg: 16,
    totalSets: 15,
    avgRpe: 8.2,
    safetyInterventions: 0,
    prAchieved: true,
    phaseNote: '🏆 突破！解鎖 16kg 啞鈴，8 下扎實起步',
  },
  {
    id: 'hist_10',
    date: '10/20',
    planName: '二分化 — 上肢複合軀幹',
    totalVolumeKg: 760,
    maxWeightKg: 16,
    totalSets: 15,
    avgRpe: 8.3,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '16kg 推進至 10 下，肩胛下壓極其穩定',
  },
  {
    id: 'hist_11',
    date: '10/25',
    planName: '五分化 — 胸大肌專項轟炸',
    totalVolumeKg: 820,
    maxWeightKg: 16,
    totalSets: 16,
    avgRpe: 8.5,
    safetyInterventions: 0,
    prAchieved: false,
    phaseNote: '16kg 達到 12 下滿次門檻 (1/2)',
  },
  {
    id: 'hist_12',
    date: '10/30',
    planName: '推拉腿 — 推胸肩三頭',
    totalVolumeKg: 864,
    maxWeightKg: 18,
    totalSets: 16,
    avgRpe: 8.4,
    safetyInterventions: 0,
    prAchieved: true,
    phaseNote: '🏆 二次連續滿12下！正式解鎖 18kg 新 PR 領域',
  },
];

// ============================================================
// Default Active Session based on first plan
// ============================================================
export const MOCK_SESSION: WorkoutSession = {
  app_name: 'HoldOn_Coach',
  session_id: 'push_day_20261031_01',
  user_name: 'Sam',
  plan_id: WORKOUT_PLANS[0].id,
  plan_name: WORKOUT_PLANS[0].name,
  workout_goal: 'Hypertrophy_8_12_Reps',
  total_volume_kg: 0,
  current_state: 'PREVIEW',
  exercises: JSON.parse(JSON.stringify(WORKOUT_PLANS[0].exercises)),
  rest_timer: {
    default_seconds: 90,
    accumulated_fatigue_extension_seconds: 0,
  },
  coach_feedback: {
    speech_text: 'Sam，教練先別加！今天推胸肩，我們先穩扎穩打把次數推滿 12 下！💪',
    tone: 'encouraging',
  },
};

// ============================================================
// Modern Diet / Nutrition Log Structure (飲食記錄模型)
// ============================================================
export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  store?: string;
  time?: string;
  emoji: string;
}

export interface DailyDietRecord {
  date: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  workoutBonusCalories: number;
  workoutBonusProtein: number;
  workoutBonusCarbs: number;
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
  };
}

export const INITIAL_TODAY_DIET: DailyDietRecord = {
  date: '2026-10-31',
  targetCalories: 2650, // 包含練後代謝加碼
  targetProtein: 163, // 包含練後加碼 15g
  targetCarbs: 305, // 包含練後加碼 45g
  targetFat: 65,
  workoutBonusCalories: 320,
  workoutBonusProtein: 15,
  workoutBonusCarbs: 45,
  meals: {
    breakfast: [
      {
        id: 'b1',
        name: '茶葉蛋 ×2 顆',
        store: '7-ELEVEN',
        calories: 140,
        protein_g: 14,
        carb_g: 2,
        fat_g: 9,
        emoji: '🥚',
        time: '08:30',
      },
      {
        id: 'b2',
        name: '無糖高纖豆漿 450ml',
        store: '全家',
        calories: 135,
        protein_g: 15,
        carb_g: 6,
        fat_g: 6,
        emoji: '🥛',
        time: '08:35',
      },
      {
        id: 'b3',
        name: '能量香蕉',
        store: '水果攤',
        calories: 90,
        protein_g: 1,
        carb_g: 23,
        fat_g: 0.3,
        emoji: '🍌',
        time: '08:40',
      },
    ],
    lunch: [
      {
        id: 'l1',
        name: '舒肥雞胸肉便當',
        store: '健康餐盒',
        calories: 520,
        protein_g: 42,
        carb_g: 65,
        fat_g: 10,
        emoji: '🍱',
        time: '12:30',
      },
      {
        id: 'l2',
        name: '熟烤紫地瓜 (中)',
        store: '7-ELEVEN',
        calories: 140,
        protein_g: 2,
        carb_g: 32,
        fat_g: 0.2,
        emoji: '🍠',
        time: '12:45',
      },
    ],
    dinner: [
      {
        id: 'd1',
        name: '清燉牛肉麵 (半筋半肉)',
        store: '外食牛肉麵店',
        calories: 580,
        protein_g: 36,
        carb_g: 62,
        fat_g: 18,
        emoji: '🍜',
        time: '18:45',
      },
      {
        id: 'd2',
        name: '燙青菜 (地瓜葉)',
        store: '小吃店',
        calories: 65,
        protein_g: 3,
        carb_g: 5,
        fat_g: 3,
        emoji: '🥬',
        time: '18:50',
      },
    ],
    snack: [
      {
        id: 's1',
        name: '黃金乳清蛋白粉 (1份)',
        store: '自備補給',
        calories: 120,
        protein_g: 24,
        carb_g: 3,
        fat_g: 1.5,
        emoji: '🥤',
        time: '17:15',
      },
    ],
  },
};

// ============================================================
// Taiwan Convenience Store & Fitness Food Preset Database
// ============================================================
export const FOOD_DATABASE: MealItem[] = [
  { id: 'f_01', name: '即食嫩雞胸肉', store: '7-ELEVEN', calories: 110, protein_g: 24, carb_g: 1, fat_g: 1.5, emoji: '🍗' },
  { id: 'f_02', name: '熟烤地瓜 (中型)', store: '7-ELEVEN', calories: 130, protein_g: 2, carb_g: 30, fat_g: 0.2, emoji: '🍠' },
  { id: 'f_03', name: '茶葉蛋 ×2 顆', store: '7-ELEVEN', calories: 140, protein_g: 14, carb_g: 2, fat_g: 10, emoji: '🥚' },
  { id: 'f_04', name: '無糖濃豆漿 450ml', store: '全家', calories: 135, protein_g: 15, carb_g: 5, fat_g: 6, emoji: '🥛' },
  { id: 'f_05', name: '鮪魚御飯糰', store: '7-ELEVEN', calories: 200, protein_g: 6, carb_g: 34, fat_g: 4, emoji: '🍙' },
  { id: 'f_06', name: '雞肉蔬菜御飯糰', store: '全家', calories: 215, protein_g: 8, carb_g: 36, fat_g: 4, emoji: '🍙' },
  { id: 'f_07', name: '四盎司牛肉堡', store: '麥當勞', calories: 510, protein_g: 30, carb_g: 40, fat_g: 25, emoji: '🍔' },
  { id: 'f_08', name: '麥克鷄塊 (6塊)', store: '麥當勞', calories: 270, protein_g: 14, carb_g: 16, fat_g: 16, emoji: '🍗' },
  { id: 'f_09', name: '大麥克漢堡', store: '麥當勞', calories: 550, protein_g: 26, carb_g: 45, fat_g: 29, emoji: '🍔' },
  { id: 'f_10', name: '希臘式優格 (無糖)', store: '全聯', calories: 100, protein_g: 15, carb_g: 6, fat_g: 0.5, emoji: '🥣' },
  { id: 'f_11', name: '乳清蛋白飲 (一份)', store: '自備', calories: 120, protein_g: 25, carb_g: 3, fat_g: 1, emoji: '🥤' },
  { id: 'f_12', name: '香蕉 (單根)', store: '全聯/超商', calories: 90, protein_g: 1, carb_g: 23, fat_g: 0.3, emoji: '🍌' },
  { id: 'f_13', name: '鹽烤鯖魚便當', store: '全家', calories: 620, protein_g: 32, carb_g: 75, fat_g: 20, emoji: '🍱' },
  { id: 'f_14', name: '滷牛腱肉 (一份)', store: '小吃/自備', calories: 180, protein_g: 28, carb_g: 1, fat_g: 6, emoji: '🥩' },
  { id: 'f_15', name: '鹹酥雞胸肉 (一份)', store: '夜市外食', calories: 430, protein_g: 24, carb_g: 18, fat_g: 28, emoji: '🍗' },
];

export const QUICK_FOODS = FOOD_DATABASE;

// ============================================================
// Coach Feedback Templates
// ============================================================
export const COACH_MESSAGES = {
  rep_increase: (reps: number) => `穩穩的！次數推上來了，下一組目標提高到 ${reps} 下，姿勢顧好！💪`,
  weight_unlock: (weight: number) => `🎉 連續兩組推滿 12 下！達到標準，下一組正式升重至 ${weight}kg！`,
  weight_drop_rpe9: (weight: number) => `🛑 教練先別加！這組回報【有點硬】(RPE 9)，為防關節硬推代償，教練主動幫你降回 ${weight}kg！`,
  weight_drop_rpe10: (weight: number) => `⚠️ 踩煞車！這組回報【極限力竭】(RPE 10)，強制下修至 ${weight}kg 並拉長休息，安全第一！`,
  tier1_alert: '⚠️ 偵測到刺痛！卡片已亮琥珀色，自動切換對握中立握法並降重 20%，關節安全最優先',
  tier2_alert: '🛑 同部位持續不適！卡片亮紅燈，已直接為你換成坐姿機械式動作，固定軌跡更安全',
  hard_limit: '⛔ 這個重量超出安全肌肥大區間！教練先別加——我們不是在比力量舉，先推滿 12 下！',
  rest_start: (seconds: number) => `休息 ${seconds} 秒，深吸慢吐放鬆神經系統 😮‍💨`,
  rest_extend: '收到！再多休 30 秒喘口氣，已記錄至疲勞日誌 🫁',
  rest_done: '休息結束！調整呼吸，準備上陣 🔥',
  exercise_done: (name: string) => `🎯 ${name} 全部組數完成！漂亮，滑動進入下一個動作！`,
  workout_done: '🎉 今日訓練圓滿結算！總容量與營養補償已生成，快來看看你的進步！📊',
  rpe_easy: '感覺很輕鬆？那我們先把次數推滿 12 下，教練先別加重！😎',
  rpe_moderate: '這個強度剛剛好，動作控制非常漂亮，繼續保持 👊',
  rpe_hard: '撐得好！有點硬就先穩住，不用急著硬拚重量',
  pr_celebration: '🏆 破個人紀錄啦！總噸數再次突破，肌肉正在超量恢復！',
};
