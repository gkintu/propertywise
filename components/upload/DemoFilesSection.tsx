"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverLiftMotion } from "@/components/motion";

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
	const [isFetching, setIsFetching] = useState(false);
	const isDisabled = isLoading || isFetching;

	const handleCardClick = async (filePath: string) => {
		if (isDisabled) return;
		setIsFetching(true);
		try {
			const fileName = filePath.split("/").pop() || "demo-file.pdf";
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Could not fetch demo file: ${response.statusText}`);
			}
			const blob = await response.blob();
			const demoFile = new File([blob], fileName, { type: "application/pdf" });
			onDemoFileUpload(demoFile);
		} catch (error) {
			console.error("Failed to load demo file:", error);
			// Optionally, show a toast notification to the user here
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto mt-12 mb-8 text-left">
			<div className="flex items-center gap-3 mb-6">
				<span className="relative group" tabIndex={0}>
					<Info className="w-6 h-6 text-yellow-600 dark:text-[#FBBF24]" />
					<span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs rounded px-3 py-1 shadow-lg z-10 w-max max-w-xs">
						{t("tooltip")}
					</span>
				</span>
				<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					{t("title")}
				</h3>
			</div>
			<div
				className={cn(
					"grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity",
					isDisabled && "opacity-60"
				)}
			>
				{demoFiles.map((file) => (
					<HoverLiftMotion key={file.path}>
						<Card
							className={cn(
								"dark:bg-gray-800/50 transition-colors",
								!isDisabled &&
									"cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500/50",
								isDisabled && "cursor-not-allowed"
							)}
							onClick={() => handleCardClick(file.path)}
							tabIndex={isDisabled ? -1 : 0}
							role="button"
							aria-disabled={isDisabled}
							aria-label={file.name}
						>
							<CardContent className="p-4 flex flex-col items-start justify-between h-full">
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 mt-1">
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
					</HoverLiftMotion>
				))}
			</div>
		</div>
	);
}
