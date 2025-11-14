import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CalculatorProvider } from './contexts/CalculatorContext';
import CalculatorPage from './pages/CalculatorPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <CalculatorProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Router>
    </CalculatorProvider>
  );
}

export default App;
