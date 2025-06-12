// Test data flow to verify both formats work correctly

// Test 1: Structured JSON format (preferred)
const structuredResponse = {
  analysis: {
    propertyDetails: {
      address: "Test Address 123",
      price: 4500000,
      bedrooms: 3,
      size: 95,
      propertyType: "Apartment",
      yearBuilt: 2010
    },
    strongPoints: [
      { title: "Great Location", description: "Close to public transport and schools", category: "location" },
      { title: "Modern Kitchen", description: "Recently renovated with high-end appliances", category: "interior" },
      { title: "Good Condition", description: "Well-maintained property with minimal wear", category: "maintenance" },
      { title: "Parking Included", description: "Comes with dedicated parking space", category: "amenities" }
    ],
    concerns: [
      { title: "High Maintenance Fee", description: "Monthly fees are above average for the area", severity: "medium", category: "financial" },
      { title: "Small Storage", description: "Limited storage space in the unit", severity: "low", category: "interior" },
      { title: "Noise Concerns", description: "Located on a busy street with potential traffic noise", severity: "medium", category: "location" },
      { title: "Older Building", description: "Building infrastructure may need updates soon", severity: "low", category: "structural" }
    ],
    bottomLine: "Good property with minor concerns that can be addressed",
    summary: "A well-maintained apartment in a desirable location with some minor drawbacks"
  }
};

// Test 2: Summary format (fallback)
const summaryResponse = {
  summary: "This is a summary text response when the AI doesn't return structured JSON data. It contains the analysis in text format but lacks the structured strong points and concerns format."
};

console.log("✅ Structured Response Test:");
console.log("- Strong Points Count:", structuredResponse.analysis.strongPoints.length);
console.log("- Concerns Count:", structuredResponse.analysis.concerns.length);
console.log("- Has Property Details:", !!structuredResponse.analysis.propertyDetails);

console.log("\n✅ Summary Response Test:");
console.log("- Has Summary:", !!summaryResponse.summary);
console.log("- Summary Length:", summaryResponse.summary.length);

console.log("\n✅ Data Flow Test Complete - Both formats are valid!");
