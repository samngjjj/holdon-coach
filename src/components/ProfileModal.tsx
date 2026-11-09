// ============================================================
// HoldOn Coach — Profile Modal (身體數據與客製化訓練設定)
// 身高、體重、年齡、性別、體脂率 -> 產出建議起始配重與熱量基準
// 極簡白底 + 薄荷綠風格
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, X, Check } from 'lucide-react';
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
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setShowProfileModal(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00D09C]/15 text-[#00A87E] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">個人身體檔案與配重設定</h2>
                <p className="text-xs text-slate-500">依據生理指標制定安全起始重量與營養基線</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Name & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">暱稱 / 稱呼</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#00D09C] focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">性別</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 'male' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.gender === 'male'
                        ? 'bg-[#00D09C] border-[#00D09C] text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    男 ♂
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, gender: 'female' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      form.gender === 'female'
                        ? 'bg-[#00D09C] border-[#00D09C] text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
                <label className="text-xs font-bold text-slate-600 block mb-1">年齡 (歲)</label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00D09C] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">身高 (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={form.height_cm}
                  onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00D09C] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">體重 (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={form.weight_kg}
                  onChange={(e) => setForm({ ...form, weight_kg: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00D09C] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">體脂率 (%)</label>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#00D09C] focus:bg-white"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">健齡與自我訓練經驗</label>
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
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      form.experience === exp.id
                        ? 'bg-[#00D09C]/15 border-[#00D09C] text-[#00A87E]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">主要訓練訴求</label>
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
                    className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      form.goal === g.id
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Science Calculations */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-[#00D09C]" />
                <span className="text-xs font-extrabold text-slate-800">
                  系統 2 運動科學自動推估指標
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold">BMI 指數</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{stats.bmi}</p>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold">基礎代謝 BMR</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{stats.bmr} kcal</p>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold">建議 TDEE</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{stats.tdee} kcal</p>
                </div>
                <div className="p-2 rounded-xl bg-[#00D09C]/10 border border-[#00D09C]/40 shadow-sm">
                  <p className="text-[10px] text-[#00A87E] font-bold">臥推起始配重</p>
                  <p className="text-sm font-black text-[#00A87E] mt-0.5">{stats.recommendedPressKg} kg</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                💡 依據你的體重與健齡，系統將為你預設以 <span className="text-[#00A87E] font-bold">{stats.recommendedPressKg}kg</span> 進行安全熱身與起步，並恪守「推滿 12 下才加重」原則！
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 active:scale-[0.98] transition-all"
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
