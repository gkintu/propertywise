# Server-Side PDF Generation Implementation Guide

## Overview

This document serves as a comprehensive guide for implementing server-side PDF generation in Next.js 15 applications using @react-pdf/renderer, based on official documentation and real-world examples.

## Documentation References

1. **[React PDF Server-Side Rendering](./react-pdf-server-side-rendering.md)** - Official @react-pdf/renderer documentation
2. **[Next.js 15 Route Handlers](./nextjs-15-route-handlers.md)** - Official Next.js API route documentation  
3. **[NextResponse API](./nextjs-nextresponse-api.md)** - Official NextResponse documentation
4. **[Invoice Generator Reference](./reference-invoice-generator.md)** - Complex production implementation
5. **[Repotalent Reference](./reference-repotalent.md)** - Clean, simple implementation
6. **[SayHi Resume Reference](./reference-sayhi-resume.md)** - Advanced styling and features

## Core Implementation Pattern

### 1. API Route Structure

```typescript
import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import React from "react";
import { PDFComponent } from "@/components/PDFComponent";

export const maxDuration = 60; // For long-running operations

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate request
    const data = await request.json();
    
    // 2. Generate PDF stream
    const stream = await ReactPDF.renderToStream(
      React.createElement(PDFComponent, { data })
    );
    
    // 3. Convert to Web Stream
    const webStream = toWebStream(stream);
    
    // 4. Return response with proper headers
    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}

function toWebStream(nodejsStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodejsStream.on('data', (chunk) => controller.enqueue(chunk));
      nodejsStream.on('end', () => controller.close());
      nodejsStream.on('error', (err) => controller.error(err));
    },
  });
}
```

### 2. PDF Component Structure

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  // More styles...
});

export const PDFComponent = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text>PDF Content</Text>
      </View>
    </Page>
  </Document>
);
```

### 3. Client-Side Integration

```typescript
const generatePDF = async (data) => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('PDF generation failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
  }
};
```

## Best Practices

### Error Handling
```typescript
// Input validation
const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

try {
  const validatedData = schema.parse(requestData);
} catch (error) {
  return NextResponse.json(
    { error: 'Invalid input data' },
    { status: 400 }
  );
}
```

### Headers Configuration
```typescript
return new NextResponse(webStream, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="document.pdf"',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});
```

### Performance Optimization
```typescript
// Use maxDuration for long-running operations
export const maxDuration = 60;

// Use streaming for memory efficiency
const stream = await ReactPDF.renderToStream(component);

// Proper stream handling
function toWebStream(nodejsStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodejsStream.on('data', chunk => controller.enqueue(chunk));
      nodejsStream.on('end', () => controller.close());
      nodejsStream.on('error', err => controller.error(err));
    },
  });
}
```

## Common Patterns

### 1. Dynamic Route Parameters
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Use id for data fetching
}
```

### 2. Data Fetching
```typescript
// External API
const data = await fetch('https://api.example.com/data')
  .then(res => res.json());

// Database query
const data = await db.select().from(table).where(eq(table.id, id));
```

### 3. Complex Styling
```typescript
const styles = StyleSheet.create({
  // Theme-aware styles
  page: {
    backgroundColor: isDarkMode ? '#111827' : '#ffffff',
    color: isDarkMode ? '#f9fafb' : '#111827',
  },
  // Responsive layouts
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Professional typography
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
```

## Advanced Features

### Custom Fonts
```typescript
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'CustomFont',
  src: '/fonts/custom-font.ttf',
});
```

### SVG Integration
```typescript
import { Svg, Path } from '@react-pdf/renderer';

<Svg width="24" height="24" viewBox="0 0 24 24">
  <Path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
</Svg>
```

### Multi-Page Documents
```typescript
<Document>
  <Page>
    <Text>Page 1 Content</Text>
  </Page>
  <Page>
    <Text>Page 2 Content</Text>
  </Page>
</Document>
```

## Troubleshooting

### Common Issues

1. **Stream Conversion Errors**
   - Ensure proper Node.js to Web Stream conversion
   - Handle all stream events (data, end, error)

2. **Component Type Errors**
   - Use `React.createElement` for server-side rendering
   - Cast to `React.ReactElement` if needed

3. **Font Loading Issues**
   - Register fonts at module level
   - Use absolute paths for font files

4. **Memory Issues**
   - Use `renderToStream` instead of `renderToBuffer`
   - Implement proper garbage collection

### Debugging
```typescript
// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  console.log('PDF generation debug info:', data);
}

// Add error boundaries
try {
  const stream = await ReactPDF.renderToStream(component);
} catch (error) {
  console.error('PDF generation failed:', error);
  // Return error response
}
```

## Security Considerations

1. **Input Validation**: Always validate input data
2. **Rate Limiting**: Implement rate limiting for PDF generation
3. **File Size Limits**: Set reasonable limits for generated PDFs
4. **Content Sanitization**: Sanitize user-provided content
5. **Access Control**: Implement proper authentication/authorization

## Testing Strategy

1. **Unit Tests**: Test PDF component rendering
2. **Integration Tests**: Test API route functionality
3. **Performance Tests**: Test with large documents
4. **Browser Tests**: Test download functionality
5. **Visual Tests**: Verify PDF output quality

This implementation guide provides a solid foundation for server-side PDF generation in modern Next.js applications.
