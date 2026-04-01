import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { ResultData } from '../App';

interface GuidePageProps {
  key?: string;
  resultData: ResultData;
  onBack: () => void;
}

export function GuidePage({ resultData, onBack }: GuidePageProps) {
  const { result } = resultData;
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const checkReviewStatus = () => {
      const reviewed = localStorage.getItem('mbti_reviewed');
      if (reviewed === 'true') {
        setHasReviewed(true);
      }
    };

    checkReviewStatus();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkReviewStatus();
        
        const currentTime = new Date().getTime();
        const lastLeaveTime = localStorage.getItem('mbti_last_leave');
        
        if (lastLeaveTime) {
          const timeDiff = currentTime - parseInt(lastLeaveTime);
          if (timeDiff >= 5000 && timeDiff <= 30000) {
            setShowCompleteButton(true);
          }
        }
      } else {
        localStorage.setItem('mbti_last_leave', new Date().getTime().toString());
        setShowCompleteButton(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleMarkReviewed = () => {
    localStorage.setItem('mbti_reviewed', 'true');
    setHasReviewed(true);
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen flex items-center justify-center bg-white p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-[#050505] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10"
      >
        <div className="absolute -top-10 -left-10 text-[14rem] font-black text-white/[0.03] tracking-tighter leading-none select-none pointer-events-none">
          {result.type}
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center leading-tight">
              美团消费后评价<br/>
              <span className="text-emerald-400">领取专属徽章</span>
            </h1>
            
            <div className="mb-8">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 leading-relaxed font-medium mb-8 text-left"
              >
                亲爱的来访者：<br/>
                感谢你愿意花时间，走进自己的内心世界。<br/>
                这份专属徽章，是我们为你准备的小小心意，<br/>
                只送给真实消费并留下评价的你，<br/>
                愿它能陪你一起，温柔且坚定地接纳自己的每一面。
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-emerald-400 mb-6 text-center">📋 操作步骤</h3>
                
                <div className="space-y-4 mb-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <p className="text-white/90">在美团平台完成消费后，前往对应店铺页面</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <p className="text-white/90">发布15字以上的真实消费评价</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <p className="text-white/90">凭已发布的评价页面，到前台领取对应人格专属徽章1枚</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-full px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 shadow-lg shadow-indigo-500/30"
              >
                返回结果
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
