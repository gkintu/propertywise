import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PropertyAnalysis } from "@/lib/types";
import { TranslationFunction } from "@/lib/i18n-types";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  HomeIcon,
  MapPinIcon,
  TrendingUpIcon,
  InfoIcon,
  FileTextIcon,
  Maximize2Icon,
  CalendarIcon,
  pdfDefectIcons,
} from "./icons";

/**
 * Props interface for the AnalysisReportPDF component
 */
interface AnalysisReportPDFProps {
  analysisData: PropertyAnalysis;
  t: TranslationFunction;
  isDarkMode?: boolean;
  locale?: "en" | "no";
}

/**
 * Type for react-pdf StyleSheet styles
 */
type PDFStyles = ReturnType<typeof createStyles>;

/**
 * Type for icon colors configuration
 */
type IconColors = ReturnType<typeof getIconColors>;

/**
 * Create theme-aware styles for the PDF document
 * Follows the same color scheme as the web page for consistency
 */
const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    // Page container
    page: {
      flexDirection: "column",
      backgroundColor: isDarkMode ? "#111827" : "#FFFFFF",
      padding: "0 30 30 30",
      fontFamily: "Helvetica",
      color: isDarkMode ? "#F9FAFB" : "#111827",
      fontSize: 12,
      lineHeight: 1.4,
    },

    // Header section with PropertyWise branding
    brandHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 24,
      paddingBottom: 16,
      borderBottom: `1 solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
      gap: 8,
    },

    brandText: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#F9FAFB" : "#111827",
    },

    // Main title section
    titleSection: {
      marginBottom: 24,
    },

    mainTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#F9FAFB" : "#111827",
      marginBottom: 8,
      lineHeight: 1.2,
    },

    subtitle: {
      fontSize: 11,
      color: isDarkMode ? "#D1D5DB" : "#6B7280",
      marginBottom: 4,
    },

    // Card components (matching web page cards)
    card: {
      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
      border: `1 solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#F9FAFB" : "#111827",
    },

    cardContent: {
      fontSize: 12,
      lineHeight: 1.6,
      color: isDarkMode ? "#D1D5DB" : "#374151",
    },

    // Market position section (blue themed)
    marketPositionBox: {
      backgroundColor: isDarkMode ? "#1e3a8a33" : "#EFF6FF",
      border: `1 solid ${isDarkMode ? "#1e40af" : "#DBEAFE"}`,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
    },

    marketPositionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDarkMode ? "#93C5FD" : "#1E3A8A",
      marginBottom: 8,
    },

    marketPositionText: {
      fontSize: 12,
      color: isDarkMode ? "#BFDBFE" : "#1E40AF",
      lineHeight: 1.4,
    },

    columnContainer: {
      flexDirection: "column",
    },

    // Strong points styling (green theme)
    strongPointsContainer: {
      marginBottom: 20, // Added margin to push concerns down
    },
    strongPointsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },

    strongPointsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDarkMode ? "#86EFAC" : "#047857",
    },

    strongPointItem: {
      backgroundColor: isDarkMode ? "#14532d33" : "#ECFDF5",
      border: `1 solid ${isDarkMode ? "#166534" : "#D1FAE5"}`,
      borderRadius: 6,
      padding: 12,
      marginBottom: 12,
    },

    strongPointHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 4,
    },

    strongPointTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: isDarkMode ? "#BBF7D0" : "#065F46",
      flex: 1,
    },

    strongPointDescription: {
      fontSize: 10,
      color: isDarkMode ? "#D1D5DB" : "#374151",
      lineHeight: 1.4,
      marginTop: 4,
    },

    // Concerns styling (red theme)
    concernsHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },

    concernsTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDarkMode ? "#FCA5A5" : "#DC2626",
    },

    concernItem: {
      backgroundColor: isDarkMode ? "#7f1d1d33" : "#FEF2F2",
      border: `1 solid ${isDarkMode ? "#7f1d1d" : "#FECACA"}`,
      borderRadius: 6,
      padding: 12,
      marginBottom: 12,
    },

    concernHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 4,
    },

    concernTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: isDarkMode ? "#FECACA" : "#991B1B",
      flex: 1,
    },

    concernDescription: {
      fontSize: 10,
      color: isDarkMode ? "#D1D5DB" : "#374151",
      lineHeight: 1.4,
      marginTop: 4,
    },

    // Hidden defects section
    hiddenDefectsCard: {
      // Match the card container background (Strong Selling Points container)
      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
      border: `1 solid ${isDarkMode ? "#4B5563" : "#E5E7EB"}`,
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
    },

    propertyDetailsCard: {
      backgroundColor: isDarkMode
        ? "rgba(17, 24, 39, 0.85)"
        : "rgba(255, 255, 255, 0.85)",
      border: `1 solid ${isDarkMode ? "#4B5563" : "#E5E7EB"}`,
      borderRadius: 12,
      padding: 24,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
    },
    propertyDetailsGrid: {
      flexDirection: "row",
      gap: 16,
    },
    propertyDetailItem: {
      flex: 1,
    },
    propertyDetailHeader: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 4,
      marginBottom: 8,
    },
    propertyDetailIconContainer: {
      backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "#E0E7FF",
      borderRadius: 6,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
      width: 22,
      height: 22,
    },
    propertyDetailIconWrapper: {
      justifyContent: "center",
      alignItems: "center",
      width: 22,
      height: 22,
    },
    propertyDetailLabel: {
      fontSize: 10,
      color: isDarkMode ? "#D1D5DB" : "#4B5563",
      fontWeight: "medium",
    },
    propertyDetailValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#111827",
      marginBottom: 4,
    },
    propertyDetailCurrency: {
      fontSize: 12,
      fontWeight: "normal",
      color: isDarkMode ? "#9CA3AF" : "#6B7280",
    },
    propertyDetailSubtext: {
      fontSize: 9,
      color: isDarkMode ? "#9CA3AF" : "#6B7280",
      marginTop: 8,
    },
    propertyDetailBadge: {
      borderWidth: 1,
      borderRadius: 5,
      paddingVertical: 3,
      paddingHorizontal: 7,
      marginTop: 8,
      alignSelf: "flex-start",
    },
    propertyDetailBadgeText: {
      fontSize: 8,
      fontWeight: "bold",
      color: isDarkMode ? "#A7F3D0" : "#065F46",
      lineHeight: 1,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    hiddenDefectsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#FFFFFF" : "#111827",
    },

    hiddenDefectsDescription: {
      fontSize: 12,
      color: isDarkMode ? "#D1D5DB" : "#374151",
      marginBottom: 16,
      lineHeight: 1.4,
    },

    hiddenDefectItem: {
      backgroundColor: isDarkMode ? "#111827" : "#F9FAFB",
      border: `1 solid ${isDarkMode ? "#4B5563" : "#E5E7EB"}`,
      borderRadius: 6,
      padding: 12,
      marginBottom: 12,
    },

    hiddenDefectHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },

    hiddenDefectCategory: {
      fontSize: 12,
      fontWeight: "bold",
      color: isDarkMode ? "#F9FAFB" : "#111827",
    },

    

    hiddenDefectLabel: {
      fontSize: 10,
      fontWeight: "bold",
      color: isDarkMode ? "#D1D5DB" : "#374151",
      marginBottom: 4,
      marginTop: 8,
    },

    hiddenDefectText: {
      fontSize: 9,
      color: isDarkMode ? "#D1D5DB" : "#374151",
      lineHeight: 1.4,
      marginBottom: 6,
    },

    hiddenDefectListItem: {
      fontSize: 9,
      color: isDarkMode ? "#D1D5DB" : "#374151",
      lineHeight: 1.3,
      marginBottom: 2,
    },

    

    hiddenDefectRiskBadgeText: {
      fontSize: 9,
      fontWeight: "bold",
      lineHeight: 1,
    },

    briefExplanationBox: {
      borderWidth: 1,
      borderRadius: 4,
      padding: 8,
      marginBottom: 8,
    },

    briefExplanationText: {
      fontSize: 10,
      lineHeight: 1.4,
    },

    // Bottom line alert (yellow theme)
    bottomLineAlert: {
      backgroundColor: isDarkMode ? "#451a0333" : "#FEFCE8",
      border: `1 solid ${isDarkMode ? "#ca8a04" : "#FEF08A"}`,
      borderRadius: 6,
      padding: 16,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },

    bottomLineContent: {
      flex: 1,
    },

    bottomLineTitle: {
      fontSize: 12,
      color: isDarkMode ? "#FBBF24" : "#A16207",
      fontWeight: "bold",
      marginBottom: 4,
    },

    bottomLineText: {
      fontSize: 11,
      color: isDarkMode ? "#ffc657" : "#A16207",
      lineHeight: 1.4,
    },

    // Footer
    footer: {
      position: "absolute",
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: "center",
      color: isDarkMode ? "#9CA3AF" : "#6B7280",
      fontSize: 9,
      borderTop: `1 solid ${isDarkMode ? "#374151" : "#E5E7EB"}`,
      paddingTop: 8,
    },
  });

