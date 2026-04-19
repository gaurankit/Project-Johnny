import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JohnnyIcon from './JohnnyIcon';
import MarkdownMessage from './MarkdownMessage';
import HotelCard from './HotelCard';
import FlightCard from './FlightCard';

const UserAvatar = () => (
  <img
    src="https://randomuser.me/api/portraits/men/32.jpg"
    alt="User avatar"
    className="w-8 h-8 rounded-full flex-shrink-0"
  />
);

export default function ChatEnhanced({
  userPrompt,
  tripOptions,
  onSelectTrip,
  selectedTrip,
  bookingStatus,
  chatMessages,
  chatLoading,
  onSendMessage,
}) {
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // New message added, cards loaded, or booking confirmed → scroll
  useEffect(() => {
    setTimeout(scrollToBottom, 80);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages.length, tripOptions, bookingStatus]);

  // Trip selected → wait for card animations to settle then scroll
  useEffect(() => {
    if (!selectedTrip) return;
    setTimeout(scrollToBottom, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip]);

  // Streaming in progress → always follow the bottom
  useEffect(() => {
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (!lastMsg?.streaming) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chatMessages]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || chatLoading) return;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(msg);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full min-h-0">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-8">

        {/* Initial user message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 flex-row-reverse"
        >
          <UserAvatar />
          <div className="flex-1 text-right">
            <div className="inline-block text-base leading-relaxed text-gray-900 bg-gray-100 rounded-2xl px-4 py-2.5 text-left max-w-[85%]">
              {userPrompt}
            </div>
          </div>
        </motion.div>

        {/* Trip options */}
        {tripOptions.length > 0 && (
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base leading-relaxed text-gray-900"
              >
                I've crafted three personalized itineraries for you. Each option balances your interests and budget:
              </motion.div>

              <div className="space-y-3">
                <AnimatePresence>
                  {tripOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.15, type: 'spring', stiffness: 100 }}
                      onClick={() => !selectedTrip && onSelectTrip(option)}
                      className={`bg-white border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                        selectedTrip === option
                          ? 'border-black ring-2 ring-black shadow-lg scale-[1.02]'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                      } ${selectedTrip && selectedTrip !== option ? 'opacity-40 scale-95' : ''}`}
                    >
                      {/* Title + Budget */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-semibold text-base text-black flex items-center gap-2">
                          {option.title}
                          {selectedTrip === option && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 text-green-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </motion.svg>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg">
                          {option.budget}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-sm text-gray-700 leading-relaxed mb-3">
                        {option.description}
                      </div>

                      {/* Hotel + Flight product line */}
                      {(option.hotel || option.flight) && (
                        <div className="flex flex-col gap-1 mb-3 border-t border-gray-100 pt-3">
                          {option.hotel && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                              </svg>
                              <span>{option.hotel}</span>
                            </div>
                          )}
                          {option.flight && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                              </svg>
                              <span>{option.flight}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {option.highlights.map((highlight, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 font-medium"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {!selectedTrip && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1.0 }}
                    className="text-sm text-gray-500"
                  >
                    Click a trip to select it, or ask me anything about these options!
                  </motion.div>
                )}
                {selectedTrip && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5"
                  >
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-gray-700">{selectedTrip.title}</strong> selected — ask me anything, or type <strong className="text-gray-700">"Book this"</strong> when you're ready to confirm.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Ongoing chat messages */}
        <AnimatePresence initial={false}>
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'user' ? (
                <UserAvatar />
              ) : (
                <div className="w-8 h-8 flex-shrink-0">
                  <JohnnyIcon size={32} />
                </div>
              )}
              <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="inline-block text-base leading-relaxed text-gray-900 bg-gray-100 rounded-2xl px-4 py-2.5 text-left max-w-[85%]">
                    {msg.text}
                  </div>
                ) : msg.type === 'hotel-card' ? (
                  <HotelCard data={msg.data} />
                ) : msg.type === 'flight-card' ? (
                  <FlightCard data={msg.data} />
                ) : msg.type === 'new-options' ? (
                  <div className="space-y-3 w-full">
                    <p className="text-base text-gray-900">{msg.text}</p>
                    {(msg.options || []).map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.12, type: 'spring', stiffness: 100 }}
                        onClick={() => onSelectTrip(option)}
                        className={`bg-white border rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedTrip === option
                            ? 'border-black ring-2 ring-black shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                        } ${selectedTrip && selectedTrip !== option ? 'opacity-40 scale-95' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-semibold text-base text-black flex items-center gap-2">
                            {option.title}
                            {selectedTrip === option && (
                              <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg">{option.budget}</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{option.description}</p>
                        {(option.hotel || option.flight) && (
                          <div className="flex flex-col gap-1 mb-3 border-t border-gray-100 pt-2">
                            {option.hotel && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                {option.hotel}
                              </div>
                            )}
                            {option.flight && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                                {option.flight}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {option.highlights?.map((h, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 font-medium">{h}</span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-[90%]">
                    <MarkdownMessage content={msg.text} streaming={msg.streaming} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator — shown only before first streaming chunk */}
        <AnimatePresence>
          {chatLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 flex-shrink-0">
                <JohnnyIcon size={32} />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking confirmation — appears after user says "Book this" */}
        <AnimatePresence>
          {bookingStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-lg"
            >
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(14)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: ['#34d399','#6ee7b7','#fbbf24','#a78bfa'][i % 4] }}
                    initial={{ x: '50%', y: '50%', opacity: 1 }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 120}%`,
                      y: `${50 + (Math.random() - 0.5) * 120}%`,
                      opacity: 0,
                      scale: [1, 1.5, 0],
                    }}
                    transition={{ duration: 1.4, delay: i * 0.05, ease: 'easeOut' }}
                  />
                ))}
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                  >
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <div>
                    <div className="font-bold text-xl text-green-900">Trip Booked Successfully! 🎉</div>
                    <div className="text-sm text-green-700">Your adventure begins soon</div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-4 mt-4">
                  <div className="text-sm text-green-900 font-medium mb-2">{bookingStatus}</div>
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Confirmation sent to your email</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Input — replaced with booked message after confirmation */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          {bookingStatus ? (
            <div className="text-center text-sm text-gray-500 py-2">
              🎉 Your trip is booked — check your email for details!
            </div>
          ) : (
          <>
            <div className="relative bg-gray-50 border border-gray-200 rounded-3xl px-5 py-3.5 flex items-end gap-2 focus-within:border-gray-400 focus-within:bg-white transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={selectedTrip ? `Ask anything, or type "Book this" to confirm...` : "Ask Johnny anything about your trip..."}
                rows="1"
                className="flex-1 border-none outline-none text-base text-black placeholder-gray-400 bg-transparent resize-none max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatLoading}
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2.5 text-center text-xs text-gray-500">
              Johnny synthesizes itineraries in under 3 seconds • Powered by Google Gemini
            </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
