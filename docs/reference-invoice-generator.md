# Reference Implementation: Invoice Generator

## Repository
**Source**: https://github.com/kevinberlanga/invoice-generator

This repository provides an excellent real-world example of server-side PDF generation using Next.js 15, React 19, `renderToStream`, and `NextResponse`.

## Key Files

### API Route Implementation
**File**: `src/app/api/generate-invoice/[uuid]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import ReactPDF from "@react-pdf/renderer";
import React from "react";
import Invoice, { ItemData } from "./Invoice";

export const maxDuration = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
  const { uuid } = await params;
  console.log("uuid", uuid);
  
  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  if (!uuidRegex.test(uuid)) {
    return new NextResponse(JSON.stringify({ error: "Invalid UUID format" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch data from external API
  const itemData: ItemData = await fetch(
    `https://garage-backend.onrender.com/getListing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uuid,
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => {
      const {
        id,
        listingTitle,
        sellingPrice,
        itemBrand,
        listingDescription,
        // ... more fields
      } = data?.result?.listing;
      
      return {
        user,
        listingId: id,
        listingTitle,
        sellingPrice,
        // ... transformed data
      };
    });

  // Generate PDF using renderToStream
  const stream = await ReactPDF.renderToStream(
    React.createElement(Invoice, { data: itemData }),
  );

  return new NextResponse(toWebStream(stream), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${uuid}.pdf"`,
    },
  });
}

// Convert Node.js stream to Web Stream
function toWebStream(nodejsStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodejsStream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });

      nodejsStream.on("end", () => {
        controller.close();
      });

      nodejsStream.on("error", (err) => {
        controller.error(err);
      });
    },
  });
}
```

### PDF Component Implementation
**File**: `src/app/api/generate-invoice/[uuid]/Invoice.tsx`

```typescript
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  DocumentProps,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import sharp from "sharp";

export type ItemData = {
  listingId: string;
  user: {
    id: string;
    email: string;
  };
  listingTitle: string;
  sellingPrice: number;
  // ... more fields
};

// Create styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  // ... more styles
});

// Create Document Component
const Invoice = ({ data, ...props }: { data: ItemData } & DocumentProps) => {
  const {
    user,
    listingTitle,
    sellingPrice,
    // ... destructure data
  } = data;

  return (
    <Document {...props}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Invoice</Text>
            <Text style={styles.headerSubtitle}>
              Date of Issue: {new Date().toLocaleDateString("en-US")}
            </Text>
            {/* More header content */}
          </View>
        </View>
        
        {/* Invoice content */}
        <View style={styles.mainSection}>
          <Text style={{ marginBottom: 10 }}>Invoice Details</Text>
          {/* Invoice table and details */}
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Sample Copy</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;

// Image resizing helper
function resize(
  url: string,
  { width, height }: { width: number; height: number },
): () => Promise<Buffer> {
  return async () => {
    const imageResponse = await fetch(
      url + "?width=3840&quality=75&resize=contain",
    );
    const imageBuffer = await imageResponse.arrayBuffer();
    return await sharp(Buffer.from(imageBuffer))
      .resize(width * 2, height * 2, {
        fit: "contain",
        position: "top",
        background: "white",
      })
      .toBuffer();
  };
}
```

### Client-Side Usage
**File**: `src/components/ListingLinkForm.tsx`

```typescript
const onSubmit = () => {
  const uuid = extractUuidFromUrl(form.getValues().url);
  const href = `/api/generate-invoice/${uuid}`;

  // Download as invoice.pdf
  const a = document.createElement("a");
  a.href = href;
  a.download = `invoice-${uuid}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

## Key Implementation Patterns

### 1. Stream Conversion
The most critical part is converting Node.js ReadableStream to Web ReadableStream:

```typescript
function toWebStream(nodejsStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodejsStream.on("data", (chunk) => controller.enqueue(chunk));
      nodejsStream.on("end", () => controller.close());
      nodejsStream.on("error", (err) => controller.error(err));
    },
  });
}
```

### 2. Error Handling
Proper validation and error responses:

```typescript
const uuidRegex = /^[0-9a-fA-F-]{36}$/;
if (!uuidRegex.test(uuid)) {
  return new NextResponse(JSON.stringify({ error: "Invalid UUID format" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
```

### 3. PDF Headers
Correct headers for PDF download:

```typescript
return new NextResponse(toWebStream(stream), {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="invoice-${uuid}.pdf"`,
  },
});
```

### 4. maxDuration Configuration
For long-running PDF generation:

```typescript
export const maxDuration = 60;
```

### 5. Dynamic Route Parameters
Handling Next.js 15 dynamic routes:

```typescript
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
  const { uuid } = await params;
  // ...
}
```

## Architecture Benefits

1. **Server-Side Processing**: PDF generation doesn't block the client
2. **Streaming**: Memory-efficient for large documents
3. **Type Safety**: Full TypeScript support throughout
4. **Error Handling**: Proper HTTP status codes and error messages
5. **Performance**: Uses Node.js streams for optimal performance
6. **Scalability**: Server-side processing scales better than client-side

## Integration Notes

- Works with external APIs for data fetching
- Supports image processing (sharp library)
- Handles complex PDF layouts with tables and styling
- Uses SVG graphics for logos and icons
- Implements proper caching strategies
