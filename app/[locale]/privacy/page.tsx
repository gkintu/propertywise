"use client";

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Shield, Lock, Eye, Download, Trash2, Edit, ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { use } from "react"

interface PrivacyPageProps {
  params: Promise<{locale: string}>;
}

export default function PrivacyPolicy({ params }: PrivacyPageProps) {
  const { locale } = use(params);
  const t = useTranslations('PrivacyPolicy');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString(locale === 'no' ? 'nb-NO' : 'en-US')}</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              {t('introduction.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('introduction.description')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {t('introduction.commitment')}
            </p>
          </CardContent>
        </Card>

        {/* Data Controller Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dataController.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-semibold">{t('dataController.company')}</p>
                  <p className="text-gray-600">{t('dataController.address')}</p>
                  <p className="text-gray-600">{t('dataController.organizationNumber')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <a href="mailto:privacy@propertywise.no" className="text-blue-600 hover:underline">
                  privacy@propertywise.no
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">+47 XX XX XX XX</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dataCollection.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">{t('dataCollection.personalData.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>{t('dataCollection.personalData.contactInfo')}</li>
                  <li>{t('dataCollection.personalData.accountInfo')}</li>
                  <li>{t('dataCollection.personalData.paymentInfo')}</li>
                  <li>{t('dataCollection.personalData.communicationData')}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">{t('dataCollection.propertyData.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>{t('dataCollection.propertyData.documents')}</li>
                  <li>{t('dataCollection.propertyData.addresses')}</li>
                  <li>{t('dataCollection.propertyData.analysisResults')}</li>
                  <li>{t('dataCollection.propertyData.uploadedFiles')}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">{t('dataCollection.technicalData.title')}</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>{t('dataCollection.technicalData.ipAddress')}</li>
                  <li>{t('dataCollection.technicalData.browserData')}</li>
                  <li>{t('dataCollection.technicalData.usageData')}</li>
                  <li>{t('dataCollection.technicalData.cookies')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dataUsage.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('dataUsage.propertyAnalysis.title')}</h3>
                <p className="text-gray-700">{t('dataUsage.propertyAnalysis.description')}</p>
                <p className="text-sm text-blue-600 mt-1">{t('dataUsage.legalBasis')}: {t('dataUsage.propertyAnalysis.legalBasis')}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">{t('dataUsage.serviceProvision.title')}</h3>
                <p className="text-gray-700">{t('dataUsage.serviceProvision.description')}</p>
                <p className="text-sm text-blue-600 mt-1">{t('dataUsage.legalBasis')}: {t('dataUsage.serviceProvision.legalBasis')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('dataUsage.communication.title')}</h3>
                <p className="text-gray-700">{t('dataUsage.communication.description')}</p>
                <p className="text-sm text-blue-600 mt-1">{t('dataUsage.legalBasis')}: {t('dataUsage.communication.legalBasis')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('dataUsage.improvement.title')}</h3>
                <p className="text-gray-700">{t('dataUsage.improvement.description')}</p>
                <p className="text-sm text-blue-600 mt-1">{t('dataUsage.legalBasis')}: {t('dataUsage.improvement.legalBasis')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('dataUsage.legal.title')}</h3>
                <p className="text-gray-700">{t('dataUsage.legal.description')}</p>
                <p className="text-sm text-blue-600 mt-1">{t('dataUsage.legalBasis')}: {t('dataUsage.legal.legalBasis')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dataSharing.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">{t('dataSharing.description')}</p>
              
              <div>
                <h3 className="font-semibold mb-2">{t('dataSharing.serviceProviders.title')}</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>{t('dataSharing.serviceProviders.aiProcessing')}</li>
                  <li>{t('dataSharing.serviceProviders.cloudStorage')}</li>
                  <li>{t('dataSharing.serviceProviders.analytics')}</li>
                  <li>{t('dataSharing.serviceProviders.payment')}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('dataSharing.legal.title')}</h3>
                <p className="text-gray-700">{t('dataSharing.legal.description')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              {t('dataSecurity.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">{t('dataSecurity.description')}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('dataSecurity.technical.title')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                    <li>{t('dataSecurity.technical.encryption')}</li>
                    <li>{t('dataSecurity.technical.secureTransmission')}</li>
                    <li>{t('dataSecurity.technical.accessControls')}</li>
                    <li>{t('dataSecurity.technical.monitoring')}</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">{t('dataSecurity.organizational.title')}</h4>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dataRetention.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">{t('dataRetention.description')}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('dataRetention.accountData')}</span>
                  <span className="text-blue-600">{t('dataRetention.accountDataPeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('dataRetention.propertyDocuments')}</span>
                  <span className="text-blue-600">{t('dataRetention.propertyDocumentsPeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('dataRetention.analysisResults')}</span>
                  <span className="text-blue-600">{t('dataRetention.analysisResultsPeriod')}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{t('dataRetention.marketingData')}</span>
                  <span className="text-blue-600">{t('dataRetention.marketingDataPeriod')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-600" />
              {t('yourRights.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-6">{t('yourRights.description')}</p>
              
              <div className="grid gap-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Download className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.access.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.access.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Edit className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.rectification.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.rectification.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.erasure.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.erasure.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.restriction.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.restriction.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Download className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.portability.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.portability.description')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <X className="h-5 w-5 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">{t('yourRights.objection.title')}</h3>
                    <p className="text-gray-600 text-sm">{t('yourRights.objection.description')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  <strong>{t('yourRights.exercising.title')}:</strong> {t('yourRights.exercising.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('cookies.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">{t('cookies.description')}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{t('cookies.essential.title')}</h4>
                  <p className="text-gray-600 text-sm">{t('cookies.essential.description')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">{t('cookies.functional.title')}</h4>
                  <p className="text-gray-600 text-sm">{t('cookies.functional.description')}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">{t('cookies.analytics.title')}</h4>
                  <p className="text-gray-600 text-sm">{t('cookies.analytics.description')}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-4">{t('cookies.management')}</p>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('internationalTransfers.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{t('internationalTransfers.description')}</p>
            <p className="text-gray-700">{t('internationalTransfers.safeguards')}</p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('contact.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">{t('contact.description')}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('contact.privacy.title')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href="mailto:privacy@propertywise.no" className="text-blue-600 hover:underline">
                        privacy@propertywise.no
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">+47 XX XX XX XX</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">{t('contact.authority.title')}</h4>
                  <div className="space-y-2">
                    <p className="text-gray-700">{t('contact.authority.name')}</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a href="mailto:postkasse@datatilsynet.no" className="text-blue-600 hover:underline">
                        postkasse@datatilsynet.no
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">+47 22 39 69 00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('changes.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{t('changes.description')}</p>
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
          <Button variant="outline" asChild className="flex-1">
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
