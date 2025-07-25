TITLE: Install Vercel Blob Package
DESCRIPTION: Installs the `@vercel/blob` package using `pnpm`. This package is essential for interacting with Vercel Blob storage from your application.
SOURCE: https://vercel.com/docs/storage/vercel-blob/server-upload

LANGUAGE: Shell
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: Vercel Blob: Copy Existing Blob with copy() Method
DESCRIPTION: The `copy()` method is used to create a copy of an existing blob within Vercel Blob storage. This action counts as an Advanced Operation for billing purposes.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
copy()
```

----------------------------------------

TITLE: Listing and Downloading Vercel Blobs with SDK
DESCRIPTION: This code demonstrates how to list blobs from a Vercel Blob store using the `@vercel/blob` SDK and generate download links for each. It iterates through the retrieved blobs and creates an anchor tag for each, linking to its `downloadUrl` property, allowing users to download the files.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: javascript
CODE:
```
import { list } from '@vercel/blob';

export default async function Page() {
  const response = await list();

  return (
    <>
      {response.blobs.map((blob) => (
        <a key={blob.pathname} href={blob.downloadUrl}>
          {blob.pathname}
        </a>
      ))}
    </>
  );
}
```

----------------------------------------

TITLE: Vercel Blob: Client-Side Upload with upload() Method
DESCRIPTION: The `upload()` method facilitates client-side uploads of blobs to Vercel Blob. This action counts as an Advanced Operation for billing purposes.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
upload()
```

----------------------------------------

TITLE: Vercel Blob: Upload Blob with put() Method
DESCRIPTION: The `put()` method is used to upload a blob to Vercel Blob storage. This action counts as an Advanced Operation for billing. It is also utilized when uploading files through the Vercel dashboard.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
put()
```

----------------------------------------

TITLE: Install Vercel Blob Package
DESCRIPTION: Instructions to install the @vercel/blob package using pnpm, yarn, npm, or bun. This is the first step to integrate Vercel Blob into your project.
SOURCE: https://vercel.com/docs/storage/vercel-blob/client-upload

LANGUAGE: pnpm
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: Batch Delete All Vercel Blobs with Rate Limit Handling
DESCRIPTION: This function provides a robust solution for deleting all blobs in a Vercel Blob store in batches. It includes conservative batching, delays between batches, and exponential backoff with retries to handle `BlobServiceRateLimited` errors and avoid hitting API rate limits, ensuring all blobs are eventually deleted.
SOURCE: https://vercel.com/docs/storage/vercel-blob/examples

LANGUAGE: TypeScript
CODE:
```
import { list, del, BlobServiceRateLimited } from "@vercel/blob";
import { setTimeout } from "node:timers/promises";

async function deleteAllBlobs() {
  let cursor: string | undefined;
  let totalDeleted = 0;

  // Batch size to respect rate limits (conservative approach)
  const BATCH_SIZE = 100; // Conservative batch size
  const DELAY_MS = 1000; // 1 second delay between batches

  do {
    const listResult = await list({
      cursor,
      limit: BATCH_SIZE,
    });

    if (listResult.blobs.length > 0) {
      const batchUrls = listResult.blobs.map((blob) => blob.url);

      // Retry logic with exponential backoff
      let retries = 0;
      const maxRetries = 3;

      while (retries <= maxRetries) {
        try {
          await del(batchUrls);
          totalDeleted += listResult.blobs.length;
          console.log(
            `Deleted ${listResult.blobs.length} blobs (${totalDeleted} total)`
          );
          break; // Success, exit retry loop
        } catch (error) {
          retries++;

          if (retries > maxRetries) {
            console.error(
              `Failed to delete batch after ${maxRetries} retries:`,
              error
            );
            throw error; // Re-throw after max retries
          }

          // Exponential backoff: wait longer with each retry
          let backoffDelay = 2 ** retries * 1000;

          if (error instanceof BlobServiceRateLimited) {
            backoffDelay = error.retryAfter * 1000;
          }

          console.warn(
            `Retry ${retries}/${maxRetries} after ${backoffDelay}ms delay`
          );

          await setTimeout(backoffDelay);
        }

        await setTimeout(DELAY_MS);
      }
    }

    cursor = listResult.cursor;
  } while (cursor);

  console.log(`All blobs were deleted. Total: ${totalDeleted}`);
}

