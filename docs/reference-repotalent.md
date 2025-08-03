# Reference Implementation: Repotalent

## Repository
**Source**: https://github.com/johanmic/repotalent

This repository demonstrates a clean server-side PDF generation implementation with Next.js and @react-pdf/renderer.

## Key Implementation File
**File**: `src/app/api/pdf/render/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { CVDocument } from '@/components/CVDocument';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate PDF stream
    const stream = await renderToStream(
      <CVDocument data={data} />
    );

    // Convert to web stream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
```

## Key Features

### 1. Clean Architecture
- Simple, focused API route
- Clear separation of concerns
- Minimal dependencies

### 2. JSX Syntax
Unlike other examples, this uses JSX directly instead of React.createElement:

```typescript
const stream = await renderToStream(
  <CVDocument data={data} />
);
```

### 3. Error Handling
Comprehensive error handling with proper HTTP responses:

```typescript
try {
  // PDF generation logic
} catch (error) {
  return NextResponse.json(
    { error: 'Failed to generate PDF' },
    { status: 500 }
  );
}
```

### 4. Stream Processing
Standard Node.js to Web Stream conversion pattern:

```typescript
const webStream = new ReadableStream({
  start(controller) {
    stream.on('data', (chunk) => controller.enqueue(chunk));
    stream.on('end', () => controller.close());
    stream.on('error', (err) => controller.error(err));
  },
});
```

## Component Structure

The CVDocument component follows standard @react-pdf/renderer patterns:

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

export const CVDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>CV Content</Text>
      </View>
    </Page>
  </Document>
);
```

## Advantages of This Approach

1. **Simplicity**: Minimal, focused implementation
2. **Readability**: JSX syntax is more readable than React.createElement
3. **Maintainability**: Clean separation between PDF logic and business logic
4. **Performance**: Efficient stream handling
5. **Type Safety**: Full TypeScript support

## Comparison with Other Implementations

| Feature | Repotalent | Invoice Generator | PropertyWise |
|---------|------------|-------------------|--------------|
| Syntax | JSX | React.createElement | Mixed |
| Complexity | Simple | Complex | Medium |
| Error Handling | Basic | Comprehensive | Advanced |
| Validation | None | UUID validation | Zod schema |
| Data Source | Request body | External API | Request body |

## Best Practices Demonstrated

1. **Keep API routes focused**: Single responsibility principle
2. **Use JSX when possible**: More readable than createElement
3. **Handle streams properly**: Always handle data, end, and error events
4. **Return appropriate headers**: Content-Type and Content-Disposition
5. **Implement error boundaries**: Catch and handle PDF generation errors

## Integration Notes

- Works well with form submissions
- Suitable for simple to medium complexity PDFs
- Easy to extend with additional features
- Good starting point for custom implementations
