#!/usr/bin/env node

/**
 * Script to upload demo PDF files to Vercel Blob storage
 * Run this once to get permanent blob URLs for demo files
 * 
 * Usage: node scripts/upload-demo-files.js
 */

import dotenv from 'dotenv';
import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function uploadDemoFiles() {
  const demoFiles = [
    {
      name: 'Alv Johnsens vei 1 - Drammen - Salgsoppgave.pdf',
      displayName: 'Alv Johnsens vei 1 - Drammen',
      blobName: 'demo-alv-johnsens-vei-1.pdf'
    },
    {
      name: 'Bolette brygge 5 - Oslo - salgsoppgave.pdf',
      displayName: 'Bolette brygge 5 - Oslo',
      blobName: 'demo-bolette-brygge-5.pdf'
    },
    {
      name: 'Sanengveien 1 - Fredrikstad - salgsoppgave.pdf',
      displayName: 'Sanengveien 1 - Fredrikstad',
      blobName: 'demo-sanengveien-1.pdf'
    }
  ];

  console.log('🚀 Starting demo file upload to Vercel Blob...\n');

  const results = [];

  for (const file of demoFiles) {
    try {
      console.log(`📄 Uploading: ${file.displayName}`);
      
      const filePath = join(process.cwd(), 'public', 'demo-pdfs', file.name);
      const fileBuffer = await readFile(filePath);
      
      const blob = await put(file.blobName, fileBuffer, {
        access: 'public',
        contentType: 'application/pdf'
      });
      
      results.push({
        ...file,
        blobUrl: blob.url,
        size: fileBuffer.length
      });
      
      console.log(`✅ Success: ${blob.url}`);
      console.log(`   Size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB\n`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${file.displayName}:`, error);
    }
  }

  console.log('📋 Summary of uploaded files:\n');
  console.log('Copy this into your DemoFilesSection.tsx:\n');
  console.log('```tsx');
  console.log('const demoFiles = [');
  
  results.forEach((file, index) => {
    console.log(`  {`);
    console.log(`    name: "${file.displayName}",`);
    console.log(`    path: "/demo-pdfs/${file.name}",`);
    console.log(`    blobUrl: "${file.blobUrl}",`);
    console.log(`  }${index < results.length - 1 ? ',' : ''}`);
  });
  
  console.log('];');
  console.log('```\n');
  
  console.log('🎉 Demo file upload complete!');
}

uploadDemoFiles().catch(console.error);
