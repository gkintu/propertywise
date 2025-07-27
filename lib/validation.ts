
import { z } from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_MIME_TYPES = ['application/pdf'];

export const AnalyzePdfRequestSchema = z.object({
  file: z
    .instanceof(File, { message: 'A file upload is required.' })
    .refine((file) => file.size > 0, 'File cannot be empty.')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    )
    .refine(
      (file) => ACCEPTED_MIME_TYPES.includes(file.type),
      'Invalid file type. Only PDFs are allowed.'
    ),
  language: z.preprocess(
    (lang) => (typeof lang === 'string' && lang ? lang : 'en'),
    z.enum(['en', 'no'])
  ),
});

// New schema for blob-based analysis
export const AnalyzePdfFromBlobSchema = z.object({
  blobUrl: z.string().url('A valid blob URL is required.'),
  language: z.preprocess(
    (lang) => (typeof lang === 'string' && lang ? lang : 'en'),
    z.enum(['en', 'no'])
  ),
});
