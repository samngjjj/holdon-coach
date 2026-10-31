// ============================================================
// HoldOn Coach — Diet & Nutrition Tracker View (練後代謝與飲食記錄)
// 參考現代飲食 App (MyFitnessPal / Cofit)，結合每日巨量營養素、超商快選與練後加碼
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Plus,
  Trash2,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  Search,
  X,
  Check,
  Dumbbell,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import {
  FOOD_DATABASE,
  type MealCategory,
  type MealItem,
} from '@/data/exercises';

export default function DietTrackerView() {
  const { dietRecord, userProfile, addMealItem, removeMealItem, totalVolumeKg, setActiveTab } = useWorkoutStore();

  const [activeCategory, setActiveCategory] = useState<MealCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCal, setCustomCal] = useState('');
  const [customProt, setCustomProt] = useState('');
  const [customCarb, setCustomCarb] = useState('');
  const [customFat, setCustomFat] = useState('');

  // Calculate consumed totals
  const allMeals = [
    ...dietRecord.meals.breakfast,
    ...dietRecord.meals.lunch,
    ...dietRecord.meals.dinner,
    ...dietRecord.meals.snack,
  ];

  const totalCalories = allMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = allMeals.reduce((s, m) => s + m.protein_g, 0);
  const totalCarbs = allMeals.reduce((s, m) => s + m.carb_g, 0);
  const totalFat = allMeals.reduce((s, m) => s + m.fat_g, 0);

  const calPct = Math.min(100, Math.round((totalCalories / dietRecord.targetCalories) * 100));
  const protPct = Math.min(100, Math.round((totalProtein / dietRecord.targetProtein) * 100));
  const carbPct = Math.min(100, Math.round((totalCarbs / dietRecord.targetCarbs) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / dietRecord.targetFat) * 100));

  const mealSections: { key: MealCategory; label: string; icon: string; items: MealItem[] }[] = [
    { key: 'breakfast', label: '早餐 (Breakfast)', icon: '🌅', items: dietRecord.meals.breakfast },
    { key: 'lunch', label: '午餐 (Lunch)', icon: '☀️', items: dietRecord.meals.lunch },
    { key: 'dinner', label: '晚餐 (Dinner)', icon: '🌙', items: dietRecord.meals.dinner },
    { key: 'snack', label: '練後加餐 / 補給 (Post-Workout & Snacks)', icon: '💪', items: dietRecord.meals.snack },
  ];

  const filteredFoods = FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.store && f.store.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddPreset = (food: MealItem) => {
    if (!activeCategory) return;
    addMealItem(activeCategory, {
      name: food.name,
      store: food.store,
      calories: food.calories,
      protein_g: food.protein_g,
      carb_g: food.carb_g,
      fat_g: food.fat_g,
      emoji: food.emoji,
    });
    setActiveCategory(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory || !customName) return;
    addMealItem(activeCategory, {
      name: customName,
      store: '自訂',
      calories: Number(customCal) || 0,
      protein_g: Number(customProt) || 0,
      carb_g: Number(customCarb) || 0,
      fat_g: Number(customFat) || 0,
      emoji: '🍽️',
    });
    setCustomName('');
    setCustomCal('');
    setCustomProt('');
    setCustomCarb('');
    setCustomFat('');
    setActiveCategory(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-28 text-white">
      {/* Top Banner: Workout Dynamic Bonus Sync */}
      <div className="bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 border border-orange-500/30 rounded-3xl p-4 mb-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">練後代謝動態對齊</span>
              <span className="text-[10px] text-zinc-400 block">今日訓練容量：{totalVolumeKg > 0 ? totalVolumeKg : 744}kg</span>
            </div>
          </div>
          <span className="text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/25">
            +{dietRecord.workoutBonusCalories} kcal 加碼
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed">
          運動科學邏輯：依今日訓練總噸數，自動在你的基本 TDEE 上提高 <b className="text-emerald-400">+{dietRecord.workoutBonusProtein}g 蛋白質</b> 與 <b className="text-amber-400">+{dietRecord.workoutBonusCarbs}g 碳水化合物</b> 額度！
        </p>
      </div>

      {/* Main Calories & Macro Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 mb-5 shadow-xl">
        {/* Calorie Progress */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs text-zinc-400 block">今日已攝取熱量</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-white tabular-nums">{totalCalories}</span>
              <span className="text-xs text-zinc-500 font-mono">/ {dietRecord.targetCalories} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block">剩餘熱量額度</span>
            <span className="text-lg font-bold text-orange-400 tabular-nums">
              {Math.max(0, dietRecord.targetCalories - totalCalories)} kcal
            </span>
          </div>
        </div>

        {/* Calorie Bar */}
        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-zinc-800/80">
          {/* Protein */}
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] text-emerald-300 font-bold block">蛋白質 (Protein)</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-emerald-400 tabular-nums">{totalProtein}</span>
              <span className="text-[10px] text-zinc-400 font-mono">/{dietRecord.targetProtein}g</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${protPct}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] text-amber-300 font-bold block">碳水化合物 (Carbs)</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-amber-400 tabular-nums">{totalCarbs}</span>
              <span className="text-[10px] text-zinc-400 font-mono">/{dietRecord.targetCarbs}g</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbPct}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
            <span className="text-[10px] text-sky-300 font-bold block">優質脂肪 (Fat)</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-sky-400 tabular-nums">{totalFat}</span>
              <span className="text-[10px] text-zinc-400 font-mono">/{dietRecord.targetFat}g</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${fatPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Ask AI Coach Quick Banner */}
      <div
        onClick={() => setActiveTab('chat')}
        className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl p-3.5 mb-5 flex items-center justify-between cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
              不確定這餐吃什麼？問 AI 隨身教練 ➔
            </p>
            <p className="text-[10px] text-zinc-400">
              AI 自動比對你剩餘的 {Math.max(0, dietRecord.targetProtein - totalProtein)}g 蛋白質缺口，推薦超商外食組合！
            </p>
          </div>
        </div>
      </div>

      {/* Meals List (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-4">
        {mealSections.map((section) => {
          const sectionCal = section.items.reduce((s, m) => s + m.calories, 0);
          const sectionProt = section.items.reduce((s, m) => s + m.protein_g, 0);

          return (
            <div
              key={section.key}
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 shadow-md"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{section.label}</h3>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      小計：{sectionCal} kcal • 蛋白質 {sectionProt}g
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCategory(section.key)}
                  className="px-2.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>記錄</span>
                </button>
              </div>

              {/* Items in Meal */}
              {section.items.length === 0 ? (
                <p className="text-xs text-zinc-600 py-2 text-center">尚未新增食物記錄</p>
              ) : (
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg">{item.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            {item.store && (
                              <span className="text-zinc-500">{item.store}</span>
                            )}
                            <span className="text-emerald-400 font-mono">P:{item.protein_g}g</span>
                            <span className="text-amber-400 font-mono">C:{item.carb_g}g</span>
                            <span className="text-sky-400 font-mono">F:{item.fat_g}g</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-bold text-zinc-300 font-mono">
                          {item.calories} <span className="text-[10px] font-normal text-zinc-500">kcal</span>
                        </span>
                        <button
                          onClick={() => removeMealItem(section.key, item.id)}
                          className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Drawer / Modal */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
            onClick={() => setActiveCategory(null)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      記錄到：{mealSections.find((m) => m.key === activeCategory)?.label}
                    </h3>
                    <p className="text-[10px] text-zinc-400">點擊超商與外食資料庫直接新增，或手動自訂</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="relative my-3">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜尋 7-11、全家、便當、牛肉堡、雞胸肉..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Food List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
                <span className="text-[10px] font-bold text-zinc-400 block mb-1">
                  台灣超商與健人外食快選資料庫 ({filteredFoods.length})
                </span>

                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleAddPreset(food)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl">{food.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{food.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                          <span className="text-zinc-500">{food.store}</span>
                          <span className="text-emerald-400 font-mono">P:{food.protein_g}g</span>
                          <span className="text-amber-400 font-mono">C:{food.carb_g}g</span>
                          <span className="text-sky-400 font-mono">F:{food.fat_g}g</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-orange-400 font-mono">
                        {food.calories} kcal
                      </span>
                      <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">
                        +
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Input Form (Collapsible/Footer) */}
              <form onSubmit={handleAddCustom} className="pt-3 border-t border-zinc-800 mt-2">
                <span className="text-[10px] font-bold text-zinc-400 block mb-2">或自行手動輸入：</span>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  <input
                    type="text"
                    placeholder="食物名稱"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="col-span-2 bg-zinc-800 border border-zinc-700/60 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="熱量kcal"
                    value={customCal}
                    onChange={(e) => setCustomCal(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700/60 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                  <input
                    type="number"
                    placeholder="蛋白質g"
                    value={customProt}
                    onChange={(e) => setCustomProt(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700/60 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="碳水g"
                    value={customCarb}
                    onChange={(e) => setCustomCarb(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700/60 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增自訂食物</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
