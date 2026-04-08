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

const dimensionConfig = {
  'E/I': { leftKey: 'E', rightKey: 'I' },
  'S/N': { leftKey: 'S', rightKey: 'N' },
  'T/F': { leftKey: 'T', rightKey: 'F' },
  'J/P': { leftKey: 'J', rightKey: 'P' }
};

const LEFT_COLOR = '#14b8a6';
const RIGHT_COLOR = '#6366f1';
const NEUTRAL_COLOR = '#9ca3af';

export function Quiz({ question, currentIndex, totalQuestions, onAnswer, onPrevious }: QuizProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const [showGuide, setShowGuide] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const config = dimensionConfig[question.dimension];

  const ambientColor = 'bg-teal-400/20';

  React.useEffect(() => {
    if (currentIndex > 0) {
      setShowGuide(false);
    }
    setSelectedIndex(null);
  }, [currentIndex]);

  const handleGuideClose = () => {
    setShowGuide(false);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const weights = [2, 1, 0, 1, 2];
    const keys = [config.rightKey, config.rightKey, 'neutral', config.leftKey, config.leftKey];
    setTimeout(() => {
      onAnswer(keys[index], weights[index]);
    }, 200);
  };

  const circles = [
    { size: 56, borderWidth: 4, color: RIGHT_COLOR },
    { size: 44, borderWidth: 3, color: RIGHT_COLOR },
    { size: 36, borderWidth: 3, color: NEUTRAL_COLOR },
    { size: 44, borderWidth: 3, color: LEFT_COLOR },
    { size: 56, borderWidth: 4, color: LEFT_COLOR }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 min-h-[80vh] flex flex-col relative">

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

      <div className="mb-8 flex items-center justify-between relative z-10">
        <div className="w-12"></div>

        <div className="flex-1 px-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
            <span>Progress</span>
            <span>{currentIndex + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-teal-600 h-2 rounded-full"
              initial={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="w-12"></div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="mb-16 text-center flex flex-col items-center px-4">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug text-balance">
                {question.text}
              </h2>
              {question.guide && (
                <p className="mt-4 text-base text-gray-500 italic">{question.guide}</p>
              )}
            </div>

            <div className="flex flex-col items-center gap-8">
              <div className="flex justify-center items-center gap-3 sm:gap-4 px-4">
                {circles.map((circle, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className="rounded-full transition-all flex-shrink-0"
                    style={{
                      width: circle.size,
                      height: circle.size,
                      borderWidth: circle.borderWidth,
                      borderColor: circle.color,
                      borderStyle: 'solid',
                      backgroundColor: selectedIndex === index ? circle.color : 'transparent',
                      transform: selectedIndex === index ? 'scale(1.15)' : 'scale(1)'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center w-full max-w-[320px] px-2 text-sm font-medium text-gray-500">
                <span>反对</span>
                <span>中立</span>
                <span>同意</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">如何答题</h3>
            <p className="text-gray-600 mb-4">请根据题目描述，选择符合你实际情况的程度：</p>
            <p className="text-gray-500 mb-6 text-sm italic">本次心理测验是为了让你更好地了解自我，所有问题的答案无对错之分，请按你的实际情况真实回答。</p>
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-4 border-indigo-500 mb-2"></div>
                <span className="text-sm text-gray-600">反对</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full border-4 border-gray-400 mb-2"></div>
                <span className="text-sm text-gray-600">中立</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-4 border-teal-500 mb-2"></div>
                <span className="text-sm text-gray-600">同意</span>
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

      {currentIndex > 0 && (
        <div className="mt-20 flex justify-center relative z-10">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onPrevious}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-white/30 backdrop-blur-sm border border-white/50 text-gray-500 hover:bg-white/50 hover:text-gray-700 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">上一题</span>
          </motion.button>
        </div>
      )}
    </div>
  );
}