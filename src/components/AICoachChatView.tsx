// ============================================================
// HoldOn Coach — Dedicated AI Coach Chat View (專屬 AI 隨身教練對話分頁)
// 只讀取個人的身體素質、訓練狀況與飲食狀況，提供精準擬真的健身解答
// ============================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  Activity,
  Flame,
  Utensils,
  Dumbbell,
  RotateCcw,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats } from '@/data/exercises';
import PlanEditorModal from './PlanEditorModal';

const PROMPT_SUGGESTIONS = [
  '🔄 幫我把側平舉調到第一個動作',
  '🔁 幫我把今日課表動作前後次序倒轉',
  '✏️ 把上斜臥推重量改為 18kg × 4 組',
  '➕ 課表加入寬握引體向上',
  '🍗 我今天蛋白質還差多少？超商怎麼補？',
  '🛑 我剛才推完有點硬，下一組能衝 20kg 嗎？',
  '⚠️ 我剛才左肩刺痛卡卡的，建議怎麼調整？',
  '📊 以我的體脂和體重，我現在該增肌還是減脂？',
];

export default function AICoachChatView() {
  const {
    chatMessages,
    isGeneratingResponse,
    sendChatMessage,
    clearChat,
    userProfile,
    session,
    dietRecord,
    totalVolumeKg,
    currentSet,
    safetyTier,
    setActiveTab,
    showPlanEditorModal,
    setShowPlanEditorModal,
  } = useWorkoutStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stats = calculateProfileStats(userProfile);

  // Compute live diet intake
  const allMeals = [
    ...dietRecord.meals.breakfast,
    ...dietRecord.meals.lunch,
    ...dietRecord.meals.dinner,
    ...dietRecord.meals.snack,
  ];
  const consumedCalories = allMeals.reduce((s, m) => s + m.calories, 0);
  const consumedProtein = allMeals.reduce((s, m) => s + m.protein_g, 0);
  const proteinDeficit = Math.max(0, dietRecord.targetProtein - consumedProtein);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGeneratingResponse]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isGeneratingResponse) return;
    sendChatMessage(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] px-3 pb-24 text-white">
      {/* Real-time Context Banner: AI strictly reads user parameters */}
      <div className="bg-zinc-900/95 border border-zinc-800 rounded-2xl p-3 mb-3 shadow-md shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI 隨身教練即時讀取個人數據中</span>
          </div>
          <button
            onClick={clearChat}
            className="text-[10px] text-zinc-500 hover:text-zinc-400 flex items-center gap-1"
            title="重設對話紀錄"
          >
            <RotateCcw className="w-3 h-3" />
            <span>清除對話</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          <div className="bg-zinc-800/60 p-1.5 rounded-xl border border-zinc-700/40">
            <span className="text-zinc-500 block">👤 身體素質</span>
            <span className="font-bold text-white block truncate">
              {userProfile.weight_kg}kg • BF {userProfile.body_fat_pct || 16.5}%
            </span>
          </div>

          <div className="bg-zinc-800/60 p-1.5 rounded-xl border border-zinc-700/40">
            <span className="text-zinc-500 block">🏋️ 當日訓練</span>
            <span className="font-bold text-orange-400 block truncate">
              {totalVolumeKg > 0 ? `${totalVolumeKg}kg` : '744kg'} • {session.exercises[0]?.target_load.weight_kg}kg
            </span>
          </div>

          <div className="bg-zinc-800/60 p-1.5 rounded-xl border border-zinc-700/40">
            <span className="text-zinc-500 block">🥗 今日飲食缺口</span>
            <span className="font-bold text-emerald-400 block truncate">
              {proteinDeficit > 0 ? `缺 ${proteinDeficit}g 蛋白` : '蛋白質已達標'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}

                {/* AI Plan Modification Execution Badge */}
                {msg.actionBadge && (
                  <div className="mt-3.5 p-3 rounded-2xl bg-zinc-950/90 border border-orange-500/40 shadow-inner text-left">
                    <div className="flex items-center gap-1.5 mb-1.5 text-orange-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI 教練已動態更新訓練課表！</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mb-2.5">
                      {msg.actionBadge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('workout')}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs hover:opacity-90 flex items-center gap-1 transition-all shadow"
                      >
                        <Dumbbell className="w-3 h-3" />
                        <span>前往訓練動作</span>
                      </button>
                      <button
                        onClick={() => setShowPlanEditorModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1 border border-zinc-700 transition-colors"
                      >
                        <span>檢視/微調課表</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-400 shrink-0 font-bold text-xs">
                  {userProfile.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isGeneratingResponse && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs py-2 pl-10">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-zinc-400">教練正在讀取你的訓練與飲食數據分析中...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="py-2 overflow-x-auto flex gap-1.5 shrink-0 no-scrollbar">
        {PROMPT_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-2.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 whitespace-nowrap transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="shrink-0 pt-1">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 focus-within:border-orange-500/80 rounded-2xl px-3 py-2 shadow-xl">
          <input
            type="text"
            placeholder="詢問有關你個人的訓練、飲食、配重或肩膀問題..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGeneratingResponse}
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isGeneratingResponse}
            className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Plan Editor Modal */}
      <PlanEditorModal
        isOpen={showPlanEditorModal}
        onClose={() => setShowPlanEditorModal(false)}
      />
    </div>
  );
}
