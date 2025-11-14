# ChurnGuard - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd churn-calculator
npm install
```

### 2. Set Up Environment (Optional)
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
```env
VITE_ANTHROPIC_API_KEY=your_api_key_here  # Optional - Falls back to rule-based analysis
VITE_HUBSPOT_ACCESS_TOKEN=your_token_here # Optional
VITE_HUBSPOT_PORTAL_ID=your_portal_id     # Optional
```

**Note:** The app works without API keys! It will use intelligent fallback analysis if no Anthropic API key is provided.

### 3. Run the Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## 📦 Project Structure

```
churn-calculator/
├── src/
│   ├── components/          # UI Components
│   │   ├── CalculatorForm.tsx
│   │   ├── EmailCaptureForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── LoadingSpinner.tsx
│   ├── pages/              # Page Views
│   │   ├── CalculatorPage.tsx
│   │   └── ResultsPage.tsx
│   ├── contexts/           # React Context
│   │   └── CalculatorContext.tsx
│   ├── utils/              # Business Logic
│   │   ├── calculations.ts
│   │   ├── aiAnalysis.ts
│   │   ├── fallbackAnalysis.ts
│   │   ├── hubspot.ts
│   │   └── prompts.ts
│   └── types/              # TypeScript Types
│       └── index.ts
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # Full documentation
```

## 🛠️ Available Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎨 Features

✅ **Calculator Form** - Input business metrics  
✅ **Real-time Calculations** - Instant churn cost analysis  
✅ **AI-Powered Insights** - Claude AI recommendations (optional)  
✅ **Fallback Analysis** - Smart rule-based analysis if no API key  
✅ **Visual Charts** - 12-month cost projections  
✅ **Email Capture** - HubSpot integration (optional)  
✅ **Responsive Design** - Mobile-friendly UI  
✅ **TypeScript** - Full type safety  

## 🎯 Usage Flow

1. User enters business metrics (AOV, customers, churn rate, etc.)
2. App calculates key metrics (monthly/annual costs, CLV, etc.)
3. AI generates personalized insights and recommendations
4. User sees visual results with charts and actionable advice
5. Optional email capture for detailed report

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js` to customize the theme colors:
- Primary (indigo): `#6366f1`
- Accent (emerald): `#10b981`
- Warning (red): `#ef4444`

### Add Industries
Edit `src/components/CalculatorForm.tsx` to add more industry options.

### Modify Analysis
Edit `src/utils/fallbackAnalysis.ts` to customize the rule-based analysis logic.

## 📱 Production Deployment

Build the app:
```bash
npm run build
```

The `dist/` folder contains production-ready static files.

Deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **Any static host**: Upload `dist/` folder

## ⚠️ Important Security Note

For production, move API calls to a backend:
1. Create a server-side API route
2. Store API keys on the server
3. Never expose keys in the browser

## 📝 License

MIT License - Use freely for your projects!

---

**Need Help?** Check the full [README.md](./README.md) for detailed documentation.

