import React from 'react';
import { Svg, Path, Circle, Rect, G, Polygon } from '@react-pdf/renderer';

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
  | 'TrendingUp'
  | 'Maximize2'
  | 'Calendar'
  | 'Droplets'
  | 'Zap'
  | 'Scale'
  | 'Bug'
  | 'Wrench'
  | 'Beaker'
  | 'DollarSign';

interface PDFIconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// Icon path data extracted from Lucide React icons
const iconPaths: Record<IconName, { paths: string[]; viewBox?: string; strokeWidth?: number; circles?: Array<{cx: string, cy: string, r: string}>; rects?: Array<{x: string, y: string, width: string, height: string, rx?: string}>; polygons?: Array<{points: string}> }> = {
  CheckCircle: {
    paths: ['m9 12 2 2 4-4'],
    circles: [{ cx: '12', cy: '12', r: '10' }],
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
    paths: ['m22 7-8.5 8.5-5-5L2 17', 'm16 7h6v6'],
    viewBox: '0 0 24 24'
  },
  FileText: {
    paths: [
      'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z',
      'm15 2 5 5',
      'M10 9h4',
      'M10 13h6',
      'M10 17h6'
    ],
    viewBox: '0 0 24 24'
  },
  Eye: {
    paths: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'],
    circles: [{ cx: '12', cy: '12', r: '3' }],
    viewBox: '0 0 24 24'
  },
  Maximize2: {
    paths: ['M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7'],
    viewBox: '0 0 24 24'
  },
  Calendar: {
    paths: ['M8 2v4', 'M16 2v4', 'M3 10h18'],
    rects: [{ x: '3', y: '4', width: '18', height: '18', rx: '2' }],
    viewBox: '0 0 24 24'
  },
  Droplets: {
    paths: ['M17 14.5c0-2.5-2-4.5-5-4.5s-5 2-5 4.5c0 2.5 2 4.5 5 4.5s5-2 5-4.5z', 'M12 22a7 7 0 0 0 7-7c0-2.2-1-4-3-5.5s-3.5-2-5.5-3.5a7 7 0 0 0-7 7c0 2.2 1 4 3 5.5s3.5 2 5.5 3.5z'],
    viewBox: '0 0 24 24'
  },
  Zap: {
    paths: [],
    polygons: [{ points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' }],
    viewBox: '0 0 24 24'
  },
  Scale: {
    paths: ['m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z', 'm2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z', 'M7 21h10', 'M12 3v18', 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'],
    viewBox: '0 0 24 24'
  },
  Bug: {
    paths: ['m8 2 1.88 1.88', 'M14.12 3.88 16 2', 'M9 7.13v-1a3.003 3.003 0 1 1 6 0v1', 'M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6', 'M12 20v-9', 'M6.53 9C4.6 8.8 3 7.1 3 5', 'M6 13H2', 'M3 21c0-2.1 1.7-3.9 3.8-4', 'M20.97 5c0 2.1-1.6 3.8-3.5 4', 'M22 13h-4', 'M17.2 17c2.1.1 3.8 1.9 3.8 4'],
    viewBox: '0 0 24 24'
  },
  Wrench: {
    paths: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
    viewBox: '0 0 24 24'
  },
  Beaker: {
    paths: ['M4.5 3h15', 'M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3', 'M6 14h12'],
    viewBox: '0 0 24 24'
  },
  DollarSign: {
    paths: ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
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

  const { paths, circles, rects, polygons, strokeWidth = 2, viewBox = '0 0 24 24' } = iconData;

  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox={viewBox}
    >
      <G fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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
            rx={rect.rx}
          />
        ))}
        {polygons?.map((polygon, index) => (
          <Polygon
            key={`polygon-${index}`}
            points={polygon.points}
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