# CalculatorForm Component Usage

## Overview

The `CalculatorForm` component is a fully-featured, beautiful form built with React Hook Form, Tailwind CSS, and TypeScript. It collects churn calculator inputs from users with real-time validation, auto-formatting, and helpful tooltips.

## Features

✅ **Form Management**: Built with `react-hook-form` for optimal performance and validation  
✅ **Auto-formatting**: Currency fields auto-format with $ and commas, number fields format with commas  
✅ **Real-time Validation**: Validates on blur and submit with helpful error messages  
✅ **Tooltips**: Info icons with tooltips using `@headlessui/react` Popover  
✅ **Responsive Design**: Mobile-first design that looks great on all screen sizes  
✅ **Loading States**: Submit button shows loading spinner during submission  
✅ **Collapsible Section**: Advanced options collapse/expand smoothly  
✅ **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation  

## Usage

```tsx
import CalculatorForm from './components/CalculatorForm';
import { CalculatorInputs } from './types';

function MyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CalculatorInputs) => {
    setIsSubmitting(true);
    
    try {
      // data will contain:
      // - averageOrderValue: number
      // - numberOfCustomers: number
      // - purchaseFrequency: number
      // - churnRate: number (defaults to 75 if user left blank)
      // - customerAcquisitionCost?: number (optional)
      // - grossMargin?: number (optional)
      
      console.log('Form data:', data);
      
      // Perform your calculations or API calls here
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Calculate Your Churn Cost</h2>
      <CalculatorForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
```

## Integration with Context

```tsx
import { useCalculator } from '../contexts/CalculatorContext';
import { useNavigate } from 'react-router-dom';
import { calculateChurnMetrics } from '../utils/calculations';

function CalculatorPage() {
  const navigate = useNavigate();
  const { setCalculatorInputs, setCalculatorResults } = useCalculator();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CalculatorInputs) => {
    setIsSubmitting(true);
    
    try {
      // Save inputs to context
      setCalculatorInputs(data);
      
      // Calculate results
      const results = calculateChurnMetrics(data);
      setCalculatorResults(results);
      
      // Navigate to next step (e.g., email capture)
      navigate('/email-capture');
      
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Calculate Your Churn Cost
      </h2>
      <CalculatorForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
```

## Form Fields

### Required Fields

1. **Average Order Value ($)**
   - Auto-formats with $ and commas
   - Minimum: $1
   - Example: $85

2. **Total Customers**
   - Auto-formats with commas
   - Minimum: 1
   - Example: 5,000

3. **Purchase Frequency (per year)**
   - Decimal allowed (step: 0.1)
   - Minimum: 0.1
   - Default: 2
   - Example: 2.5

### Optional Fields

4. **Current Churn Rate (%)**
   - Defaults to 75% if left blank
   - Includes tooltip with industry benchmark info
   - Range: 0-100%

### Advanced Options (Collapsible)

5. **Customer Acquisition Cost ($)**
   - Optional
   - Auto-formats with $ and commas
   - Example: $50

6. **Gross Margin (%)**
   - Optional
   - Range: 0-100%
   - Example: 40

## Styling

The component uses Tailwind CSS utility classes and includes:
- Focus ring effects on inputs
- Smooth transitions on all interactions
- Error states with red highlighting
- Hover effects on interactive elements
- Custom fade-in animation for collapsible section

## Custom Animations

The component includes a fade-in animation defined in `index.css`:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

## Props

```typescript
interface CalculatorFormProps {
  onSubmit: (data: CalculatorInputs) => void;
  isSubmitting?: boolean;
}
```

- `onSubmit`: Callback function called when form is valid and submitted
- `isSubmitting`: Optional boolean to show loading state on submit button

## Validation Rules

- All required fields must be filled
- Average Order Value must be ≥ $1
- Total Customers must be ≥ 1
- Purchase Frequency must be ≥ 0.1
- Churn Rate (if provided) must be 0-100%
- Customer Acquisition Cost (if provided) must be ≥ 0
- Gross Margin (if provided) must be 0-100%

## Data Formatting

The component handles formatting internally:
- Currency inputs: User can type "85" and it displays as "$85"
- Large numbers: User can type "5000" and it displays as "5,000"
- On submit, all formatted strings are parsed back to numbers
- Empty churn rate automatically defaults to 75

## Dependencies

- `react-hook-form@^7.66.0`: Form state management and validation
- `@heroicons/react@^2.2.0`: Icons (InformationCircle, ChevronDown, ChevronUp)
- `@headlessui/react@^2.2.9`: Accessible UI components (Popover for tooltips)
- `tailwindcss@^3.4.17`: Utility-first CSS framework

## Accessibility

- All inputs have proper labels with `htmlFor` attributes
- Required fields marked with asterisk and `aria-required`
- Error messages associated with inputs
- Keyboard navigation fully supported
- Focus states clearly visible
- Tooltips accessible via keyboard

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Flexbox
- ES6+ JavaScript features
- CSS custom properties (for Tailwind)