deleteAllBlobs().catch((error) => {
  console.error("An error occurred:", error);
});
```

----------------------------------------

TITLE: Install Vercel Blob Package
DESCRIPTION: This command installs the `@vercel/blob` package using pnpm, making it available for use in your project. It's the essential first step to integrate Vercel Blob into your application.
SOURCE: https://vercel.com/docs/vercel-blob/client-upload

LANGUAGE: pnpm
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: Display Images from Vercel Blob with Next.js Image
DESCRIPTION: Demonstrates how to fetch a list of uploaded blobs from Vercel Blob using the `list()` function and then render them in a Next.js application. It iterates through the retrieved blobs and displays each image using the `next/image` component.
SOURCE: https://vercel.com/docs/vercel-blob/server-upload

LANGUAGE: TypeScript
CODE:
```
import { list } from '@vercel/blob';
import Image from 'next/image';

export async function Images() {
  const { blobs } = await list();

  return (
    <section>
      {blobs.map((image, i) => (
        <Image
          priority={i < 2}
          key={image.pathname}
          src={image.url}
          alt="My Image"
          width={200}
          height={200}
        />
      ))}
    </section>
  );
}
```

----------------------------------------

TITLE: Forcing Browser Cache Refresh for Vercel Blob Images
DESCRIPTION: This HTML snippet illustrates how to force a browser to fetch an updated version of a Vercel Blob image by appending a unique query parameter (e.g., `?v=123456`) to the blob's URL. This technique bypasses browser caching, ensuring the latest content is displayed even if the browser has a cached version.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: html
CODE:
```
<img
  src="https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/blob-oYnXSVczoLa9yBYMFJOSNdaiiervF5.png?v=123456"
/>
```

----------------------------------------

TITLE: Vercel Blob SDK: list() Method
DESCRIPTION: Retrieves a list of blobs from Vercel Blob. Blobs are returned in lexicographical order by pathname. It supports filtering by prefix and pagination using cursor and limit options.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
list(options?: ListBlobOptions): Promise<ListBlobResult>
  options?: ListBlobOptions - Configuration options for listing blobs.
    cursor?: string - A cursor for pagination, used to retrieve the next set of results.
    limit?: number - The maximum number of blobs to return in a single request (e.g., 1000).
    prefix?: string - A string to filter blobs by, returning only those whose pathnames start with the given prefix (e.g., 'folder/').
  Returns: ListBlobResult - An object containing the list of blobs and potentially a next cursor.
    blobs: Blob[] - An array of blob objects.
    cursor?: string - A cursor for the next page of results, if available.
```

----------------------------------------

TITLE: Install Vercel Blob Package
DESCRIPTION: Installs the `@vercel/blob` package using pnpm, which is the primary dependency for interacting with Vercel Blob storage services.
SOURCE: https://vercel.com/docs/vercel-blob/server-upload

LANGUAGE: pnpm
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: Perform Partial Downloads with cURL Range Requests on Vercel Blob
DESCRIPTION: Vercel Blob supports HTTP range requests, allowing users to download only specific portions of a blob. These cURL examples demonstrate how to retrieve the first few bytes, the last few bytes, or a specific byte range from a Vercel Blob URL, optimizing data transfer for large files.
SOURCE: https://vercel.com/docs/storage/vercel-blob/examples

LANGUAGE: Terminal
CODE:
```
# First 4 bytes
curl -r 0-3 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 3.14

# Last 5 bytes
curl -r -5 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 58151

# Bytes 3-6
curl -r 3-6 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 4159
```

----------------------------------------

TITLE: Vercel Blob: List Blobs with list() Method
DESCRIPTION: The `list()` method is used to retrieve a list of blobs stored in your Vercel Blob store. This action counts as an Advanced Operation for billing and is frequently used when refreshing the file browser or navigating folders in the Vercel dashboard.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
list()
```

----------------------------------------

TITLE: Display Images from Vercel Blob in Next.js
DESCRIPTION: Retrieves a list of blobs from Vercel Blob storage and renders them using the `next/image` component. This example demonstrates how to fetch and display multiple images, optimizing the loading of initial images.
SOURCE: https://vercel.com/docs/storage/vercel-blob/server-upload

LANGUAGE: TypeScript
CODE:
```
import { list } from '@vercel/blob';
import Image from 'next/image';

