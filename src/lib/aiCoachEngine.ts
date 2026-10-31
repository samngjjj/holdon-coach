// ============================================================
// HoldOn Coach — Dedicated Context-Aware AI Fitness Engine
// 專屬讀取個人身體素質、訓練狀況、飲食狀況，並支援對話式動態編輯運動課表
// ============================================================

import {
  type UserProfile,
  type WorkoutSession,
  type DailyDietRecord,
  type WorkoutHistoryEntry,
  calculateProfileStats,
} from '@/data/exercises';
import { EXERCISE_CATALOG_POOL, findExerciseInCatalog } from '@/data/exerciseCatalog';

export interface AIPlanAction {
  type: 'reorder' | 'reverse' | 'swap' | 'replace' | 'add' | 'remove' | 'update_load';
  sourceName?: string;
  targetName?: string;
  targetIndex?: number;
  newWeight?: number;
  newReps?: number;
  newSets?: number;
  addedExerciseId?: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actionBadge?: {
    actionType: string;
    description: string;
    executed: boolean;
  };
}

export interface CoachContext {
  profile: UserProfile;
  session: WorkoutSession;
  diet: DailyDietRecord;
  history: WorkoutHistoryEntry[];
  currentSet: number;
  safetyTier: number;
  totalVolumeKg: number;
}

export interface AICoachReplyResult {
  replyText: string;
  action?: AIPlanAction;
}

