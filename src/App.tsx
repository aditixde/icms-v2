import { Routes, Route } from 'react-router-dom';
import EquilibriumFinder from './components/EquilibriumFinder';
import { ExplanationPage } from './components/ExplanationPage';
import { ArchetypesPage } from './components/ArchetypesPage';
import { ArchetypeDetailsPage } from './components/ArchetypeDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EquilibriumFinder />} />
      <Route path="/explanation" element={<ExplanationPage />} />
      <Route path="/archetypes" element={<ArchetypesPage />} />
      <Route path="/archetype-details" element={<ArchetypeDetailsPage />} />
    </Routes>
  );
}

export default App;
