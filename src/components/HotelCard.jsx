import { motion } from 'framer-motion';

// Reliable Unsplash hotel photos by tier
const HOTEL_IMAGES = {
  5: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=400&fit=crop',
  4: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop',
  3: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=400&fit=crop',
  2: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
  default: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop',
};

export default function HotelCard({ data }) {
  const stars = '⭐'.repeat(Math.min(data.stars || 4, 5));
  const imgSrc = HOTEL_IMAGES[data.stars] || HOTEL_IMAGES.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md w-full max-w-sm"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={data.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = HOTEL_IMAGES.default; }}
        />
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1 flex items-center gap-1 shadow-sm">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-sm font-bold text-gray-900">{data.rating}</span>
          <span className="text-xs text-gray-500">/ 10</span>
        </div>
        {/* Star rating overlay */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 rounded-lg px-2.5 py-1">
          <span className="text-xs text-white">{stars}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{data.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {data.location}
          </div>
        </div>

        {data.description && (
          <p className="text-xs text-gray-600 leading-relaxed">{data.description}</p>
        )}

        {/* Amenities */}
        {data.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.amenities.slice(0, 5).map((a, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">{data.pricePerNight}</span>
            <span className="text-xs text-gray-500 ml-1">/ night</span>
          </div>
          <a
            href={`https://www.google.com/travel/hotels/search?q=${encodeURIComponent(data.name + ' ' + data.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            View Hotel
          </a>
        </div>
      </div>
    </motion.div>
  );
}
