import { useState, useRef } from 'react'
import { toast } from "sonner"
import { useTranslations } from 'next-intl'

export function useFileUpload() {
  const t = useTranslations('HomePage')
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [statusMessage, setStatusMessage] = useState<string>('')
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

  const handleDrop = (e: React.DragEvent) => {
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
      
      // Clear previous files and set the new one
      setUploadedFiles([file])
      setStatusMessage(t('upload.fileUploaded', {fileName: file.name}))
      toast.success(t('upload.fileUploaded', {fileName: file.name}))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Clear previous files and set the new one
      setUploadedFiles([file])
      setStatusMessage(t('upload.fileSelected', {fileName: file.name}))
      toast.success(t('upload.fileSelected', {fileName: file.name}))
    }
  }

  const removeFile = () => {
    setUploadedFiles([])
    setStatusMessage(t('upload.fileRemoved'))
    // Clear the file input as well
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    // Clear any existing files before opening dialog
    if (uploadedFiles.length > 0) {
      setUploadedFiles([])
    }
    fileInputRef.current?.click()
  }

  return {
    dragActive,
    uploadedFiles,
    statusMessage,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeFile,
    openFileDialog,
    setUploadedFiles, // Expose setter
  }
}
