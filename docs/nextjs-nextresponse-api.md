# NextResponse API Documentation

## Official Documentation

From: https://nextjs.org/docs/app/api-reference/functions/next-response

NextResponse extends the Web Response API with additional convenience methods.

## Constructor

Create a new NextResponse instance:

```typescript
import { NextResponse } from 'next/server'

// Basic response
return new NextResponse('Hello World')

// With options
return new NextResponse('Hello World', {
  status: 200,
  headers: {
    'Content-Type': 'text/plain',
  },
})
```

## Static Methods

### json()

Produce a response with the given JSON body:

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

### redirect()

Produce a response that redirects to a URL:

```typescript
import { NextResponse } from 'next/server'

return NextResponse.redirect(new URL('/new', request.url))
```

The URL can be created and modified before being used:

```typescript
import { NextResponse } from 'next/server'

// Given an incoming request...
const loginUrl = new URL('/login', request.url)
// Add ?from=/incoming-url to the /login URL
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// And redirect to the new URL
return NextResponse.redirect(loginUrl)
```

### rewrite()

Produce a response that rewrites (proxies) the given URL while preserving the original URL:

```typescript
import { NextResponse } from 'next/server'

// Incoming request: /about, browser shows /about
// Rewritten request: /proxy, browser shows /about
return NextResponse.rewrite(new URL('/proxy', request.url))
```

### next()

The `next()` method is useful for Middleware, as it allows you to return early and continue routing:

```typescript
import { NextResponse } from 'next/server'

return NextResponse.next()
```

You can also forward headers when producing the response:

```typescript
import { NextResponse } from 'next/server'

// Given an incoming request...
const newHeaders = new Headers(request.headers)
// Add a new header
newHeaders.set('x-version', '123')
// And produce a response with the new headers
return NextResponse.next({
  request: {
    // New request headers
    headers: newHeaders,
  },
})
```

## Cookies

Read or mutate the Set-Cookie header of the response.

### set(name, value)

Given a name, set a cookie with the given value on the response:

```typescript
// Given incoming request /home
let response = NextResponse.next()
// Set a cookie to hide the banner
response.cookies.set('show-banner', 'false')
// Response will have a `Set-Cookie:show-banner=false;path=/home` header
return response
```

### get(name)

Given a cookie name, return the value of the cookie:

```typescript
// Given incoming request /home
let response = NextResponse.next()
// { name: 'show-banner', value: 'false', Path: '/home' }
response.cookies.get('show-banner')
```

### getAll()

Given a cookie name, return the values of the cookie. If no name is given, return all cookies:

```typescript
// Given incoming request /home
let response = NextResponse.next()
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
response.cookies.getAll('experiments')
// Alternatively, get all cookies for the response
response.cookies.getAll()
```

### delete(name)

Given a cookie name, delete the cookie from the response:

```typescript
// Given incoming request /home
let response = NextResponse.next()
// Returns true for deleted, false is nothing is deleted
response.cookies.delete('experiments')
```

## Streaming Support

NextResponse can handle streaming responses by accepting a ReadableStream:

```typescript
import { NextResponse } from 'next/server'

// Create a ReadableStream
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('Hello ')
    controller.enqueue('World!')
    controller.close()
  }
})

return new NextResponse(stream, {
  headers: {
    'Content-Type': 'text/plain',
  },
})
```

## Headers

Set custom headers on the response:

```typescript
import { NextResponse } from 'next/server'

return new NextResponse('Hello World', {
  status: 200,
  headers: {
    'Content-Type': 'text/plain',
    'X-Custom-Header': 'custom-value',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
})
```

## Key Implementation Notes

1. **Web API Extension**: Extends standard Web Response API
2. **Cookie Management**: Built-in cookie handling methods
3. **Streaming Support**: Native support for ReadableStream
4. **Type Safety**: Full TypeScript support
5. **Middleware Integration**: Designed to work with Next.js middleware
6. **Performance**: Optimized for Edge Runtime
7. **Header Management**: Convenient header manipulation methods
