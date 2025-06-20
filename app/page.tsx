"use client";

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to default locale (English)
    router.replace('/en')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
        </div>
        <p className="text-gray-600">Redirecting to PropertyWise...</p>
      </div>
    </div>
  )
}