export async function Images() {
  const { blobs } = await list();

  return (
    <section>
      {blobs.map((image, i) => (
        <Image
          priority={i < 2}
          key={image.pathname}
          src={image.url}
          alt="My Image"
          width={200}
          height={200}
        />
      ))}
    </section>
  );
}
```

----------------------------------------

TITLE: Upload a file using Vercel Blob SDK put function
DESCRIPTION: This snippet demonstrates how to upload a file to Vercel Blob using the `put` function from the `@vercel/blob` SDK. It takes the desired filename, the file content (e.g., an `imageFile` Blob or File object), and an options object. The `access: 'public'` option makes the uploaded blob publicly accessible.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: JavaScript
CODE:
```
import { put } from '@vercel/blob';

const blob = await put('avatar.jpg', imageFile, {
  access: 'public',
});
```

----------------------------------------

TITLE: Vercel Blob SDK: put() Method
DESCRIPTION: Uploads a file to Vercel Blob. For large files, it automatically handles multipart uploads, splitting, uploading, and reassembling the file. It also supports creating virtual folders by interpreting slashes in the pathname.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
put(pathname: string, body: ReadableStream | Blob | File | string | ArrayBuffer, options?: PutBlobOptions): Promise<PutBlobResult>
  pathname: string - The path and filename for the blob, e.g., 'folder/file.txt'. Slashes create virtual folders.
  body: ReadableStream | Blob | File | string | ArrayBuffer - The content of the blob.
  options?: PutBlobOptions - Configuration options for the upload.
    access: 'public' | 'private' - Specifies the access level for the blob.
```

----------------------------------------

TITLE: List Blobs within a Virtual Folder in Vercel Blob
DESCRIPTION: Shows how to retrieve a list of blobs located within a specific virtual folder by using the `list` function with a `prefix` option. This allows for filtering and displaying organized content.
SOURCE: https://vercel.com/docs/vercel-blob

LANGUAGE: javascript
CODE:
```
const listOfBlobs = await list({
  cursor,
  limit: 1000,
  prefix: 'folder/',
});
```

----------------------------------------

TITLE: Perform Range Requests with Vercel Blob using curl
DESCRIPTION: Demonstrates how to use `curl` to perform partial downloads (range requests) on Vercel Blob files. This allows fetching specific byte ranges from a blob, such as the first few bytes, last few bytes, or a custom range.
SOURCE: https://vercel.com/docs/vercel-blob/examples

LANGUAGE: Terminal
CODE:
```
# First 4 bytes
curl -r 0-3 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 3.14

# Last 5 bytes
curl -r -5 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 58151

# Bytes 3-6
curl -r 3-6 https://1sxstfwepd7zn41q.public.blob.vercel-storage.com/pi.txt
# 4159
```

----------------------------------------

TITLE: Upload a Public Blob with Vercel Blob SDK
DESCRIPTION: This JavaScript snippet demonstrates how to upload a file (blob) using the `put` function from the `@vercel/blob` SDK. It takes a filename, the file content, and an options object to set the access level to 'public', making the uploaded blob publicly accessible.
SOURCE: https://vercel.com/docs/vercel-blob

LANGUAGE: JavaScript
CODE:
```
import { put } from '@vercel/blob';

const blob = await put('avatar.jpg', imageFile, {
  access: 'public',
});
```

----------------------------------------

TITLE: Install Vercel Blob SDK using pnpm
DESCRIPTION: Install the @vercel/blob package using the pnpm package manager. This command is the initial step to integrate the Vercel Blob SDK into your project for storage operations.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: Shell
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: List Blobs by Mode
DESCRIPTION: Filter Blobs by either 'folded' or 'expanded' mode using the `--mode` option with `vercel blob list`. The default mode is 'expanded'.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob list --mode folded
```

----------------------------------------

TITLE: List files in Vercel Blob store using CLI
DESCRIPTION: Use the `vercel blob list` command to display all files currently stored in your Vercel Blob store.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob list
```

----------------------------------------

