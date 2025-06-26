"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlayCircle } from "lucide-react";

// Define the list of demo files here
const demoFiles = [
  {
    name: "Alv Johnsens vei 1 - Drammen",
    path: "/demo-pdfs/Alv Johnsens vei 1 - Drammen - Salgsoppgave.pdf",
  },
  {
    name: "Bolette brygge 5 - Oslo",
    path: "/demo-pdfs/Bolette brygge 5 - Oslo - salgsoppgave.pdf",
  },
  {
    name: "Sanengveien 1 - Fredrikstad",
    path: "/demo-pdfs/Sanengveien 1 - Fredrikstad - salgsoppgave.pdf",
  },
];

interface DemoFilesSectionProps {
  onDemoFileSelect: (filePath: string, fileName: string) => void;
  isLoading: boolean;
}

export function DemoFilesSection({ onDemoFileSelect, isLoading }: DemoFilesSectionProps) {
  const t = useTranslations("HomePage.demo");

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-8 text-left">
      <div className="flex items-center gap-3 mb-6">
        <PlayCircle className="w-6 h-6 text-yellow-600 dark:text-[#FBBF24]" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {t('title')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoFiles.map((file) => (
          <Card key={file.path} className="dark:bg-gray-800/50 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-start justify-between h-full">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                        <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white mb-4">
                        {file.name}
                    </p>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-yellow-600 dark:text-[#FBBF24] hover:text-yellow-700 dark:hover:text-[#F59E0B]"
                    onClick={() => onDemoFileSelect(file.path, file.name + ".pdf")}
                    disabled={isLoading}
                >
                    {t('analyzeButton')}
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}