import { Routes, Route } from 'react-router-dom';
import EquilibriumFinder from './components/EquilibriumFinder';
import { ExplanationPage } from './components/ExplanationPage';
import { ArchetypesPage } from './components/ArchetypesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EquilibriumFinder />} />
      <Route path="/explanation" element={<ExplanationPage />} />
      <Route path="/archetypes" element={<ArchetypesPage />} />
    </Routes>
  );
}

export default App;