TITLE: Upload a file to Vercel Blob store using CLI
DESCRIPTION: Execute the `vercel blob put` command to upload a specified file from your local system to the Vercel Blob store.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob put [path-to-file]
```

----------------------------------------

TITLE: List and Display Blobs with Download URLs
DESCRIPTION: This code snippet demonstrates how to list blobs from Vercel Blob storage and generate download URLs for each. It uses the `@vercel/blob` SDK's `list` function to retrieve blob metadata and then renders a list of links, where each link's `href` is set to the `downloadUrl` property, ensuring the browser forces a download.
SOURCE: https://vercel.com/docs/vercel-blob

LANGUAGE: javascript
CODE:
```
import { list } from '@vercel/blob';

export default async function Page() {
  const response = await list();

  return (
    <>
      {response.blobs.map((blob) => (
        <a key={blob.pathname} href={blob.downloadUrl}>
          {blob.pathname}
        </a>
      ))}
    </>
  );
}
```

----------------------------------------

TITLE: Vercel CLI: vercel blob command
DESCRIPTION: Documents the usage and purpose of the `vercel blob` command within the Vercel CLI. This command is typically used for interacting with Vercel Blob storage.
SOURCE: https://vercel.com/docs/directory-listing

LANGUAGE: APIDOC
CODE:
```
vercel blob
```

----------------------------------------

TITLE: Remove Vercel Blob Store
DESCRIPTION: Use the `vercel blob store remove` command to delete a specific Blob store by its ID.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob store remove [store-id]
```

----------------------------------------

TITLE: Vercel Blob Size Limits
DESCRIPTION: Details on the cache size limit of 300MB per blob and the absolute maximum file size of 5TB. It explains the implications for blobs exceeding the cache limit, such as always counting as a cache MISS and incurring Fast Origin Transfer charges, and recommends multipart uploads for files larger than 100MB.
SOURCE: https://vercel.com/docs/storage/vercel-blob/usage-and-pricing

LANGUAGE: APIDOC
CODE:
```
Cache Size Limit: 300MB per blob
  Blobs larger than 300MB will not be cached
  Accessing these blobs will always count as a cache MISS (generating one Simple Operation)
  These large blobs will also incur Fast Origin Transfer charges for each access
Maximum File Size: 5TB (5,000GB)
  This is the absolute maximum size for any individual file uploaded to Vercel Blob
  For files larger than 100MB, we recommend using multipart uploads
```

----------------------------------------

TITLE: Get Vercel Blob Store Details
DESCRIPTION: Use the `vercel blob store get` command to retrieve information about a specific Blob store by its ID.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob store get [store-id]
```

----------------------------------------

TITLE: Create Blob with Virtual Folder Path
DESCRIPTION: Demonstrates how to create a blob within a virtual folder structure by including slashes in the pathname. Vercel Blob interprets slashes as folder delimiters for organization in listings and the file browser, without creating actual file system folders.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: javascript
CODE:
```
const blob = await put('folder/file.txt', 'Hello World!', { access: 'public' });
```

----------------------------------------

TITLE: Vercel Blob Storage: `upload()` Method API Reference
DESCRIPTION: The `upload()` method facilitates client-side uploads to Vercel Blob Storage. It fetches a client token from a specified server route (`handleUploadUrl`) and then uploads the provided blob. It supports various body types and offers options for access control, content type, multipart uploads, progress tracking, and operation cancellation.
SOURCE: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk

LANGUAGE: APIDOC
CODE:
```
upload(pathname, body, options);

Returns: {
  pathname: string;
  contentType: string;
  contentDisposition: string;
  url: string;
  downloadUrl: string;
}

Parameters:
- pathname (Required): string - A string specifying the base value of the return URL.
- body (Required): ReadableStream | String | ArrayBuffer | Blob - A blob object as `ReadableStream`, `String`, `ArrayBuffer` or `Blob` based on supported body types.
- options (Required): object
  - access (Required): "public" - Access level for the blob.
  - contentType (Optional): string - A string indicating the media type. By default, it's extracted from the pathname's extension.
  - handleUploadUrl (Required*): string - A string specifying the route to call for generating client tokens for client uploads.
  - clientPayload (Optional): string - A string to be sent to your `handleUpload` server code.
  - multipart (Optional): boolean - Pass `multipart: true` when uploading large files. It will split the file into multiple parts, upload them in parallel and retry failed parts.
  - abortSignal (Optional): AbortSignal - An AbortSignal to cancel the operation.
  - onUploadProgress (Optional): function({loaded: number, total: number, percentage: number}) - Callback to track upload progress.

