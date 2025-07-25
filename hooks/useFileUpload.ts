import { useState, useRef } from 'react'
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
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-blob',
      });
      
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
  }
}
