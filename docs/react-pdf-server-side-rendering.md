# React PDF Server-Side Rendering Documentation

## Official Documentation

### renderToStream API

From: https://react-pdf.org/node#rendertostream

**Helper function to render a PDF into a Node Stream.**

#### Usage

```javascript
const MyDocument = () => (
  <Document>
    <Page>
      <Text>React-pdf</Text>
    </Page>
  </Document>
);

const stream = await renderToStream(<MyDocument />);
```

#### Arguments

| Parameter | Description | Default |
|-----------|-------------|---------|
| document | Document's root element to be rendered | undefined |

#### Returns

PDF document Stream

---

## Advanced Features

### Usage with Express.js (Node only)

```javascript
import React from 'react';
import ReactPDF from '@react-pdf/renderer';

const pdfStream = await ReactPDF.renderToStream(<MyDocument />);
res.setHeader('Content-Type', 'application/pdf');
pdfStream.pipe(res);
pdfStream.on('end', () => console.log('Done streaming, response sent.'));
```

### Page Wrapping

React-pdf has a built-in wrapping engine that is enabled by default for creating paged documents.

#### Breakable vs. Unbreakable Components

- **Breakable components**: Try to fill up remaining space before jumping to new page (View, Text, Link)
- **Unbreakable components**: Indivisible - if no space, rendered on following page (Image)

#### Page Breaks

Add page breaks using the `break` prop:

```javascript
import { Document, Page, Text } from '@react-pdf/renderer'

const doc = () => (
  <Document>
    <Page wrap>
      <Text break>
        // This will force a new page
      </Text>
    </Page>
  </Document>
);
```

#### Fixed Components

Use `fixed` prop for components that should appear on all pages (headers, footers):

```javascript
import { Document, Page, View } from '@react-pdf/renderer'

const doc = () => (
  <Document>
    <Page wrap>
      <View fixed>
        // This appears on all pages
      </View>
    </Page>
  </Document>
);
```

### Dynamic Content

Render dynamic text based on context:

```javascript
import { Document, Page } from '@react-pdf/renderer'

const doc = () => (
  <Document>
    <Page wrap>
      <Text render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);
```

#### Available Arguments

| Parameter | Description | Type |
|-----------|-------------|------|
| pageNumber | Current page number | Integer |
| totalPages | Total amount of pages in final document | Integer |
| subPageNumber | Current subpage in Page component | Integer |
| subPageTotalPages | Total amount of pages in Page component | Integer |

### Rendering Large Documents

For documents with 30+ pages in browser, use web workers to avoid blocking the main thread.

### Debugging

Set `debug={true}` on any valid primitive (except Document) to see layout debugging information.

### Hyphenation

React-pdf implements the Knuth and Plass line breaking algorithm. You can customize hyphenation:

```javascript
import { Font } from '@react-pdf/renderer'

const hyphenationCallback = (word) => {
  // Return word syllables in an array
}

Font.registerHyphenationCallback(hyphenationCallback);
```

---

## Key Implementation Notes

1. **Server-Side Only**: `renderToStream` is designed for Node.js environments
2. **Stream Handling**: Returns Node.js ReadableStream that needs conversion for web APIs
3. **Performance**: More efficient than `renderToBuffer` for large documents
4. **Error Handling**: Proper stream error handling is essential
5. **Memory Management**: Streaming reduces memory footprint compared to buffer methods
