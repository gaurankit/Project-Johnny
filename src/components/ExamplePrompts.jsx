import { motion } from 'framer-motion';

const examples = [
  {
    icon: "🗼",
    title: "Romantic Paris",
    prompt: "Romantic weekend in Paris for our anniversary, love art and food, $3000 budget"
  },
  {
    icon: "🗾",
    title: "Family Tokyo",
    prompt: "Family trip to Tokyo for 7 days with kids, cultural experiences and fun activities"
  },
  {
    icon: "🏖️",
    title: "Bali Wellness",
    prompt: "Wellness retreat in Bali, yoga and meditation focused, 5 days, $2500"
  },
  {
    icon: "❄️",
    title: "Iceland Adventure",
    prompt: "Adventure trip to Iceland to see Northern Lights, 5 days in winter"
  },
];

export default function ExamplePrompts({ onSelect }) {
  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="text-sm font-medium text-gray-500 mb-3 text-center">
        Try these examples:
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(example.prompt)}
            className="group bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{example.icon}</span>
              <div>
                <div className="font-medium text-sm text-gray-900 mb-1 group-hover:text-black">
                  {example.title}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {example.prompt}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
