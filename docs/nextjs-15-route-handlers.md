# Next.js 15 Route Handlers Documentation

## Official Documentation

From: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.

## HTTP Methods

A route file allows you to create custom request handlers for a given route. The following HTTP methods are supported: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

```typescript
export async function GET(request: Request) {}
export async function HEAD(request: Request) {}
export async function POST(request: Request) {}
export async function PUT(request: Request) {}
export async function DELETE(request: Request) {}
export async function PATCH(request: Request) {}
export async function OPTIONS(request: Request) {}
```

## Parameters

### request (optional)

The `request` object is a NextRequest object, which is an extension of the Web Request API.

```typescript
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl
}
```

### context (optional)

- `params`: a promise that resolves to an object containing the dynamic route parameters for the current route.

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team } = await params
}
```

## Examples

### Streaming

Streaming is commonly used in combination with Large Language Models (LLMs), such as OpenAI, for AI-generated content.

```typescript
// Basic streaming example
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
  return new Response(stream)
}
```

### Request Body

Read the Request body using standard Web API methods:

```typescript
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

### Headers

You can read headers with `headers` from `next/headers`:

```typescript
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')
  
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

### Cookies

Read or set cookies with `cookies` from `next/headers`:

```typescript
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

### URL Query Parameters

The request object includes additional convenience methods for handling query parameters:

```typescript
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```

### CORS

Set CORS headers for a specific Route Handler:

```typescript
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### Non-UI Responses

You can use Route Handlers to return non-UI content:

```typescript
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Next.js Documentation</title>
        <link>https://nextjs.org/docs</link>
        <description>The React Framework for the Web</description>
      </channel>
    </rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

## Segment Config Options

Route Handlers use the same route segment configuration as pages and layouts:

```typescript
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 60
```

## Key Implementation Notes

1. **Web Standards**: Built on Web Request and Response APIs
2. **TypeScript Support**: Full TypeScript support with NextRequest/NextResponse
3. **Streaming Support**: Native support for streaming responses
4. **Middleware Integration**: Works with Next.js middleware
5. **Edge Runtime**: Can run on Edge Runtime for better performance
6. **Caching**: Supports various caching strategies
7. **Error Handling**: Integrate with Next.js error handling systems
