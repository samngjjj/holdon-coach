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
  shortTitle?: string;
  tagline?: string;
  category: 'SpecialFocus' | 'PPL' | 'UpperLower' | 'BroSplit';
  categoryLabel: string;
  description: string;
  targetFocus: string;
  equipment?: string;
  duration?: string;
  level?: string;
  caloriesBurn?: number;
  nippardPrinciples?: {
    scientificBasis: string;
    repScheme: string;
    frequency: string;
    weeklySets: string;
  };
  exercises: ExerciseCard[];
}

export const WORKOUT_PLANS: WorkoutPlanPreset[] = [
  // 1. 焦點專項 — 腹部減脂與抗伸展核心 (Jeff Nippard Scientific Waist & Core)
  {
    id: 'fat_loss_belly',
    name: 'Jeff Nippard — 腹部減脂與抗伸展核心 (Scientific Waist & Core)',
    shortTitle: '腹部減脂',
    tagline: '骨盆後傾捲動 • 抗伸展長力臂 • 消除腰腹贅肉',
    category: 'SpecialFocus',
    categoryLabel: '30日專項焦點',
    description: 'Jeff Nippard 科學腹肌指南！依據肌電圖（EMG）研究，透過骨盆主動後傾（PPT）孤立下腹，結合抗伸展長力臂平板支撐與側向旋轉，最大化核心張力並保護腰椎。',
    targetFocus: '腹直肌下段 / 腹橫肌 / 側腹斜肌 / 抗伸展穩定',
    equipment: '無需器材',
    duration: '18 分鐘',
    level: '科學進階',
    caloriesBurn: 280,
    nippardPrinciples: {
      scientificBasis: '骨盆後傾捲動 (PPT) + 抗伸展等長收縮 (Anti-Extension)',
      repScheme: '12-16 Reps (RIR 1-2)',
      frequency: '每週 2-3 次核心循環',
      weeklySets: '12-14 組最優容量',
    },
    exercises: [
      {
        exercise_id: 'lying_leg_raise',
        exercise_name: '仰臥骨盆後傾抬腿',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/scissors-kick.gif',
          alt_text: '仰臥交替抬腿動作示範',
          cue: 'Jeff 核心法則：吸氣骨盆後傾緊貼地面，下腹發力將骨盆捲離地面 2 公分，離心 3 秒慢放，不靠屈髖代償。',
        },
        grip_type: '徒手平躺',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 14, rule: '推滿 14 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'oblique_crunch',
        exercise_name: '斜向對角單車轉體',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/bicycle-crunch.gif',
          alt_text: '單車轉體動作示範',
          cue: '胸廓朝對側骨盆旋轉，雙手輕放耳側不拉扯頸椎，頂峰側腹等長收縮擠壓 1 秒。',
        },
        grip_type: '雙手輕觸耳側',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 16, rule: '推滿 16 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'plank_core',
        exercise_name: '長力臂抗伸展平板支撐',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/plank.gif',
          alt_text: '平板支撐示範',
          cue: '手肘前移超出肩膀 10 公分拉長力臂，骨盆微後傾夾緊臀部與腹直肌，產生超強神經肌肉徵召。',
        },
        grip_type: '手肘撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 45, rule: '撐滿 45 秒即完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'quadruped_donkey_kick',
        exercise_name: '跪姿後側鏈抗扭提膝',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/donkey-kick.gif',
          alt_text: '跪姿屈膝提膝示範',
          cue: '腰椎保持絕對中立不晃動，單腿後蹬至與軀幹平行，強化核心旋轉穩定與上臀。',
        },
        grip_type: '雙手手掌撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 14, rule: '推滿 14 下完成' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 2. 焦點專項 — 六塊腹肌科學雕刻 (Jeff Nippard Evidence-Based Abs)
  {
    id: 'six_pack_abs',
    name: 'Jeff Nippard — 六塊腹肌科學雕刻 (Evidence-Based Abs)',
    shortTitle: '六塊腹肌',
    tagline: '深層腹直肌募集 • 全活動度屈曲 • 稜角分明',
    category: 'SpecialFocus',
    categoryLabel: '30日專項焦點',
    description: 'Jeff Nippard 招牌六塊腹肌課表！融合上腹屈曲、下腹抬腿、旋轉側腹與極限等長抗屈，在保護椎間盤的前提下創造最高的機械張力與代謝壓力。',
    targetFocus: '腹直肌上中下段 / 腹內外斜肌 / 前鋸肌',
    equipment: '無需器材',
    duration: '20 分鐘',
    level: '中高階',
    caloriesBurn: 310,
    nippardPrinciples: {
      scientificBasis: '主動脊柱屈曲 (Active Spinal Flexion) + 漸進式超負荷',
      repScheme: '12-16 Reps (RIR 1-2)',
      frequency: '每週 2-3 次',
      weeklySets: '14 組高強度做組',
    },
    exercises: [
      {
        exercise_id: 'oblique_crunch',
        exercise_name: '側腹對角線極限收縮',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/bicycle-crunch.gif',
          alt_text: '單車捲腹示範',
          cue: 'Jeff 提示：集中意念於側腹肌纖維縮短，手肘只是指引方向，每下旋轉停頓 1 秒。',
        },
        grip_type: '雙手輕觸耳側',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 16, rule: '推滿 16 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'lying_leg_raise',
        exercise_name: '懸空骨盆捲腹抬腿',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/scissors-kick.gif',
          alt_text: '仰臥抬腿示範',
          cue: '雙腿下放時在離地 15 度停頓 1 秒（長肌纖維拉伸區），下背部全程緊貼地面。',
        },
        grip_type: '徒手平躺',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 16, rule: '推滿 16 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'plank_core',
        exercise_name: '等長高阻抗平板支撐',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/plank.gif',
          alt_text: '平板支撐示範',
          cue: '意念想像手肘與腳尖在地面互拉，全身緊繃如鋼板，極限榨乾核心深層肌群。',
        },
        grip_type: '手肘撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 50, rule: '撐滿 50 秒即完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'quadruped_donkey_kick',
        exercise_name: '跪姿動態核心提膝',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/donkey-kick.gif',
          alt_text: '提膝示範',
          cue: '大腿前收時吐氣極限壓縮腹肌下部，後蹬時夾緊臀肌，達成拮抗平衡。',
        },
        grip_type: '雙手手掌撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 14, rule: '推滿 14 下完成' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 3. 焦點專項 — 蜜桃翹臀科學 (Jeff Nippard Science-Based Glute Hypertrophy)
  {
    id: 'glutes_focus',
    name: 'Jeff Nippard — 蜜桃翹臀科學 (Science-Based Glute Hypertrophy)',
    shortTitle: '臀部',
    tagline: '拉伸位+縮短位雙重超量肌肥大 • 提臀不粗腿',
    category: 'SpecialFocus',
    categoryLabel: '30日專項焦點',
    description: 'Jeff Nippard 臀肌科學黃金三角！結合「縮短位峰值收縮（臀橋）」與「長肌纖維拉伸過載（保加利亞分腿蹲）」，最大化臀大肌與臀中肌生長信號，膝關節與腰椎零負擔。',
    targetFocus: '臀大肌上部/下部 / 臀中肌 / 膕繩肌',
    equipment: '自重 / 啞鈴',
    duration: '22 分鐘',
    level: '全階段通用',
    caloriesBurn: 290,
    nippardPrinciples: {
      scientificBasis: '拉伸位過載 (Lengthened Overload) + 峰值等長收縮 (Shortened Peak)',
      repScheme: '10-15 Reps (RIR 1-2)',
      frequency: '每週 2 次高頻刺激',
      weeklySets: '14 組最優容量',
    },
    exercises: [
      {
        exercise_id: 'glute_bridge',
        exercise_name: '仰臥骨盆後傾臀橋',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/glute-bridge.gif',
          alt_text: '仰臥橋式提臀示範',
          cue: 'Jeff 招牌細節：下巴微收看肚臍防止腰椎超伸，腳跟踩實，頂峰骨盆後傾夾緊臀大肌停留 2 秒。',
        },
        grip_type: '徒手平躺',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 16, rule: '推滿 16 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'bulgarian_split_squat',
        exercise_name: '臀部偏向保加利亞分腿蹲',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/bulgarian-split-squat.gif',
          alt_text: '保加利亞分腿蹲示範',
          cue: '身軀微前傾 15 度將重力線完全加載至臀大肌，下沉至大腿與地面平行，拉伸位停頓 1 秒。',
        },
        grip_type: '雙手垂持',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 8, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'quadruped_donkey_kick',
        exercise_name: '四足跪姿 45° 外展蹬臀',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/donkey-kick.gif',
          alt_text: '跪姿屈膝抬腿示範',
          cue: '腳尖微向外旋 15 度對準臀大肌上部肌纖維方向，頂峰等長擠壓 1.5 秒。',
        },
        grip_type: '雙手手掌撐地',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 0, reps: 15, rule: '推滿 15 下完成' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'goblet_squat',
        exercise_name: '寬距全幅度高腳杯深蹲',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '啞鈴高腳杯深蹲示範',
          cue: '寬站距外展膝蓋，直立下沉至全活動度（Full ROM），底部拉伸臀肌下側。',
        },
        grip_type: '托握啞鈴',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 16, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 4. 推拉腿 - 終極推日 (Jeff Nippard The Ultimate Push Day)
  {
    id: 'ppl_push',
    name: 'Jeff Nippard — 終極推日 (The Ultimate Push Day)',
    shortTitle: '推胸肩三頭 (Push)',
    tagline: '30° 上斜臥推 • 鎖肩長肌纖維拉伸 • 肩胛平面側平舉',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: 'Jeff Nippard 最暢銷推日範本！開場以 30° 上斜啞鈴臥推觸發上胸拉伸肌肥大（Stretch-Mediated Hypertrophy），接續平板臥推壓榨中下胸機械張力，再由肩胛骨平面側平舉與過頭伸展雕塑 3D 肩膀與三頭長頭。',
    targetFocus: '胸大肌上部/中下部 / 三角肌中前束 / 肱三頭肌長頭',
    equipment: '啞鈴 / 板凳',
    duration: '45 分鐘',
    level: '科學進階',
    caloriesBurn: 340,
    nippardPrinciples: {
      scientificBasis: '30° 上胸最優肌電角 + 肩胛骨平面運動 + 雙重漸進 (8-12RM)',
      repScheme: '8-12 RM (RIR 1-2)',
      frequency: '每週 2 次高頻率推日',
      weeklySets: '15 組超量恢復容量',
    },
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '30° 上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '標準正握上斜啞鈴臥推動作示範',
          cue: 'Jeff 招牌上胸角度：板凳調至 30 度（肌電圖活性最高），手肘內收 45 度保護旋轉肌，底端停留 1 秒享受長肌纖維拉伸，推滿 12 下才升重！',
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
          cue: '沉肩收緊肩胛骨，小臂全程垂直地面，離心 2-3 秒慢放，頂峰胸大肌主動聚攏對撞。',
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
        exercise_name: '肩胛平面啞鈴側平舉',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-lateral-raise.gif',
          alt_text: '啞鈴側平舉動作示範',
          cue: '手臂與身軀呈 15-30 度夾角（肩胛骨平面），手肘微彎引導抬起至肩高，完全釋放肩峰夾擠壓力。',
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
          cue: '肩關節屈曲上抬，將三頭肌長頭（Long Head）置於極限被動拉伸位，大臂固定垂直，榨乾深層肌纖維。',
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

  // 5. 推拉腿 - 終極拉日 (Jeff Nippard The Ultimate Pull Day)
  {
    id: 'ppl_pull',
    name: 'Jeff Nippard — 終極拉日 (The Ultimate Pull Day)',
    shortTitle: '拉背二頭 (Pull)',
    tagline: '垂直背闊下拉 • 胸托無腰椎負擔划船 • 上斜二頭極致拉伸',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: 'Jeff Nippard 科學背部肌肥大！垂直下拉直擊背闊肌寬度，胸托划船杜絕下背與腰椎借力代償，搭配上斜二頭彎舉在肩關節後伸位觸發長肌纖維拉伸，打造黃金倒三角。',
    targetFocus: '背闊肌全段 / 菱形肌 / 斜方肌中下束 / 肱二頭肌長頭 / 後三角肌',
    equipment: '啞鈴 / 滑輪',
    duration: '45 分鐘',
    level: '科學進階',
    caloriesBurn: 350,
    nippardPrinciples: {
      scientificBasis: '胸托零剪切力 + 肩關節後伸位拉伸 + 垂直/水平力線平衡',
      repScheme: '8-12 RM (RIR 1-2)',
      frequency: '每週 2 次高頻率拉日',
      weeklySets: '15 組超量恢復容量',
    },
    exercises: [
      {
        exercise_id: 'lat_pulldown_db',
        exercise_name: '高位滑輪垂直下拉',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/lat-pulldown.gif',
          alt_text: '滑輪下拉動作示範',
          cue: '挺胸沉肩，手肘往後下方朝褲袋方向牽引，頂峰背闊肌等長收縮 1 秒，離心 3 秒慢速延展。',
        },
        grip_type: '正握寬握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 40, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'one_arm_db_row',
        exercise_name: '單臂胸托弧線划船',
        exercise_index: 1,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/one-arm-dumbbell-row.gif',
          alt_text: '單臂啞鈴划船示範',
          cue: '胸部與核心完全鎖定，啞鈴呈向後的拋物線拉引至髖部，頂峰夾背徹底擠壓背闊下束。',
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
      },
      {
        exercise_id: 'rear_delt_fly',
        exercise_name: '45° 俯身三角肌後束飛鳥',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/rear-delt-fly.gif',
          alt_text: '俯身啞鈴飛鳥示範',
          cue: '俯身 45 度，手臂向兩側展翅不聳肩，小拇指不刻意翻轉，孤立後三角肌。',
        },
        grip_type: '掌心相對',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 6, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_incline_curl',
        exercise_name: '45° 上斜啞鈴二頭彎舉',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-bicep-curl.gif',
          alt_text: '上斜啞鈴彎舉示範',
          cue: '椅背 45-60 度，手臂自然後垂，在極限長度拉伸位起步彎舉，頂峰前臂外旋（Supination）頂峰擠壓。',
        },
        grip_type: '正反握轉向',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 6. 推拉腿 - 終極腿日 (Jeff Nippard The Ultimate Leg Day)
  {
    id: 'ppl_legs',
    name: 'Jeff Nippard — 終極腿日 (The Ultimate Leg Day)',
    shortTitle: '下肢力量 (Legs)',
    tagline: '全幅度深蹲 • 屈髖 RDL 離心超量 • 保加利亞單側穩定',
    category: 'PPL',
    categoryLabel: '推拉腿 (PPL)',
    description: 'Jeff Nippard 下肢黃金公式！深蹲進行全關節活動度（Full ROM）股四頭肌拉伸，RDL 提供後側鏈極限離心張力，保加利亞分腿蹲消除左右側肌力失衡，輔以全幅度站姿提踵。',
    targetFocus: '股四頭肌 / 膕繩肌 / 臀大肌 / 小腿三頭肌',
    equipment: '啞鈴 / 板凳',
    duration: '50 分鐘',
    level: '高強度',
    caloriesBurn: 420,
    nippardPrinciples: {
      scientificBasis: 'Full ROM 膝關節深屈曲 + 髖鉸鏈離心超量 + 單側肌力對稱',
      repScheme: '8-12 RM (深蹲/硬舉) • 12-15 RM (單腿/提踵)',
      frequency: '每週 2 次腿部日',
      weeklySets: '14 組高負載容量',
    },
    exercises: [
      {
        exercise_id: 'goblet_squat',
        exercise_name: '全活動度高腳杯深蹲',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '啞鈴高腳杯深蹲示範',
          cue: '雙腳微外展，挺胸軀幹直立，下蹲至大腿低於平行線，底部停頓 1 秒最大化股四頭肌拉伸。',
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
          cue: '膝關節微彎鎖死角度，全靠髖關節向後折疊（Hip Hinge），啞鈴貼著小腿下放，膕繩肌拉伸至極限。',
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
          cue: '身軀微前傾 15 度聚焦臀部，垂直下沉至後膝貼地，推起時重心穩在腳後跟。',
        },
        grip_type: '雙手垂持',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'standing_calf_raise',
        exercise_name: '全幅度單腿提踵',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/calf-raise.gif',
          alt_text: '站姿提踵示範',
          cue: '底部腳後跟下沉至拉伸極限停留 1 秒消除阿基里斯腱彈性反彈，頂峰提踵收縮 1 秒。',
        },
        grip_type: '單手持啞鈴',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 12, reps: 15, rule: '滿 15 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 7. 二分化 - 基礎上肢專精 (Jeff Nippard The Fundamentals Upper)
  {
    id: 'upper_lower_upper',
    name: 'Jeff Nippard — 基礎上肢專精 (The Fundamentals Upper)',
    shortTitle: '二分化上肢 (Upper)',
    tagline: '每週 2 次高頻率刺激 • 水平/垂直推拉黃金拮抗平衡',
    category: 'UpperLower',
    categoryLabel: '二分化 (Upper / Lower)',
    description: 'Jeff Nippard 招牌 Upper/Lower 分化！一週刺激上肢 2 次，精確配比水平推（臥推）、垂直推（肩推）、水平拉（划船）、垂直拉（下拉）與手臂超量補償。',
    targetFocus: '胸肌 / 背闊肌 / 三角肌全束 / 肱二頭與肱三頭肌',
    equipment: '啞鈴 / 滑輪',
    duration: '45 分鐘',
    level: '中階進階',
    caloriesBurn: 360,
    nippardPrinciples: {
      scientificBasis: '每週 2 次最優 MPS 蛋白質合成峰值 + 拮抗平衡',
      repScheme: '8-12 RM (RIR 1-2)',
      frequency: '每週 2 次上肢日',
      weeklySets: '14 組均衡容量',
    },
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '30° 上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '上斜啞鈴臥推示範',
          cue: '鎖死肩胛骨，30 度椅背精準刺激鎖骨處上胸肌纖維，底部停頓 1 秒。',
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
          cue: '軀幹平穩不借力旋轉，手肘沿肋骨側向後上方拉引，頂峰夾背。',
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
          cue: '手肘微向前收 20-30 度，避開肩峰撞擊危險區，平穩向上推舉。',
        },
        grip_type: '正握微旋前',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 12, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'hammer_curl',
        exercise_name: '啞鈴中立錘式彎舉',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/hammer-curl.gif',
          alt_text: '啞鈴錘式彎舉示範',
          cue: '掌心相對對握，重載刺激肱肌（Brachialis）與肱橈肌，撐大手臂側向厚度。',
        },
        grip_type: '中立對握',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 8. 二分化 - 基礎下肢與核心 (Jeff Nippard The Fundamentals Lower)
  {
    id: 'upper_lower_lower',
    name: 'Jeff Nippard — 基礎下肢與核心 (The Fundamentals Lower)',
    shortTitle: '二分化下肢 (Lower)',
    tagline: '下肢三大力線整合 • 股四頭/後側鏈/核心等長穩固',
    category: 'UpperLower',
    categoryLabel: '二分化 (Upper / Lower)',
    description: 'Jeff Nippard 下肢核心經典配方！深蹲驅動前側鏈、硬舉深拉後側鏈，輔以長力臂抗伸展平板支撐強化核心傳導力量。',
    targetFocus: '股四頭肌 / 膕繩肌 / 臀大肌 / 深層抗伸展核心',
    equipment: '啞鈴 / 自重',
    duration: '40 分鐘',
    level: '中階',
    caloriesBurn: 380,
    nippardPrinciples: {
      scientificBasis: '前後側動力鏈閉鎖整合 + 抗伸展等長收縮',
      repScheme: '8-12 RM (大重量做組)',
      frequency: '每週 2 次下肢日',
      weeklySets: '12 組高張力做組',
    },
    exercises: [
      {
        exercise_id: 'goblet_squat',
        exercise_name: '高腳杯全幅度深蹲',
        exercise_index: 0,
        total_exercises: 3,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '高腳杯深蹲示範',
          cue: '核心收緊如同吸入氣缸，髖關節下沉至膝關節下方，全幅度膝屈拉伸。',
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
          cue: '向後推臀折疊髖關節，下背部鎖緊筆直，享受後大腿緊繃拉伸張力。',
        },
        grip_type: '正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 22.5, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'plank_core',
        exercise_name: '長力臂核心平板支撐',
        exercise_index: 2,
        total_exercises: 3,
        media: {
          type: 'gif',
          url: '/exercises/plank.gif',
          alt_text: '平板支撐示範',
          cue: '骨盆微後傾（PPT），腹肌臀肌同時劇烈發力，強化腰椎抗剪切能力。',
        },
        grip_type: '徒手支撐',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 45, rule: '撐滿 45 秒即完成' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 9. 五分化 - 健美胸肌與手臂專精 (Jeff Nippard Pure Bodybuilding Chest & Arms)
  {
    id: 'bro_chest',
    name: 'Jeff Nippard — 健美胸肌與手臂專精 (Pure Bodybuilding Chest & Arms)',
    shortTitle: '胸部與手臂轟炸',
    tagline: '高容量代謝壓力 • 上胸重載+飛鳥拉伸+自重收尾',
    category: 'BroSplit',
    categoryLabel: '五分化 (Bro Split)',
    description: 'Jeff Nippard 純健美（Pure Bodybuilding）胸臂專項！先以複合臥推累積超高機械張力，中段以啞鈴飛鳥提供極限拉伸位刺激，最後以力竭伏地挺身進行代謝泵感充血。',
    targetFocus: '胸大肌全束（上/中/下） / 肱三頭肌 / 肱二頭肌',
    equipment: '啞鈴 / 自重',
    duration: '42 分鐘',
    level: '高階專項',
    caloriesBurn: 360,
    nippardPrinciples: {
      scientificBasis: '機械張力 (Heavy Compound) + 代謝壓力 (Metabolic Stress)',
      repScheme: '8-12 RM 複合 + 12-15 RM 孤立 + 力竭收尾',
      frequency: '每週 1-2 次單部位專攻',
      weeklySets: '14 組極限充血做組',
    },
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '30° 上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '上斜啞鈴臥推示範',
          cue: '上胸第一動作，30 度椅角，底部 1 秒停頓，滿 12 下自動解鎖升重。',
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
          cue: '下落深吸氣鎖住核心，推起吐氣，胸肌頂峰等長擠壓 1 秒。',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 4,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_fly',
        exercise_name: '啞鈴仰臥長肌纖維飛鳥',
        exercise_index: 2,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-fly.gif',
          alt_text: '啞鈴仰臥飛鳥示範',
          cue: '手肘微曲如環抱巨木，兩側外展至胸肌被動拉伸極限，頂峰弧線聚攏。',
        },
        grip_type: '對握抱球',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'pushup_burnout',
        exercise_name: '自重力竭伏地挺身 (Burnout Set)',
        exercise_index: 3,
        total_exercises: 4,
        media: {
          type: 'gif',
          url: '/exercises/pushup.gif',
          alt_text: '標準伏地挺身示範',
          cue: '胸部輕觸地面再推起，作為當日最後收尾，將血液深度灌入胸肌纖維。',
        },
        grip_type: '徒手手掌撐地',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 0, reps: 15, rule: '推至力竭' },
        safety_status: 'NORMAL',
      },
    ],
  },

  // 10. 五分化/全身頻率 — 高頻全身肌肥大 (Jeff Nippard High Frequency Full Body)
  {
    id: 'full_body_high_freq',
    name: 'Jeff Nippard — 高頻全身肌肥大 (High Frequency Full Body)',
    shortTitle: '高頻全身 (Full Body)',
    tagline: '一週三練全身循環 • 最優蛋白質合成週期 • 高性價比',
    category: 'BroSplit',
    categoryLabel: '全身頻率 (Full Body)',
    description: 'Jeff Nippard 備受推崇的全身高頻訓練哲學！每練一次全身主要肌群一次，每次維持 3-4 組最高品質做組，肌蛋白質合成（MPS）終年維持峰值。',
    targetFocus: '胸 / 背 / 腿 / 肩 全身各大肌群',
    equipment: '啞鈴 / 板凳',
    duration: '45 分鐘',
    level: '全階段通用',
    caloriesBurn: 400,
    nippardPrinciples: {
      scientificBasis: '每週 3 次頻率刺激 + 局部累積容量最優化',
      repScheme: '8-12 RM (RIR 1-2)',
      frequency: '每週 3 天隔日進行',
      weeklySets: '15 組全身精準做組',
    },
    exercises: [
      {
        exercise_id: 'incline_db_press',
        exercise_name: '30° 上斜啞鈴臥推',
        exercise_index: 0,
        total_exercises: 5,
        media: {
          type: 'gif',
          url: '/exercises/incline-dumbbell-press.gif',
          alt_text: '上斜啞鈴臥推示範',
          cue: '上胸主導複合動作，精準控制離心速度 2-3 秒。',
        },
        grip_type: '一般正握',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 16, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'one_arm_db_row',
        exercise_name: '單臂啞鈴划船',
        exercise_index: 1,
        total_exercises: 5,
        media: {
          type: 'gif',
          url: '/exercises/one-arm-dumbbell-row.gif',
          alt_text: '單臂啞鈴划船示範',
          cue: '手肘向後拉引貼合背闊肌力線，完全保護脊椎中立。',
        },
        grip_type: '對握中立',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'goblet_squat',
        exercise_name: '高腳杯全幅度深蹲',
        exercise_index: 2,
        total_exercises: 5,
        media: {
          type: 'gif',
          url: '/exercises/goblet-squat.gif',
          alt_text: '高腳杯深蹲示範',
          cue: '全關節活動度深蹲，深層拉伸股四頭肌。',
        },
        grip_type: '托握啞鈴',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 20, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_rdl',
        exercise_name: '啞鈴羅馬尼亞硬舉',
        exercise_index: 3,
        total_exercises: 5,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-rdl.gif',
          alt_text: '啞鈴硬舉示範',
          cue: '向後推臀折疊髖鉸鏈，刺激大腿後側膕繩肌與臀部。',
        },
        grip_type: '正握',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 22.5, reps: 10, rule: '滿 12 下自動解鎖升重' },
        safety_status: 'NORMAL',
      },
      {
        exercise_id: 'db_lateral_raise',
        exercise_name: '肩胛平面啞鈴側平舉',
        exercise_index: 4,
        total_exercises: 5,
        media: {
          type: 'gif',
          url: '/exercises/dumbbell-lateral-raise.gif',
          alt_text: '啞鈴側平舉示範',
          cue: '肩胛骨平面向外抬起，雕塑三角肌中束飽滿度。',
        },
        grip_type: '正握提拉',
        current_set: 1,
        total_sets: 3,
        target_load: { weight_kg: 8, reps: 12, rule: '滿 12 下自動解鎖升重' },
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
const defaultPlan = WORKOUT_PLANS.find((p) => p.id === 'ppl_push') || WORKOUT_PLANS[0];

export const MOCK_SESSION: WorkoutSession = {
  app_name: 'HoldOn_Coach',
  session_id: 'push_day_20261031_01',
  user_name: 'Sam',
  plan_id: defaultPlan.id,
  plan_name: defaultPlan.name,
  workout_goal: 'Jeff_Nippard_Hypertrophy_8_12_Reps',
  total_volume_kg: 0,
  current_state: 'PREVIEW',
  exercises: JSON.parse(JSON.stringify(defaultPlan.exercises)),
  rest_timer: {
    default_seconds: 90,
    accumulated_fatigue_extension_seconds: 0,
  },
  coach_feedback: {
    speech_text: 'Sam，歡迎來到 Jeff Nippard 科學肌肥大課表！恪守 30° 上胸拉伸與雙重漸進，推滿 12 下才升重！💪',
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
