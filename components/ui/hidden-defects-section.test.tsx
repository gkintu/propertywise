import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HiddenDefectsSection } from './hidden-defects-section';
import { HiddenDefect } from '@/lib/types';

// Mock the useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'hiddenDefects.title': 'Hidden Property Defects',
      'hiddenDefects.description': 'Potential issues that may not be immediately visible',
      'hiddenDefects.signsToLookFor': 'Signs to Look For',
      'hiddenDefects.consequences': 'Potential Consequences', 
      'hiddenDefects.preventiveMeasures': 'What to Do Before Purchase',
      'hiddenDefects.actionRequired': 'Recommended Action',
      'hiddenDefects.riskLevels.low': 'Low Risk',
      'hiddenDefects.riskLevels.medium': 'Medium Risk',
      'hiddenDefects.riskLevels.high': 'High Risk',
      'hiddenDefects.categories.moisture_water_damage.title': 'Moisture & Water Damage',
      'hiddenDefects.categories.electrical_faults.title': 'Electrical Faults',
      'hiddenDefects.categories.roof_structural_issues.title': 'Roof & Structural Issues',
    };
    return translations[key] || key;
  }
}));

describe('HiddenDefectsSection', () => {
  const mockHiddenDefects: HiddenDefect[] = [
    {
      category: 'moisture_water_damage',
      riskLevel: 'high',
      signsToLookFor: ['Dark stains on walls', 'Musty odors', 'Peeling paint'],
      consequences: 'Structural damage and health risks from mold',
      preventiveMeasures: 'Request moisture inspection and check for proper ventilation',
      actionRequired: 'Have professional moisture assessment before purchase'
    },
    {
      category: 'electrical_faults',
      riskLevel: 'medium',
      signsToLookFor: ['Flickering lights', 'Old wiring'],
      consequences: 'Safety hazards and expensive repairs',
      preventiveMeasures: 'Request electrical inspection'
    }
  ];

  it('renders hidden defects section with all defects', () => {
    render(<HiddenDefectsSection hiddenDefects={mockHiddenDefects} />);
    
    expect(screen.getByText('Hidden Property Defects')).toBeInTheDocument();
    expect(screen.getByText('Moisture & Water Damage')).toBeInTheDocument();
    expect(screen.getByText('Electrical Faults')).toBeInTheDocument();
  });

  it('displays risk levels correctly', () => {
    render(<HiddenDefectsSection hiddenDefects={mockHiddenDefects} />);
    
    expect(screen.getByText('High Risk')).toBeInTheDocument();
    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
  });

  it('expands accordion items when clicked', () => {
    render(<HiddenDefectsSection hiddenDefects={mockHiddenDefects} />);
    
    // Initially, detailed content should not be visible
    expect(screen.queryByText('Dark stains on walls')).not.toBeInTheDocument();
    
    // Click on the first accordion trigger
    const moistureAccordion = screen.getByText('Moisture & Water Damage');
    fireEvent.click(moistureAccordion);
    
    // Now the detailed content should be visible
    expect(screen.getByText('Dark stains on walls')).toBeInTheDocument();
    expect(screen.getByText('Musty odors')).toBeInTheDocument();
    expect(screen.getByText('Structural damage and health risks from mold')).toBeInTheDocument();
  });

  it('renders nothing when no hidden defects provided', () => {
    const { container } = render(<HiddenDefectsSection hiddenDefects={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles missing actionRequired field gracefully', () => {
    const defectWithoutAction = mockHiddenDefects[1]; // electrical_faults doesn't have actionRequired
    render(<HiddenDefectsSection hiddenDefects={[defectWithoutAction]} />);
    
    const electricalAccordion = screen.getByText('Electrical Faults');
    fireEvent.click(electricalAccordion);
    
    expect(screen.getByText('Safety hazards and expensive repairs')).toBeInTheDocument();
    expect(screen.getByText('Request electrical inspection')).toBeInTheDocument();
    // actionRequired section should not be present
    expect(screen.queryByText('Recommended Action')).not.toBeInTheDocument();
  });
});
