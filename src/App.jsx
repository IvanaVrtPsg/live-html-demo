import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import WorkflowCreator from './pages/WorkflowCreator/WorkflowCreator

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        
        <Routes>
          <Route path="/" element={<WorkflowCreator />} />
          <Route path="/workflow-creator" element={<WorkflowCreator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;