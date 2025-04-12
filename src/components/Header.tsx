
import React from 'react';
import { Scale, BarChart3, FileText, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
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
            <Button variant="ghost" size="sm" className="text-white hover:bg-legal-primary/60">
              <FileText className="mr-1 h-4 w-4" />
              Prediction
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-legal-primary/60">
              <BarChart3 className="mr-1 h-4 w-4" />
              Analytics
            </Button>
          </nav>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="hidden md:flex bg-legal-primary text-white border-white/20 hover:bg-legal-primary/80">
              Upload Case
            </Button>
            <Button size="sm" className="bg-legal-accent text-legal-dark hover:bg-legal-accent/90">
              New Prediction
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
