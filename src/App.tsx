import { Routes, Route } from 'react-router-dom';
import { ArchetypesPage } from './components/ArchetypesPage';
import { ArchetypeDetailsPage } from './components/ArchetypeDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ArchetypesPage />} />
      <Route path="/archetype-details" element={<ArchetypeDetailsPage />} />
    </Routes>
  );
}

export default App;
