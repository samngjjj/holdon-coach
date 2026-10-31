// ============================================================
// HoldOn Coach — Profile Modal (身體數據與客製化訓練設定)
// 身高、體重、年齡、性別、體脂率 -> 產出建議起始配重與熱量基準
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Flame, Shield, X, Check, Dumbbell } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats, type UserProfile } from '@/data/exercises';

export default function ProfileModal() {
  const { userProfile, showProfileModal, setShowProfileModal, updateUserProfile } = useWorkoutStore();

  const [form, setForm] = useState<UserProfile>({ ...userProfile });

  if (!showProfileModal) return null;

  const stats = calculateProfileStats(form);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(form);
    setShowProfileModal(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setShowProfileModal(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">個人身體檔案與配重設定</h2>
                <p className="text-xs text-zinc-400">依據生理指標制定安全起始重量與營養基線</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Name & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">暱稱 / 稱呼</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">性別</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 'male' })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      form.gender === 'male'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    男 ♂
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 'female' })}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      form.gender === 'female'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    女 ♀
                  </button>
                </div>
              </div>
            </div>

            {/* Age, Height, Weight, Body Fat */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">年齡 (歲)</label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">身高 (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={form.height_cm}
                  onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">體重 (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={form.weight_kg}
                  onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">體脂率 (%)</label>
                <input
                  type="number"
                  min="4"
                  max="50"
                  step="0.5"
                  placeholder="選填"
                  value={form.body_fat_pct || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      body_fat_pct: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">健齡與自我訓練經驗</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: '🌱 新手 (0-1年)' },
                  { id: 'intermediate', label: '🔥 進階 (1-3年)' },
                  { id: 'advanced', label: '⚡ 老手 (3年以上)' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setForm({ ...form, experience: exp.id as any })}
                    className={`py-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                      form.experience === exp.id
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="text-xs text-zinc-400 block mb-1">主要訓練訴求</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hypertrophy', label: '💪 8-12RM 肌肥大' },
                  { id: 'joint_safety', label: '🛡️ 關節保護復健' },
                  { id: 'fat_loss', label: '🔥 燃脂增肌重組' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setForm({ ...form, goal: g.id as any })}
                    className={`py-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                      form.goal === g.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Science Calculations */}
            <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-300">
                  系統 2 運動科學自動推估指標
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500">BMI 指數</p>
                  <p className="text-sm font-bold text-white mt-0.5">{stats.bmi}</p>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500">基礎代謝 BMR</p>
                  <p className="text-sm font-bold text-white mt-0.5">{stats.bmr} kcal</p>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500">建議 TDEE</p>
                  <p className="text-sm font-bold text-white mt-0.5">{stats.tdee} kcal</p>
                </div>
                <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <p className="text-[10px] text-orange-400">臥推起始配重</p>
                  <p className="text-sm font-bold text-orange-300 mt-0.5">{stats.recommendedPressKg} kg</p>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                💡 依據你的體重與健齡，系統將為你預設以 <span className="text-orange-400 font-semibold">{stats.recommendedPressKg}kg</span> 進行安全熱身與起步，並恪守「推滿 12 下才加重」原則！
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:opacity-90 transition-all"
              >
                <Check className="w-5 h-5" />
                儲存個人檔案並客製化課表
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
