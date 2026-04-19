import { motion } from 'framer-motion';

const AIRLINE_COLORS = {
  'Air France': 'bg-blue-600',
  'Delta': 'bg-red-600',
  'United': 'bg-blue-800',
  'American': 'bg-blue-500',
  'British Airways': 'bg-blue-700',
  'Emirates': 'bg-red-500',
  'Singapore Airlines': 'bg-yellow-600',
  'JAL': 'bg-red-600',
  'ANA': 'bg-blue-500',
  'Lufthansa': 'bg-yellow-500',
  'Qatar Airways': 'bg-purple-700',
  'KLM': 'bg-blue-500',
};

export default function FlightCard({ data }) {
  const airlineColor = AIRLINE_COLORS[data.airline] || 'bg-gray-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md w-full max-w-sm"
    >
      {/* Header */}
      <div className={`${airlineColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">{data.airline}</span>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-lg">{data.price}</div>
          <div className="text-white text-opacity-80 text-xs">{data.class}</div>
        </div>
      </div>

      {/* Route */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.from}</div>
            <div className="text-sm text-gray-500">{data.fromCity}</div>
            <div className="text-base font-semibold text-gray-800 mt-1">{data.departure}</div>
          </div>

          {/* Route line */}
          <div className="flex-1 mx-4 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{data.duration}</span>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 h-px bg-gray-200" />
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.stops === 'Direct' || data.stops === '0 stops' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              {data.stops}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.to}</div>
            <div className="text-sm text-gray-500">{data.toCity}</div>
            <div className="text-base font-semibold text-gray-800 mt-1">
              {data.arrival}
              {data.arrivalDay && <span className="text-xs text-orange-500 ml-0.5">{data.arrivalDay}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {data.aircraft && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 17h18M12 3v14"/>
              </svg>
              {data.aircraft}
            </span>
          )}
        </div>
        <button className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors">
          Select Flight
        </button>
      </div>
    </motion.div>
  );
}