Example URL:
url: "https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt"
```

----------------------------------------

TITLE: Vercel Blob: Delete Blob with del() Method
DESCRIPTION: The `del()` method is used to delete a blob from Vercel Blob storage. While it counts towards operation rate limits, delete operations are free of charge for billing purposes.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: APIDOC
CODE:
```
del()
```

----------------------------------------

TITLE: Batch Delete All Vercel Blobs with Rate Limit Handling
DESCRIPTION: Provides a function `deleteAllBlobs` to iteratively list and delete all blobs in a Vercel Blob store. It implements batch processing, a delay between batches, and robust retry logic with exponential backoff to handle `BlobServiceRateLimited` errors and avoid hitting API rate limits. This function is suitable for serverless environments or cron jobs.
SOURCE: https://vercel.com/docs/vercel-blob/examples

LANGUAGE: TypeScript
CODE:
```
import { list, del, BlobServiceRateLimited } from "@vercel/blob";
import { setTimeout } from "node:timers/promises";

async function deleteAllBlobs() {
  let cursor: string | undefined;
  let totalDeleted = 0;

  // Batch size to respect rate limits (conservative approach)
  const BATCH_SIZE = 100; // Conservative batch size
  const DELAY_MS = 1000; // 1 second delay between batches

  do {
    const listResult = await list({
      cursor,
      limit: BATCH_SIZE,
    });

    if (listResult.blobs.length > 0) {
      const batchUrls = listResult.blobs.map((blob) => blob.url);

      // Retry logic with exponential backoff
      let retries = 0;
      const maxRetries = 3;

      while (retries <= maxRetries) {
        try {
          await del(batchUrls);
          totalDeleted += listResult.blobs.length;
          console.log(
            `Deleted ${listResult.blobs.length} blobs (${totalDeleted} total)`
          );
          break; // Success, exit retry loop
        } catch (error) {
          retries++;

          if (retries > maxRetries) {
            console.error(
              `Failed to delete batch after ${maxRetries} retries:`, error
            );
            throw error; // Re-throw after max retries
          }

          // Exponential backoff: wait longer with each retry
          let backoffDelay = 2 ** retries * 1000;

          if (error instanceof BlobServiceRateLimited) {
            backoffDelay = error.retryAfter * 1000;
          }

          console.warn(
            `Retry ${retries}/${maxRetries} after ${backoffDelay}ms delay`
          );

          await setTimeout(backoffDelay);
        }

        await setTimeout(DELAY_MS);
      }
    }

    cursor = listResult.cursor;
  } while (cursor);

  console.log(`All blobs were deleted. Total: ${totalDeleted}`);
}

deleteAllBlobs().catch((error) => {
  console.error("An error occurred:", error);
});
```

----------------------------------------

TITLE: Delete a file from Vercel Blob store using CLI
DESCRIPTION: Utilize the `vercel blob del` command to remove a file from the Blob store, specifying its URL or pathname.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob del [url-or-pathname]
```

----------------------------------------

TITLE: Install Vercel Blob SDK using pnpm
DESCRIPTION: This command installs the `@vercel/blob` package, which is the first step to integrate Vercel Blob into your project. It works with any frontend framework and is necessary to use the SDK's functionalities.
SOURCE: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk

LANGUAGE: pnpm
CODE:
```
pnpm i @vercel/blob
```

----------------------------------------

TITLE: Example Vercel Blob Object with Random Suffix
DESCRIPTION: Illustrates a typical blob object returned by `put()` when `addRandomSuffix: true` is enabled, showing the dynamically generated suffix in the file path and name.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: JSON
CODE:
```
{
  pathname: 'profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt',
  contentType: 'text/plain',
  contentDisposition: 'attachment; filename="user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt"',
  url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt',
  downloadUrl: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345-NoOVGDVcqSPc7VYCUAGnTzLTG2qEM2.txt?download=1'
}
```

----------------------------------------

TITLE: Add a new Blob store using Vercel CLI
DESCRIPTION: Use the `vercel blob store add` command to create and register a new Blob store, providing a unique name for it.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob store add [name]
```

----------------------------------------

TITLE: Copy a file within Vercel Blob store using CLI
DESCRIPTION: The `vercel blob copy` command allows you to duplicate an existing file within the Blob store, specifying both the source and destination paths.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob copy [from-url-or-pathname] [to-pathname]
```

