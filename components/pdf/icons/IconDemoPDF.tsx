import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { 
  PDFIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  HomeIcon,
  ClockIcon,
  MapPinIcon,
  BedIcon,
  BathIcon,
  CarIcon,
  FileTextIcon,
  EyeIcon,
  LucideIconForPDF 
} from './index';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1 solid #E5E7EB',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  iconLabel: {
    fontSize: 12,
    color: '#374151',
  },
});

/**
 * Demo PDF component showing all available icons
 */
export const IconDemoPDF: React.FC = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>PDF Icons Demo</Text>
      
      {/* Direct PDFIcon usage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Direct PDFIcon Usage</Text>
        
        <View style={styles.iconRow}>
          <PDFIcon name="CheckCircle" size={16} color="#059669" />
          <Text style={styles.iconLabel}>CheckCircle (Success)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <PDFIcon name="AlertTriangle" size={16} color="#DC2626" />
          <Text style={styles.iconLabel}>AlertTriangle (Warning)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <PDFIcon name="Home" size={16} color="#3B82F6" />
          <Text style={styles.iconLabel}>Home (Property)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <PDFIcon name="FileText" size={16} color="#3B82F6" />
          <Text style={styles.iconLabel}>FileText (Document)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <PDFIcon name="Eye" size={16} color="#374151" />
          <Text style={styles.iconLabel}>Eye (Key Findings)</Text>
        </View>
      </View>

      {/* Pre-built Icon Components */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pre-built Icon Components</Text>
        
        <View style={styles.iconRow}>
          <CheckCircleIcon />
          <Text style={styles.iconLabel}>CheckCircleIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <AlertTriangleIcon />
          <Text style={styles.iconLabel}>AlertTriangleIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <HomeIcon />
          <Text style={styles.iconLabel}>HomeIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <ClockIcon />
          <Text style={styles.iconLabel}>ClockIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <MapPinIcon />
          <Text style={styles.iconLabel}>MapPinIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <FileTextIcon />
          <Text style={styles.iconLabel}>FileTextIcon (default)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <EyeIcon />
          <Text style={styles.iconLabel}>EyeIcon (default)</Text>
        </View>
      </View>

      {/* Property-specific Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Analysis Icons</Text>
        
        <View style={styles.iconRow}>
          <BedIcon />
          <Text style={styles.iconLabel}>3 Bedrooms</Text>
        </View>
        
        <View style={styles.iconRow}>
          <BathIcon />
          <Text style={styles.iconLabel}>2 Bathrooms</Text>
        </View>
        
        <View style={styles.iconRow}>
          <CarIcon />
          <Text style={styles.iconLabel}>2 Car Garage</Text>
        </View>
      </View>

      {/* Lucide Icon Converter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lucide Icon Converter</Text>
        
        <View style={styles.iconRow}>
          <LucideIconForPDF iconName="CheckCircle" size={16} color="#10B981" />
          <Text style={styles.iconLabel}>Converted from CheckCircle</Text>
        </View>
        
        <View style={styles.iconRow}>
          <LucideIconForPDF iconName="TriangleAlert" size={16} color="#F59E0B" />
          <Text style={styles.iconLabel}>Converted from TriangleAlert</Text>
        </View>
        
        <View style={styles.iconRow}>
          <LucideIconForPDF iconName="CircleCheck" size={16} color="#059669" />
          <Text style={styles.iconLabel}>Converted from CircleCheck</Text>
        </View>
      </View>

      {/* Custom Sizes and Colors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Sizes and Colors</Text>
        
        <View style={styles.iconRow}>
          <CheckCircleIcon size={10} color="#84CC16" />
          <CheckCircleIcon size={14} color="#22C55E" />
          <CheckCircleIcon size={18} color="#059669" />
          <CheckCircleIcon size={22} color="#047857" />
          <Text style={styles.iconLabel}>Different sizes: 10px, 14px, 18px, 22px</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default IconDemoPDF;
