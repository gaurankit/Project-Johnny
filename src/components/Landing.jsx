import { useState } from 'react';
import JohnnyIcon from './JohnnyIcon';
import ExamplePrompts from './ExamplePrompts';

export default function Landing({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleSelect = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-12">
        <JohnnyIcon size={48} />
        <div className="text-4xl font-semibold text-black tracking-tight">Johnny</div>
      </div>
      
      <div className="w-full max-w-2xl relative">
        <div className="relative bg-white border border-gray-300 rounded-3xl px-14 py-4 flex items-center focus-within:border-gray-400 focus-within:shadow-sm transition">
          <svg 
            className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
          </svg>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Where would you like to go?"
            className="flex-1 border-none outline-none text-base text-black placeholder-gray-400 bg-transparent"
          />
          
          <div className="flex items-center gap-2 absolute right-3 top-1/2 -translate-y-1/2">
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-black cursor-pointer hover:bg-gray-100">
              Auto
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <rect x="2" y="8" width="3" height="8" rx="1.5"/>
                <rect x="7" y="4" width="3" height="16" rx="1.5"/>
                <rect x="12" y="10" width="3" height="4" rx="1.5"/>
                <rect x="17" y="6" width="3" height="12" rx="1.5"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-center text-xs text-gray-500">
          Johnny synthesizes itineraries in under 3 seconds
        </div>
      </div>

      {/* Example Prompts */}
      <ExamplePrompts onSelect={handleExampleSelect} />
    </div>
  );
}
