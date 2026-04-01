import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Download, Zap, Sparkles, Users, PieChart } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { ResultData } from '../App';
import { compatibilityData } from '../data/results';

interface ResultProps {
  key?: string;
  resultData: ResultData;
  onRestart: () => void;
  onGoToGuide: () => void;
}

export function Result({ resultData, onRestart, onGoToGuide }: ResultProps) {
  const { result, percentages } = resultData;
  const posterRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveImage = async () => {
    if (posterRef.current) {
      try {
        setIsGenerating(true);
        // 临时移除动画，确保所有元素都可见
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        
        // 临时隐藏指南页面按钮
        const guideButton = posterRef.current.querySelector('button');
        const guideButtonStyle = guideButton?.style.display;
        if (guideButton) {
          guideButton.style.display = 'none';
        }
        
        // 禁用所有动画，直接显示最终状态
        const progressBars = posterRef.current.querySelectorAll('.mb-6.relative');
        progressBars.forEach(bar => {
          const leftBar = bar.querySelector('.h-full.transition-all');
          const rightBar = bar.querySelectorAll('.h-full.transition-all')[1];
          if (leftBar) leftBar.style.transition = 'none';
          if (rightBar) rightBar.style.transition = 'none';
        });
        
        // 强制所有元素渲染完成，增加延迟时间
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 确保海报容器在视口中
        const originalPosition = posterRef.current.style.position;
        const originalTop = posterRef.current.style.top;
        posterRef.current.style.position = 'relative';
        posterRef.current.style.top = '0';
        
        // 滚动到顶部
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const dataUrl = await htmlToImage.toPng(posterRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#050505',
          // 确保捕获所有元素
          allowTaint: true,
          useCORS: true,
          // 增加宽度和高度以确保捕获完整内容
          width: posterRef.current.offsetWidth,
          height: posterRef.current.offsetHeight,
          // 增加timeout时间
          timeout: 10000
        });
        
        // 恢复原始样式
        document.body.style.overflow = originalOverflow;
        if (guideButton) {
          guideButton.style.display = guideButtonStyle || '';
        }
        posterRef.current.style.position = originalPosition;
        posterRef.current.style.top = originalTop;
        
        // 恢复动画
        progressBars.forEach(bar => {
          const leftBar = bar.querySelector('.h-full.transition-all');
          const rightBar = bar.querySelectorAll('.h-full.transition-all')[1];
          if (leftBar) leftBar.style.transition = 'all duration-1500 ease-out';
          if (rightBar) rightBar.style.transition = 'all duration-1500 ease-out';
        });
        
        // Instead of triggering a direct download (which fails in WeChat),
        // we show the generated image in a modal for the user to long-press and save.
        setPreviewImage(dataUrl);
      } catch (error) {
        console.error('Failed to save image', error);
        alert('生成海报失败，请重试');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const ProgressBar = ({ leftLetter, leftText, rightLetter, rightText, leftPct, rightPct, colorClass, textClass, index = 0 }: any) => {
    const isLeftDominant = result.type.includes(leftLetter);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);
    
    React.useEffect(() => {
      // 每个进度条依次出现，创造层次感
      const timer = setTimeout(() => {
        setLeftWidth(leftPct);
        setRightWidth(rightPct);
      }, 100 + index * 200); // 每个进度条延迟200ms
      
      return () => clearTimeout(timer);
    }, [leftPct, rightPct, index]);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
        className="mb-6 relative"
      >
        {/* Top Row: Letter - Bar - Letter */}
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`text-3xl md:text-4xl font-black w-8 md:w-10 text-center leading-none ${isLeftDominant ? textClass : 'text-gray-700'}`}
          >
            {leftLetter}
          </motion.span>
          
          <div className="flex-1 bg-gray-900 rounded-full h-4 md:h-5 flex overflow-hidden border border-white/10 shadow-inner">
            <div 
              className={`h-full transition-all duration-1500 ease-out ${isLeftDominant ? colorClass : 'bg-gray-800'}`} 
              style={{ width: `${leftWidth}%` }}
            />
            <div 
              className={`h-full transition-all duration-1500 ease-out ${!isLeftDominant ? colorClass : 'bg-gray-800'}`} 
              style={{ width: `${rightWidth}%` }}
            />
          </div>

          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`text-3xl md:text-4xl font-black w-8 md:w-10 text-center leading-none ${!isLeftDominant ? textClass : 'text-gray-700'}`}
          >
            {rightLetter}
          </motion.span>
        </div>

        {/* Bottom Row: Text + Percentage */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="flex justify-between items-center px-11 md:px-14 font-bold tracking-wider uppercase"
        >
          <span className={`text-xs md:text-sm ${isLeftDominant ? textClass : 'text-gray-600'}`}>
            {leftText} <span className="text-base md:text-lg ml-1">{leftPct}%</span>
          </span>
          <span className={`text-xs md:text-sm ${!isLeftDominant ? textClass : 'text-gray-600'}`}>
            <span className="text-base md:text-lg mr-1">{rightPct}%</span> {rightText}
          </span>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col items-center justify-center"
    >
      {/* Poster Card */}
      <div 
        ref={posterRef}
        className="bg-[#050505] rounded-[2.5rem] p-6 md:p-10 shadow-2xl w-full mb-8 relative overflow-hidden border border-white/10"
      >
        {/* Massive Background Text */}
        <div className="absolute -top-10 -left-10 text-[14rem] font-black text-white/[0.03] tracking-tighter leading-none select-none pointer-events-none">
          {result.type}
        </div>
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-1.5 border border-white/20 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-white/70 mb-6"
            >
              MBTI人格类型
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-8xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40"
            >
              {result.type}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4"
            >
              {result.title}
            </motion.h2>

            {/* Traits Tags moved here */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start"
            >
              {result.traits.map((trait, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-black text-white bg-white/10 border border-white/20 backdrop-blur-md uppercase tracking-wider"
                >
                  #{trait}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dimension Bars */}
        <div className="space-y-4 mb-10 relative z-10">
          <ProgressBar 
            index={0}
            leftLetter="E" leftText="外向" rightLetter="I" rightText="内向" 
            leftPct={percentages.E} rightPct={percentages.I} 
            colorClass="bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
            textClass="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
          />
          <ProgressBar 
            index={1}
            leftLetter="S" leftText="感觉" rightLetter="N" rightText="直觉" 
            leftPct={percentages.S} rightPct={percentages.N} 
            colorClass="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
            textClass="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
          />
          <ProgressBar 
            index={2}
            leftLetter="T" leftText="思考" rightLetter="F" rightText="情感" 
            leftPct={percentages.T} rightPct={percentages.F} 
            colorClass="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
            textClass="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
          />
          <ProgressBar 
            index={3}
            leftLetter="J" leftText="判断" rightLetter="P" rightText="感知" 
            leftPct={percentages.J} rightPct={percentages.P} 
            colorClass="bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
            textClass="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mb-8"
        >
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
            {result.description}
          </p>
        </motion.div>

        {/* Personality Percentage in Population */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm mb-6 relative z-10"
        >
          <h4 className="text-white/90 text-base font-bold mb-4 flex items-center tracking-wider">
            <PieChart className="w-5 h-5 mr-2 text-blue-400"/> 📊 人格占比
          </h4>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
              <motion.div 
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${result.percentage} 100` }}
                transition={{ delay: 1.7, duration: 1.5 }}
                className="absolute inset-0 rounded-full border-8 border-blue-500"
                style={{
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  transform: 'rotate(-45deg)'
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{result.percentage}%</span>
                <span className="text-xs text-white/70">人群占比</span>
              </div>
            </div>
            <p className="text-center text-sm text-white/70 mb-2">
              人群占比：约 {result.percentage}%
            </p>
            <p className="text-center text-sm text-white/70">
              {result.rarityDescription}
            </p>
          </div>
        </motion.div>

        {/* Representatives Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm mb-6 relative z-10"
        >
          <h4 className="text-white/90 text-base font-bold mb-4 flex items-center tracking-wider">
            <Users className="w-5 h-5 mr-2 text-amber-400"/> 代表人物
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.representatives.map((rep, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                className="bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <h5 className="text-white font-bold text-sm mb-2">{rep.name}（{rep.country}）</h5>
                <p className="text-white/60 text-xs">{rep.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compatibility Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm mb-6 relative z-10"
        >
          <h4 className="text-white/90 text-base font-bold mb-4 flex items-center tracking-wider">
            <Users className="w-5 h-5 mr-2 text-purple-400"/> 💞 人格契合度
          </h4>
          <div className="space-y-4">
            {compatibilityData[result.type].slice(0, 2).map((item, index) => (
              <motion.div 
                key={item.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 + index * 0.1 }}
                className="bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-white font-bold text-sm mr-2">{item.type}</span>
                    <span className="text-white/70 text-xs">{item.title}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-800 rounded-full h-2 overflow-hidden mr-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.compatibility}%` }}
                        transition={{ delay: 2 + index * 0.1, duration: 1 }}
                        className="h-full bg-purple-500 rounded-full"
                      />
                    </div>
                    <span className="text-purple-400 font-bold text-sm">{item.compatibility}%</span>
                  </div>
                </div>
                <p className="text-white/60 text-xs">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 mb-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm"
            >
              <h4 className="text-white/90 text-base font-bold mb-4 flex items-center tracking-wider">
                <Sparkles className="w-5 h-5 mr-2 text-emerald-400"/> 核心天赋与优势
              </h4>
              <div className="space-y-4">
                {result.talents.map((t, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + idx * 0.1 }}
                  >
                    <h5 className="text-emerald-300 text-sm font-bold mb-1">{t.title}</h5>
                    <p className="text-white/70 text-sm leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-2xl backdrop-blur-sm"
            >
              <h4 className="text-white/90 text-base font-bold mb-4 flex items-center tracking-wider">
                <Zap className="w-5 h-5 mr-2 text-amber-400"/> 潜在短板与成长痛点
              </h4>
              <div className="space-y-4">
                {result.shortcomings.map((t, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + idx * 0.1 }}
                  >
                    <h5 className="text-amber-300 text-sm font-bold mb-1">{t.title}</h5>
                    <p className="text-white/70 text-sm leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="mt-8 relative z-10"
          >
            <button
              onClick={onGoToGuide}
              className="w-full flex items-center justify-center px-6 py-4 rounded-2xl font-black text-white bg-orange-500 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/30"
            >
              美团消费后评价领取MBTI徽章
            </button>
          </motion.div>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
          <div className="text-[10px] md:text-xs font-bold text-white/40 tracking-widest uppercase whitespace-nowrap">
            加洲心理
          </div>
          
          <div className="text-[9px] md:text-[10px] font-medium text-white/30 tracking-wider text-center flex-1 mx-2">
            TEST FOR FUN / 仅供娱乐参考
          </div>
          <div className="text-[10px] md:text-xs font-bold text-white/40 tracking-widest">
            TEL:0591-88119118
          </div>
        </div>
      
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
      >
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center px-6 py-4 rounded-2xl font-black text-gray-900 bg-white hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          再测一次
        </button>
        <button
          onClick={handleSaveImage}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center px-6 py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="animate-pulse">生成中...</span>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              保存海报
            </>
          )}
        </button>
      </motion.div>



      {/* Image Preview Modal for WeChat/Mobile */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md flex flex-col items-center">
            <p className="text-white/90 font-bold mb-4 animate-pulse text-lg tracking-wider">
              👇 长按下方图片保存到手机 👇
            </p>
            <div className="relative w-full max-h-[75vh] overflow-y-auto rounded-2xl no-scrollbar shadow-2xl border border-white/20">
              <img src={previewImage} alt="MBTI Poster" className="w-full h-auto rounded-2xl" />
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="mt-6 px-8 py-3 bg-white/10 border border-white/20 rounded-full text-white font-bold backdrop-blur-md active:scale-95 transition-all hover:bg-white/20"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
