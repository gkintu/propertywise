import { useState, useRef, useEffect } from 'react'
import { toast } from "sonner"
import { useTranslations } from 'next-intl'
import { upload } from '@vercel/blob/client'

// Demo file blob URLs that should never be deleted
const DEMO_FILE_BLOB_IDENTIFIERS = [
  'demo-alv-johnsens-vei-1',
  'demo-bolette-brygge-5', 
  'demo-sanengveien-1'
];

const isDemoFileBlob = (blobUrl: string): boolean => {
  return DEMO_FILE_BLOB_IDENTIFIERS.some(identifier => blobUrl.includes(identifier));
};

export function useFileUpload() {
  const t = useTranslations('HomePage')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Session and blob tracking
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('upload-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('upload-session-id', sessionId);
    }
    return sessionId;
  };

  const trackBlobForCleanup = (blobUrl: string) => {
    const sessionId = getSessionId();
    const allBlobs = JSON.parse(localStorage.getItem('user-uploaded-blobs') || '[]');
    
    const blobEntry = {
      url: blobUrl,
      timestamp: Date.now(),
      processed: false,
      sessionId: sessionId,
      active: true
    };
    
    allBlobs.push(blobEntry);
    localStorage.setItem('user-uploaded-blobs', JSON.stringify(allBlobs));
    console.log(`🏷️ Tracked blob for session ${sessionId}: ${blobUrl}`);
  };

  const markBlobProcessed = (blobUrl: string) => {
    const allBlobs = JSON.parse(localStorage.getItem('user-uploaded-blobs') || '[]');
    
    const updatedBlobs = allBlobs.map((blob: { url: string; processed: boolean; active: boolean }) => 
      blob.url === blobUrl ? { ...blob, processed: true, active: false } : blob
    );
    
    localStorage.setItem('user-uploaded-blobs', JSON.stringify(updatedBlobs));
    console.log(`✅ Marked blob as processed: ${blobUrl}`);
  };

  // Handle page unload events (F5, tab close)
  useEffect(() => {
    const handlePageUnload = async () => {
      const currentSessionId = getSessionId();
      const allBlobs = JSON.parse(localStorage.getItem('user-uploaded-blobs') || '[]');
      
      // Find unprocessed blobs from current session that need immediate cleanup
      const blobsToCleanup = allBlobs.filter((blob: { sessionId: string; processed: boolean; url: string }) => 
        blob.sessionId === currentSessionId && !blob.processed && !isDemoFileBlob(blob.url)
      );
      
      if (blobsToCleanup.length > 0) {
        console.log(`🧹 Page unload - immediately cleaning up ${blobsToCleanup.length} unprocessed blobs`);
        
        // Use sendBeacon for reliable cleanup during page unload
        // This is the only way to make HTTP requests during beforeunload that actually work
        for (const blob of blobsToCleanup) {
          try {
            const cleanupData = JSON.stringify({ blobUrl: blob.url });
            const success = navigator.sendBeacon('/api/cleanup-blob', cleanupData);
            
            if (success) {
              console.log(`📡 Beacon sent for blob cleanup: ${blob.url}`);
            } else {
              console.warn(`⚠️ Failed to send beacon for blob: ${blob.url}`);
              // Fallback: mark for later cleanup
              blob.needsCleanup = true;
              blob.closedAt = Date.now();
            }
          } catch (error) {
            console.warn(`⚠️ Error sending cleanup beacon for blob: ${blob.url}`, error);
            // Fallback: mark for later cleanup
            blob.needsCleanup = true;
            blob.closedAt = Date.now();
          }
        }
        
        // Remove cleaned blobs from localStorage
        const remainingBlobs = allBlobs.filter((blob: { sessionId: string; processed: boolean }) => 
          !(blob.sessionId === currentSessionId && !blob.processed)
        );
        
        localStorage.setItem('user-uploaded-blobs', JSON.stringify(remainingBlobs));
      }
    };

    // beforeunload is the most reliable for cleanup actions
    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, []);

  // Cleanup stale blobs on component mount
  useEffect(() => {
    const cleanupStaleBlobs = async () => {
      const allBlobs = JSON.parse(localStorage.getItem('user-uploaded-blobs') || '[]');
      const currentSessionId = getSessionId();
      const now = Date.now();
      const maxAge = 1000 * 60 * 60; // 1 hour maximum age
      
      const blobsToCleanup = allBlobs.filter((blob: { sessionId: string; processed: boolean; needsCleanup?: boolean; closedAt?: number; timestamp: number }) => {
        const isDifferentSession = blob.sessionId !== currentSessionId;
        const isMarkedForCleanup = blob.needsCleanup && blob.closedAt && (now - blob.closedAt > 30000); // 30 second grace period
        const isExpired = now - blob.timestamp > maxAge;
        const isUnprocessed = !blob.processed;
        
        return (isDifferentSession && isUnprocessed) || isMarkedForCleanup || isExpired;
      });

      if (blobsToCleanup.length === 0) {
        console.log(`🧹 No stale blobs to clean up`);
        return;
      }

      console.log(`🧹 Found ${blobsToCleanup.length} stale blobs to clean up`);

      // Clean up blobs in parallel with error handling
      const cleanupPromises = blobsToCleanup.map(async (blob: { url: string }) => {
        try {
          const response = await fetch('/api/cleanup-blob', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blobUrl: blob.url }),
          });
          
          if (response.ok) {
            console.log(`✅ Cleaned up stale blob: ${blob.url}`);
            return blob.url;
          } else {
            console.warn(`⚠️ Failed to cleanup blob: ${blob.url} (${response.status})`);
            return null;
          }
        } catch (error) {
          console.warn(`⚠️ Error cleaning up blob: ${blob.url}`, error);
          return null;
        }
      });

      const cleanedUrls = (await Promise.all(cleanupPromises)).filter(Boolean);
      
      // Remove cleaned blobs from tracking
      const remainingBlobs = allBlobs.filter((blob: { url: string }) => 
        !cleanedUrls.includes(blob.url)
      );
      
      localStorage.setItem('user-uploaded-blobs', JSON.stringify(remainingBlobs));
      
      if (cleanedUrls.length > 0) {
        console.log(`🧹 Successfully cleaned up ${cleanedUrls.length} stale blobs`);
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(cleanupStaleBlobs, 1000);
    return () => clearTimeout(timer);
  }, []);

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (file.type !== "application/pdf") {
      return t('upload.validation.invalidFileTypeDrop')
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return t('upload.validation.fileSizeLimit')
    }
    
    return null
  }

  const uploadToBlob = async (file: File): Promise<string> => {
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      console.log("Starting blob upload for file:", file.name);
      
      // Generate unique filename to prevent collisions
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop() || 'pdf';
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const uniqueFilename = `user-upload-${baseName}-${timestamp}-${randomString}.${fileExtension}`;
      
      console.log("Uploading with unique filename:", uniqueFilename);
      
      const blob = await upload(uniqueFilename, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-blob',
      });
      
      console.log("Blob upload successful. URL:", blob.url);
      console.log("Full blob response:", blob);
      
      // Track blob for potential cleanup
      trackBlobForCleanup(blob.url);
      
      // Verify blob is accessible before returning (with exponential backoff)
      console.log("Verifying blob accessibility...");
      let verificationSuccessful = false;
      const maxVerificationRetries = 5;
      
      for (let attempt = 0; attempt < maxVerificationRetries; attempt++) {
        try {
          const verificationResponse = await fetch(blob.url, { method: 'HEAD' });
          console.log(`Blob verification attempt ${attempt + 1}: ${verificationResponse.status} ${verificationResponse.statusText}`);
          
          if (verificationResponse.ok) {
            console.log("Blob verified as accessible");
            verificationSuccessful = true;
            break;
          }
          
          // Exponential backoff: 500ms, 1s, 2s, 4s, 8s
          if (attempt < maxVerificationRetries - 1) {
            const delay = 500 * Math.pow(2, attempt);
            console.warn(`Blob not accessible, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxVerificationRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        } catch (error) {
          console.warn(`Blob verification attempt ${attempt + 1} failed:`, error);
          if (attempt < maxVerificationRetries - 1) {
            const delay = 500 * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (!verificationSuccessful) {
        console.warn("⚠️ Blob verification failed after all attempts, but proceeding anyway. The blob may become accessible shortly.");
        console.warn("📝 Note: Analysis may retry if blob is not accessible during processing.");
      }
      return blob.url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error(t('upload.uploadFailed'))
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteBlobFromUrl = async (blobUrl: string): Promise<void> => {
    try {
      const response = await fetch('/api/delete-blob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blobUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blob');
      }
    } catch (error) {
      console.error('Error deleting blob:', error);
      // Don't throw here - we don't want blob deletion failures to break the UI
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
      setStatusMessage(t('upload.releaseToUpload'))
    } else if (e.type === "dragleave") {
      setDragActive(false)
      setStatusMessage('')
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setStatusMessage('')
    
    const files = Array.from(e.dataTransfer.files)
    
    // Validate file count
    if (files.length > 1) {
      toast.error(t('upload.validation.multipleFilesDrop'))
      return
    }
    
    if (files.length === 1) {
      const file = files[0]
      const validationError = validateFile(file)
      
      if (validationError) {
        toast.error(validationError)
        return
      }
      
      try {
        setStatusMessage(t('upload.uploading'))
        const blobUrl = await uploadToBlob(file)
        
        // Store both file and blob URL
        const fileWithBlobUrl = Object.assign(file, { blobUrl })
        setUploadedFiles([fileWithBlobUrl])
        setStatusMessage(t('upload.fileUploaded', {fileName: file.name}))
        toast.success(t('upload.fileUploaded', {fileName: file.name}))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('upload.uploadFailed'))
        setStatusMessage('')
      }
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate file count
    if (files.length > 1) {
      toast.error(t('upload.validation.multipleFilesSelect'))
      e.target.value = '' // Clear the input
      return
    }
    
    if (files.length === 1) {
      const file = files[0]
      const validationError = validateFile(file)
      
      if (validationError) {
        toast.error(validationError)
        e.target.value = '' // Clear the input
        return
      }
      
      try {
        setStatusMessage(t('upload.uploading'))
        const blobUrl = await uploadToBlob(file)
        
        // Store both file and blob URL
        const fileWithBlobUrl = Object.assign(file, { blobUrl })
        setUploadedFiles([fileWithBlobUrl])
        setStatusMessage(t('upload.fileSelected', {fileName: file.name}))
        toast.success(t('upload.fileSelected', {fileName: file.name}))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('upload.uploadFailed'))
        setStatusMessage('')
        e.target.value = '' // Clear the input
      }
    }
  }

  const removeFile = async () => {
    // Delete blob only if it's NOT a demo file
    if (uploadedFiles.length > 0) {
      const fileWithBlobUrl = uploadedFiles[0] as File & { blobUrl?: string };
      if (fileWithBlobUrl.blobUrl && !isDemoFileBlob(fileWithBlobUrl.blobUrl)) {
        await deleteBlobFromUrl(fileWithBlobUrl.blobUrl);
      }
    }
    
    setUploadedFiles([])
    setStatusMessage(t('upload.fileRemoved'))
    // Clear the file input as well
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = async () => {
    // Clear any existing files and their blobs before opening dialog
    // But don't delete demo file blobs
    if (uploadedFiles.length > 0) {
      const fileWithBlobUrl = uploadedFiles[0] as File & { blobUrl?: string };
      if (fileWithBlobUrl.blobUrl && !isDemoFileBlob(fileWithBlobUrl.blobUrl)) {
        await deleteBlobFromUrl(fileWithBlobUrl.blobUrl);
      }
      setUploadedFiles([])
    }
    fileInputRef.current?.click()
  }

  return {
    dragActive,
    uploadedFiles,
    statusMessage,
    fileInputRef,
    isUploading,
    uploadProgress,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    openFileDialog,
    setUploadedFiles, // Expose setter
    uploadToBlob, // Expose upload function
    markBlobProcessed, // Expose blob processing function
  }
}

// Export function to mark blob as processed (call this after successful analysis)
export const markBlobAsProcessed = (blobUrl: string) => {
  const allBlobs = JSON.parse(localStorage.getItem('user-uploaded-blobs') || '[]');
  
  const updatedBlobs = allBlobs.map((blob: { url: string; processed: boolean; active: boolean }) => 
    blob.url === blobUrl ? { ...blob, processed: true, active: false } : blob
  );
  
  localStorage.setItem('user-uploaded-blobs', JSON.stringify(updatedBlobs));
  console.log(`✅ Marked blob as processed: ${blobUrl}`);
};
