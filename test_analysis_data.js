// Test script to simulate the JSON data structure you provided
const testData = {
  "propertyDetails": {
    "address": "Grønlundveien 20B, 1809 Askim, Indre Østfold",
    "bedrooms": 2,
    "price": 1950000,
    "size": 51,
    "yearBuilt": 1971,
    "propertyType": "apartment"
  },
  "strongPoints": [
    {
      "title": "Updated Kitchen & Bathroom",
      "description": "Kitchen and bathroom were upgraded in 2020 and are modern.",
      "category": "kitchen"
    },
    {
      "title": "No Common Expenses",
      "description": "The property has no common expenses (fellesutgifter).",
      "category": "fees"
    },
    {
      "title": "Good Storage Space",
      "description": "The apartment has good storage space and includes 2 outdoor sheds.",
      "category": "storage"
    },
    {
      "title": "West-facing Balcony",
      "description": "The property has a balconly facing west with good sun exposure",
      "category": "outdoor"
    }
  ],
  "concerns": [
    {
      "title": "Window Condition",
      "description": "Several windows have cracked or punctured glass. Some older windows are damaged.",
      "severity": "medium",
      "estimatedCost": "10 000 - 50 000 NOK",
      "category": "structural"
    },
    {
      "title": "Electrical System",
      "description": "The electrical system has a 'Tilstandsgrad 2' rating, indicating a need for review.",
      "severity": "medium",
      "category": "electrical"
    },
    {
      "title": "Potential Pest Issue",
      "description": "Neighbor reported a rat on the loft, although the seller hasn't personally experienced any issues.",
      "severity": "low",
      "category": "pest"
    },
    {
      "title": "Old Electrical Installations",
      "description": "Some electrical installations are from the building year.",
      "severity": "low",
      "category": "electrical"
    }
  ],
  "bottomLine": "This property presents a good opportunity, especially for first-time buyers, due to the lack of common expenses and recently updated kitchen and bathroom. However, potential buyers should budget for window repairs/replacements. A thorough review of the electrical system is also recommended.",
  "summary": "This is a 3-room apartment in Askim built in 1971, offered at 1,950,000 NOK. It boasts a modern kitchen and bathroom, no common expenses, and good storage. There are some concerns regarding the windows and electrical system that should be investigated further."
};

// Store in localStorage to test the analysis result page
if (typeof window !== 'undefined') {
  localStorage.setItem('analysisResult', JSON.stringify(testData));
  console.log('Test data stored in localStorage');
  console.log('Strong Points:', testData.strongPoints.length);
  console.log('Concerns:', testData.concerns.length);
  
  // Navigate to analysis result page
  window.location.href = '/analysis-result';
} else {
  // Node.js environment
  console.log('Test data structure:');
  console.log('Strong Points:', testData.strongPoints.length);
  console.log('Concerns:', testData.concerns.length);
  console.log('Data:', JSON.stringify(testData, null, 2));
}
