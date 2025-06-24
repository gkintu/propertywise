"use client";

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Shield, Lock, ArrowLeft, Home as HomeIcon } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import LocaleSwitcher from '@/components/locale/LocaleSwitcher'
import { Badge } from "@/components/ui/badge"

interface PrivacyPageProps {
  params: Promise<{locale: string}>;
}

export default function PrivacyPolicy({ params }: PrivacyPageProps) {
  const { locale } = use(params);
  const t = useTranslations('PrivacyPolicy');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">PropertyWise</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LocaleSwitcher />
            <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-950/20 text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-200 dark:hover:bg-yellow-900/30">
              Privacy Policy
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-[#F9FAFB] mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 dark:text-[#D1D5DB]">{t('lastUpdated')}: {new Date().toLocaleDateString(locale === 'no' ? 'nb-NO' : 'en-US')}</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-[#F9FAFB]">
              <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              {t('introduction.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed mb-4">
              {t('introduction.description')}
            </p>
            <p className="text-gray-700 dark:text-[#D1D5DB] leading-relaxed">
              {t('introduction.commitment')}
            </p>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="dark:text-[#F9FAFB]">{t('dataCollection.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 dark:text-[#F9FAFB]">{t('dataCollection.documentData.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-[#D1D5DB]">
                  <li>{t('dataCollection.documentData.pdfFiles')}</li>
                  <li>{t('dataCollection.documentData.propertyInfo')}</li>
                  <li>{t('dataCollection.documentData.analysisResults')}</li>
                  <li>{t('dataCollection.documentData.temporaryProcessing')}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 dark:text-[#F9FAFB]">{t('dataCollection.preferences.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-[#D1D5DB]">
                  <li>{t('dataCollection.preferences.language')}</li>
                  <li>{t('dataCollection.preferences.theme')}</li>
                  <li>{t('dataCollection.preferences.localStorage')}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 dark:text-[#F9FAFB]">{t('dataCollection.technicalData.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-[#D1D5DB]">
                  <li>{t('dataCollection.technicalData.ipAddress')}</li>
                  <li>{t('dataCollection.technicalData.browserData')}</li>
                  <li>{t('dataCollection.technicalData.usageData')}</li>
                  <li>{t('dataCollection.technicalData.errorLogs')}</li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">{t('dataCollection.notice.title')}</h4>
                <p className="text-yellow-700 dark:text-yellow-300">{t('dataCollection.notice.description')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-[#F9FAFB]">
              <Lock className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              {t('dataSecurity.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-[#D1D5DB] mb-4">{t('dataSecurity.description')}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold dark:text-[#F9FAFB]">{t('dataSecurity.technical.title')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-[#D1D5DB] text-sm">
                    <li>{t('dataSecurity.technical.encryption')}</li>
                    <li>{t('dataSecurity.technical.secureTransmission')}</li>
                    <li>{t('dataSecurity.technical.accessControls')}</li>
                    <li>{t('dataSecurity.technical.monitoring')}</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold dark:text-[#F9FAFB]">{t('dataSecurity.organizational.title')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-[#D1D5DB] text-sm">
                    <li>{t('dataSecurity.organizational.staffTraining')}</li>
                    <li>{t('dataSecurity.organizational.limitedAccess')}</li>
                    <li>{t('dataSecurity.organizational.regularAudits')}</li>
                    <li>{t('dataSecurity.organizational.incidentResponse')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="dark:text-[#F9FAFB]">{t('dataRetention.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-[#D1D5DB] mb-4">{t('dataRetention.description')}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#374151] rounded-lg">
                  <span className="font-medium dark:text-[#F9FAFB]">{t('dataRetention.documentData')}</span>
                  <span className="text-blue-600 dark:text-blue-400">{t('dataRetention.documentDataPeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#374151] rounded-lg">
                  <span className="font-medium dark:text-[#F9FAFB]">{t('dataRetention.localStorage')}</span>
                  <span className="text-blue-600 dark:text-blue-400">{t('dataRetention.localStoragePeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#374151] rounded-lg">
                  <span className="font-medium dark:text-[#F9FAFB]">{t('dataRetention.analysisResults')}</span>
                  <span className="text-blue-600 dark:text-blue-400">{t('dataRetention.analysisResultsPeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#374151] rounded-lg">
                  <span className="font-medium dark:text-[#F9FAFB]">{t('dataRetention.technicalLogs')}</span>
                  <span className="text-blue-600 dark:text-blue-400">{t('dataRetention.technicalLogsPeriod')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="dark:text-[#F9FAFB]">{t('cookies.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-[#D1D5DB] mb-4">{t('cookies.description')}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold dark:text-[#F9FAFB]">{t('cookies.essential.title')}</h4>
                  <p className="text-gray-600 dark:text-[#D1D5DB] text-sm">{t('cookies.essential.description')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold dark:text-[#F9FAFB]">{t('cookies.functional.title')}</h4>
                  <p className="text-gray-600 dark:text-[#D1D5DB] text-sm">{t('cookies.functional.description')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold dark:text-[#F9FAFB]">{t('cookies.analytics.title')}</h4>
                  <p className="text-gray-600 dark:text-[#D1D5DB] text-sm">{t('cookies.analytics.description')}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-[#D1D5DB] mt-4">{t('cookies.management')}</p>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="dark:text-[#F9FAFB]">{t('internationalTransfers.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-[#D1D5DB] mb-4">{t('internationalTransfers.description')}</p>
            <p className="text-gray-700 dark:text-[#D1D5DB]">{t('internationalTransfers.safeguards')}</p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8 dark:bg-[#1F2937] dark:border-[#374151]">
          <CardHeader>
            <CardTitle className="dark:text-[#F9FAFB]">{t('changes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-[#D1D5DB]">{t('changes.description')}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <a href="mailto:privacy@propertywise.no">
              <Mail className="h-4 w-4 mr-2" />
              {t('actions.contactUs')}
            </a>
          </Button>
          <Button variant="outline" asChild className="flex-1 dark:border-[#374151] dark:text-[#F9FAFB] dark:hover:bg-[#374151]">
            <Link href={`/${locale}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('actions.backToHome')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
