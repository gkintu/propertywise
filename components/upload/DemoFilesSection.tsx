"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "@/components/customized/spinner/spinner-05";

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
	isLoading: boolean; // This prop represents the PARENT's loading state (i.e., when analysis is running).
}

export function DemoFilesSection({
	onDemoFileUpload,
	isLoading,
}: DemoFilesSectionProps) {
	const t = useTranslations("HomePage.demo");

	// CHANGE: Added local state to track which specific demo file is being fetched.
	// WHY: This provides immediate feedback to the user on the card they clicked, independent of the parent's analysis state.
	const [fetchingPath, setFetchingPath] = useState<string | null>(null);

	const handleCardClick = async (filePath: string, displayName: string) => {
		// Prevent multiple fetches if one is already in progress.
		if (fetchingPath || isLoading) return;

		setFetchingPath(filePath);

		try {
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error(`Could not fetch demo file: ${response.statusText}`);
			}
			const blob = await response.blob();

			// CHANGE: The filename is now robustly derived from the path.
			// WHY: This prevents errors from manual naming mismatches and ensures the File object has the correct name.
			const fileName = filePath.split("/").pop() || displayName;
			const demoFile = new File([blob], fileName, { type: "application/pdf" });

			onDemoFileUpload(demoFile);
		} catch (error) {
			// CHANGE: Added user-facing error handling.
			// WHY: If the fetch fails, the user needs to be notified. The original empty catch block provided no feedback.
			console.error("Failed to fetch demo file:", error);
			toast.error(t("fetchError"));
		} finally {
			// CHANGE: Ensure fetching state is always reset.
			// WHY: Using a 'finally' block guarantees that the UI returns to a normal state, even if an error occurred.
			setFetchingPath(null);
		}
	};

	const isAnyActionInProgress = isLoading || !!fetchingPath;

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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{demoFiles.map((file) => (
					<Card
						key={file.path}
						className={`dark:bg-gray-800/50 transition-colors ${
							isAnyActionInProgress
								? "cursor-not-allowed opacity-50"
								: "cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-500/50"
						}`} // CHANGE: Added dynamic classes to disable the card visually.
						onClick={() => handleCardClick(file.path, file.name)}
						// CHANGE: Added onKeyDown for better accessibility.
						// WHY: This makes the component fully keyboard-navigable, behaving like a true button for users who can't use a mouse.
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleCardClick(file.path, file.name);
							}
						}}
						tabIndex={isAnyActionInProgress ? -1 : 0} // CHANGE: Card is not focusable when disabled.
						role="button"
						aria-label={file.name}
						aria-disabled={isAnyActionInProgress} // CHANGE: Semantically disable the button for screen readers.
					>
						<CardContent className="p-4 flex flex-col items-start justify-between h-full">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-1 w-6 h-6 flex items-center justify-center">
									{/* CHANGE: Show a spinner on the specific card being fetched. */}
									{/* WHY: This provides clear, targeted feedback about which action is in progress. */}
									{fetchingPath === file.path ? (
										<Spinner size="sm" />
									) : (
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
									)}
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
