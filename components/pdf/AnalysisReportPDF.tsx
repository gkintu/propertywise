"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PropertyAnalysis } from '@/lib/types';
import { TranslationFunction } from '@/lib/i18n-types';

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf'
// });

// Create styles that match the web page design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  // Header with PropertyWise branding
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1 solid #E5E7EB',
  },
  brandIcon: {
    width: 8,
    height: 8,
    backgroundColor: '#EAB308',
    marginRight: 8,
    borderRadius: 2,
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  // Main title section (matching web page)
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 20,
  },
  // Summary card (matching web page card style)
  summaryCard: {
    backgroundColor: '#FFFFFF',
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
  },
  // Market position section (blue box like web page)
  marketPositionBox: {
    backgroundColor: '#EFF6FF',
    border: '1 solid #DBEAFE',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  marketPositionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  marketPositionText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 1.4,
  },
  // Key findings card (matching web page)
  keyFindingsCard: {
    backgroundColor: '#FFFFFF',
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  keyFindingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
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
    color: '#047857',
  },
  strongPointItem: {
    backgroundColor: '#ECFDF5',
    border: '1 solid #D1FAE5',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  strongPointTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 4,
  },
  strongPointDescription: {
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.4,
  },
  // Concerns styling (matching red theme)
  concernsHeader: {
    marginBottom: 8,
  },
  concernsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  concernItem: {
    backgroundColor: '#FEF2F2',
    border: '1 solid #FECACA',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  concernTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 4,
  },
  concernDescription: {
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.4,
  },
  // Bottom line alert (matching yellow alert with border-yellow-200 bg-yellow-50)
  bottomLineAlert: {
    backgroundColor: '#FEFCE8', // bg-yellow-50
    border: '1 solid #FEF08A', // border-yellow-200
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
    color: '#A16207', // text-yellow-800
    lineHeight: 1.4,
  },
  bottomLineTextBold: {
    fontSize: 11,
    color: '#A16207', // text-yellow-800
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
    color: '#6B7280',
    fontSize: 9,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 8,
  },
});

interface AnalysisReportPDFProps {
  analysisData: PropertyAnalysis;
  t: TranslationFunction;
}

export const AnalysisReportPDF: React.FC<AnalysisReportPDFProps> = ({ analysisData, t }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* PropertyWise Header (matching web page) */}
      <View style={styles.brandHeader}>
        <View style={styles.brandIcon} />
        <Text style={styles.brandText}>PropertyWise</Text>
      </View>

      {/* Main Title */}
      <View>
        <Text style={styles.mainTitle}>
          {analysisData?.propertyDetails?.address || t('analysis.propertyAnalysisTitle')}
        </Text>
        <Text style={styles.subtitle}>
          {t('analysis.reportGeneratedOn', { date: new Date().toLocaleDateString() })}
        </Text>
      </View>

      {/* Summary Card (if exists) */}
      {analysisData?.summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>
            {t('analysis.analysisSummaryTitle')}
          </Text>
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
        <Text style={styles.keyFindingsTitle}>
          {t('analysis.keyFindingsTitle')}
        </Text>
        
        <View style={styles.twoColumnLayout}>
          {/* Strong Points Column */}
          <View style={styles.strongPointsContainer}>
            <View style={styles.strongPointsHeader}>
              <Text style={styles.strongPointsTitle}>
                {t('analysis.strongSellingPoints')}
              </Text>
            </View>
            
            {analysisData?.strongPoints?.map((point, idx) => {
              const spTitle = typeof point === 'string' ? point : point.title;
              const spDescription = typeof point === 'string' ? '' : point.description;
              return (
                <View key={idx} style={styles.strongPointItem}>
                  <Text style={styles.strongPointTitle}>
                    {spTitle}
                  </Text>
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
              <Text style={styles.concernsTitle}>
                {t('analysis.areasOfConcern')}
              </Text>
            </View>
            
            {analysisData?.concerns?.map((concern, idx) => {
              const concernTitle = typeof concern === 'string' ? concern : concern.title;
              const concernDescription = typeof concern === 'string' ? '' : concern.description;
              return (
                <View key={idx} style={styles.concernItem}>
                  <Text style={styles.concernTitle}>
                    {concernTitle}
                  </Text>
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
        <View style={styles.bottomLineAlert}>
          <View style={styles.bottomLineIcon}>
            <Text style={{ fontSize: 12, color: '#CA8A04' }}>⚠</Text>
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
