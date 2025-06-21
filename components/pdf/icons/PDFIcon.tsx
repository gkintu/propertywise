import React from 'react';
import { Svg, Path, Circle, Rect, G } from '@react-pdf/renderer';

export type IconName = 
  | 'CheckCircle'
  | 'AlertTriangle' 
  | 'Home'
  | 'Clock'
  | 'MapPin'
  | 'Bed'
  | 'Bath'
  | 'Car'
  | 'Search'
  | 'Upload'
  | 'X'
  | 'ExternalLink'
  | 'Info'
  | 'Warning'
  | 'Success'
  | 'Error'
  | 'FileText'
  | 'Eye'
  | 'TrendingUp';

interface PDFIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// Icon path data extracted from Lucide React icons
const iconPaths: Record<IconName, { paths: string[]; viewBox?: string; circles?: Array<{cx: string, cy: string, r: string}>; rects?: Array<{x: string, y: string, width: string, height: string}> }> = {
  CheckCircle: {
    paths: ['m9 12 2 2 4-4', 'M21.801 10A10 10 0 1 1 17 3.335'],
    viewBox: '0 0 24 24'
  },
  AlertTriangle: {
    paths: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z', 'M12 9v4', 'm12 17.02.01 0'],
    viewBox: '0 0 24 24'
  },
  Home: {
    paths: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
    viewBox: '0 0 24 24'
  },
  Clock: {
    paths: ['M15 12l-3-3v6'],
    circles: [{ cx: '12', cy: '12', r: '10' }],
    viewBox: '0 0 24 24'
  },
  MapPin: {
    paths: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'],
    circles: [{ cx: '12', cy: '10', r: '3' }],
    viewBox: '0 0 24 24'
  },
  Bed: {
    paths: ['M2 4v16', 'M2 8h18a2 2 0 0 1 2 2v10', 'M2 17h20', 'M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4'],
    viewBox: '0 0 24 24'
  },
  Bath: {
    paths: ['M2 12h20', 'M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6', 'M4 6V4a2 2 0 0 1 2-2h2', 'M10 2v4', 'M14 2v4'],
    viewBox: '0 0 24 24'
  },
  Car: {
    paths: ['M8 19h8', 'M6 19v-4L2 9l2-4h16l2 4-4 6v4'],
    circles: [{ cx: '8', cy: '19', r: '2' }, { cx: '16', cy: '19', r: '2' }],
    viewBox: '0 0 24 24'
  },
  Search: {
    paths: ['m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z'],
    viewBox: '0 0 24 24'
  },
  Upload: {
    paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
    viewBox: '0 0 24 24'
  },
  X: {
    paths: ['M18 6 6 18', 'M6 6l12 12'],
    viewBox: '0 0 24 24'
  },
  ExternalLink: {
    paths: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
    viewBox: '0 0 24 24'
  },
  Info: {
    paths: ['M12 16v-4', 'M12 8h.01'],
    circles: [{ cx: '12', cy: '12', r: '10' }],
    viewBox: '0 0 24 24'
  },
  Warning: {
    paths: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z', 'M12 9v4', 'm12 17.02.01 0'],
    viewBox: '0 0 24 24'
  },
  Success: {
    paths: ['m9 12 2 2 4-4'],
    circles: [{ cx: '12', cy: '12', r: '10' }],
    viewBox: '0 0 24 24'
  },
  Error: {
    paths: ['M18 6 6 18', 'M6 6l12 12'],
    circles: [{ cx: '12', cy: '12', r: '10' }],
    viewBox: '0 0 24 24'
  },
  TrendingUp: {
    paths: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
    viewBox: '0 0 24 24'
  },
  FileText: {
    paths: ['M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z', 'M14 2v6h6'],
    viewBox: '0 0 24 24'
  },
  Eye: {
    paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'],
    circles: [{ cx: '12', cy: '12', r: '3' }],
    viewBox: '0 0 24 24'
  }
};

export const PDFIcon: React.FC<PDFIconProps> = ({ 
  name, 
  size = 16, 
  color = '#000000'
}) => {
  const iconData = iconPaths[name];
  
  if (!iconData) {
    // Fallback to a simple circle if icon not found
    return (
      <Svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24"
      >
        <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }

  const { paths, circles, rects, viewBox = '0 0 24 24' } = iconData;

  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox={viewBox}
    >
      <G fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {circles?.map((circle, index) => (
          <Circle 
            key={`circle-${index}`}
            cx={circle.cx} 
            cy={circle.cy} 
            r={circle.r}
          />
        ))}
        {rects?.map((rect, index) => (
          <Rect 
            key={`rect-${index}`}
            x={rect.x} 
            y={rect.y} 
            width={rect.width} 
            height={rect.height}
          />
        ))}
        {paths.map((path, index) => (
          <Path 
            key={`path-${index}`}
            d={path}
          />
        ))}
      </G>
    </Svg>
  );
};

export default PDFIcon;
