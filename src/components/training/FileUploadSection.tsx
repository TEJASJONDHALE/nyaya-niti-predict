
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadSectionProps {
  csvFile: File | null;
  setCsvFile: (file: File | null) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ csvFile, setCsvFile }) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv') {
        toast({
          title: 'Invalid File',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        });
        return;
      }
      setCsvFile(file);
      toast({
        title: 'File Selected',
        description: `${file.name} selected for training.`,
      });
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center">
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Upload CSV file with case data
        </p>
        <input
          type="file"
          id="csvUpload"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Label
          htmlFor="csvUpload"
          className="cursor-pointer px-4 py-2 bg-legal-primary text-white rounded-md hover:bg-legal-primary/90 transition-colors"
        >
          Select File
        </Label>
      </div>
      {csvFile && (
        <div className="mt-4 text-sm text-gray-600">
          Selected: {csvFile.name}
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
