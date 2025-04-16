
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="text-red-500 text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
