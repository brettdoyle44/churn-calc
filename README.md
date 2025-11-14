# ChurnGuard - Shopify Churn Cost Calculator

ChurnGuard is a powerful web application that helps Shopify store owners calculate the true cost of customer churn and receive AI-powered recommendations to improve retention.

## Features

- 📊 **Accurate Churn Calculations** - Calculate monthly and annual churn costs, customer lifetime value, and retention metrics
- 🤖 **AI-Powered Analysis** - Get personalized insights and recommendations powered by Claude AI
- 📈 **Visual Projections** - See 12-month cost projections and potential savings
- 🏢 **Industry Benchmarks** - Compare your metrics against industry standards
- 📧 **Email Capture** - Integrated with HubSpot for lead generation

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Charts**: Recharts
- **AI**: Anthropic Claude API
- **CRM**: HubSpot API

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Anthropic API key (optional, falls back to rule-based analysis)
- HubSpot access token (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd churn-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_HUBSPOT_ACCESS_TOKEN=your_token_here
VITE_HUBSPOT_PORTAL_ID=your_portal_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CalculatorForm.tsx
│   ├── EmailCaptureForm.tsx
│   ├── ResultsDisplay.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Page components
│   ├── CalculatorPage.tsx
│   └── ResultsPage.tsx
├── contexts/           # React context providers
│   └── CalculatorContext.tsx
├── utils/              # Utility functions
│   ├── calculations.ts
│   ├── aiAnalysis.ts
│   ├── fallbackAnalysis.ts
│   ├── hubspot.ts
│   └── prompts.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How It Works

1. **Input Collection**: Users enter their business metrics (AOV, customer count, churn rate, industry, business model)
2. **Calculations**: The app calculates key metrics including:
   - Monthly and annual churn costs
   - Customer lifetime value
   - Retention rate
   - Potential recovery amounts
3. **AI Analysis**: If an Anthropic API key is provided, Claude analyzes the data and generates:
   - Executive summary
   - Key insights
   - Actionable recommendations
   - Industry comparisons
   - Urgency assessment
4. **Results Display**: Users see visualizations and detailed analysis
5. **Email Capture**: Optional email submission for full report (integrated with HubSpot)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ANTHROPIC_API_KEY` | No | API key for Claude AI analysis (falls back to rule-based if not provided) |
| `VITE_HUBSPOT_ACCESS_TOKEN` | No | HubSpot access token for CRM integration |
| `VITE_HUBSPOT_PORTAL_ID` | No | HubSpot portal ID |

## Customization

### Tailwind Colors

The app uses custom color themes defined in `tailwind.config.js`:
- **Primary**: Indigo (`#6366f1`)
- **Accent**: Emerald (`#10b981`)
- **Warning**: Red (`#ef4444`)

### Industry Options

Add or modify industries in `src/components/CalculatorForm.tsx`:
```tsx
<option value="Your Industry">Your Industry</option>
```

### Fallback Analysis

If you're not using the AI API, customize the rule-based analysis in `src/utils/fallbackAnalysis.ts`.

## Deployment

### Build for production:
```bash
npm run build
```

The `dist` folder will contain the production-ready files.

### Deploy to Vercel, Netlify, or any static host:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Security Notes

⚠️ **Important**: The Anthropic API is currently configured with `dangerouslyAllowBrowser: true` for development. In production, you should:

1. Create a backend API route to handle AI requests
2. Store API keys securely on the server
3. Never expose API keys in the browser

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