/**
 * Get theme-aware icon colors
 */
const getIconColors = (isDarkMode: boolean) => ({
  brand: "#EAB308", // Yellow brand color - consistent across themes
  trending: isDarkMode ? "#10B981" : "#047857", // TrendingUp icon
  checkCircle: isDarkMode ? "#10B981" : "#059669", // CheckCircle icon
  alertTriangle: isDarkMode ? "#F87171" : "#DC2626", // AlertTriangle icon
  info: isDarkMode ? "#F87171" : "#991B1B", // Info icon
  bottomLineAlert: isDarkMode ? "#FBBF24" : "#CA8A04", // Bottom line alert
  mapPin: isDarkMode ? "#FBBF24" : "#EAB308", // MapPin icon
  eye: isDarkMode ? "#D1D5DB" : "#374151", // Eye icon
  fileText: isDarkMode ? "#D1D5DB" : "#111827", // FileText icon
});

/**
 * Render Strong Points section with safe data handling
 */
const renderStrongPoints = (
  strongPoints: (string | { title: string; description: string })[],
  styles: PDFStyles,
  iconColors: IconColors,
  t: TranslationFunction
) => {
  // Defensive programming - ensure we have safe data
  const safeStrongPoints = Array.isArray(strongPoints)
    ? strongPoints // No longer limiting to 10 items
    : [];

  return (
    <View style={styles.columnContainer}>
      <View style={styles.strongPointsHeader}>
        <TrendingUpIcon size={14} color={iconColors.trending} />
        <Text style={styles.strongPointsTitle}>
          {t("analysis.strongSellingPoints") || "Strong Selling Points"}
        </Text>
      </View>

      {safeStrongPoints.length > 0 ? (
        safeStrongPoints.map((point, idx) => {
          const title =
            (typeof point === "string" ? point : point?.title) ||
            `Strong Point ${idx + 1}`;
          const description =
            typeof point === "string" ? "" : point?.description || "";

          // Truncate long text to prevent PDF rendering issues
          const safeTitle = title.substring(0, 200);
          const safeDescription = description.substring(0, 300);

          return (
            <View
              key={`strong-${idx}`}
              style={styles.strongPointItem}
              wrap={false}
            >
              <View style={styles.strongPointHeader}>
                <CheckCircleIcon size={10} color={iconColors.checkCircle} />
                <Text style={styles.strongPointTitle}>{safeTitle}</Text>
              </View>
              {safeDescription && (
                <Text style={styles.strongPointDescription}>
                  {safeDescription}
                </Text>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.strongPointTitle}>No strong points available</Text>
      )}
    </View>
  );
};

/**
 * Render Concerns section with safe data handling
 */
const renderConcerns = (
  concerns: (string | { title: string; description: string })[],
  styles: PDFStyles,
  iconColors: IconColors,
  t: TranslationFunction
) => {
  // Defensive programming - ensure we have safe data
  const safeConcerns = Array.isArray(concerns)
    ? concerns // No longer limiting to 10 items
    : [];

  return (
    <View style={styles.columnContainer}>
      <View style={styles.concernsHeader}>
        <AlertTriangleIcon size={14} color={iconColors.alertTriangle} />
        <Text style={styles.concernsTitle}>
          {t("analysis.areasOfConcern") || "Areas of Concern"}
        </Text>
      </View>

      {safeConcerns.length > 0 ? (
        safeConcerns.map((concern, idx) => {
          const title =
            (typeof concern === "string" ? concern : concern?.title) ||
            `Concern ${idx + 1}`;
          const description =
            typeof concern === "string" ? "" : concern?.description || "";

          // Truncate long text to prevent PDF rendering issues
          const safeTitle = title.substring(0, 200);
          const safeDescription = description.substring(0, 300);

          return (
            <View
              key={`concern-${idx}`}
              style={styles.concernItem}
              wrap={false}
            >
              <View style={styles.concernHeader}>
                <InfoIcon size={10} color={iconColors.info} />
                <Text style={styles.concernTitle}>{safeTitle}</Text>
              </View>
              {safeDescription && (
                <Text style={styles.concernDescription}>{safeDescription}</Text>
              )}
            </View>
          );
        })
      ) : (
        <Text style={styles.concernTitle}>No concerns available</Text>
      )}
    </View>
  );
};

/**
 * Main AnalysisReportPDF Component with comprehensive error handling
 *
 * Generates a professional PDF report that mirrors the web interface design.
 * Supports both light and dark themes for consistent branding.
 */
export const AnalysisReportPDF: React.FC<AnalysisReportPDFProps> = ({
  analysisData,
  t,
  isDarkMode = false,
  locale = "en",
}) => {
  // Comprehensive data validation and error handling
  try {
    if (!analysisData) {
      throw new Error("No analysis data provided");
    }

    if (!analysisData.propertyDetails) {
      throw new Error("Property details are missing");
    }

    // Safe data extraction with fallbacks
    const safeAnalysisData = {
      propertyDetails: {
        address: analysisData.propertyDetails?.address || "Property Address",
        bedrooms: analysisData.propertyDetails?.bedrooms || 0,
        price: analysisData.propertyDetails?.price || 0,
        currency: analysisData.propertyDetails?.currency || "NOK",
        size: analysisData.propertyDetails?.size || 0,
        yearBuilt:
          analysisData.propertyDetails?.yearBuilt || new Date().getFullYear(),
        propertyType: analysisData.propertyDetails?.propertyType || "property",
      },
      strongPoints: Array.isArray(analysisData.strongPoints)
        ? analysisData.strongPoints
        : [],
      concerns: Array.isArray(analysisData.concerns)
        ? analysisData.concerns
        : [],
      hiddenDefects: Array.isArray(analysisData.hiddenDefects)
        ? analysisData.hiddenDefects
        : [],
      bottomLine:
        analysisData.bottomLine?.substring(0, 500) ||
        "No bottom line available",
      summary:
        analysisData.summary?.substring(0, 1000) || "No summary available",
    };

    const styles = createStyles(isDarkMode);
    const iconColors = getIconColors(isDarkMode);

    // Conditionally format the date based on locale
    const today = new Date();
    let formattedDate;
    if (locale === "no") {
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      formattedDate = `${day}-${month}-${year}`;
    } else {
      formattedDate = today.toLocaleDateString("en-CA"); // YYYY-MM-DD
    }

    return (
      <Document
        title={`PropertyWise Analysis - ${safeAnalysisData.propertyDetails.address}`}
        author="PropertyWise"
        subject="Property Analysis Report"
        creator="PropertyWise AI Analysis Tool"
      >
        <Page size="A4" style={styles.page}>
          {/* Header with PropertyWise Branding */}
          <View style={styles.brandHeader}>
            <HomeIcon size={16} color={iconColors.brand} />
            <Text style={styles.brandText}>PropertyWise</Text>
          </View>

          {/* Main Title Section */}
          <View style={styles.titleSection}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <View style={{ marginTop: 2 }}>
                <MapPinIcon size={24} color={iconColors.mapPin} />
              </View>
              <Text style={styles.mainTitle}>
                {safeAnalysisData.propertyDetails.address}
              </Text>
            </View>
            <Text style={styles.subtitle}>
              {(t &&
                t("analysis.reportGeneratedOn", { date: formattedDate })) ||
                `Report generated on ${formattedDate}`}
            </Text>
          </View>

          {/* Summary Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FileTextIcon size={16} color={iconColors.fileText} />
              <Text style={styles.cardTitle}>
                {(t && t("analysis.analysisSummaryTitle")) ||
                  "Analysis Summary"}
              </Text>
            </View>
            <Text style={styles.cardContent}>{safeAnalysisData.summary}</Text>
          </View>

          {/* Property Details Section */}
          <View style={styles.propertyDetailsCard} wrap={false}>
            <View style={styles.propertyDetailsGrid}>
              {/* Property Type */}
              <View style={styles.propertyDetailItem}>
                <View style={styles.propertyDetailHeader}>
                  <View style={styles.propertyDetailIconContainer}>
                    <HomeIcon
                      size={12}
                      color={isDarkMode ? "#A5B4FC" : "#4F46E5"}
                    />
                  </View>
                  <Text style={styles.propertyDetailLabel}>
                    {(t && t("analysis.marketPosition")) || "Property Type"}
                  </Text>
                </View>
                <Text style={styles.propertyDetailValue}>
                  {(t &&
                    t(
                      `analysis.propertyTypes.${safeAnalysisData.propertyDetails.propertyType}`
                    )) ||
                    safeAnalysisData.propertyDetails.propertyType}
                </Text>
                <View
                  style={[
                    styles.propertyDetailBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(52, 211, 153, 0.1)"
                        : "#ECFDF5",
                      borderColor: isDarkMode ? "#34D399" : "#10B981",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.propertyDetailBadgeText,
                      { color: isDarkMode ? "#A7F3D0" : "#065F46" },
                    ]}
                  >
                    {safeAnalysisData.propertyDetails.bedrooms}-room apartment
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View style={styles.propertyDetailItem}>
                <View style={styles.propertyDetailHeader}>
                  <View style={styles.propertyDetailIconWrapper}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: isDarkMode ? "#34D399" : "#10B981" },
                      ]}
                    />
                  </View>
                  <Text style={styles.propertyDetailLabel}>
                    {(t && t("analysis.priceLabel")) || "Price"}
                  </Text>
                </View>
                <Text style={styles.propertyDetailValue}>
                  {safeAnalysisData.propertyDetails.price.toLocaleString()}
                  <Text style={styles.propertyDetailCurrency}>
                    {" "}
                    {safeAnalysisData.propertyDetails.currency || "NOK"}
                  </Text>
                </Text>
                <Text style={styles.propertyDetailSubtext}>
                  {(t && t("analysis.askingPrice")) || "Asking Price"}
                </Text>
              </View>

              {/* Size */}
              <View style={styles.propertyDetailItem}>
                <View style={styles.propertyDetailHeader}>
                  <View style={styles.propertyDetailIconWrapper}>
                    <Maximize2Icon
                      size={14}
                      color={isDarkMode ? "#A5B4FC" : "#4F46E5"}
                    />
                  </View>
                  <Text style={styles.propertyDetailLabel}>
                    {(t && t("analysis.sizeLabel")) || "Size"}
                  </Text>
                </View>
                <Text style={styles.propertyDetailValue}>
                  {safeAnalysisData.propertyDetails.size}
                  <Text style={styles.propertyDetailCurrency}> m²</Text>
                </Text>
                <Text style={styles.propertyDetailSubtext}>
                  {(t && t("analysis.totalArea")) || "Total Area"}
                </Text>
              </View>

              {/* Year Built */}
              <View style={styles.propertyDetailItem}>
                <View style={styles.propertyDetailHeader}>
                  <View style={styles.propertyDetailIconWrapper}>
                    <CalendarIcon
                      size={14}
                      color={isDarkMode ? "#C084FC" : "#9333EA"}
                    />
                  </View>
                  <Text style={styles.propertyDetailLabel}>
                    {(t && t("analysis.yearBuiltLabel")) || "Year Built"}
                  </Text>
                </View>
                <Text style={styles.propertyDetailValue}>
                  {safeAnalysisData.propertyDetails.yearBuilt}
                </Text>
                <View
                  style={[
                    styles.propertyDetailBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(192, 132, 252, 0.1)"
                        : "#F5F3FF",
                      borderColor: isDarkMode ? "#C084FC" : "#9333EA",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.propertyDetailBadgeText,
                      { color: isDarkMode ? "#E9D5FF" : "#8B5CF6" },
                    ]}
                  >
                    {(() => {
                      const age =
                        new Date().getFullYear() -
                        safeAnalysisData.propertyDetails.yearBuilt;
                      return age <= 0
                        ? (t && t("analysis.ageLabels.new")) || "New"
                        : (t &&
                            t("analysis.ageLabels.yearsOld", { years: age })) ||
                            `${age} years old`;
                    })()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Key Findings Section */}
          <View style={styles.card}>
            <View style={styles.strongPointsContainer}>
              {/* Strong Points Column */}
              {renderStrongPoints(
                safeAnalysisData.strongPoints,
                styles,
                iconColors,
                t
              )}
            </View>

            {/* Concerns Column */}
            {renderConcerns(safeAnalysisData.concerns, styles, iconColors, t)}
          </View>

          {/* Hidden Defects Section */}
          {safeAnalysisData.hiddenDefects.length > 0 && (
            <View style={styles.hiddenDefectsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.hiddenDefectsTitle}>
                  {(t && t("hiddenDefects.title")) || "Hidden Defects"}
                </Text>
              </View>
              <Text style={styles.hiddenDefectsDescription}>
                {(t && t("hiddenDefects.description")) ||
                  "Potential hidden defects to consider"}
              </Text>

              {safeAnalysisData.hiddenDefects.map((defect, idx) => {
                // Safe data extraction with fallbacks
                const category = defect?.category || "unknown";
                const riskLevel = defect?.riskLevel || "medium";
                const briefExplanation =
                  defect?.briefExplanation || "No explanation available.";
                const consequences =
                  defect?.consequences || "No consequences specified.";
                const preventiveMeasures =
                  defect?.preventiveMeasures ||
                  "No preventive measures specified.";
                const actionRequired = defect?.actionRequired;

                const Icon = pdfDefectIcons[category];

                const riskStyles = {
                  low: {
                    backgroundColor: isDarkMode ? "#166534" : "#D1FAE5",
                    color: isDarkMode ? "#D1FAE0" : "#14A37F",
                  },

                  medium: {
                    backgroundColor: isDarkMode ? "#854d0e" : "#FEF3C7",
                    color: isDarkMode ? "#FDE27A" : "#D4703A",
                  },

                  high: {
                    backgroundColor: isDarkMode ? "#991B1B" : "#FEE2E2",
                    color: isDarkMode ? "#FED2D2" : "#D54242",
                  },
                };

                const briefExplanationStyle = {
                  borderColor: isDarkMode ? "#ca8a04" : "#FEF08A",
                  backgroundColor: isDarkMode ? "#451a0333" : "#FEFCE8",
                  color: isDarkMode ? "#ffc657" : "#b3621d",
                };

                return (
                  <View
                    key={`defect-${idx}`}
                    style={styles.hiddenDefectItem}
                    wrap={false}
                  >
                    <View style={styles.hiddenDefectHeader}>
                      {Icon && (
                        <Icon
                          size={14}
                          color={isDarkMode ? "#F9FAFB" : "#111827"}
                        />
                      )}
                      <Text style={styles.hiddenDefectCategory}>
                        {(t &&
                          t(`hiddenDefects.categories.${category}.title`)) ||
                          category}
                      </Text>
                      <Text
                        style={[
                          styles.hiddenDefectRiskBadgeText,
                          {
                            backgroundColor: riskStyles[riskLevel].backgroundColor,
                            color: riskStyles[riskLevel].color,
                            paddingVertical: 3,
                            paddingHorizontal: 6,
                            borderRadius: 5,
                          },
                        ]}
                      >
                        {(t && t(`hiddenDefects.riskLevels.${riskLevel}`)) ||
                          riskLevel}
                      </Text>
                    </View>

                    <View style={{ paddingLeft: 22, gap: 8 }}>
                      <View
                        style={[
                          styles.briefExplanationBox,
                          {
                            borderColor: briefExplanationStyle.borderColor,
                            backgroundColor:
                              briefExplanationStyle.backgroundColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.briefExplanationText,
                            { color: briefExplanationStyle.color },
                          ]}
                        >
                          {briefExplanation}
                        </Text>
                      </View>

                      <View>
                        <Text style={styles.hiddenDefectLabel}>
                          {(t && t("hiddenDefects.consequences")) ||
                            "Consequences"}
                          :
                        </Text>
                        <Text style={styles.hiddenDefectText}>
                          {consequences.substring(0, 200)}
                        </Text>
                      </View>

                      <View>
                        <Text style={styles.hiddenDefectLabel}>
                          {(t && t("hiddenDefects.preventiveMeasures")) ||
                            "Preventive measures"}
                          :
                        </Text>
                        <Text style={styles.hiddenDefectText}>
                          {preventiveMeasures.substring(0, 200)}
                        </Text>
                      </View>

                      {actionRequired && (
                        <View>
                          <Text style={styles.hiddenDefectLabel}>
                            {(t && t("hiddenDefects.actionRequired")) ||
                              "Action Required"}
                            :
                          </Text>
                          <Text style={styles.hiddenDefectText}>
                            {actionRequired.substring(0, 200)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Bottom Line Alert */}
          <View style={styles.bottomLineAlert} wrap={false}>
            <View style={{ marginTop: 2 }}>
              <AlertTriangleIcon size={14} color={iconColors.bottomLineAlert} />
            </View>
            <View style={styles.bottomLineContent}>
              <Text style={styles.bottomLineTitle}>
                {(t && t("analysis.bottomLine")) || "Bottom Line"}
              </Text>
              <Text style={styles.bottomLineText}>
                {safeAnalysisData.bottomLine}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              PropertyWise Analysis Report - Generated by AI Property Analysis
              Tool
            </Text>
          </View>
        </Page>
      </Document>
    );
  } catch (error) {
    console.error("Error in AnalysisReportPDF component:", error);

    // Fallback minimal PDF for errors
    const styles = createStyles(isDarkMode);

    return (
      <Document title="PropertyWise Analysis - Error" author="PropertyWise">
        <Page size="A4" style={styles.page}>
          <View style={styles.brandHeader}>
            <HomeIcon size={16} color="#EAB308" />
            <Text style={styles.brandText}>PropertyWise</Text>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Error Generating Report</Text>
            <Text style={styles.subtitle}>
              An error occurred while generating the PDF report.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardContent}>
              Error details:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </Text>
            <Text style={styles.cardContent}>
              Please try again or contact support if the issue persists.
            </Text>
          </View>
        </Page>
      </Document>
    );
  }
};
