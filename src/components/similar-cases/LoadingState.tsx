
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const LoadingState: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legal-primary"></div>
          <p className="text-sm text-gray-500">Searching for similar cases...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
