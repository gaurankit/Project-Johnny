import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingStages() {
  const [stage, setStage] = useState(0);
  
  const stages = [
    { text: "Analyzing your preferences...", icon: "🔍" },
    { text: "Searching destinations...", icon: "🌍" },
    { text: "Crafting perfect itineraries...", icon: "✨" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % stages.length);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl px-8 py-6 shadow-2xl max-w-md mx-4"
      >
        <div className="flex items-center gap-4">
          {/* Animated loader */}
          <div className="relative w-12 h-12">
            <motion.div
              className="absolute inset-0 border-4 border-gray-200 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-4 border-black border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Stage text with icon */}
          <div className="flex-1">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-base font-medium text-gray-900"
            >
              <span className="text-2xl">{stages[stage].icon}</span>
              <span>{stages[stage].text}</span>
            </motion.div>
            
            {/* Progress bar */}
            <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-black h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
