// Test script to verify PDF theme handling
// This would be run in the browser console to test the dark mode PDF generation

const testPDFTheme = () => {
  console.log("Testing PDF theme functionality...");
  
  // Simulate getting theme from next-themes
  const mockTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  console.log(`Current theme detected: ${mockTheme}`);
  
  // Check if the downloadAsPDF function would receive the correct theme parameter
  const isDarkMode = mockTheme === 'dark';
  console.log(`PDF would be generated with isDarkMode: ${isDarkMode}`);
  
  return {
    currentTheme: mockTheme,
    pdfWillUseDarkMode: isDarkMode
  };
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPDFTheme };
}
