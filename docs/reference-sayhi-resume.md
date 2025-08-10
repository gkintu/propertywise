# Reference Implementation: SayHi Resume Generator

## Repository
**Source**: https://github.com/ChrisLey521/SayHi

This repository demonstrates advanced server-side PDF generation for resume/CV documents with professional styling.

## Key Implementation Patterns

### API Route Structure
**File**: Similar to `src/app/api/generate-resume/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ResumeDocument } from '@/components/ResumeDocument';

export async function POST(request: NextRequest) {
  try {
    const resumeData = await request.json();
    
    // Validate required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.fullName) {
      return NextResponse.json(
        { error: 'Personal information is required' },
        { status: 400 }
      );
    }

    // Generate PDF with streaming
    const pdfStream = await renderToStream(
      <ResumeDocument data={resumeData} />
    );

    // Convert Node.js stream to Web API stream
    const readableStream = new ReadableStream({
      start(controller) {
        pdfStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        
        pdfStream.on('end', () => {
          controller.close();
        });
        
        pdfStream.on('error', (error) => {
          controller.error(error);
        });
      },
    });

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `resume-${resumeData.personalInfo.fullName.replace(/\s+/g, '-')}-${timestamp}.pdf`;

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Resume PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume PDF' },
      { status: 500 }
    );
  }
}
```

## Advanced PDF Component Structure

### Professional Resume Layout
```typescript
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer';

// Register custom fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 'semibold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 3,
  },
  // ... more styles
});

export const ResumeDocument = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>
              📧 {personalInfo.email}
            </Text>
            <Text style={styles.contactItem}>
              📱 {personalInfo.phone}
            </Text>
            <Text style={styles.contactItem}>
              📍 {personalInfo.location}
            </Text>
            {personalInfo.linkedin && (
              <Link 
                src={personalInfo.linkedin}
                style={[styles.contactItem, { color: '#2563eb' }]}
              >
                🔗 LinkedIn
              </Link>
            )}
          </View>
        </View>

        {/* Summary Section */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((job, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobDate}>
                    {job.startDate} - {job.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={styles.company}>{job.company}</Text>
                {job.achievements && job.achievements.map((achievement, idx) => (
                  <Text key={idx} style={styles.achievement}>
                    • {achievement}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Technologies</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skillCategory, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>
                    {skillCategory.category}:
                  </Text>
                  <Text style={styles.skillsList}>
                    {skillCategory.items.join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
```

## Advanced Features Demonstrated

### 1. Custom Font Registration
```typescript
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf' },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
  ],
});
```

### 2. Dynamic Filename Generation
```typescript
const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
const filename = `resume-${personalInfo.fullName.replace(/\s+/g, '-')}-${timestamp}.pdf`;
```

### 3. Professional Styling Patterns
- Color scheme with hex values
- Typography hierarchy
- Responsive layout with flexbox
- Icon integration with Unicode characters
- Clickable links with Link component

### 4. Data Validation
```typescript
if (!resumeData.personalInfo || !resumeData.personalInfo.fullName) {
  return NextResponse.json(
    { error: 'Personal information is required' },
    { status: 400 }
  );
}
```

### 5. Multi-Page Support
```typescript
const styles = StyleSheet.create({
  page: {
    // Page styles
  },
  pageBreak: {
    break: true, // Force page break
  },
});
```

## Client-Side Integration

### Form Submission Pattern
```typescript
const generateResume = async (resumeData) => {
  try {
    setIsGenerating(true);
    
    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      throw new Error('Failed to generate resume');
    }

    // Handle PDF download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.personalInfo.fullName}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('Resume generation error:', error);
    // Handle error (show toast, etc.)
  } finally {
    setIsGenerating(false);
  }
};
```

## Key Architectural Decisions

1. **Professional Design**: Focus on clean, modern resume layouts
2. **Font Management**: Custom font registration for typography
3. **Modular Sections**: Each resume section is a separate component
4. **Responsive Design**: Flexbox layouts that work across different content sizes
5. **Link Integration**: Clickable links in PDF for contact information
6. **Error Boundaries**: Comprehensive error handling and validation

## Performance Optimizations

1. **Stream Processing**: Uses renderToStream for memory efficiency
2. **Font Preloading**: Registers fonts once at module level
3. **Conditional Rendering**: Only renders sections with data
4. **Efficient Layouts**: Uses flexbox for responsive design
5. **Caching Headers**: Proper cache control for generated PDFs

## Use Cases

- Professional resume generation
- CV creation for job applications  
- Portfolio document generation
- Academic CV formatting
- Multi-language resume support
