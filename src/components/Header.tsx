import React from 'react';
import { Scale, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onNewPrediction: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewPrediction }) => {
  const { signOut } = useAuth();

  return (
    <header className="bg-legal-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-7 w-7 text-legal-accent" />
            <span className="text-xl font-bold">Nyaya-Niti Predict</span>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-legal-primary/60">
              <Home className="mr-1 h-4 w-4" />
              Dashboard
            </Button>
          </nav>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="text-white hover:bg-legal-primary/60 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button 
              size="sm" 
              className="bg-legal-accent text-legal-dark hover:bg-legal-accent/90"
              onClick={onNewPrediction}
            >
              New Prediction
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
