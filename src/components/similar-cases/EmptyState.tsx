
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const EmptyState: React.FC = () => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="text-gray-500 text-center">No similar cases found</div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
