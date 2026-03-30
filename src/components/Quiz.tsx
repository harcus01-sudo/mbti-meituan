import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Question } from '../data/questions';

interface QuizProps {
  key?: string;
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (value: string, weight: number) => void;
  onPrevious: () => void;
}

export function Quiz({ question, currentIndex, totalQuestions, onAnswer, onPrevious }: QuizProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const [showGuide, setShowGuide] = React.useState(true);

  // Determine ambient color based on the current question's dimension
  const ambientColor = useMemo(() => {
    switch (question.dimension) {
      case 'E/I': return 'bg-blue-400/20';
      case 'S/N': return 'bg-emerald-400/20';
      case 'T/F': return 'bg-purple-400/20';
      case 'J/P': return 'bg-amber-400/20';
      default: return 'bg-indigo-400/20';
    }
  }, [question.dimension]);

  React.useEffect(() => {
    // 只有在第一题时显示引导
    if (currentIndex > 0) {
      setShowGuide(false);
    }
  }, [currentIndex]);

  const handleGuideClose = () => {
    setShowGuide(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col relative">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={ambientColor}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`absolute w-[120vw] h-[120vw] md:w-[50vw] md:h-[50vw] rounded-full ${ambientColor} blur-[80px] md:blur-[120px]`}
          />
        </AnimatePresence>
      </div>

      {/* Top Navigation / Progress */}
      <div className="mb-8 flex items-center justify-between relative z-10">
        <div className="w-12">
          {/* 上一题按钮已移至页面底部 */}
        </div>
        
        <div className="flex-1 px-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
            <span>Progress</span>
            <span>{currentIndex + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        <div className="w-12"></div> {/* Spacer for centering */}
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="mb-12 text-center flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug text-balance px-4 mx-auto">
                {question.text}
              </h2>
            </div>

            <div className="flex flex-col space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 shadow-sm cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                      A
                    </div>
                    <h3 className="text-lg font-medium text-indigo-600">
                      {question.optionA.text}
                    </h3>
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl p-4 shadow-sm cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                      B
                    </div>
                    <h3 className="text-lg font-medium text-teal-600">
                      {question.optionB.text}
                    </h3>
                  </div>
                </motion.div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="text-center text-gray-500 font-medium mb-2 flex items-center gap-2">
                  <span>请选择符合程度</span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ↓
                  </motion.div>
                </div>
                <div className="flex justify-center items-center gap-4 sm:gap-8">
                  <motion.button 
                    onClick={() => onAnswer(question.optionA.value, 2)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-500 hover:bg-indigo-500 hover:scale-110 transition-all shadow-sm flex-shrink-0"
                    aria-label="非常同意A"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.button 
                    onClick={() => onAnswer(question.optionA.value, 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-400 hover:bg-indigo-400 hover:scale-110 transition-all shadow-sm flex-shrink-0"
                    aria-label="比较同意A"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.button 
                    onClick={() => onAnswer('neutral', 0)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-gray-300 hover:bg-gray-300 hover:scale-110 transition-all shadow-sm flex-shrink-0"
                    aria-label="中立"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.button 
                    onClick={() => onAnswer(question.optionB.value, 1)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-teal-400 hover:bg-teal-400 hover:scale-110 transition-all shadow-sm flex-shrink-0"
                    aria-label="比较同意B"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                  <motion.button 
                    onClick={() => onAnswer(question.optionB.value, 2)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-teal-500 hover:bg-teal-500 hover:scale-110 transition-all shadow-sm flex-shrink-0"
                    aria-label="非常同意B"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </div>
              </div>
            </div>

            {/* Guide Animation */}
            {showGuide && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl relative"
                >
                  <button 
                    onClick={handleGuideClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">如何答题</h3>
                  <p className="text-gray-600 mb-6">请根据您的实际情况，选择符合您程度的选项：</p>
                  <div className="flex justify-center items-center gap-4 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 mb-2"></div>
                      <span className="text-xs text-gray-600">非常同意A</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-4 border-indigo-400 mb-2"></div>
                      <span className="text-xs text-gray-600">比较同意A</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-4 border-gray-300 mb-2"></div>
                      <span className="text-xs text-gray-600">中立</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full border-4 border-teal-400 mb-2"></div>
                      <span className="text-xs text-gray-600">比较同意B</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-4 border-teal-500 mb-2"></div>
                      <span className="text-xs text-gray-600">非常同意B</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGuideClose}
                    className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    我知道了
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Previous Question Button */}
      {currentIndex > 0 && (
        <div className="mt-20 flex justify-center relative z-10">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onPrevious}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-white/30 backdrop-blur-sm border border-white/50 text-gray-500 hover:bg-white/50 hover:text-gray-700 transition-all shadow-sm"
            aria-label="上一题"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">上一题</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
