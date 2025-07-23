"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PropertyAnalysis } from '@/lib/types';
import { TranslationFunction } from '@/lib/i18n-types';
import { CheckCircleIcon, AlertTriangleIcon, HomeIcon, MapPinIcon, EyeIcon, TrendingUpIcon, InfoIcon, FileTextIcon } from './icons';

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf'
// });

// Create styles that match the web page design
const createStyles = (isDarkMode: boolean) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  // Header with PropertyWise branding
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },
  // Main title section (matching web page)
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 11,
    color: isDarkMode ? '#D1D5DB' : '#6B7280',
    marginBottom: 20,
  },
  // Summary card (matching web page card style)
  summaryCard: {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: isDarkMode ? '#D1D5DB' : '#374151',
  },
  // Market position section (blue box like web page)
  marketPositionBox: {
    backgroundColor: isDarkMode ? '#1e3a8a33' : '#EFF6FF', // dark:bg-blue-950/20
    border: `1 solid ${isDarkMode ? '#1e40af' : '#DBEAFE'}`, // dark:border-[#1e40af]
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  marketPositionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDarkMode ? '#93C5FD' : '#1E3A8A', // dark:text-blue-300
    marginBottom: 8,
  },
  marketPositionText: {
    fontSize: 12,
    color: isDarkMode ? '#BFDBFE' : '#1E40AF', // dark:text-blue-200
    lineHeight: 1.4,
  },
  // Key findings card (matching web page)
  keyFindingsCard: {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
    border: `1 solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  keyFindingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#F9FAFB' : '#111827',
    marginBottom: 16,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  strongPointsContainer: {
    flex: 1,
  },
  concernsContainer: {
    flex: 1,
  },
  // Strong points styling (matching green theme)
  strongPointsHeader: {
    marginBottom: 8,
  },
  strongPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#86EFAC' : '#047857', // dark:text-green-300
  },
  strongPointItem: {
    backgroundColor: isDarkMode ? '#14532d33' : '#ECFDF5', // dark:bg-green-950/20
    border: `1 solid ${isDarkMode ? '#166534' : '#D1FAE5'}`, // dark:border-[#166534] (green)
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  strongPointTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDarkMode ? '#BBF7D0' : '#065F46', // dark:text-green-100
    marginBottom: 4,
    flex: 1,
  },
  strongPointDescription: {
    fontSize: 11,
    color: isDarkMode ? '#D1D5DB' : '#000000',
    lineHeight: 1.4,
  },
  // Concerns styling (matching red theme)
  concernsHeader: {
    marginBottom: 8,
  },
  concernsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDarkMode ? '#FCA5A5' : '#DC2626', // dark:text-red-300
  },
  concernItem: {
    backgroundColor: isDarkMode ? '#7f1d1d33' : '#FEF2F2', // dark:bg-red-950/20
    border: `1 solid ${isDarkMode ? '#7f1d1d' : '#FECACA'}`, // dark:border-[#7f1d1d] (red)
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  concernTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDarkMode ? '#FECACA' : '#991B1B', // dark:text-red-100
    marginBottom: 4,
    flex: 1,
  },
  concernDescription: {
    fontSize: 11,
    color: isDarkMode ? '#D1D5DB' : '#000000',
    lineHeight: 1.4,
  },
  // Bottom line alert (matching yellow alert)
  bottomLineAlert: {
    backgroundColor: isDarkMode ? '#451a0333' : '#FEFCE8', // dark:bg-yellow-950/20
    border: `1 solid ${isDarkMode ? '#ca8a04' : '#FEF08A'}`, // dark:border-[#ca8a04] (yellow)
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bottomLineIcon: {
    marginTop: 2,
  },
  bottomLineContent: {
    flex: 1,
  },
  bottomLineText: {
    fontSize: 11,
    color: isDarkMode ? '#ffc657' : '#A16207', // dark:text-[#ffc657]
    lineHeight: 1.4,
  },
  bottomLineTextBold: {
    fontSize: 11,
    color: isDarkMode ? '#FBBF24' : '#A16207', // dark:text-[#FBBF24]
    lineHeight: 1.4,
    fontWeight: 'bold',
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

interface AnalysisReportPDFProps {
  analysisData: PropertyAnalysis;
  t: TranslationFunction;
  isDarkMode?: boolean;
}

export const AnalysisReportPDF: React.FC<AnalysisReportPDFProps> = ({ analysisData, t, isDarkMode = false }) => {
  const styles = createStyles(isDarkMode);
  
  // Define icon colors based on theme to match web interface
  const iconColors = {
    trending: isDarkMode ? '#10B981' : '#047857', // TrendingUp icon - green-600 dark:green-400
    checkCircle: isDarkMode ? '#10B981' : '#059669', // CheckCircle icon - green-800 dark:green-400
    alertTriangle: isDarkMode ? '#F87171' : '#DC2626', // AlertTriangle icon - red-600 dark:red-400
    info: isDarkMode ? '#F87171' : '#991B1B', // Info icon - red-800 dark:red-400
    bottomLineAlert: isDarkMode ? '#FBBF24' : '#CA8A04', // AlertTriangle in bottom line - yellow-600 dark:yellow-400
    brand: '#EAB308', // Yellow brand color - same in both modes
    mapPin: isDarkMode ? '#FBBF24' : '#EAB308', // MapPin icon - yellow-600 dark:yellow-400
    eye: isDarkMode ? '#D1D5DB' : '#374151', // Eye icon for Key Findings - gray-600 dark:text-[#D1D5DB]
    fileText: isDarkMode ? '#D1D5DB' : '#111827', // FileText icon for Summary - dark:text-[#D1D5DB]
  };
  
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* PropertyWise Header (matching web page) */}
      <View style={styles.brandHeader}>
        <HomeIcon size={16} color={iconColors.brand} />
        <Text style={styles.brandText}>PropertyWise</Text>
      </View>

      {/* Main Title */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
          <View style={{ marginTop: 2 }}>
            <MapPinIcon size={24} color={iconColors.mapPin} />
          </View>
          <Text style={styles.mainTitle}>
            {analysisData?.propertyDetails?.address || t('analysis.propertyAnalysisTitle')}
          </Text>
        </View>
        <Text style={styles.subtitle}>
          {t('analysis.reportGeneratedOn', { date: new Date().toLocaleDateString() })}
        </Text>
      </View>

      {/* Summary Card (if exists) */}
      {analysisData?.summary && (
        <View style={styles.summaryCard}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
            <View style={{ marginTop: 2 }}>
              <FileTextIcon size={16} color={iconColors.fileText} />
            </View>
            <Text style={styles.summaryCardTitle}>
              {t('analysis.analysisSummaryTitle')}
            </Text>
          </View>
          <Text style={styles.summaryText}>
            {analysisData.summary}
          </Text>
        </View>
      )}

      {/* Market Position Box (matching blue box from web page) */}
      {analysisData?.propertyDetails && (
        <View style={styles.marketPositionBox}>
          <Text style={styles.marketPositionTitle}>
            {t('analysis.marketPosition')}
          </Text>
          <Text style={styles.marketPositionText}>
            {analysisData.propertyDetails.bedrooms}{t('analysis.roomPropertyPriced', {
              propertyType: analysisData.propertyDetails.propertyType,
              price: analysisData.propertyDetails.price.toLocaleString()
            })} • {t('analysis.totalSize', { size: analysisData.propertyDetails.size })} • {t('analysis.built', { year: analysisData.propertyDetails.yearBuilt })}
          </Text>
        </View>
      )}

      {/* Key Findings Card (matching web page layout) */}
      <View style={styles.keyFindingsCard}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
          <View style={{ marginTop: 2 }}>
            <EyeIcon size={16} color={iconColors.eye} />
          </View>
          <Text style={styles.keyFindingsTitle}>
            {t('analysis.keyFindingsTitle')}
          </Text>
        </View>
        
        <View style={styles.twoColumnLayout}>
          {/* Strong Points Column */}
          <View style={styles.strongPointsContainer}>
            <View style={styles.strongPointsHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <TrendingUpIcon size={16} color={iconColors.trending} />
                <Text style={styles.strongPointsTitle}>
                  {t('analysis.strongSellingPoints')}
                </Text>
              </View>
            </View>
            
            {analysisData?.strongPoints?.map((point, idx) => {
              const spTitle = typeof point === 'string' ? point : point.title;
              const spDescription = typeof point === 'string' ? '' : point.description;
              return (
                <View key={idx} style={styles.strongPointItem} wrap={false}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <CheckCircleIcon size={12} color={iconColors.checkCircle} />
                    <Text style={styles.strongPointTitle}>
                      {spTitle}
                    </Text>
                  </View>
                  {spDescription && (
                    <Text style={styles.strongPointDescription}>
                      {spDescription}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Concerns Column */}
          <View style={styles.concernsContainer}>
            <View style={styles.concernsHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <AlertTriangleIcon size={16} color={iconColors.alertTriangle} />
                <Text style={styles.concernsTitle}>
                  {t('analysis.areasOfConcern')}
                </Text>
              </View>
            </View>
            
            {analysisData?.concerns?.map((concern, idx) => {
              const concernTitle = typeof concern === 'string' ? concern : concern.title;
              const concernDescription = typeof concern === 'string' ? '' : concern.description;
              return (
                <View key={idx} style={styles.concernItem} wrap={false}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <InfoIcon size={12} color={iconColors.info} />
                    <Text style={styles.concernTitle}>
                      {concernTitle}
                    </Text>
                  </View>
                  {concernDescription && (
                    <Text style={styles.concernDescription}>
                      {concernDescription}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom Line Alert (matching yellow alert from web page) */}
      {analysisData?.bottomLine && (
        <View style={styles.bottomLineAlert} wrap={false}>
          <View style={styles.bottomLineIcon}>
            <AlertTriangleIcon size={14} color={iconColors.bottomLineAlert} />
          </View>
          <View style={styles.bottomLineContent}>
            <Text style={styles.bottomLineTextBold}>
              {t('analysis.bottomLine')}
            </Text>
            <Text style={styles.bottomLineText}>
              {' '}{analysisData.bottomLine}
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          PropertyWise Analysis Report - Generated by AI Property Analysis Tool
        </Text>
      </View>
    </Page>
  </Document>
  );
};
