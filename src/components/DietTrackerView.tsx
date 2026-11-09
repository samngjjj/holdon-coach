// ============================================================
// HoldOn Coach — Diet & Nutrition Tracker View (Clean White Theme)
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Plus,
  Trash2,
  Zap,
  Clock,
  Search,
  X,
  Check,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import {
  FOOD_DATABASE,
  type MealCategory,
  type MealItem,
} from '@/data/exercises';

export default function DietTrackerView() {
  const { dietRecord, addMealItem, removeMealItem, totalVolumeKg } = useWorkoutStore();

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
    { key: 'snack', label: '練後加餐 / 補給 (Post-Workout)', icon: '💪', items: dietRecord.meals.snack },
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
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-28 text-slate-800">
      {/* Top Banner: Workout Dynamic Bonus Sync */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B4A] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 block">練後代謝動態對齊</span>
              <span className="text-[10px] text-slate-400 block">今日訓練容量：{totalVolumeKg > 0 ? totalVolumeKg : 744}kg</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#FF6B4A] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            +{dietRecord.workoutBonusCalories} kcal 補償
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          運動科學自動在基本 TDEE 上加碼：<b className="text-[#00A87E]">+{dietRecord.workoutBonusProtein}g 蛋白質</b> 與 <b className="text-amber-600">+{dietRecord.workoutBonusCarbs}g 碳水</b> 促進超量恢復！
        </p>
      </div>

      {/* Main Calories & Macro Card (Clean White) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">今日已攝取熱量</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-slate-900 tabular-nums">{totalCalories}</span>
              <span className="text-xs text-slate-400 font-mono">/ {dietRecord.targetCalories} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">剩餘額度</span>
            <span className="text-lg font-black text-[#FF6B4A] tabular-nums">
              {Math.max(0, dietRecord.targetCalories - totalCalories)} kcal
            </span>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full bg-[#00D09C] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
          {/* Protein */}
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
            <span className="text-[10px] text-[#00A87E] font-bold block">蛋白質</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-[#00A87E] tabular-nums">{totalProtein}</span>
              <span className="text-[10px] text-slate-400 font-mono">/{dietRecord.targetProtein}g</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#00D09C] rounded-full" style={{ width: `${protPct}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
            <span className="text-[10px] text-amber-700 font-bold block">碳水化合物</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-amber-700 tabular-nums">{totalCarbs}</span>
              <span className="text-[10px] text-slate-400 font-mono">/{dietRecord.targetCarbs}g</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbPct}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
            <span className="text-[10px] text-sky-700 font-bold block">優質脂肪</span>
            <div className="flex items-baseline justify-center gap-0.5 my-1">
              <span className="text-xl font-black text-sky-700 tabular-nums">{totalFat}</span>
              <span className="text-[10px] text-slate-400 font-mono">/{dietRecord.targetFat}g</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${fatPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-4">
        {mealSections.map((section) => (
          <div
            key={section.key}
            className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{section.icon}</span>
                <h4 className="text-sm font-bold text-slate-800">{section.label}</h4>
              </div>
              <button
                onClick={() => setActiveCategory(section.key)}
                className="text-xs font-bold text-[#00A87E] hover:text-[#008967] flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>記錄餐點</span>
              </button>
            </div>

            {section.items.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">
                尚未記錄餐點，點擊上方「+」快速添加
              </p>
            ) : (
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{item.emoji || '🍽️'}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {item.store ? `[${item.store}] ` : ''}{item.calories} kcal • 蛋 {item.protein_g}g • 碳 {item.carb_g}g
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMealItem(section.key, item.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Food Modal / Drawer */}
      <AnimatePresence>
        {activeCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl border border-slate-200 text-slate-800 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <h3 className="text-base font-black text-slate-900">
                  新增餐點至：{mealSections.find((m) => m.key === activeCategory)?.label}
                </h3>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Presets */}
              <div className="py-3 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜尋超商健身食物 (雞胸、地瓜、豆漿、漢堡...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Food List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-1">
                <span className="text-[11px] font-bold text-slate-400 block px-1">台灣超商與外食資料庫：</span>
                {filteredFoods.slice(0, 10).map((food) => (
                  <div
                    key={food.id}
                    onClick={() => handleAddPreset(food)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{food.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{food.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-200/80 text-slate-600 font-medium">
                            {food.store}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {food.calories} kcal • 蛋白質 {food.protein_g}g • 碳水 {food.carb_g}g
                        </span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-[#00D09C]" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
