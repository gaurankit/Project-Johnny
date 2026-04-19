import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Landing from './components/Landing';
import ChatEnhanced from './components/ChatEnhanced';
import LoadingStages from './components/LoadingStages';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function App() {
  const [stage, setStage] = useState('landing');
  const [userPrompt, setUserPrompt] = useState('');
  const [tripOptions, setTripOptions] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatSessionRef = useRef(null);
  const selectedTripRef = useRef(null); // ref so sendMessage always sees latest value

  const generateTripOptions = async (prompt) => {
    setLoading(true);
    setUserPrompt(prompt);
    setStage('chat');
    setChatMessages([]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1beta' });
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const enhancedPrompt = `Based on this travel request: "${prompt}"

Generate exactly 3 different trip options in JSON format. Each option should have:
- title: A catchy name for the trip package (e.g., "Classic Parisian Romance")
- budget: Total estimated cost with currency symbol (e.g., "$2,850")
- description: 2-3 engaging sentences describing the unique experience
- highlights: Array of exactly 4 key features as short phrases (e.g., "Boutique hotel", "Seine cruise")
- hotel: A real or realistic hotel name with star rating (e.g., "Hôtel Jeanne d'Arc Le Marais ⭐⭐⭐⭐")
- flight: Realistic flight info (e.g., "Air France JFK→CDG · ~7h direct")

Make each option distinctly different in style (luxury vs budget-conscious vs authentic local).

Respond with ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "title": "Trip Name",
    "budget": "$X,XXX",
    "description": "Description here",
    "highlights": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "hotel": "Hotel Name ⭐⭐⭐⭐",
    "flight": "Airline ORIGIN→DEST · ~Xh direct"
  }
]`;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const options = JSON.parse(jsonMatch[0]);
        if (Array.isArray(options) && options.length >= 3) {
          const finalOptions = options.slice(0, 3);
          setTripOptions(finalOptions);
          initChatSession(prompt, finalOptions, model);
        } else {
          throw new Error('Invalid format');
        }
      } else {
        throw new Error('No JSON found');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      const promptLower = prompt.toLowerCase();
      let fallbackOptions = [];

      if (promptLower.includes('paris')) {
        fallbackOptions = [
          { title: "Classic Parisian Romance", budget: "$2,847", description: "Experience Paris through iconic landmarks and intimate moments. Stay in a boutique hotel in Le Marais, dine at traditional bistros, and enjoy sunset views from the Eiffel Tower.", highlights: ["Boutique hotel Le Marais", "Seine dinner cruise", "Musée d'Orsay visit", "Montmartre walking tour"], hotel: "Hôtel Jeanne d'Arc Le Marais ⭐⭐⭐⭐", flight: "Air France JFK→CDG · ~7h direct" },
          { title: "Hidden Gems of Paris", budget: "$2,650", description: "Discover Paris like a local with charming neighborhood cafés, secret gardens, and authentic experiences.", highlights: ["Local market tours", "Jazz club evening", "Canal Saint-Martin stroll", "Private wine tasting"], hotel: "Hôtel du Petit Moulin ⭐⭐⭐", flight: "Delta JFK→CDG · ~7h 30m direct" },
          { title: "Luxury Parisian Escape", budget: "$3,200", description: "Indulge in five-star accommodations and Michelin-starred dining. Experience Paris at its most elegant.", highlights: ["5-star hotel", "Michelin dining (2 meals)", "Private Louvre tour", "Champagne river cruise"], hotel: "Le Meurice ⭐⭐⭐⭐⭐", flight: "Air France JFK→CDG · ~7h direct (Business)" }
        ];
      } else if (promptLower.includes('tokyo')) {
        fallbackOptions = [
          { title: "Tokyo Family Adventure", budget: "$4,200", description: "Perfect blend of traditional culture and modern fun for families.", highlights: ["Family-friendly hotel Shibuya", "Tokyo Disneyland day", "Senso-ji Temple tour", "teamLab Borderless"], hotel: "Cerulean Tower Tokyu Hotel ⭐⭐⭐⭐⭐", flight: "JAL JFK→NRT · ~14h direct" },
          { title: "Cultural Tokyo Experience", budget: "$3,800", description: "Immerse your family in Japanese culture with hands-on activities.", highlights: ["Traditional ryokan stay", "Sushi making class", "Mt. Fuji day trip", "Kimono photo session"], hotel: "Ryokan Sawanoya ⭐⭐⭐", flight: "ANA JFK→NRT · ~14h direct" },
          { title: "Modern Tokyo Explorer", budget: "$4,500", description: "High-tech Tokyo meets family fun with robot restaurants and anime districts.", highlights: ["Robot restaurant show", "Akihabara anime tour", "Odaiba fun day", "Pokemon Center visit"], hotel: "Park Hyatt Tokyo ⭐⭐⭐⭐⭐", flight: "JAL JFK→NRT · ~14h direct (Business)" }
        ];
      } else if (promptLower.includes('bali')) {
        fallbackOptions = [
          { title: "Bali Wellness Retreat", budget: "$2,450", description: "Restore balance with daily yoga, meditation, and spa treatments in Ubud's serene jungle setting.", highlights: ["5 days yoga retreat", "Daily spa treatments", "Organic meals included", "Meditation sessions"], hotel: "Komaneka at Bisma ⭐⭐⭐⭐⭐", flight: "Singapore Airlines JFK→DPS · ~21h 1 stop" },
          { title: "Luxury Bali Sanctuary", budget: "$3,200", description: "Premium wellness experience with private villa and customized spa program.", highlights: ["Private villa & pool", "Personal wellness coach", "Luxury spa unlimited", "Healthy gourmet dining"], hotel: "Four Seasons Resort Bali at Sayan ⭐⭐⭐⭐⭐", flight: "Cathay Pacific JFK→DPS · ~20h 1 stop" },
          { title: "Authentic Bali Healing", budget: "$1,950", description: "Traditional Balinese healing practices combined with yoga and natural treatments.", highlights: ["Local homestay", "Traditional healer sessions", "Morning yoga classes", "Cooking workshops"], hotel: "Bisma Eight Ubud ⭐⭐⭐⭐", flight: "Korean Air JFK→DPS · ~22h 1 stop" }
        ];
      } else {
        fallbackOptions = [
          { title: "Classic Adventure", budget: "$2,800", description: "A well-rounded trip combining must-see attractions with authentic local experiences.", highlights: ["Mid-range hotel", "Guided city tours", "Local dining", "Transport included"], hotel: "Marriott City Center ⭐⭐⭐⭐", flight: "United · ~8h direct" },
          { title: "Budget Explorer", budget: "$1,900", description: "Smart travel choices that don't compromise on experience.", highlights: ["Boutique hostel", "Public transport passes", "Street food tours", "Free walking tours"], hotel: "Generator Hostel ⭐⭐⭐", flight: "Norse Atlantic · ~9h direct" },
          { title: "Luxury Escape", budget: "$4,200", description: "Premium accommodations, private tours, and exclusive access.", highlights: ["5-star hotel", "Private transfers", "Fine dining", "VIP experiences"], hotel: "Ritz-Carlton ⭐⭐⭐⭐⭐", flight: "British Airways · ~8h direct (Business)" }
        ];
      }

      setTripOptions(fallbackOptions);
      const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1beta' });
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      initChatSession(prompt, fallbackOptions, model);
    } finally {
      setLoading(false);
    }
  };

  const initChatSession = (prompt, options, model) => {
    const optionsSummary = options.map((o, i) =>
      `Option ${i + 1} - ${o.title} (${o.budget}): ${o.description} Highlights: ${o.highlights.join(', ')}. Hotel: ${o.hotel || 'N/A'}. Flight: ${o.flight || 'N/A'}.`
    ).join('\n');

    const session = model.startChat({
      generationConfig: {
        thinkingConfig: { thinkingBudget: 0 }, // disable thinking → true token streaming
      },
      systemInstruction: {
        parts: [{
          text: `You are Johnny, an expert travel agent at a premium travel agency. Your job is to help the customer finalise and book the perfect travel package.

Your persona:
- Warm, confident, and opinionated — like a trusted travel advisor who's done this a thousand times
- You already know the 3 packages presented to the customer (they are in your context)
- Your goal is to guide the customer toward a decision: make bold recommendations, address concerns, and close the booking when they're ready
- You lead with recommendations and assumptions — you don't wait to be asked, you proactively suggest what fits best based on what the customer said

How you behave:
- Aim for 3–6 sentences per reply — enough to be genuinely helpful, short enough to stay conversational
- Use bullet points when listing 3 or more things, otherwise stick to natural sentences
- No filler phrases ("Great question!", "Absolutely!", "Of course!")
- Speak like a human agent, not a chatbot — warm but efficient
- For questions about visa, weather, packing, flights, hotels — give specific, confident answers with real detail
- If a question deserves more depth (e.g. itinerary breakdown, cost comparison), go a little longer — but stay focused
- Make assumptions and give recommendations confidently — say "Based on what you told me, I'd go with Option 2" not "What kind of experience are you looking for?"
- If you don't have full info, make a reasonable assumption and state it — a real agent does this
- ALWAYS lead with your answer, recommendation, or information first — never open with a question
- You may end with one optional follow-up question if relevant, but only after you've fully answered
- Never respond with just a question — every reply must contain a real answer or recommendation
- Steer the conversation toward confirming a package naturally — don't wait for the customer to decide on their own
- When they say "Book this" or similar, respond with genuine excitement and confirm the key details
- When the customer asks for more options, the system will automatically fetch 3 new packages and display them — you just need to acknowledge enthusiastically and invite them to explore
- Never be stuck — a good agent always has more options up their sleeve`
        }]
      },
      history: [
        {
          role: 'user',
          parts: [{ text: `I'm looking for travel options: "${prompt}"` }]
        },
        {
          role: 'model',
          parts: [{ text: `Here are 3 itineraries for you:\n\n${optionsSummary}\n\nAsk me anything about these options!` }]
        }
      ]
    });
    chatSessionRef.current = session;
  };

  const fetchCardData = async (message, cardType) => {
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setChatLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1beta' });
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const relevantPackage = selectedTripRef.current || tripOptions[0];
      const packageContext = relevantPackage
        ? `Package: ${relevantPackage.title} (${relevantPackage.budget}). Hotel: ${relevantPackage.hotel}. Flight: ${relevantPackage.flight}.`
        : `Packages available: ${tripOptions.map(o => `${o.title} — Hotel: ${o.hotel}, Flight: ${o.flight}`).join(' | ')}`;

      const hotelPrompt = `${packageContext}
The user asked: "${message}"

Return ONLY valid JSON (no markdown) for a hotel card. Use REAL values from the package context — do NOT use placeholders like XXX. Estimate nightly rate as roughly 15-20% of total package budget divided by 7 nights.

{
  "card": {
    "type": "hotel",
    "name": "exact hotel name from package",
    "location": "City, Country",
    "stars": 4,
    "pricePerNight": "realistic nightly rate e.g. $320",
    "rating": 9.1,
    "reviewCount": "realistic review count e.g. 2,847",
    "amenities": ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym"],
    "description": "One vivid sentence about this specific hotel.",
    "imageKeyword": "luxury hotel city name"
  },
  "message": "2-3 sentence response from Johnny about this hotel"
}`;

      const flightPrompt = `${packageContext}
The user asked: "${message}"

Return ONLY valid JSON (no markdown) for a flight card. Use REAL values from the package context above — do NOT use placeholders like XXX. Estimate the flight cost as roughly 30-40% of the total package budget.

{
  "card": {
    "type": "flight",
    "airline": "real airline name parsed from the flight info",
    "from": "3-letter origin airport code",
    "fromCity": "origin city name",
    "to": "3-letter destination airport code",
    "toCity": "destination city name",
    "departure": "realistic departure time e.g. 9:45 PM",
    "arrival": "realistic arrival time e.g. 11:30 AM",
    "arrivalDay": "+1 or empty string if same day",
    "duration": "realistic duration from flight info",
    "stops": "Direct or 1 Stop",
    "class": "Economy",
    "aircraft": "realistic aircraft type e.g. Boeing 777-300ER",
    "price": "estimated flight cost as dollars e.g. $850"
  },
  "message": "2-3 sentence response from Johnny about this flight"
}`;

      const result = await model.generateContent(cardType === 'hotel' ? hotelPrompt : flightPrompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setChatMessages(prev => [...prev,
          { role: 'assistant', type: `${cardType}-card`, data: parsed.card, streaming: false },
          { role: 'assistant', text: parsed.message, streaming: false }
        ]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (err) {
      console.error('Card fetch error:', err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: "I couldn't load the card right now, but I'm happy to tell you more — just ask!",
        streaming: false
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const refreshTripOptions = async (message) => {
    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setChatLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY, { apiVersion: 'v1beta' });
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const seenTitles = tripOptions.map(o => o.title).join(', ');
      const refreshPrompt = `Based on this travel request: "${userPrompt}"

The customer has already seen these options and wants different ones: ${seenTitles}

Generate 3 FRESH and DIFFERENT trip options. Each option must have:
- title, budget, description, highlights (array of 4), hotel (name + stars), flight (airline + route + duration)

Make each distinctly different in style. Respond with ONLY a valid JSON array, no markdown.`;

      const result = await model.generateContent(refreshPrompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const newOptions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(newOptions) && newOptions.length >= 3) {
          const finalOptions = newOptions.slice(0, 3);

          // Stack new options as a chat message — no reset, no session restart
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            type: 'new-options',
            options: finalOptions,
            text: "Here are 3 more options — different styles, fresh picks:",
            streaming: false
          }]);

          return;
        }
      }
      throw new Error('Could not parse new options');
    } catch (err) {
      console.error('Refresh error:', err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: "Sorry, I had trouble fetching new options right now. Tell me what you're after and I'll tailor something.",
        streaming: false
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async (message) => {
    if (!chatSessionRef.current || !message.trim()) return;

    // Detect hotel/flight card request
    const isHotelQuery = /\b(hotel|stay|accommodation|room|where.*stay|check.?in|lodging|property)\b/i.test(message);
    const isFlightQuery = /\b(flight|fly|airline|airport|depart|arriv|take.?off|plane|flying|airways)\b/i.test(message);

    if (isHotelQuery || isFlightQuery) {
      await fetchCardData(message, isHotelQuery ? 'hotel' : 'flight');
      return;
    }

    // Detect "show me more options" intent → fresh card generation
    const isMoreOptionsRequest = /show\s*me\s*(more|other|different|new)(\s*(options?|packages?|trips?|choices?))?|(more|other|different|new)\s*(options?|packages?|trips?|choices?)|anything\s*(else|different|other)/i.test(message);
    if (isMoreOptionsRequest) {
      await refreshTripOptions(message);
      return;
    }

    // Detect "Book this" intent
    const isBookingRequest = /\bbook\s*(this|it|now|trip)\b|confirm\s*(this|booking|trip)\b/i.test(message);
    if (isBookingRequest && selectedTripRef.current) {
      const trip = selectedTripRef.current;
      setChatMessages(prev => [...prev, { role: 'user', text: message }]);
      setTimeout(() => {
        setBookingStatus(
          `Your "${trip.title}" has been confirmed! Check your email for complete itinerary and booking details. Total investment: ${trip.budget}`
        );
      }, 600);
      return;
    }

    setChatMessages(prev => [...prev, { role: 'user', text: message }]);
    setChatLoading(true);

    // Add a placeholder assistant message that will be filled by the stream
    setChatMessages(prev => [...prev, { role: 'assistant', text: '', streaming: true }]);

    try {
      const result = await chatSessionRef.current.sendMessageStream(message);
      let fullText = '';
      let firstChunk = true;

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (!chunkText) continue;
        fullText += chunkText;

        // flushSync forces React to paint each chunk immediately
        // instead of batching them all into one render at the end
        flushSync(() => {
          if (firstChunk) {
            setChatLoading(false);
            firstChunk = false;
          }
          setChatMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', text: fullText, streaming: true };
            return updated;
          });
        });
      }

      // Mark streaming complete
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: fullText, streaming: false };
        return updated;
      });
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', text: "Sorry, I ran into an issue. Please try again!", streaming: false };
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    selectedTripRef.current = trip;
    // Tell Gemini the user picked this option — Gemini responds naturally
    sendMessage(`I'd like to go with the "${trip.title}" option (${trip.budget}).`);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header onHome={() => {
        setStage('landing');
        setTripOptions([]);
        setSelectedTrip(null);
        setBookingStatus('');
        setChatMessages([]);
        setUserPrompt('');
        selectedTripRef.current = null;
        chatSessionRef.current = null;
      }} />

      {stage === 'landing' && (
        <Landing onSubmit={generateTripOptions} />
      )}

      {stage === 'chat' && (
        <ChatEnhanced
          userPrompt={userPrompt}
          tripOptions={tripOptions}
          onSelectTrip={handleSelectTrip}
          selectedTrip={selectedTrip}
          bookingStatus={bookingStatus}
          chatMessages={chatMessages}
          chatLoading={chatLoading}
          onSendMessage={sendMessage}
        />
      )}

      <AnimatePresence>
        {loading && <LoadingStages />}
      </AnimatePresence>
    </div>
  );
}

export default App;
