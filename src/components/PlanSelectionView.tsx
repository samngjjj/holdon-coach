// ============================================================
// HoldOn Coach — Plan Selection View (訓練計畫頁面 — 智慧分類與極簡降噪)
// 徹底告別資訊超載：四大直覺維度分流、AI 個人化程度推薦、一句話極簡卡片、詳細資訊抽屜化
// ============================================================

'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Check,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  SlidersHorizontal,
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  X,
  Play,
  Search,
  Home,
  Award,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { WORKOUT_PLANS, type WorkoutPlanPreset } from '@/data/exercises';
import ExerciseIllustration from './ExerciseIllustration';

type MainTab = 'recommended' | 'dah' | 'zhuo' | 'goals' | 'splits' | 'home';

interface MainCategoryTabItem {
  id: MainTab;
  label: string;
  icon: any;
  badge?: string;
}

const MAIN_TABS: MainCategoryTabItem[] = [
  { id: 'recommended', label: '為你推薦', icon: Sparkles },
  { id: 'dah', label: '大H 健體', icon: Award, badge: 'PRO' },
  { id: 'zhuo', label: '卓叔增重', icon: Flame, badge: '瘦子' },
  { id: 'goals', label: '30日專項', icon: Target },
  { id: 'splits', label: '科學分化', icon: Dumbbell },
  { id: 'home', label: '居家徒手', icon: Home },
];
type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
type SplitFilter = 'all' | 'ppl' | 'upper_lower' | 'bro';

