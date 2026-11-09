// ============================================================
// HoldOn Coach — Plan Editor Modal (Clean White Theme)
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  RotateCcw,
  Check,
  Layers,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { EXERCISE_CATALOG_POOL, type CatalogExerciseItem } from '@/data/exerciseCatalog';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlanEditorModal({ isOpen, onClose }: PlanEditorModalProps) {
  const {
    session,
    currentExerciseIndex,
    reorderExercises,
    moveExerciseUp,
    moveExerciseDown,
    reverseExercisesOrder,
    removeExerciseFromSession,
    addExerciseToSession,
    updateExerciseInSession,
    jumpToExercise,
  } = useWorkoutStore();

  const [showCatalog, setShowCatalog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', '胸部', '背部', '肩膀', '手臂', '腿部', '核心'];

  const filteredCatalog = selectedCategory === 'all'
    ? EXERCISE_CATALOG_POOL
    : EXERCISE_CATALOG_POOL.filter((item) => item.category === selectedCategory);

  const handleWeightChange = (index: number, delta: number) => {
    const ex = session.exercises[index];
    const newWeight = Math.max(0, Math.round((ex.target_load.weight_kg + delta) * 10) / 10);
    updateExerciseInSession(index, {
      target_load: { ...ex.target_load, weight_kg: newWeight },
    });
  };

  const handleRepsChange = (index: number, delta: number) => {
    const ex = session.exercises[index];
    const newReps = Math.max(1, ex.target_load.reps + delta);
    updateExerciseInSession(index, {
      target_load: { ...ex.target_load, reps: newReps },
    });
  };

  const handleSetsChange = (index: number, delta: number) => {
    const ex = session.exercises[index];
    const newSets = Math.max(1, ex.total_sets + delta);
    updateExerciseInSession(index, {
      total_sets: newSets,
    });
  };

  const handleAddFromCatalog = (item: CatalogExerciseItem) => {
    addExerciseToSession(item);
    setShowCatalog(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-800"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#00D09C]" />
                <h2 className="text-lg font-black text-slate-900">編輯今日訓練課表</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {session.plan_name} • 共 {session.exercises.length} 個動作
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
            <button
              onClick={reverseExercisesOrder}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 text-[#00A87E] transition-colors shadow-xs"
              title="將動作次序由尾到頭完全倒轉"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>前後次序完全調轉</span>
            </button>

            <button
              onClick={() => setShowCatalog(!showCatalog)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#0B132B] hover:bg-[#16223F] text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>{showCatalog ? '收起動作庫' : '➕ 新增動作'}</span>
            </button>
          </div>

          {/* Catalog Drawer (Collapsible) */}
          {showCatalog && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 max-h-56 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">選擇要加入課表的動作：</span>
                <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 rounded-full border transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#00D09C] text-white border-[#00D09C] font-bold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'all' ? '全部' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {filteredCatalog.map((item) => (
                  <button
                    key={item.exercise.exercise_id}
                    onClick={() => handleAddFromCatalog(item)}
                    className="p-2.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 text-left flex items-center justify-between group transition-all shadow-xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-[#00A87E] transition-colors">
                        {item.exercise.exercise_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.category} • {item.exercise.target_load.weight_kg}kg × {item.exercise.target_load.reps}下
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#00D09C] shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Current Session Exercise List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {session.exercises.map((ex, index) => {
              const isCurrent = index === currentExerciseIndex;

              return (
                <motion.div
                  key={`${ex.exercise_id}_${index}`}
                  layout
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-50/60 border-[#00D09C] shadow-sm ring-1 ring-[#00D09C]/30'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    {/* Index & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                          isCurrent
                            ? 'bg-[#00D09C] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {ex.exercise_name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00A87E] font-bold shrink-0">
                              進行中
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          握法：{ex.grip_type}
                        </p>
                      </div>
                    </div>

                    {/* Order buttons & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveExerciseUp(index)}
                        disabled={index === 0}
                        title="往前調一個動作"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 flex items-center justify-center transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveExerciseDown(index)}
                        disabled={index === session.exercises.length - 1}
                        title="往後調一個動作"
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 flex items-center justify-center transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {session.exercises.length > 1 && (
                        <button
                          onClick={() => removeExerciseFromSession(index)}
                          title="從課表中刪除"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Target Load Steppers */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    {/* Weight */}
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-semibold mb-1">目標重量</span>
                      <div className="flex items-center gap-1.5 w-full justify-between">
                        <button
                          onClick={() => handleWeightChange(index, -2)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-[#00A87E] font-mono">
                          {ex.target_load.weight_kg}kg
                        </span>
                        <button
                          onClick={() => handleWeightChange(index, 2)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Sets */}
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-semibold mb-1">總組數</span>
                      <div className="flex items-center gap-1.5 w-full justify-between">
                        <button
                          onClick={() => handleSetsChange(index, -1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {ex.total_sets}組
                        </span>
                        <button
                          onClick={() => handleSetsChange(index, 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Target Reps */}
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 font-semibold mb-1">目標次數</span>
                      <div className="flex items-center gap-1.5 w-full justify-between">
                        <button
                          onClick={() => handleRepsChange(index, -1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {ex.target_load.reps}下
                        </span>
                        <button
                          onClick={() => handleRepsChange(index, 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Jump during workout */}
                  {!isCurrent && (
                    <button
                      onClick={() => {
                        jumpToExercise(index);
                        onClose();
                      }}
                      className="w-full mt-2 py-1.5 text-center text-xs font-bold text-[#00A87E] bg-emerald-50/70 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                    >
                      切換為當前動作並開始推
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-[#00D09C] hover:bg-[#00B887] text-white font-black text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>儲存並完成設定</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
