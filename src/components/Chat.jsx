import { motion } from 'framer-motion';
import JohnnyIcon from './JohnnyIcon';

export default function Chat({ userPrompt, tripOptions, onSelectTrip, selectedTrip, bookingStatus }) {
  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {/* User Message */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 flex-row-reverse"
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            M
          </div>
          <div className="flex-1">
            <div className="text-base leading-relaxed text-gray-900">
              {userPrompt}
            </div>
          </div>
        </motion.div>

        {/* AI Response */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <div className="w-8 h-8 flex-shrink-0">
            <JohnnyIcon size={32} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="text-base leading-relaxed text-gray-900">
              I've crafted three personalized itineraries for you. Each option balances your interests and budget:
            </div>

            {/* Trip Options */}
            <div className="space-y-3">
              {tripOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  onClick={() => !selectedTrip && onSelectTrip(option)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition ${
                    selectedTrip === option 
                      ? 'border-black ring-2 ring-black' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  } ${selectedTrip && selectedTrip !== option ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold text-base text-black">
                      {option.title}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      {option.budget}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {option.description}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {option.highlights.map((highlight, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-600"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Booking Status */}
            {bookingStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <div className="font-semibold text-green-900">Trip Booked!</div>
                </div>
                <div className="text-sm text-green-800">
                  {bookingStatus}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gray-50 border border-gray-200 rounded-3xl px-5 py-3.5 flex items-center">
            <textarea
              placeholder="Ask Johnny anything..."
              rows="1"
              className="flex-1 border-none outline-none text-base text-black placeholder-gray-400 bg-transparent resize-none"
            />
            <button className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 ml-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <rect x="2" y="8" width="3" height="8" rx="1.5"/>
                <rect x="7" y="4" width="3" height="16" rx="1.5"/>
                <rect x="12" y="10" width="3" height="4" rx="1.5"/>
                <rect x="17" y="6" width="3" height="12" rx="1.5"/>
              </svg>
            </button>
          </div>
          <div className="mt-2.5 text-center text-xs text-gray-500">
            Johnny synthesizes itineraries in under 3 seconds
          </div>
        </div>
      </div>
    </div>
  );
}
