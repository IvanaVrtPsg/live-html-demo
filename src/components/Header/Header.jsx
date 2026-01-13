import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';

// Inside your Header component:
function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Your existing header content */}
      
      {/* Add this button wherever you want in your header */}
      <button 
        onClick={() => navigate('/workflow-creator')}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition-colors"
      >
        <Workflow size={20} />
        <span>Workflow Creator</span>
      </button>
      
      {/* Rest of your header content */}
    </header>
  );
}

export default Header;
