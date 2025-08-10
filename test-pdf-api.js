// Quick test for the PDF API route - matching PropertyAnalysis interface
const testData = {
  propertyDetails: {
    address: "Test Address 123",
    bedrooms: 3,
    price: 2500000,
    currency: "NOK",
    size: 120,
    yearBuilt: 2020,
    propertyType: "apartment"
  },
  strongPoints: [
    {
      title: "Modern Kitchen",
      description: "Recently renovated kitchen with high-end appliances",
      category: "kitchen"
    },
    {
      title: "Great Location",
      description: "Close to public transport and amenities",
      category: "location"
    }
  ],
  concerns: [
    {
      title: "Minor Wear",
      description: "Some minor wear and tear in common areas",
      severity: "low",
      estimatedCost: "5,000 NOK",
      category: "maintenance"
    }
  ],
  hiddenDefects: [
    {
      category: "electrical_faults",
      riskLevel: "low",
      briefExplanation: "Older electrical system may need upgrading",
      signsToLookFor: ["Flickering lights", "Warm outlets"],
      consequences: "Potential safety hazard if not addressed",
      preventiveMeasures: "Have electrical system inspected by qualified electrician",
      actionRequired: "Schedule inspection within 6 months"
    }
  ],
  bottomLine: "Overall a solid property with good investment potential. Minor issues can be addressed during ownership.",
  summary: "This is a well-maintained property in an excellent location. The modern amenities and recent renovations add significant value, though some minor maintenance items should be addressed."
};

// Test both server-side API and client-side integration
console.log('🧪 Testing PDF generation...');
console.log('📋 Test 1: Direct API call');

async function testDirectAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisData: testData,
        locale: 'en',
        theme: 'light'
      })
    });

    console.log('📡 API Response status:', response.status);
    
    if (response.ok) {
      const blob = await response.blob();
      console.log('✅ Direct API test successful! PDF size:', blob.size, 'bytes');
      return true;
    } else {
      console.log('❌ Direct API test failed');
      return false;
    }
  } catch (error) {
    console.error('💥 Direct API test error:', error);
    return false;
  }
}

console.log('📋 Test 2: Client-side integration simulation');

async function testClientIntegration() {
  try {
    // Simulate the client-side download flow
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisData: testData,
        theme: 'light',
        locale: 'en'
      })
    });

    if (!response.ok) {
      console.log('❌ Client integration test failed: Server error');
      return false;
    }

    const contentType = response.headers.get('content-type');
    if (contentType !== 'application/pdf') {
      console.log('❌ Client integration test failed: Wrong content type');
      return false;
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      console.log('❌ Client integration test failed: Empty PDF');
      return false;
    }

    // Get filename from header
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '') || `property-analysis-${Date.now()}.pdf`
      : `property-analysis-${Date.now()}.pdf`;

    console.log('✅ Client integration test successful!');
    console.log(`📄 Would download: ${filename} (${blob.size} bytes)`);
    return true;

  } catch (error) {
    console.error('💥 Client integration test error:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive PDF tests...\n');
  
  const apiTest = await testDirectAPI();
  console.log('');
  const clientTest = await testClientIntegration();
  
  console.log('\n📊 Test Results:');
  console.log(`  Direct API Test: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Client Integration Test: ${clientTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (apiTest && clientTest) {
    console.log('\n🎉 All tests passed! Server-side PDF migration is complete and working!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run the comprehensive test
runAllTests();
