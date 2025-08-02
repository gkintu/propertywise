"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PropertyAnalysis } from '@/lib/types';
import { TranslationFunction } from '@/lib/i18n-types';
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  HomeIcon, 
  MapPinIcon, 
  EyeIcon, 
  TrendingUpIcon, 
  InfoIcon, 
  FileTextIcon 
} from './icons';

/**
 * Props interface for the AnalysisReportPDF component
 */
interface AnalysisReportPDFProps {
  analysisData: PropertyAnalysis;
  t: TranslationFunction;
  isDarkMode?: boolean;
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
const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  // Page container
  page: {
    flexDirection: 'column',
    backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    fontSize: 12,
    lineHeight: 1.4,
  },

  // Header section with PropertyWise branding
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    gap: 8,
  },
  
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },

  // Main title section
  titleSection: {
    marginBottom: 24,
  },
  
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    marginBottom: 8,
    lineHeight: 1.2,
  },
  
  subtitle: {
    fontSize: 11,
    color: isDarkMode ? '#D1D5DB' : '#6B7280',
    marginBottom: 4,
  },

  // Card components (matching web page cards)
  card: {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },

  cardContent: {
    fontSize: 12,
    lineHeight: 1.6,
    color: isDarkMode ? '#D1D5DB' : '#374151',
  },

  // Market position section (blue themed)
  marketPositionBox: {
    backgroundColor: isDarkMode ? '#1e3a8a33' : '#EFF6FF',
    border: `1 solid ${isDarkMode ? '#1e40af' : '#DBEAFE'}`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },

  marketPositionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkMode ? '#93C5FD' : '#1E3A8A',
    marginBottom: 8,
  },

  marketPositionText: {
    fontSize: 12,
    color: isDarkMode ? '#BFDBFE' : '#1E40AF',
    lineHeight: 1.4,
  },

  // Two-column layout for key findings
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 16,
  },

  columnContainer: {
    flex: 1,
    minHeight: 40,
  },

  // Strong points styling (green theme)
  strongPointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  strongPointsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkMode ? '#86EFAC' : '#047857',
  },

  strongPointItem: {
    backgroundColor: isDarkMode ? '#14532d33' : '#ECFDF5',
    border: `1 solid ${isDarkMode ? '#166534' : '#D1FAE5'}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },

  strongPointHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },

  strongPointTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDarkMode ? '#BBF7D0' : '#065F46',
    flex: 1,
  },

  strongPointDescription: {
    fontSize: 10,
    color: isDarkMode ? '#D1D5DB' : '#374151',
    lineHeight: 1.4,
    marginTop: 4,
  },

  // Concerns styling (red theme)
  concernsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  concernsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDarkMode ? '#FCA5A5' : '#DC2626',
  },

  concernItem: {
    backgroundColor: isDarkMode ? '#7f1d1d33' : '#FEF2F2',
    border: `1 solid ${isDarkMode ? '#7f1d1d' : '#FECACA'}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },

  concernHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },

  concernTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: isDarkMode ? '#FECACA' : '#991B1B',
    flex: 1,
  },

  concernDescription: {
    fontSize: 10,
    color: isDarkMode ? '#D1D5DB' : '#374151',
    lineHeight: 1.4,
    marginTop: 4,
  },

  // Hidden defects section (purple theme)
  hiddenDefectsCard: {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: `1 solid ${isDarkMode ? '#7C3AED' : '#A855F7'}`,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },

  hiddenDefectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#C4B5FD' : '#7C2D12',
    marginBottom: 8,
  },

  hiddenDefectsDescription: {
    fontSize: 12,
    color: isDarkMode ? '#D1D5DB' : '#374151',
    marginBottom: 16,
    lineHeight: 1.4,
  },

  hiddenDefectItem: {
    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
    border: `1 solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  hiddenDefectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  hiddenDefectCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },

  hiddenDefectRisk: {
    fontSize: 9,
    backgroundColor: isDarkMode ? '#7C2D12' : '#FEF3C7',
    color: isDarkMode ? '#FCD34D' : '#92400E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  hiddenDefectLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: isDarkMode ? '#D1D5DB' : '#374151',
    marginBottom: 4,
    marginTop: 8,
  },

  hiddenDefectText: {
    fontSize: 9,
    color: isDarkMode ? '#D1D5DB' : '#374151',
    lineHeight: 1.4,
    marginBottom: 6,
  },

  hiddenDefectListItem: {
    fontSize: 9,
    color: isDarkMode ? '#D1D5DB' : '#374151',
    lineHeight: 1.3,
    marginBottom: 2,
  },

  // Bottom line alert (yellow theme)
  bottomLineAlert: {
    backgroundColor: isDarkMode ? '#451a0333' : '#FEFCE8',
    border: `1 solid ${isDarkMode ? '#ca8a04' : '#FEF08A'}`,
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  bottomLineContent: {
    flex: 1,
  },

  bottomLineTitle: {
    fontSize: 12,
    color: isDarkMode ? '#FBBF24' : '#A16207',
    fontWeight: 'bold',
    marginBottom: 4,
  },

  bottomLineText: {
    fontSize: 11,
    color: isDarkMode ? '#ffc657' : '#A16207',
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
    fontSize: 9,
    borderTop: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    paddingTop: 8,
  },
});

/**
 * Get theme-aware icon colors
 */
const getIconColors = (isDarkMode: boolean) => ({
  brand: '#EAB308', // Yellow brand color - consistent across themes
  trending: isDarkMode ? '#10B981' : '#047857', // TrendingUp icon
  checkCircle: isDarkMode ? '#10B981' : '#059669', // CheckCircle icon
  alertTriangle: isDarkMode ? '#F87171' : '#DC2626', // AlertTriangle icon
  info: isDarkMode ? '#F87171' : '#991B1B', // Info icon
  bottomLineAlert: isDarkMode ? '#FBBF24' : '#CA8A04', // Bottom line alert
  mapPin: isDarkMode ? '#FBBF24' : '#EAB308', // MapPin icon
  eye: isDarkMode ? '#D1D5DB' : '#374151', // Eye icon
  fileText: isDarkMode ? '#D1D5DB' : '#111827', // FileText icon
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
    ? strongPoints.slice(0, 10) // Limit to 10 items max
    : [];

  return (
    <View style={styles.columnContainer}>
      <View style={styles.strongPointsHeader}>
        <TrendingUpIcon size={14} color={iconColors.trending} />
        <Text style={styles.strongPointsTitle}>
          {t('analysis.strongSellingPoints') || 'Strong Selling Points'}
        </Text>
      </View>
      
      {safeStrongPoints.length > 0 ? safeStrongPoints.map((point, idx) => {
        const title = (typeof point === 'string' ? point : point?.title) || `Strong Point ${idx + 1}`;
        const description = typeof point === 'string' ? '' : point?.description || '';
        
        // Truncate long text to prevent PDF rendering issues
        const safeTitle = title.substring(0, 200);
        const safeDescription = description.substring(0, 300);
        
        return (
          <View key={`strong-${idx}`} style={styles.strongPointItem} wrap={false}>
            <View style={styles.strongPointHeader}>
              <CheckCircleIcon size={10} color={iconColors.checkCircle} />
              <Text style={styles.strongPointTitle}>
                {safeTitle}
              </Text>
            </View>
            {safeDescription && (
              <Text style={styles.strongPointDescription}>
                {safeDescription}
              </Text>
            )}
          </View>
        );
      }) : (
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
    ? concerns.slice(0, 10) // Limit to 10 items max
    : [];

  return (
    <View style={styles.columnContainer}>
      <View style={styles.concernsHeader}>
        <AlertTriangleIcon size={14} color={iconColors.alertTriangle} />
        <Text style={styles.concernsTitle}>
          {t('analysis.areasOfConcern') || 'Areas of Concern'}
        </Text>
      </View>
      
      {safeConcerns.length > 0 ? safeConcerns.map((concern, idx) => {
        const title = (typeof concern === 'string' ? concern : concern?.title) || `Concern ${idx + 1}`;
        const description = typeof concern === 'string' ? '' : concern?.description || '';
        
        // Truncate long text to prevent PDF rendering issues
        const safeTitle = title.substring(0, 200);
        const safeDescription = description.substring(0, 300);
        
        return (
          <View key={`concern-${idx}`} style={styles.concernItem} wrap={false}>
            <View style={styles.concernHeader}>
              <InfoIcon size={10} color={iconColors.info} />
              <Text style={styles.concernTitle}>
                {safeTitle}
              </Text>
            </View>
            {safeDescription && (
              <Text style={styles.concernDescription}>
                {safeDescription}
              </Text>
            )}
          </View>
        );
      }) : (
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
  isDarkMode = false 
}) => {
  // Comprehensive data validation and error handling
  try {
    if (!analysisData) {
      throw new Error('No analysis data provided');
    }

    if (!analysisData.propertyDetails) {
      throw new Error('Property details are missing');
    }

    // Safe data extraction with fallbacks
    const safeAnalysisData = {
      propertyDetails: {
        address: analysisData.propertyDetails?.address || 'Property Address',
        bedrooms: analysisData.propertyDetails?.bedrooms || 0,
        price: analysisData.propertyDetails?.price || 0,
        currency: analysisData.propertyDetails?.currency || 'NOK',
        size: analysisData.propertyDetails?.size || 0,
        yearBuilt: analysisData.propertyDetails?.yearBuilt || new Date().getFullYear(),
        propertyType: analysisData.propertyDetails?.propertyType || 'property',
      },
      strongPoints: Array.isArray(analysisData.strongPoints) 
        ? analysisData.strongPoints.slice(0, 10)
        : [],
      concerns: Array.isArray(analysisData.concerns) 
        ? analysisData.concerns.slice(0, 10) 
        : [],
      hiddenDefects: Array.isArray(analysisData.hiddenDefects) 
        ? analysisData.hiddenDefects.slice(0, 5) 
        : [],
      bottomLine: analysisData.bottomLine?.substring(0, 500) || 'No bottom line available',
      summary: analysisData.summary?.substring(0, 1000) || 'No summary available',
    };

    const styles = createStyles(isDarkMode);
    const iconColors = getIconColors(isDarkMode);

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
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <View style={{ marginTop: 2 }}>
                <MapPinIcon size={24} color={iconColors.mapPin} />
              </View>
              <Text style={styles.mainTitle}>
                {safeAnalysisData.propertyDetails.address}
              </Text>
            </View>
            <Text style={styles.subtitle}>
              {(t && t('analysis.reportGeneratedOn', { date: new Date().toLocaleDateString() })) 
                || `Report generated on ${new Date().toLocaleDateString()}`}
            </Text>
          </View>

          {/* Summary Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FileTextIcon size={16} color={iconColors.fileText} />
              <Text style={styles.cardTitle}>
                {(t && t('analysis.analysisSummaryTitle')) || 'Analysis Summary'}
              </Text>
            </View>
            <Text style={styles.cardContent}>
              {safeAnalysisData.summary}
            </Text>
          </View>

          {/* Market Position Section */}
          <View style={styles.marketPositionBox}>
            <Text style={styles.marketPositionTitle}>
              {(t && t('analysis.marketPosition')) || 'Market Position'}
            </Text>
            <Text style={styles.marketPositionText}>
              {safeAnalysisData.propertyDetails.bedrooms} bedroom {safeAnalysisData.propertyDetails.propertyType} • 
              {safeAnalysisData.propertyDetails.price.toLocaleString()} {safeAnalysisData.propertyDetails.currency} • 
              {safeAnalysisData.propertyDetails.size}m² • Built {safeAnalysisData.propertyDetails.yearBuilt}
            </Text>
          </View>

          {/* Key Findings Section */}
          <View style={styles.card} minPresenceAhead={200}>
            <View style={styles.cardHeader}>
              <EyeIcon size={16} color={iconColors.eye} />
              <Text style={styles.cardTitle}>
                {(t && t('analysis.keyFindingsTitle')) || 'Key Findings'}
              </Text>
            </View>
            
            <View style={styles.twoColumnLayout}>
              {/* Strong Points Column */}
              {renderStrongPoints(safeAnalysisData.strongPoints, styles, iconColors, t)}
              
              {/* Concerns Column */}
              {renderConcerns(safeAnalysisData.concerns, styles, iconColors, t)}
            </View>
          </View>

          {/* Hidden Defects Section */}
          {safeAnalysisData.hiddenDefects.length > 0 && (
            <View style={styles.hiddenDefectsCard} minPresenceAhead={150}>
              <View style={styles.cardHeader}>
                <EyeIcon size={16} color={iconColors.eye} />
                <Text style={styles.hiddenDefectsTitle}>
                  {(t && t('hiddenDefects.title')) || 'Hidden Defects'}
                </Text>
              </View>
              <Text style={styles.hiddenDefectsDescription}>
                {(t && t('hiddenDefects.description')) || 'Potential hidden defects to consider'}
              </Text>
              
              {safeAnalysisData.hiddenDefects.map((defect, idx) => {
                // Safe data extraction with fallbacks
                const category = defect?.category || 'unknown';
                const riskLevel = defect?.riskLevel || 'medium';
                const consequences = defect?.consequences || 'No consequences specified';
                const preventiveMeasures = defect?.preventiveMeasures || 'No preventive measures specified';
                
                // Safely handle signsToLookFor array
                const signsToLookFor = Array.isArray(defect?.signsToLookFor) 
                  ? defect.signsToLookFor.slice(0, 5) // Limit to first 5 signs
                  : [];
                
                return (
                  <View key={`defect-${idx}`} style={styles.hiddenDefectItem} wrap={false} minPresenceAhead={50}>
                    <View style={styles.hiddenDefectHeader}>
                      <Text style={styles.hiddenDefectCategory}>
                        {(t && t(`hiddenDefects.categories.${category}.title`)) || category}
                      </Text>
                      <Text style={styles.hiddenDefectRisk}>
                        {(t && t(`hiddenDefects.riskLevels.${riskLevel}`)) || riskLevel}
                      </Text>
                    </View>
                    
                    <Text style={styles.hiddenDefectLabel}>
                      {(t && t('hiddenDefects.signsToLookFor')) || 'Signs to look for'}:
                    </Text>
                    <View style={{ marginBottom: 8 }}>
                      {signsToLookFor.length > 0 ? (
                        signsToLookFor.map((sign, signIdx) => (
                          <Text key={`sign-${signIdx}`} style={styles.hiddenDefectListItem}>
                            • {sign?.substring(0, 100) || 'No description'}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.hiddenDefectText}>
                          {(t && t('hiddenDefects.noSignsAvailable')) || 'No signs specified'}
                        </Text>
                      )}
                    </View>
                    
                    <Text style={styles.hiddenDefectLabel}>
                      {(t && t('hiddenDefects.consequences')) || 'Consequences'}:
                    </Text>
                    <Text style={styles.hiddenDefectText}>
                      {consequences.substring(0, 200)}
                    </Text>
                    
                    <Text style={styles.hiddenDefectLabel}>
                      {(t && t('hiddenDefects.preventiveMeasures')) || 'Preventive measures'}:
                    </Text>
                    <Text style={styles.hiddenDefectText}>
                      {preventiveMeasures.substring(0, 200)}
                    </Text>
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
                {(t && t('analysis.bottomLine')) || 'Bottom Line'}
              </Text>
              <Text style={styles.bottomLineText}>
                {safeAnalysisData.bottomLine}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              PropertyWise Analysis Report - Generated by AI Property Analysis Tool
            </Text>
          </View>
        </Page>
      </Document>
    );

  } catch (error) {
    console.error('Error in AnalysisReportPDF component:', error);
    
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
              Error details: {error instanceof Error ? error.message : 'Unknown error'}
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
