# Johnny Demo - AI Travel Assistant

A demo React app showcasing Johnny's AI-powered travel planning capabilities using Google Gemini.

## Features

- ✅ Clean, minimal UI matching Grok's design aesthetic
- ✅ Real-time trip generation using Google Gemini AI
- ✅ 3 personalized trip options generated from user input
- ✅ Interactive trip selection and mock booking
- ✅ Smooth animations and transitions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### 3. Configure API Key

Open `src/App.jsx` and replace:
```javascript
const API_KEY = 'YOUR_GEMINI_API_KEY';
```

With your actual API key:
```javascript
const API_KEY = 'AIzaSy...your-key-here';
```

**Note:** For production, use environment variables instead.

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

### User Flow

1. **Landing Page** → User enters travel prompt
2. **Gemini generates** → 3 trip options created in real-time
3. **User selects** → Clicks preferred option
4. **Mock booking** → Confirmation message displayed

### Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Google Gemini AI** - Trip generation

### API Integration

The app calls Gemini with a structured prompt:

```javascript
const enhancedPrompt = `Based on this travel request: "${userInput}"
Generate exactly 3 different trip options in JSON format...`;
```

Gemini returns 3 options with:
- Title (catchy trip name)
- Budget (estimated cost)
- Description (2-3 sentences)
- Highlights (3-4 key features)

## Deployment

### Option 1: Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Option 2: Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

## File Structure

```
johnny-demo/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Top navigation
│   │   ├── Landing.jsx         # Initial input screen
│   │   ├── Chat.jsx            # Trip options display
│   │   └── JohnnyIcon.jsx      # Custom icon component
│   ├── App.jsx                 # Main app logic + Gemini integration
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Change Prompt Engineering

Edit the `enhancedPrompt` in `App.jsx` to customize how Gemini generates trips:

```javascript
const enhancedPrompt = `Based on: "${prompt}"
Your custom instructions here...`;
```

### Fallback Options

If Gemini API fails, the app shows hardcoded fallback options. Edit these in `App.jsx`:

```javascript
setTripOptions([
  { title: "...", budget: "...", ... }
]);
```

### Styling

Colors and spacing use Tailwind classes. Edit directly in JSX:

```jsx
className="bg-gray-50 text-black rounded-xl p-4"
```

## Demo Tips

### For Client Presentations

1. **Pre-load examples**: Test with common prompts beforehand
2. **Have fallbacks ready**: If API is slow, fallback options look identical
3. **Show the flow**: Landing → Options → Booking
4. **Emphasize speed**: "Under 3 seconds" messaging

### Example Prompts

- "Romantic weekend in Paris, $3000 budget"
- "Family trip to Tokyo, 7 days, cultural experiences"
- "Beach vacation in Bali, wellness-focused, $2500"
- "Adventure trip to Iceland, Northern Lights, 5 days"

## Troubleshooting

### API Key Issues

- Ensure API key is valid
- Check quotas in Google AI Studio
- Verify key permissions

### CORS Errors

- Gemini API supports direct browser calls
- No proxy needed for this demo

### JSON Parsing Fails

- Gemini sometimes returns markdown
- Fallback options kick in automatically

## Next Steps (Production)

For actual implementation:

1. **Backend API**: Move Gemini calls to server
2. **Authentication**: Add user accounts
3. **Real booking**: Integrate GDS/booking APIs
4. **Payment**: Add Stripe/payment gateway
5. **Database**: Store trips and user data
6. **Rate limiting**: Protect API usage

## License

MIT - Demo purposes only
