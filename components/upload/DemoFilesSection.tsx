"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

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
	onDemoFileUpload: (file: File) => void;
	isLoading: boolean;
}

export function DemoFilesSection({
	onDemoFileUpload,
	isLoading,
}: DemoFilesSectionProps) {
	const t = useTranslations("HomePage.demo");

	const handleCardClick = async (filePath: string, fileName: string) => {
		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Could not fetch demo file: ${response.statusText}`);
			}
			const blob = await response.blob();
			const demoFile = new File([blob], fileName, { type: "application/pdf" });
			onDemoFileUpload(demoFile);
		} catch {
			// Optionally handle error (toast, etc.)
		}
	};

	return (
		<div className="max-w-4xl mx-auto mt-12 mb-8 text-left">
			<div className="flex items-center gap-3 mb-6">
				<PlayCircle className="w-6 h-6 text-yellow-600 dark:text-[#FBBF24]" />
				<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					{t("title")}
				</h3>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{demoFiles.map((file) => (
					<Card
						key={file.path}
						className="dark:bg-gray-800/50 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-colors cursor-pointer"
						onClick={() => handleCardClick(file.path, file.name + ".pdf")}
						tabIndex={0}
						role="button"
						aria-label={file.name}
					>
						<CardContent className="p-4 flex flex-col items-start justify-between h-full">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-1">
									{/* Use the same red icon as upload preview */}
									<svg
										className="w-6 h-6 text-red-600 dark:text-red-400/50"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<p className="font-medium text-gray-900 dark:text-white mb-0">
									{file.name}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}