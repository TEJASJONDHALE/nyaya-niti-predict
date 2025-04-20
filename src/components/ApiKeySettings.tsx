
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ApiKeySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('perplexityApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('perplexityApiKey', apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-medium">Perplexity AI Settings</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Enter your Perplexity AI API key to enable predictions
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