export function generateAICoachResponse(
  userQuery: string,
  context: CoachContext
): AICoachReplyResult {
  const { profile, session, diet, history, currentSet, safetyTier, totalVolumeKg } = context;
  const stats = calculateProfileStats(profile);
  const q = userQuery.toLowerCase().trim();

  // Compute live diet aggregates
  const allMeals = [
    ...diet.meals.breakfast,
    ...diet.meals.lunch,
    ...diet.meals.dinner,
    ...diet.meals.snack,
  ];
  const consumedCalories = allMeals.reduce((s, m) => s + m.calories, 0);
  const consumedProtein = allMeals.reduce((s, m) => s + m.protein_g, 0);
  const consumedCarbs = allMeals.reduce((s, m) => s + m.carb_g, 0);
  const consumedFat = allMeals.reduce((s, m) => s + m.fat_g, 0);

  const proteinDeficit = Math.max(0, diet.targetProtein - consumedProtein);
  const calorieDeficit = Math.max(0, diet.targetCalories - consumedCalories);

  const currentExercise = session.exercises[session.exercises.length > 0 ? 0 : 0];

  // ============================================================
  // ⚡ 0. 課表編輯與順序調轉意圖辨識 (Plan Modification & Reordering)
  // ============================================================

  // Case 0-A: 前後次序調轉 / 倒過來做 / 反轉順序
  if (
    q.includes('前後次序調轉') ||
    q.includes('前後順序調轉') ||
    q.includes('順序倒轉') ||
    q.includes('倒過來做') ||
    q.includes('反過來做') ||
    q.includes('反轉順序') ||
    q.includes('順序倒過來') ||
    q.includes('全部調轉')
  ) {
    const action: AIPlanAction = {
      type: 'reverse',
      description: '將今日課表所有動作前後次序完全倒轉',
    };
    return {
      replyText: `🔄 **已為你將課表動作前後次序完全倒轉！**
      
💡 **運動科學解析**：
將次序反轉在健美訓練中稱為**「倒序刺激法 (Reverse Order Training)」**。先進行後段的單關節孤立動作（如側平舉、三頭伸展），能預先活化目標肌群神經募集，稍後進行複合臥推時關節更溫熱、受傷風險更低！

📋 **更新後動作清單**：
${session.exercises
  .slice()
  .reverse()
  .map((ex, i) => `${i + 1}. **${ex.exercise_name}** (${ex.target_load.weight_kg}kg × ${ex.target_load.reps}下)`)
  .join('\n')}

已即時同步到你的訓練畫面，隨時可點選最上方藥丸切換或開始第一組！💪`,
      action,
    };
  }

  // Case 0-B: 將特定動作移到第 1 個 / 調到前面 (例如: 側平舉換到第一個 / 側平舉排第一)
  if (
    (q.includes('第一') || q.includes('最前') || q.includes('前面') || q.includes('先做')) &&
    (q.includes('側平舉') || q.includes('平舉') || q.includes('划船') || q.includes('臥推') || q.includes('深蹲') || q.includes('三頭') || q.includes('二頭'))
  ) {
    let targetEx = session.exercises.find((e) =>
      q.includes(e.exercise_name.toLowerCase()) ||
      (q.includes('側平舉') && e.exercise_name.includes('側平舉')) ||
      (q.includes('三頭') && e.exercise_name.includes('三頭')) ||
      (q.includes('划船') && e.exercise_name.includes('划船')) ||
      (q.includes('二頭') && e.exercise_name.includes('二頭'))
    );

    if (!targetEx && q.includes('側平舉')) {
      targetEx = session.exercises.find((e) => e.exercise_id.includes('lateral'));
    }

    const exName = targetEx ? targetEx.exercise_name : '啞鈴側平舉';
    const action: AIPlanAction = {
      type: 'reorder',
      sourceName: exName,
      targetIndex: 0,
      description: `將【${exName}】調整為第 1 個動作`,
    };

    return {
      replyText: `🎯 **課表順序已更新！已將【${exName}】調整為第 1 個動作！**

🔥 **教練科學點評**：
把 **${exName}** 放在最前面是頂尖選手常用的**「預先疲勞法 (Pre-exhaustion)」**！
- 先將中三角肌泵血充血，神經連結拉滿。
- 稍後再推臥推時，肩膀不再冷冰冰，胸大肌更不容易被強勢肌群代償，保護肩關節！

現在訓練卡片頂部已更新為第 1 動作，穩穩推！👊`,
      action,
    };
  }

  // Case 0-C: 替換動作 (例如: 把平板臥推換成啞鈴飛鳥 / 換成俯臥撐)
  if (q.includes('換成') || q.includes('改成') || q.includes('替換')) {
    // 檢查是否有重量修改意圖
    const weightMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:kg|公斤)/);
    const setsMatch = q.match(/(\d+)\s*(?:組|sets?)/);
    const repsMatch = q.match(/(\d+)\s*(?:下|次|reps?)/);

    if (weightMatch || (setsMatch && repsMatch)) {
      const newWeight = weightMatch ? parseFloat(weightMatch[1]) : undefined;
      const newSets = setsMatch ? parseInt(setsMatch[1], 10) : undefined;
      const newReps = repsMatch ? parseInt(repsMatch[1], 10) : undefined;

      const matchedEx = session.exercises.find(
        (e) => q.includes(e.exercise_name) || (q.includes('臥推') && e.exercise_name.includes('臥推'))
      ) || session.exercises[0];

      const action: AIPlanAction = {
        type: 'update_load',
        sourceName: matchedEx.exercise_name,
        newWeight,
        newSets,
        newReps,
        description: `調整【${matchedEx.exercise_name}】目標為 ${newWeight || matchedEx.target_load.weight_kg}kg × ${newSets || matchedEx.total_sets}組`,
      };

      return {
        replyText: `✏️ **配重參數已即時更新！**
已為你將【${matchedEx.exercise_name}】調整為：
- **目標重量**：\`${newWeight || matchedEx.target_load.weight_kg}kg\`
- **總組數**：\`${newSets || matchedEx.total_sets} 組\`
- **目標次數**：\`${newReps || matchedEx.target_load.reps} 下\`

保持「推滿 12 下才解鎖下一檔」的安全節奏，發力時注意肩胛收攏！💪`,
        action,
      };
    }

    // 替換動作名稱
    let sourceEx = session.exercises.find((e) => q.includes(e.exercise_name)) ||
      session.exercises.find((e) => (q.includes('臥推') && e.exercise_name.includes('臥推')) || (q.includes('側平舉') && e.exercise_name.includes('側平舉')));
    if (!sourceEx) sourceEx = session.exercises[1] || session.exercises[0];

    let targetCatalogItem = EXERCISE_CATALOG_POOL.find((item) =>
      q.includes(item.exercise.exercise_name) ||
      (q.includes('飛鳥') && item.exercise.exercise_name.includes('飛鳥')) ||
      ((q.includes('俯臥撐') || q.includes('伏地挺身')) && item.exercise.exercise_id === 'push_ups') ||
      (q.includes('引體向上') && item.exercise.exercise_id === 'pull_ups')
    );

    if (!targetCatalogItem) {
      targetCatalogItem = q.includes('飛鳥')
        ? findExerciseInCatalog('dumbbell_fly')
        : findExerciseInCatalog('push_ups');
    }

    const targetName = targetCatalogItem?.exercise.exercise_name || '啞鈴胸肌飛鳥';
    const action: AIPlanAction = {
      type: 'replace',
      sourceName: sourceEx.exercise_name,
      targetName,
      addedExerciseId: targetCatalogItem?.exercise.exercise_id,
      description: `將【${sourceEx.exercise_name}】替換為【${targetName}】`,
    };

    return {
      replyText: `🔄 **動作替換成功！**
已為你將 **【${sourceEx.exercise_name}】** 替換為 **【${targetName}】**！

🛡️ **運動防護亮點**：
換成 ${targetName} 能以不同力學力臂刺激肌纖維，同時減輕關節的剛性剪切力。頂部示範動圖、目標次數與握法指引已全數自動載入！`,
      action,
    };
  }

  // Case 0-D: 新增動作到課表 (例如: 幫我加一個引體向上 / 增加飛鳥)
  if (q.includes('加') && (q.includes('動作') || q.includes('引體') || q.includes('飛鳥') || q.includes('伏地挺身') || q.includes('深蹲') || q.includes('提踵'))) {
    const catalogItem = EXERCISE_CATALOG_POOL.find((item) =>
      q.includes(item.exercise.exercise_name) ||
      (q.includes('引體') && item.exercise.exercise_id === 'pull_ups') ||
      (q.includes('飛鳥') && item.exercise.exercise_id === 'dumbbell_fly') ||
      (q.includes('伏地挺身') && item.exercise.exercise_id === 'push_ups')
    ) || findExerciseInCatalog('pull_ups')!;

    const action: AIPlanAction = {
      type: 'add',
      targetName: catalogItem.exercise.exercise_name,
      addedExerciseId: catalogItem.exercise.exercise_id,
      description: `課表新增【${catalogItem.exercise.exercise_name}】`,
    };

    return {
      replyText: `➕ **已為你成功加入動作：【${catalogItem.exercise.exercise_name}】！**
      
動作已排入今日【${session.plan_name}】課表尾端，總動作數增加為 ${session.exercises.length + 1} 個。
隨時可點選最上方藥丸切換練習，或點「編輯課表」進一步微調組數配重！🚀`,
      action,
    };
  }

  // Case 0-E: 刪除動作 (例如: 刪除最後一個動作 / 不要三頭伸展)
  if (q.includes('刪除') || q.includes('移除') || (q.includes('不要') && (q.includes('動作') || q.includes('三頭') || q.includes('臥推') || q.includes('最後')))) {
    let removeIdx = session.exercises.length - 1;
    if (q.includes('第一')) removeIdx = 0;
    else {
      const foundIdx = session.exercises.findIndex((e) => q.includes(e.exercise_name) || (q.includes('三頭') && e.exercise_name.includes('三頭')));
      if (foundIdx !== -1) removeIdx = foundIdx;
    }

    const removedName = session.exercises[removeIdx]?.exercise_name || '最後一個動作';
    const action: AIPlanAction = {
      type: 'remove',
      sourceName: removedName,
      targetIndex: removeIdx,
      description: `從課表中移除【${removedName}】`,
    };

    return {
      replyText: `🗑️ **已為你從課表中移除【${removedName}】！**
      
剩餘動作已重新編排索引，確保你保持專注高強度，避免垃圾訓練容量！`,
      action,
    };
  }

  // ============================================================
  // 1. 飲食與蛋白質相關問題
  // ============================================================
  if (
    q.includes('蛋白質') ||
    q.includes('吃什麼') ||
    q.includes('熱量') ||
    q.includes('飲食') ||
    q.includes('晚餐') ||
    q.includes('超商') ||
    q.includes('補')
  ) {
    if (proteinDeficit > 10) {
      return {
        replyText: `嗨 **${profile.name}**！我讀取了你今天的身體數值與飲食紀錄：

📊 **今日飲食即時監測**：
- **蛋白質目標**：${diet.targetProtein}g（基準 ${stats.targetProteinG}g ＋ 今日訓練量加碼 ${diet.workoutBonusProtein}g）
- **目前已攝取**：\`${consumedProtein}g\` / ${diet.targetProtein}g
- **剩餘蛋白質缺口**：**還差 ${proteinDeficit}g 蛋白質**！
- **熱量進度**：${consumedCalories} / ${diet.targetCalories} kcal（剩餘 ${calorieDeficit} kcal 額度）

🏪 **教練為你客製的練後超商/外食快速補法**：
1. **7-ELEVEN 組合**：一包【即食嫩雞胸肉】(24g P) ＋ 一瓶【無糖高纖豆漿】(15g P) ＋ 一顆【茶葉蛋】(7g P) ➔ **直接補上 46g 蛋白質**！
2. **全家便利商店**：【鹽烤鯖魚便當】(32g P) ＋ 一份【無糖濃豆漿】(15g P) ➔ **補進 47g 優質蛋白質**。
3. **自備補充**：直接搖一杯【乳清蛋白 (25g P)】配一根【香蕉 (23g 碳水)】，黃金 4:1 比例促進肝醣超量恢復！

記住「教練先別加，但蛋白質一定要加滿」！有足夠胺基酸，剛才撕裂的胸大肌肌纖維才會超量生長 💪`,
      };
    } else {
      return {
        replyText: `**${profile.name}**，你今天的飲食控制非常優秀！👏

📊 **今日攝取達標率**：
- 蛋白質：\`${consumedProtein}g\` / ${diet.targetProtein}g（**已達到 ${Math.round((consumedProtein / diet.targetProtein) * 100)}% 達標率**！）
- 總熱量：\`${consumedCalories} kcal\` / ${diet.targetCalories} kcal
- 碳水化合物：\`${consumedCarbs}g\` / ${diet.targetCarbs}g

因為你今天推胸累積了 **${totalVolumeKg > 0 ? totalVolumeKg : 744}kg** 的訓練容量，你的胰島素敏感度處於高峰，晚點睡前若肚子餓，喝一杯熱牛奶或半匙酪蛋白/希臘優格即可，不需要再硬塞大魚大肉，好好讓消化道休息！`,
      };
    }
  }

  // ============================================================
  // 2. 加重、升重時機、衝重量問題
  // ============================================================
  if (
    q.includes('加重') ||
    q.includes('加重量') ||
    q.includes('升重') ||
    q.includes('大重量') ||
    q.includes('換重量') ||
    q.includes('20kg') ||
    q.includes('25kg') ||
    q.includes('幾下')
  ) {
    return {
      replyText: `**${profile.name}，教練先別加！** 🛑 

讓我讀取你這幾組的數據：
- 當前動作：**${currentExercise?.exercise_name || '上斜啞鈴臥推'}**
- 目前配重：**${currentExercise?.target_load.weight_kg || 16}kg × ${currentExercise?.target_load.reps || 10}下**
- 歷史最高 PR：**${Math.max(...history.map((h) => h.maxWeightKg), 16)}kg**

🎯 **【教練先別加】雙重漸進黃金守則**：
1. **絕不為了數字犧牲次數**：在重量跳級前，必須在 **RPE ≤ 8（不吃力、不走鐘）** 的狀態下，**連續兩組推滿 12 下滿次**！
2. **升重只跳一檔**：即使達標，下一組也只准拿 **+2kg**（從 16kg 升至 18kg），絕不允許直接衝 20kg 或 25kg，而且升重後的次數必須**主動降回 8 下重新打底**！
3. 若剛才覺得吃力或手肘搖晃，代表穩定肌群（肩袖肌群）還沒跟上，強行硬加重量只會讓肩膀前三角與斜方肌嚴重代償！把 16kg 推到像呼吸一樣自然，肌肉感受度才是真的！👊`,
    };
  }

  // ============================================================
  // 3. 肩膀、刺痛、受傷、卡卡問題
  // ============================================================
  if (
    q.includes('痛') ||
    q.includes('刺痛') ||
    q.includes('肩膀') ||
    q.includes('關節') ||
    q.includes('受傷') ||
    q.includes('卡卡') ||
    q.includes('手肘')
  ) {
    const isSafetyTriggered = safetyTier > 0;
    return {
      replyText: `🚨 **安全防護優先！我是你的隨身安全 AI 教練**：

${isSafetyTriggered ? '⚠️ 我看到你剛才已經觸發了關節刺痛警示！系統已為你踩煞車切換至【對握中立握法】並降重 20%。' : '⚠️ 請立刻停止當前組數，不要抱著「再撐一下」的心態硬推！'}

👨‍⚕️ **給 ${profile.name} 的關節保護診斷**：
1. **握法立刻修正**：正握推胸時手肘如果外展大於 75 度，容易引發「肩峰下夾擠症候群 (Impingement)」。請將握法改為**「對握中立握法 (Neutral Grip)」**，手肘內收約 45 度，讓胸大肌承擔張力。
2. **強制降重**：當前重量立即下調 **20%**（例如 16kg ➔ 12~14kg），組間休息自動拉長至 120 秒。
3. **第二防線（換器材）**：如果次組依然覺得刺痛，系統會強制將啞鈴動作結算，切換為【坐姿機械式胸推機】或【固定滑輪】，利用固定軌跡卸除旋轉肌袖的平衡負擔。

你的肩膀要用一輩子，我們來健身是為了變壯健康，不是來急診室報到的！先放鬆伸展，感覺改善再繼續！🛡️`,
    };
  }

  // ============================================================
  // 4. 體重、體脂、增肌減脂策略
  // ============================================================
  if (
    q.includes('體脂') ||
    q.includes('增肌') ||
    q.includes('減脂') ||
    q.includes('熱量盈餘') ||
    q.includes('瘦') ||
    q.includes('肥') ||
    q.includes('體態')
  ) {
    return {
      replyText: `📊 **個人身體素質與週期策略分析報告**：

👤 **${profile.name} 的即時生理檔案**：
- **性別/年齡**：${profile.gender === 'male' ? '男性' : '女性'}，${profile.age} 歲
- **身高/體重**：${profile.height_cm} cm / ${profile.weight_kg} kg
- **體脂率**：\`${profile.body_fat_pct || 16.5}%\` • **BMI**：\`${stats.bmi}\`
- **基礎代謝率 (BMR)**：${stats.bmr} kcal
- **每日總消耗 (TDEE)**：${stats.tdee} kcal（訓練日動態加碼至 ${stats.tdee + 320} kcal）

🎯 **專業教練建議**：
以你目前體脂 **${profile.body_fat_pct || 16.5}%** 與中階訓練者背景，你正處於極佳的**「乾淨增肌 (Lean Bulk / Recomposition)」黃金區間**！
- **熱量策略**：不要大暴食，每日熱量控制在 TDEE + 200~300 kcal（約 ${stats.tdee + 250} kcal），每個月體重增幅維持在 0.8~1.2kg，能最大化肌肉蛋白合成，同時不堆積腹部脂肪。
- **蛋白質定錨**：維持每公斤體重 2.0g，也就是每日 **${stats.targetProteinG}g ~ ${stats.targetProteinG + 15}g**。
- **目標課表**：繼續推進【${session.plan_name}】，把上斜臥推與單臂划船的重量階梯一級一級推滿！`,
    };
  }

  // ============================================================
  // 5. 減量週 (Deload)、疲勞、過度訓練
  // ============================================================
  if (
    q.includes('減量') ||
    q.includes('疲勞') ||
    q.includes('累') ||
    q.includes('喘') ||
    q.includes('沒力') ||
    q.includes('休息') ||
    q.includes('停滯')
  ) {
    return {
      replyText: `😴 **中樞神經與疲勞觀察報告**：

我看了一下你的歷史進步曲線：
- **累計訓練總次數**：${history.length} 場次
- **近 4 週訓練總容量**：從 420kg 逐步爬升到現在的 ${history[history.length - 1]?.totalVolumeKg || 864}kg！
- **波浪週期紀錄**：在 10/05 你曾執行過一次全身性減量週 (380kg)，隨後迎來了 16kg 與 18kg 的爆發突破！

💡 **何時需要再次減量？**
1. **RPE 連續偏高**：如果你發現同樣的 16kg，平時推起來是 RPE 8，這週卻每組都像 RPE 9.5 瀕臨力竭。
2. **組間休息展延**：如果你在訓練中頻繁按下「+30秒 再喘一下」超過 3 次以上。
3. **睡眠心率上升**：起床時握力下降或肌肉充血感遲鈍。

若出現上述徵兆，下週請直接執行 **Deload 週**：重量下調 30%，組數砍半，讓關節囊與肌腱超量修復，蓄力下一次突破！`,
    };
  }

  // ============================================================
  // 6. 預設通用/開放式綜合解答
  // ============================================================
  return {
    replyText: `嗨 **${profile.name}**！我是專屬於你的「教練先別加」隨身 AI 教練 🏋️‍♂️

我已同步讀取你的個人檔案：
- 身體素質：${profile.height_cm}cm / ${profile.weight_kg}kg (體脂 ${profile.body_fat_pct || 16.5}%, TDEE: ${stats.tdee} kcal)
- 目前課表：**${session.plan_name}**（今日累積容量：${totalVolumeKg > 0 ? totalVolumeKg : 744}kg）
- 飲食狀態：今日蛋白質已攝取 **${consumedProtein}g / ${diet.targetProtein}g**

針對你的問題：**「${userQuery}」**

從運動科學來看，最關鍵的核心依然是：
1. **動作質量第一**：上斜臥推與划船動作下放時吸氣維持張力，向心推起吐氣，不利用反彈力。
2. **嚴格雙重漸進**：推滿 12 下連續兩組才准加重；只要今天覺得稍微吃力 (RPE 9)，教練第一時間幫你踩煞車降重！
3. **營養動態對齊**：今天訓練消耗大，蛋白質一定要補滿 ${diet.targetProtein}g，多喝水 2500ml 促進乳酸代謝。

💡 **課表小提示**：你可以直接跟我說「幫我把動作次序調轉」、「把側平舉換到第一個」或「臥推改成 4 組 18kg」，我會直接為你修改課表！💪`,
  };
}