----------------------------------------

TITLE: Perform Automatic Multipart Upload with Vercel Blob put()
DESCRIPTION: Demonstrates how to initiate an automatic multipart upload for large files using the `put()` method from `@vercel/blob`. By setting `multipart: true` in the options, the API handles the entire process of splitting, parallel uploading, and completing the file upload seamlessly.
SOURCE: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk

LANGUAGE: JavaScript
CODE:
```
const blob = await put('large-movie.mp4', file, {
  access: 'public',
  multipart: true,
});
```

----------------------------------------

TITLE: Upload Multipart Chunks
DESCRIPTION: Demonstrates how to upload individual parts of a file using the `uploader.uploadPart` method. This phase requires managing memory usage and concurrent requests, with each part typically being a minimum of 5MB.
SOURCE: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk

LANGUAGE: JavaScript
CODE:
```
const part1 = await uploader.uploadPart(1, chunkBody1);
const part2 = await uploader.uploadPart(2, chunkBody2);
const part3 = await uploader.uploadPart(3, chunkBody3);
```

----------------------------------------

TITLE: Generate Unique Blob Pathnames with addRandomSuffix in JavaScript
DESCRIPTION: This JavaScript example illustrates how to utilize the `addRandomSuffix: true` option with the `put()` method. This automatically appends a unique random suffix to the blob's pathname, ensuring that new uploads do not overwrite existing content and create distinct URLs.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: JavaScript
CODE:
```
const blob = await put('avatar.jpg', imageFile, {
  access: 'public',
  addRandomSuffix: true // Creates a pathname like 'avatar-oYnXSVczoLa9yBYMFJOSNdaiiervF5.jpg'
});
```

----------------------------------------

TITLE: Upload Individual File Parts with Vercel Blob Uploader (JavaScript/TypeScript)
DESCRIPTION: Illustrates how to upload individual chunks of a file using the `uploadPart` method of the `Uploader` object. This phase requires careful management of memory usage and concurrent requests, with each part typically being at least 5MB.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: JavaScript
CODE:
```
const part1 = await uploader.uploadPart(1, chunkBody1);
const part2 = await uploader.uploadPart(2, chunkBody2);
const part3 = await uploader.uploadPart(3, chunkBody3);
```

----------------------------------------

TITLE: Upload Blob to Specific Folder using Vercel Blob SDK
DESCRIPTION: This example shows how to upload a file to an existing folder within your Vercel Blob storage by including the folder name in the `pathname` parameter of the `put()` method.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: TypeScript
CODE:
```
const imageFile = formData.get('image') as File;
const blob = await put(`existingBlobFolder/${imageFile.name}`, imageFile, {
  access: 'public',
  addRandomSuffix: true,
});
```

----------------------------------------

TITLE: Periodic Vercel Blob Backup to AWS S3 with Next.js Cron Job
DESCRIPTION: This TypeScript code demonstrates a periodic backup solution for Vercel Blob. It's designed to run as a Next.js API route (Cron Job), authenticates requests, lists all blobs from Vercel Blob, fetches their content, and streams them efficiently to a specified AWS S3 bucket, handling pagination automatically.
SOURCE: https://vercel.com/docs/vercel-blob/examples

LANGUAGE: typescript
CODE:
```
import { Readable } from "node:stream";
import { S3Client } from "@aws-sdk/client-s3";
import { list } from "@vercel/blob";
import { Upload } from "@aws-sdk/lib-storage";
import type { NextRequest } from "next/server";
import type { ReadableStream } from "node:stream/web";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const s3 = new S3Client({
    region: "us-east-1",
  });

  let cursor: string | undefined;

  do {
    const listResult = await list({
      cursor,
      limit: 250,
    });

    if (listResult.blobs.length > 0) {
      await Promise.all(
        listResult.blobs.map(async (blob) => {
          const res = await fetch(blob.url);
          if (res.body) {
            const parallelUploads3 = new Upload({
              client: s3,
              params: {
                Bucket: "vercel-blob-backup",
                Key: blob.pathname,
                Body: Readable.fromWeb(res.body as ReadableStream),
              },
              leavePartsOnError: false,
            });

            await parallelUploads3.done();
          }
        })
      );
    }

    cursor = listResult.cursor;
  } while (cursor);

  return new Response("Backup done!");
}
```

