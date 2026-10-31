// ============================================================
// HoldOn Coach — Exercise Catalog Pool
// 完整動作庫，支援動作抽換、新增、排序與 AI 自動編排課表
// ============================================================

import { ExerciseCard } from './exercises';

export interface CatalogExerciseItem {
  category: '胸部' | '背部' | '肩膀' | '手臂' | '腿部' | '核心';
  exercise: Omit<ExerciseCard, 'exercise_index' | 'total_exercises' | 'current_set'>;
}

export const EXERCISE_CATALOG_POOL: CatalogExerciseItem[] = [
  // --- 胸部 ---
  {
    category: '胸部',
    exercise: {
      exercise_id: 'incline_db_press',
      exercise_name: '上斜啞鈴臥推',
      media: {
        type: 'gif',
        url: '/exercises/incline-dumbbell-press.gif',
        alt_text: '上斜啞鈴臥推動作示範',
        cue: '手肘微收 45 度，肩膀沉穩貼背，專注上胸拉伸與聚攏',
      },
      grip_type: '一般正握',
      total_sets: 4,
      target_load: { weight_kg: 16, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
      alt_media: {
        type: 'gif',
        url: '/exercises/incline-dumbbell-press-neutral.gif',
        alt_text: '對握中立握法上斜臥推',
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
  },
  {
    category: '胸部',
    exercise: {
      exercise_id: 'flat_db_press',
      exercise_name: '平板啞鈴臥推',
      media: {
        type: 'gif',
        url: '/exercises/flat-dumbbell-press.gif',
        alt_text: '平板啞鈴臥推示範',
        cue: '下落吸氣穩定肩胛，推起吐氣胸部夾緊',
      },
      grip_type: '一般正握',
      total_sets: 4,
      target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
      alt_media: {
        type: 'gif',
        url: '/exercises/flat-dumbbell-press-neutral.gif',
        alt_text: '對握中立握法平板臥推',
        cue: '中立握法鎖住肩關節健康',
      },
      replacement: {
        exercise_id: 'machine_chest_press',
        exercise_name: '坐姿機械式胸推機',
        media: {
          type: 'gif',
          url: '/exercises/machine-chest-press.gif',
          alt_text: '坐姿機械胸推示範',
          cue: '固定軌跡推出，保護旋轉肌',
        },
        grip_type: '機械握把',
      },
    },
  },
  {
    category: '胸部',
    exercise: {
      exercise_id: 'dumbbell_fly',
      exercise_name: '啞鈴胸肌飛鳥',
      media: {
        type: 'gif',
        url: '/exercises/dumbbell-fly.gif',
        alt_text: '啞鈴胸肌飛鳥示範',
        cue: '手臂微屈如抱大樹，感受胸肌外側強烈被動拉伸',
      },
      grip_type: '對握弧形',
      total_sets: 3,
      target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '胸部',
    exercise: {
      exercise_id: 'push_ups',
      exercise_name: '自重伏地挺身 (俯臥撐)',
      media: {
        type: 'gif',
        url: '/exercises/push-ups.gif',
        alt_text: '伏地挺身動作示範',
        cue: '全身繃成一直線，手肘與軀幹呈 45 度角下壓',
      },
      grip_type: '徒手撐地',
      total_sets: 3,
      target_load: { weight_kg: 0, reps: 15, rule: '滿 15 下自動解鎖進階' },
      safety_status: 'NORMAL',
    },
  },

  // --- 背部 ---
  {
    category: '背部',
    exercise: {
      exercise_id: 'one_arm_db_row',
      exercise_name: '單臂啞鈴划船',
      media: {
        type: 'gif',
        url: '/exercises/one-arm-dumbbell-row.gif',
        alt_text: '單臂啞鈴划船示範',
        cue: '脊柱延伸平行於凳，往臀部方向弧形拉起，手肘緊貼身體',
      },
      grip_type: '對握中立',
      total_sets: 4,
      target_load: { weight_kg: 18, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
      alt_media: {
        type: 'gif',
        url: '/exercises/chest-supported-row.gif',
        alt_text: '胸托啞鈴划船',
        cue: '胸部貼緊斜凳，卸除腰椎負擔',
      },
    },
  },
  {
    category: '背部',
    exercise: {
      exercise_id: 'lat_pulldown_db',
      exercise_name: '高位滑輪下拉',
      media: {
        type: 'gif',
        url: '/exercises/lat-pulldown.gif',
        alt_text: '滑輪下拉示範',
        cue: '手肘主導向後下方拉，挺胸感受背闊肌強烈聚縮',
      },
      grip_type: '正握寬握',
      total_sets: 4,
      target_load: { weight_kg: 40, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '背部',
    exercise: {
      exercise_id: 'pull_ups',
      exercise_name: '寬握引體向上',
      media: {
        type: 'gif',
        url: '/exercises/pull-ups.gif',
        alt_text: '引體向上示範',
        cue: '背闊肌先啟動下沉肩胛，下巴過槓頂峰停頓 1 秒',
      },
      grip_type: '正握寬握',
      total_sets: 3,
      target_load: { weight_kg: 0, reps: 8, rule: '推滿 8 下解鎖負重' },
      safety_status: 'NORMAL',
    },
  },

  // --- 肩膀 ---
  {
    category: '肩膀',
    exercise: {
      exercise_id: 'db_lateral_raise',
      exercise_name: '啞鈴側平舉',
      media: {
        type: 'gif',
        url: '/exercises/dumbbell-lateral-raise.gif',
        alt_text: '啞鈴側平舉示範',
        cue: '手肘微彎鉛角，舉至肩膀高度即停，勿用斜方肌甩動',
      },
      grip_type: '正握提拉',
      total_sets: 3,
      target_load: { weight_kg: 8, reps: 12, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
      alt_media: {
        type: 'gif',
        url: '/exercises/cable-lateral-raise.gif',
        alt_text: '纜繩側平舉',
        cue: '纜繩恆定張力，肩關節低衝擊',
      },
    },
  },
  {
    category: '肩膀',
    exercise: {
      exercise_id: 'db_shoulder_press',
      exercise_name: '坐姿啞鈴肩推',
      media: {
        type: 'gif',
        url: '/exercises/dumbbell-shoulder-press.gif',
        alt_text: '坐姿啞鈴肩推示範',
        cue: '背貼椅背，推至頂峰啞鈴不互撞，保護肩峰滑囊',
      },
      grip_type: '正握微旋前',
      total_sets: 4,
      target_load: { weight_kg: 14, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '肩膀',
    exercise: {
      exercise_id: 'rear_delt_fly',
      exercise_name: '俯身啞鈴飛鳥',
      media: {
        type: 'gif',
        url: '/exercises/rear-delt-fly.gif',
        alt_text: '俯身啞鈴飛鳥示範',
        cue: '俯身 45 度手肘微曲，向兩側展翅孤立後三角肌',
      },
      grip_type: '中立對握',
      total_sets: 3,
      target_load: { weight_kg: 6, reps: 12, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },

  // --- 手臂 ---
  {
    category: '手臂',
    exercise: {
      exercise_id: 'overhead_tricep_ext',
      exercise_name: '過頭啞鈴三頭肌伸展',
      media: {
        type: 'gif',
        url: '/exercises/overhead-tricep-extension.gif',
        alt_text: '過頭啞鈴三頭伸展示範',
        cue: '大臂夾緊耳側垂直向上，手肘保持穩定不外擴',
      },
      grip_type: '雙手握單啞鈴',
      total_sets: 3,
      target_load: { weight_kg: 12, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '手臂',
    exercise: {
      exercise_id: 'db_incline_curl',
      exercise_name: '上斜啞鈴二頭彎舉',
      media: {
        type: 'gif',
        url: '/exercises/incline-bicep-curl.gif',
        alt_text: '上斜啞鈴彎舉示範',
        cue: '背貼斜凳享受二頭長頭極致拉伸，頂峰外旋擠壓',
      },
      grip_type: '旋後握法',
      total_sets: 3,
      target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '手臂',
    exercise: {
      exercise_id: 'hammer_curl',
      exercise_name: '啞鈴錘式彎舉',
      media: {
        type: 'gif',
        url: '/exercises/hammer-curl.gif',
        alt_text: '啞鈴錘式彎舉示範',
        cue: '掌心相對對握，專注強化肱肌與手臂前臂厚度',
      },
      grip_type: '中立對握',
      total_sets: 3,
      target_load: { weight_kg: 10, reps: 12, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },

  // --- 腿部 ---
  {
    category: '腿部',
    exercise: {
      exercise_id: 'goblet_squat',
      exercise_name: '啞鈴高腳杯深蹲',
      media: {
        type: 'gif',
        url: '/exercises/goblet-squat.gif',
        alt_text: '高腳杯深蹲示範',
        cue: '啞鈴抱於胸前，膝蓋順應腳尖方向蹲下至大腿平行',
      },
      grip_type: '托握啞鈴',
      total_sets: 4,
      target_load: { weight_kg: 20, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '腿部',
    exercise: {
      exercise_id: 'db_rdl',
      exercise_name: '啞鈴羅馬尼亞硬舉 (RDL)',
      media: {
        type: 'gif',
        url: '/exercises/dumbbell-rdl.gif',
        alt_text: '啞鈴羅馬尼亞硬舉示範',
        cue: '髖關節向後折疊，背部打直，大腿後側膕繩肌強烈拉伸',
      },
      grip_type: '正握垂直下放',
      total_sets: 4,
      target_load: { weight_kg: 22.5, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },
  {
    category: '腿部',
    exercise: {
      exercise_id: 'bulgarian_split_squat',
      exercise_name: '保加利亞分腿蹲',
      media: {
        type: 'gif',
        url: '/exercises/bulgarian-split-squat.gif',
        alt_text: '保加利亞分腿蹲示範',
        cue: '後腳背搭於板凳，前腳踩穩重心下沉，臀肌強烈刺激',
      },
      grip_type: '雙手垂持',
      total_sets: 3,
      target_load: { weight_kg: 10, reps: 10, rule: '滿 12 下自動解鎖升重' },
      safety_status: 'NORMAL',
    },
  },

  // --- 核心 ---
  {
    category: '核心',
    exercise: {
      exercise_id: 'plank_core',
      exercise_name: '平板支撐核心強化',
      media: {
        type: 'gif',
        url: '/exercises/plank.gif',
        alt_text: '平板支撐示範',
        cue: '手肘撐地骨盆後傾，腹肌臀部同時夾緊',
      },
      grip_type: '徒手支撐',
      total_sets: 3,
      target_load: { weight_kg: 0, reps: 45, rule: '撐滿 45 秒即完成' },
      safety_status: 'NORMAL',
    },
  },
];

export function findExerciseInCatalog(nameOrId: string): CatalogExerciseItem | undefined {
  const norm = nameOrId.toLowerCase().trim();
  return EXERCISE_CATALOG_POOL.find(
    (item) =>
      item.exercise.exercise_id.toLowerCase().includes(norm) ||
      item.exercise.exercise_name.toLowerCase().includes(norm) ||
      norm.includes(item.exercise.exercise_name.toLowerCase())
  );
}
