"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Home as HomeIcon, AlertTriangle, CheckCircle, Clock, MapPin, Bed, Bath, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use } from "react"
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '@/components/locale/LocaleSwitcher'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import FileUploadSection from '@/components/upload/FileUploadSection';
import { PropertyListingBadge } from '@/components/ui/property-listing-badge';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { ClientOnly } from '@/components/hydration/ClientOnly';

interface PageProps {
  params: Promise<{locale: string}>;
}

export default function Home({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations('HomePage');
  const f = useTranslations('Footer');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffef2] to-white dark:from-[#111827] dark:to-[#1F2937]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-[#111827]/85 backdrop-blur-sm border-b border-gray-200/30 dark:border-[#374151]/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-[#F9FAFB]">PropertyWise</span>
          </div>
          <div className="flex items-center gap-4">
            <ClientOnly>
              {isFeatureEnabled('DARK_MODE_TOGGLE') && <ThemeToggle />}
              <LocaleSwitcher />
              <PropertyListingBadge />
            </ClientOnly>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="mb-12">
          <Badge variant="outline" className="mb-6 text-yellow-600 dark:text-[#FBBF24] border-yellow-200 dark:border-[#CA8A04]">
            {t('badge')}
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-[#F9FAFB] mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-[#D1D5DB] max-w-2xl mx-auto">
            {t('description')}
          </p>
          
          {/* Decorative Separation Line */}
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent max-w-md"></div>
            <div className="mx-4">
              <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent max-w-md"></div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-[#F9FAFB] mb-4">
              {t('greeting')}
            </h2>
          </div>
        </div>

        {/* Search Section */}
        <ClientOnly>
          {isFeatureEnabled('PROPERTY_SEARCH') && (
            <div className="max-w-2xl mx-auto mb-16">
              <div className="relative flex items-center bg-white dark:bg-[#1F2937] border-2 border-yellow-200 dark:border-[#CA8A04] rounded-full p-2 shadow-lg">
                <div className="flex-1 px-4">
                  <Input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="border-0 text-lg placeholder:text-gray-400 dark:placeholder:text-[#9CA3AF] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-[#F9FAFB]"
                  />
                </div>
                <Button className="bg-yellow-500 hover:bg-[#FACC15] text-white dark:text-[#111827] px-8 py-3 rounded-full">
                  {t('getAnalysisButton')}
                  <Search className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </ClientOnly>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-[#F59E0B]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F9FAFB] mb-2">{t('features.riskDetection.title')}</h3>
            <p className="text-gray-600 dark:text-[#D1D5DB]">{t('features.riskDetection.description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-[#22C55E]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F9FAFB] mb-2">{t('features.marketAnalysis.title')}</h3>
            <p className="text-gray-600 dark:text-[#D1D5DB]">{t('features.marketAnalysis.description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-blue-600 dark:text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F9FAFB] mb-2">{t('features.investmentInsights.title')}</h3>
            <p className="text-gray-600 dark:text-[#D1D5DB]">{t('features.investmentInsights.description')}</p>
          </div>
        </div>

        {/* PDF Upload Section */}
        <section className="text-left">
          <FileUploadSection />
        </section>

        {/* Recent Analysis Section */}
        <ClientOnly>
          {isFeatureEnabled('RECENT_ANALYSIS') && (
            <section className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-[#F9FAFB] mb-12 text-center">{t('recentAnalysis.title')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Property 1 */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-[#1F2937] dark:border-[#374151]">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Modern family home"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gray-900/80 dark:bg-[#F9FAFB]/80 text-white dark:text-[#111827]">
                      <Clock className="w-3 h-3 mr-1" />3 hours ago
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#F9FAFB] mb-1">Oakwood Drive 15</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#9CA3AF] mb-2">
                      <MapPin className="w-3 h-3" />
                      Portland, OR 97201
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-[#F9FAFB]">$425,000</span>
                      <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">1,850 sq ft</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground dark:text-[#9CA3AF] mb-2">{t('recentAnalysis.keyFindings')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-[#22C55E]" />
                        <span className="text-foreground dark:text-[#D1D5DB]">Well-maintained HVAC system</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-[#F59E0B]" />
                        <span className="text-foreground dark:text-[#D1D5DB]">Roof replacement needed soon</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#374151] text-xs text-gray-500 dark:text-[#9CA3AF]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />3
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />2
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {t('recentAnalysis.badges.goodBuy')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Property 2 */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-[#1F2937] dark:border-[#374151]">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Downtown condo"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gray-900/80 dark:bg-[#F9FAFB]/80 text-white dark:text-[#111827]">
                      <Clock className="w-3 h-3 mr-1" />5 hours ago
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground dark:text-[#F9FAFB] mb-1">Broadway Street 42</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground dark:text-[#9CA3AF] mb-2">
                      <MapPin className="w-3 h-3" />
                      Seattle, WA 98102
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-foreground dark:text-[#F9FAFB]">$680,000</span>
                      <span className="text-sm text-muted-foreground dark:text-[#9CA3AF]">1,200 sq ft</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground dark:text-[#9CA3AF] mb-2">{t('recentAnalysis.keyFindings')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-[#F59E0B]" />
                        <span className="text-foreground dark:text-[#D1D5DB]">High HOA fees</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-[#22C55E]" />
                        <span className="text-foreground dark:text-[#D1D5DB]">Excellent location score</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border dark:border-[#374151] text-xs text-muted-foreground dark:text-[#9CA3AF]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />2
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />2
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                        {t('recentAnalysis.badges.consider')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Property 3 */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-[#1F2937] dark:border-[#374151]">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Suburban house"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gray-900/80 dark:bg-[#F9FAFB]/80 text-white dark:text-[#111827]">
                      <Clock className="w-3 h-3 mr-1" />1 day ago
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#F9FAFB] mb-1">Maple Avenue 128</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#9CA3AF] mb-2">
                      <MapPin className="w-3 h-3" />
                      Austin, TX 78704
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-[#F9FAFB]">$520,000</span>
                      <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">2,100 sq ft</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-2">{t('recentAnalysis.keyFindings')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-[#22C55E]" />
                        <span className="text-gray-700 dark:text-[#D1D5DB]">Recently renovated kitchen</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-blue-500 dark:text-[#3B82F6]" />
                        <span className="text-gray-700 dark:text-[#D1D5DB]">Large garage and driveway</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#374151] text-xs text-gray-500 dark:text-[#9CA3AF]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />4
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />3
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {t('recentAnalysis.badges.greatDeal')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Property 4 */}
                <Card className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-[#1F2937] dark:border-[#374151]">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Townhouse"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gray-900/80 dark:bg-[#F9FAFB]/80 text-white dark:text-[#111827]">
                      <Clock className="w-3 h-3 mr-1" />2 days ago
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-[#F9FAFB] mb-1">Pine Street 67</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#9CA3AF] mb-2">
                      <MapPin className="w-3 h-3" />
                      Denver, CO 80202
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-[#F9FAFB]">$395,000</span>
                      <span className="text-sm text-gray-500 dark:text-[#9CA3AF]">1,650 sq ft</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-[#9CA3AF] mb-2">{t('recentAnalysis.keyFindings')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-500 dark:text-[#EF4444]" />
                        <span className="text-gray-700 dark:text-[#D1D5DB]">Foundation issues detected</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 dark:text-[#22C55E]" />
                        <span className="text-gray-700 dark:text-[#D1D5DB]">Good school district</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-[#374151] text-xs text-gray-500 dark:text-[#9CA3AF]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" />3
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />2
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
                        {t('recentAnalysis.badges.caution')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
        </ClientOnly>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl p-12 max-w-4xl mx-auto border border-yellow-100 dark:border-yellow-800/30">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-[#F9FAFB] mb-4">{t('cta.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-[#D1D5DB] mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-[#FACC15] text-white dark:text-[#111827] px-8">
                {t('cta.startButton')}
              </Button>
              <Button size="lg" variant="outline" className="px-8 border-yellow-200 dark:border-[#CA8A04] text-yellow-700 dark:text-[#FBBF24] hover:bg-yellow-50 dark:hover:bg-[#374151]">
                {t('cta.sampleButton')}
              </Button>
            </div>
          </div>
        </section>

                {/* Disclaimer */}
        <div className="text-center mb-16 mt-8">
          <p className="text-sm text-gray-500 dark:text-[#9CA3AF] max-w-lg mx-auto">
            {t('disclaimer')}
          </p>
        </div>
        
        {/* Footer */}
        <footer className="py-8 border-t border-yellow-200/30 dark:border-[#374151] bg-gradient-to-b from-[#fffef2] to-yellow-50/30 dark:bg-gradient-to-b dark:from-[#1F2937] dark:to-[#111827]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-[#D1D5DB]">
                © 2025 PropertyWise AS. {f('rights')}
              </div>
              <div className="flex gap-6 text-sm">
                <Link href={`/${locale}/privacy`} className="text-yellow-600 dark:text-[#FBBF24] hover:text-yellow-700 dark:hover:text-[#FEF3C7] hover:underline transition-colors">
                  {f('privacy')}
                </Link>
                <a href="mailto:support@propertywise.no" className="text-gray-700 dark:text-[#D1D5DB] hover:text-gray-900 dark:hover:text-[#F9FAFB] transition-colors">
                  {f('contact')}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