----------------------------------------

TITLE: Delete Blob from Vercel Blob Store (Next.js TypeScript API Route)
DESCRIPTION: Provides a Next.js API route example demonstrating how to delete a blob object from the Vercel Blob store. It uses the `del` function from `@vercel/blob` and retrieves the URL to delete from the request's search parameters.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: TypeScript
CODE:
```
import { del } from '@vercel/blob';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get('url') as string;
  await del(urlToDelete);

  return new Response();
}
```

----------------------------------------

TITLE: Upload Blob with Read-Write Token
DESCRIPTION: Specify your Blob read-write token using the `--rw-token` option when uploading a file with `vercel blob put`.
SOURCE: https://vercel.com/docs/cli/blob

LANGUAGE: terminal
CODE:
```
vercel blob put image.jpg --rw-token [rw-token]
```

----------------------------------------

TITLE: Vercel CLI: blob Command
DESCRIPTION: Documents the `vercel blob` command, providing its basic syntax and purpose within the Vercel Command Line Interface.
SOURCE: https://vercel.com/docs/conformance/dashboard-overview/catalog

LANGUAGE: cli
CODE:
```
vercel blob
```

----------------------------------------

TITLE: Example Vercel Blob Object Without Random Suffix
DESCRIPTION: Shows a blob object returned by `put()` when `addRandomSuffix: true` is not used (default behavior), demonstrating a static file path and name without a generated suffix.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: JSON
CODE:
```
{
  pathname: 'profilesv1/user-12345.txt',
  contentType: 'text/plain',
  contentDisposition: 'attachment; filename="user-12345.txt"',
  url: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345.txt',
  downloadUrl: 'https://ce0rcu23vrrdzqap.public.blob.vercel-storage.com/profilesv1/user-12345.txt?download=1'
}
```

----------------------------------------

TITLE: Vercel Blob Object Metadata Structure
DESCRIPTION: This section describes the metadata fields available for a Vercel Blob object, which can be reviewed in the Vercel Storage Dashboard. It lists properties such as file name, path, size, upload date, content type, and HTTP headers.
SOURCE: https://vercel.com/docs/storage/vercel-blob/client-upload

LANGUAGE: APIDOC
CODE:
```
Blob Object Metadata:
  - file name: string
  - path: string
  - size: number (bytes)
  - uploaded date: datetime
  - content type: string (MIME type)
  - HTTP headers: object (key-value pairs)
```

----------------------------------------

TITLE: Upload File to a Specific Folder in Vercel Blob
DESCRIPTION: Demonstrates how to upload a file to a virtual folder within Vercel Blob by including the folder name in the file path. This creates a logical folder structure for organization.
SOURCE: https://vercel.com/docs/vercel-blob

LANGUAGE: javascript
CODE:
```
const blob = await put('folder/file.txt', 'Hello World!', { access: 'public' });
```

----------------------------------------

TITLE: Generate Unique Blob Pathnames Programmatically in JavaScript
DESCRIPTION: This JavaScript snippet demonstrates an alternative method for preventing blob overwrites by programmatically generating unique pathnames. It shows how to incorporate a timestamp into the filename before uploading, ensuring each upload has a distinct identifier.
SOURCE: https://vercel.com/docs/storage/vercel-blob

LANGUAGE: JavaScript
CODE:
```
const timestamp = Date.now();
const blob = await put(`user-profile-${timestamp}.jpg`, imageFile, {
  access: 'public',
});
```

----------------------------------------

TITLE: Upload Blob using Vercel Blob SDK in Next.js App Router
DESCRIPTION: This example demonstrates how to create a Next.js API route (`app/upload/route.ts`) that accepts a file via `multipart/form-data` and uploads it to Vercel Blob storage using the `@vercel/blob` SDK's `put` method. It returns a unique URL for the uploaded blob.
SOURCE: https://vercel.com/docs/vercel-blob/using-blob-sdk

LANGUAGE: TypeScript
CODE:
```
import { put } from '@vercel/blob';

export async function PUT(request: Request) {
  const form = await request.formData();
  const file = form.get('file') as File;
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return Response.json(blob);
}
```