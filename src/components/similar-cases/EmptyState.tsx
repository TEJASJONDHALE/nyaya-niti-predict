import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="text-gray-500 text-center">
          <Info className="h-6 w-6 mx-auto mb-2 text-blue-500" />
          <div className="font-medium">No similar cases found</div>
          <p className="text-sm mt-1">
            We couldn't find any matching case precedents from the eCourt service via Gemini AI. Try a different outcome or check again later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