export default function PlanSelectionView() {
  const { session, selectPlan, setActiveTab, userProfile } = useWorkoutStore();

  // Navigation & Filter States
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('recommended');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [splitSubFilter, setSplitSubFilter] = useState<SplitFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewPlan, setPreviewPlan] = useState<WorkoutPlanPreset | null>(null);
  const [showScientificPrinciples, setShowScientificPrinciples] = useState<boolean>(false);

  // View mode for category tabs: grid (3x2, all 6 visible) vs scroll (horizontal single row)
  const [isGridMode, setIsGridMode] = useState<boolean>(true); // Default to grid so all 6 are 100% visible!
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Mouse drag-to-scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartLeft, setScrollStartLeft] = useState(0);

  const checkScrollBounds = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScrollBounds();
  }, [isGridMode, checkScrollBounds]);

  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -180, behavior: 'smooth' });
    setTimeout(checkScrollBounds, 300);
  };

  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 180, behavior: 'smooth' });
    setTimeout(checkScrollBounds, 300);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollStartLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollStartLeft - walk;
    checkScrollBounds();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    checkScrollBounds();
  };

  // Wheel horizontal scrolling handler
  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    if (e.deltaY !== 0) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      checkScrollBounds();
    }
  };

  // Active current plan object
  const currentPlan = useMemo(
    () => WORKOUT_PLANS.find((p) => p.id === session.plan_id) || WORKOUT_PLANS[3],
    [session.plan_id]
  );

  // 1. AI 智能匹配依據用戶程度與目標
  const userRecommendedPlan = useMemo(() => {
    const exp = userProfile?.experience || 'intermediate';
    const goal = userProfile?.goal || 'hypertrophy';

    if (goal === 'fat_loss') {
      return WORKOUT_PLANS.find((p) => p.id === 'fat_loss_belly') || WORKOUT_PLANS[0];
    }
    if (exp === 'beginner') {
      return WORKOUT_PLANS.find((p) => p.id === 'zhuo_hardgainer_a') || WORKOUT_PLANS.find((p) => p.id === 'full_body_high_freq') || WORKOUT_PLANS[9];
    }
    if (exp === 'intermediate') {
      return WORKOUT_PLANS.find((p) => p.id === 'dah_3d_shoulders') || WORKOUT_PLANS.find((p) => p.id === 'upper_lower_upper') || WORKOUT_PLANS[6];
    }
    return WORKOUT_PLANS.find((p) => p.id === 'dah_v_taper_chest_back') || WORKOUT_PLANS.find((p) => p.id === 'ppl_push') || WORKOUT_PLANS[3];
  }, [userProfile]);

  // 2. 依據六大主 Tab 與過濾條件過濾清單
  const filteredPlans = useMemo(() => {
    let list: WorkoutPlanPreset[] = [];

    if (activeMainTab === 'recommended') {
      // 推薦維度：用戶專屬推薦 + 大H專項 + 卓叔增重 + 熱門入門
      const topIds = [userRecommendedPlan.id, 'dah_3d_shoulders', 'zhuo_hardgainer_a', 'fat_loss_belly', 'full_body_high_freq'];
      list = WORKOUT_PLANS.filter((p) => topIds.includes(p.id));
    } else if (activeMainTab === 'dah') {
      // 大H 健體專項
      list = WORKOUT_PLANS.filter((p) => p.category === 'DaH');
    } else if (activeMainTab === 'zhuo') {
      // 卓叔瘦人增重專項
      list = WORKOUT_PLANS.filter((p) => p.category === 'ZhuoShu');
    } else if (activeMainTab === 'goals') {
      // 30日焦點專項（腹部、六塊肌、翹臀）
      list = WORKOUT_PLANS.filter((p) => p.category === 'SpecialFocus');
    } else if (activeMainTab === 'splits') {
      // 科學分化（PPL、Upper/Lower、BroSplit）
      let splitList = WORKOUT_PLANS.filter((p) => ['PPL', 'UpperLower', 'BroSplit'].includes(p.category));
      if (splitSubFilter === 'ppl') {
        splitList = splitList.filter((p) => p.category === 'PPL');
      } else if (splitSubFilter === 'upper_lower') {
        splitList = splitList.filter((p) => p.category === 'UpperLower');
      } else if (splitSubFilter === 'bro') {
        splitList = splitList.filter((p) => p.category === 'BroSplit');
      }
      list = splitList;
    } else if (activeMainTab === 'home') {
      // 居家徒手無需器材
      list = WORKOUT_PLANS.filter(
        (p) => p.equipment?.includes('無需器材') || p.id === 'fat_loss_belly' || p.id === 'six_pack_abs'
      );
    }

    // 次級難度篩選
    if (levelFilter === 'beginner') {
      list = list.filter((p) => p.level?.includes('新手') || p.level?.includes('全階段') || p.level?.includes('瘦人') || p.id === 'full_body_high_freq');
    } else if (levelFilter === 'intermediate') {
      list = list.filter((p) => p.level?.includes('中階') || p.level?.includes('科學進階') || p.category === 'UpperLower' || p.category === 'DaH');
    } else if (levelFilter === 'advanced') {
      list = list.filter((p) => p.level?.includes('高階') || p.level?.includes('高強度') || p.category === 'PPL');
    }

    // 關鍵字搜尋（支援教練名、肌群、動作、器材）
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = WORKOUT_PLANS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortTitle?.toLowerCase().includes(q) ||
          p.coachName?.toLowerCase().includes(q) ||
          p.targetFocus.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.equipment?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeMainTab, levelFilter, splitSubFilter, searchQuery, userRecommendedPlan]);

  // 一鍵採用計畫
  const handleChoosePlan = (plan: WorkoutPlanPreset) => {
    selectPlan(plan.id);
    setPreviewPlan(null);
    setActiveTab('workout');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* ============================================================ */}
      {/* 1. Header (Screen 1 經典「訓練計畫」極簡白底美化版) */}
      {/* ============================================================ */}
      <div className="pt-6 pb-4 px-4 bg-white border-b border-slate-200/80 sticky top-0 z-20 backdrop-blur-md bg-white/95 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider inline-flex items-center gap-1">
            <span>訓練</span>
            <span className="text-[#00D09C] relative inline-block">
              計畫
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#00D09C] rounded-full" />
            </span>
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">
            <Activity className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>{WORKOUT_PLANS.length} 套科學課表</span>
          </div>
        </div>

        {/* 搜尋列 */}
        <div className="max-w-md mx-auto mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋動作、肌群 (胸/腹/背/翹臀/徒手)..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs font-medium text-slate-800 pl-9 pr-8 py-2.5 rounded-2xl border border-slate-200/80 focus:border-[#00D09C] focus:ring-2 focus:ring-[#00D09C]/20 outline-hidden transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* ============================================================ */}
        {/* 2. 進行中課表快照 (Active Plan Minimal Banner) */}
        {/* ============================================================ */}
        {!searchQuery && currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs flex items-center justify-between gap-3 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00A87E] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00A87E] bg-emerald-50 px-1.5 py-0.2 rounded-md">
                    目前進行中
                  </span>
                </div>
                <h2 className="text-sm font-black text-slate-900 truncate mt-0.5">
                  {currentPlan.shortTitle || currentPlan.name}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">
                  {currentPlan.duration || '45分鐘'} • {currentPlan.exercises.length} 個動作模組
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('workout')}
              className="px-3.5 py-1.5 rounded-xl bg-[#00D09C] hover:bg-[#00B98A] text-white text-xs font-black shrink-0 flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>繼續訓練</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 3. 六大核心維度分類標籤 (Main Category Tabs — 3×2 全展開 + 完整平滑滑動功能) */}
        {/* ============================================================ */}
        {!searchQuery && (
          <div className="space-y-1.5">
            {/* Header with Title and Grid/Scroll Mode Switcher */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
                <span>精選專區分類 (全 6 大課表類別)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGridMode(!isGridMode)}
                className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={isGridMode ? '切換為單行左右滑動模式' : '展開全部 6 大分類平鋪 (3×2)'}
              >
                {isGridMode ? (
                  <>
                    <SlidersHorizontal className="w-3 h-3 text-[#00D09C]" />
                    <span>切換橫滑模式</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3 h-3 text-[#00D09C]" />
                    <span>展開全部分類 (3×2)</span>
                  </>
                )}
              </button>
            </div>

            {/* Mode 1: 3x2 Clean Grid — ALL 6 TABS ARE 100% VISIBLE AT ONCE! NO SCROLLING NEEDED */}
            {isGridMode ? (
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl text-xs font-bold shadow-inner">
                {MAIN_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeMainTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveMainTab(tab.id as MainTab);
                        setLevelFilter('all');
                      }}
                      className={`py-2 px-1.5 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer text-center relative select-none ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm font-black ring-1 ring-slate-900/10'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? 'text-[#00D09C]' : 'text-slate-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold truncate">{tab.label}</span>
                      {tab.badge && (
                        <span className="px-1 py-0.2 rounded-full text-[8px] font-black bg-[#FF6B4A] text-white shrink-0 leading-none">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Mode 2: Horizontal Slide Bar with Arrow Buttons, Wheel Scroll & Drag */
              <div className="relative group">
                {/* Left Scroll Button */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#00D09C] transition-all cursor-pointer active:scale-90"
                    title="向左滑動"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}

                {/* Right Scroll Button */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#00D09C] transition-all cursor-pointer active:scale-90"
                    title="向右滑動（查看科學分化與居家徒手）"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}

                {/* Scrollable Container with onWheel & Mouse Drag */}
                <div
                  ref={scrollContainerRef}
                  onScroll={checkScrollBounds}
                  onWheel={handleWheelScroll}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className={`flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl text-xs font-bold overflow-x-auto select-none touch-pan-x transition-colors ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  style={{
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {MAIN_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeMainTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveMainTab(tab.id as MainTab);
                          setLevelFilter('all');
                        }}
                        className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 relative ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-[#00D09C]' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-bold">{tab.label}</span>
                        {tab.badge && (
                          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-[#FF6B4A] text-white">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. 次級次要篩選膠囊 (Sub-filter Bar — 支援滑輪左右滾動) */}
        {/* ============================================================ */}
        {!searchQuery && (
          <div
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 touch-pan-x"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* 分化課表子類 (PPL / Upper Lower / Bro) */}
            {activeMainTab === 'splits' && (
              <div className="flex items-center gap-1.5 shrink-0">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'ppl', label: '推拉腿 (PPL)' },
                  { id: 'upper_lower', label: '上下肢' },
                  { id: 'bro', label: '胸臂/全身' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSplitSubFilter(item.id as SplitFilter)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      splitSubFilter === item.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* 難度標籤切換 */}
            {activeMainTab !== 'splits' && activeMainTab !== 'dah' && activeMainTab !== 'zhuo' && (
              <div className="flex items-center gap-1.5 shrink-0">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'beginner', label: '🟢 新手友善' },
                  { id: 'intermediate', label: '🟡 中階進階' },
                  { id: 'advanced', label: '🔴 高階強度' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLevelFilter(item.id as LevelFilter)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      levelFilter === item.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 5A. 大H 健體美學專項橫幅 (大H Tab) */}
        {/* ============================================================ */}
        {activeMainTab === 'dah' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-linear-to-br from-amber-500/15 via-amber-500/5 to-white border border-amber-300 shadow-xs space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs">
                🏆 大H • IFBB PRO 健體自然職業選手
              </span>
              <span className="text-[11px] font-bold text-amber-800">
                陳建昕 經典菜單
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              極致 V-Taper 倒三角、3D 南瓜肩與受控慢離心
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              大H 訓練心法：「重質不重量、控制張力、拒絕盲目借力」。透過肩胛骨平面運動軌跡與 3 秒受控慢離心，在保護肩關節的前提下徹底榨乾目標肌群！
            </p>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 5B. 卓叔增重瘦人專項橫幅 (卓叔 Tab) */}
        {/* ============================================================ */}
        {activeMainTab === 'zhuo' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-linear-to-br from-orange-500/15 via-orange-500/5 to-white border border-orange-300 shadow-xs space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-500 text-white shadow-2xs">
                🍚 卓叔增重體系 • 瘦人增肌鼻祖
              </span>
              <span className="text-[11px] font-bold text-orange-800">
                外胚型 / 怎麼吃都不胖專屬
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              「瘦子增肌焚訣：練得越少，效果越好」
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              卓叔增重核心哲學：瘦人神經易疲勞、代謝高。每次只練 4 個大複合動作，嚴格控制在 38 分鐘內結束，專注把力氣練大，保護寶貴熱量盈餘！
            </p>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 5C. 專屬推薦首卡 (僅在「為你推薦」Tab 顯示) */}
        {/* ============================================================ */}
        {activeMainTab === 'recommended' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md relative overflow-hidden"
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-100 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>依您的個人資料智能推薦 ({userProfile?.experience === 'beginner' ? '新手階段' : userProfile?.experience === 'advanced' ? '高階強度' : '中階進階'})</span>
            </div>

            <h3 className="text-xl font-black mt-1 tracking-tight">
              {userRecommendedPlan.shortTitle || userRecommendedPlan.name}
            </h3>
            <p className="text-xs text-emerald-50/90 mt-1 line-clamp-1 font-medium">
              {userRecommendedPlan.tagline || userRecommendedPlan.description}
            </p>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-white/90">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">
                  ⏱️ {userRecommendedPlan.duration || '40分鐘'}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">
                  🏋️ {userRecommendedPlan.exercises.length} 動作
                </span>
              </div>

              <button
                onClick={() => setPreviewPlan(userRecommendedPlan)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 text-xs font-black shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>立即檢視</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* 6. 30日目標專項三大白色大卡片 (僅在「30日專項」Tab 精確呈現) */}
        {/* ============================================================ */}
        {activeMainTab === 'goals' && !searchQuery && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 divide-y divide-slate-100">
            {/* Row 1: 腹部減脂 */}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const plan = WORKOUT_PLANS.find((p) => p.id === 'fat_loss_belly');
                if (plan) setPreviewPlan(plan);
              }}
              className="group flex items-center justify-between min-h-[115px] pl-5 sm:pl-6 cursor-pointer hover:bg-slate-50/90 transition-colors"
            >
              <div className="flex-1 pr-3 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    熱銷爆款
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">18分鐘 • 4動作</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors mt-0.5">
                  腹部減脂
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
                  骨盆後傾捲動 • 消除腰腹贅肉
                </p>
              </div>

              <div className="w-32 sm:w-40 h-28 relative overflow-hidden flex items-center justify-end shrink-0">
                <img
                  src="/images/plans/belly_fat_loss.jpg"
                  alt="腹部減脂"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Row 2: 六塊腹肌 */}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const plan = WORKOUT_PLANS.find((p) => p.id === 'six_pack_abs');
                if (plan) setPreviewPlan(plan);
              }}
              className="group flex items-center justify-between min-h-[115px] pl-5 sm:pl-6 cursor-pointer hover:bg-slate-50/90 transition-colors"
            >
              <div className="flex-1 pr-3 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                    線條雕塑
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">20分鐘 • 4動作</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors mt-0.5">
                  六塊腹肌
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
                  深層腹直肌募集 • 稜角分明
                </p>
              </div>

              <div className="w-32 sm:w-40 h-28 relative overflow-hidden flex items-center justify-end shrink-0">
                <img
                  src="/images/plans/six_pack_abs.jpg"
                  alt="六塊腹肌"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* Row 3: 臀部 */}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const plan = WORKOUT_PLANS.find((p) => p.id === 'glutes_focus');
                if (plan) setPreviewPlan(plan);
              }}
              className="group flex items-center justify-between min-h-[115px] pl-5 sm:pl-6 cursor-pointer hover:bg-slate-50/90 transition-colors"
            >
              <div className="flex-1 pr-3 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    蜜桃翹臀
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">22分鐘 • 4動作</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors mt-0.5">
                  臀部塑形
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-medium line-clamp-1">
                  長肌纖維拉伸過載 • 提臀不粗腿
                </p>
              </div>

              <div className="w-32 sm:w-40 h-28 relative overflow-hidden flex items-center justify-end shrink-0">
                <img
                  src="/images/plans/glutes_focus.jpg"
                  alt="臀部"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. 極簡卡片列表 (De-cluttered Clean Cards) */}
        {/* ============================================================ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {searchQuery ? `搜尋結果 (${filteredPlans.length})` : `精選推薦清單 (${filteredPlans.length})`}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">
              雙重漸進 (8-12RM)
            </span>
          </div>

          {filteredPlans.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80">
              <p className="text-slate-400 text-xs">沒有找到符合條件的課表</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLevelFilter('all');
                }}
                className="mt-3 text-xs text-[#00A87E] font-bold"
              >
                清除所有篩選
              </button>
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const isCurrent = session.plan_id === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPreviewPlan(plan)}
                  className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer shadow-2xs hover:shadow-sm ${
                    isCurrent
                      ? 'border-[#00D09C] ring-2 ring-[#00D09C]/20 bg-emerald-50/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Top Tags Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-700">
                        {plan.categoryLabel}
                      </span>
                      {plan.coachName && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/15 text-amber-800 border border-amber-300/60 flex items-center gap-0.5">
                          {plan.coachName.includes('大H') ? '🏆 大H專項' : '🍚 卓叔增重'}
                        </span>
                      )}
                      {plan.equipment && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          {plan.equipment.includes('無需器材') ? '⚡ 徒手' : '🏋️ ' + plan.equipment.split('/')[0].trim()}
                        </span>
                      )}
                      {plan.duration && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          ⏱️ {plan.duration}
                        </span>
                      )}
                    </div>

                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white flex items-center gap-1 shadow-2xs shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                        進行中
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5 shrink-0">
                        檢視 <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Plan Main Title (Clean & Short) */}
                  <h4 className="text-base font-black text-slate-900 mt-2 tracking-tight">
                    {plan.shortTitle || plan.name.replace(/^Jeff Nippard\s*[—–-]\s*/, '')}
                  </h4>

                  {/* One-Liner Tagline (Replaces wall of text) */}
                  <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                    {plan.tagline || plan.description}
                  </p>

                  {/* Exercise Mini Avatars & Focus */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-700 text-[11px]">
                        🎯 {plan.targetFocus.split('/')[0].trim()}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px]">{plan.exercises.length} 個動作模組</span>
                    </div>

                    {/* Exercise thumbnail avatars */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {plan.exercises.slice(0, 3).map((ex, i) => (
                        <div
                          key={ex.exercise_id + i}
                          className="w-5 h-5 rounded-full bg-slate-100 border border-white flex items-center justify-center overflow-hidden"
                        >
                          <ExerciseIllustration
                            exerciseId={ex.exercise_id}
                            exerciseName={ex.exercise_name}
                            className="w-full h-full scale-125"
                          />
                        </div>
                      ))}
                      {plan.exercises.length > 3 && (
                        <div className="w-5 h-5 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] font-black text-slate-600">
                          +{plan.exercises.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. 課表詳情抽屜彈窗 (Preview Drawer / Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {previewPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
            onClick={() => setPreviewPlan(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Drag Pill */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 sm:hidden" />

              {/* Drawer Header */}
              <div className="p-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-[#00A87E]">
                      {previewPlan.categoryLabel}
                    </span>
                    {previewPlan.coachBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                        {previewPlan.coachBadge}
                      </span>
                    )}
                    {session.plan_id === previewPlan.id && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white">
                        目前進行中
                      </span>
                    )}
                    {previewPlan.duration && (
                      <span className="text-[11px] text-slate-400 font-bold">
                        ⏱️ {previewPlan.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1 truncate">
                    {previewPlan.shortTitle || previewPlan.name}
                  </h3>
                </div>

                <button
                  onClick={() => setPreviewPlan(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 overflow-y-auto space-y-4">
                {/* One liner & targets */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs leading-relaxed space-y-1.5">
                  <p className="font-bold text-slate-800">
                    🎯 焦點肌群：<span className="text-emerald-700">{previewPlan.targetFocus}</span>
                  </p>
                  <p className="text-slate-500 font-medium">
                    {previewPlan.description}
                  </p>
                </div>

                {/* Collapsible Scientific Basis (想看的人再點開，拒絕資訊塞爆) */}
                {previewPlan.nippardPrinciples && (
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-emerald-50/40">
                    <button
                      type="button"
                      onClick={() => setShowScientificPrinciples(!showScientificPrinciples)}
                      className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-950 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
                        <span>🔬 Jeff Nippard 運動科學指標</span>
                      </span>
                      {showScientificPrinciples ? (
                        <ChevronUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>

                    <AnimatePresence>
                      {showScientificPrinciples && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-3 pb-3 grid grid-cols-2 gap-2 text-[11px]"
                        >
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                            <p className="text-slate-400 font-bold">生理機制</p>
                            <p className="text-slate-800 font-bold mt-0.5 line-clamp-2">
                              {previewPlan.nippardPrinciples.scientificBasis}
                            </p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                            <p className="text-slate-400 font-bold">強度保留</p>
                            <p className="text-slate-800 font-bold mt-0.5">
                              {previewPlan.nippardPrinciples.repScheme}
                            </p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                            <p className="text-slate-400 font-bold">訓練頻率</p>
                            <p className="text-slate-800 font-bold mt-0.5">
                              {previewPlan.nippardPrinciples.frequency}
                            </p>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                            <p className="text-slate-400 font-bold">每週容量</p>
                            <p className="text-slate-800 font-bold mt-0.5">
                              {previewPlan.nippardPrinciples.weeklySets}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Exercise List */}
                <div>
                  <h4 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>包含動作模組 ({previewPlan.exercises.length})</span>
                    <span className="text-[11px] font-normal text-slate-400">雙重漸進配重</span>
                  </h4>

                  <div className="space-y-2.5">
                    {previewPlan.exercises.map((ex, idx) => (
                      <div
                        key={ex.exercise_id + idx}
                        className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            <ExerciseIllustration
                              exerciseId={ex.exercise_id}
                              exerciseName={ex.exercise_name}
                              className="w-full h-full scale-100"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {idx + 1}. {ex.exercise_name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {ex.total_sets} 組 × {ex.target_load.reps} 下 • {ex.grip_type}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-black font-mono text-[#00A87E] bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0">
                          {ex.target_load.weight_kg > 0 ? `${ex.target_load.weight_kg}kg` : '自重'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => handleChoosePlan(previewPlan)}
                  className="w-full py-3.5 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-md shadow-[#00D09C]/20 transition-all cursor-pointer active:scale-98"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>採用此課表並前往訓練</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
