TITLE: Parse PDF File and Output to JSON
DESCRIPTION: Demonstrates how to parse a PDF file using 'pdf2json' and write the extracted data to a JSON file. It includes examples for loading from a file path and from a buffer.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_3

LANGUAGE: javascript
CODE:
```
import fs from "fs";
import PDFParser from "pdf2json"; 

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", (errData) =>
 console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
 fs.writeFile(
  "./pdf2json/test/F1040EZ.json",
  JSON.stringify(pdfData),
  (data) => console.log(data)
 );
});

pdfParser.loadPDF("./pdf2json/test/pdf/fd/form/F1040EZ.pdf");
```

LANGUAGE: javascript
CODE:
```
fs.readFile(pdfFilePath, (err, pdfBuffer) => {
 if (!err) {
  pdfParser.parseBuffer(pdfBuffer);
 }
});
```

----------------------------------------

TITLE: pdf2json v3.1.0 Named Export for PDFParser
DESCRIPTION: In v3.1.0, `PDFParser` is no longer the default export but a named export. This change requires modifications to import statements in projects using the library.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_46

LANGUAGE: JavaScript
CODE:
```
// Old (pre v3.1.0) import statement:
// import PDFParser from 'pdf2json';

// New (v3.1.0+) import statement:
import { PDFParser } from 'pdf2json';
```

----------------------------------------

TITLE: Install pdf2json via npm
DESCRIPTION: Instructions for installing the pdf2json module locally or globally using npm, and how to update it to the latest version.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_0

LANGUAGE: Shell
CODE:
```
npm i pdf2json
```

LANGUAGE: Shell
CODE:
```
npm i pdf2json -g
```

LANGUAGE: Shell
CODE:
```
npm update pdf2json -g
```

----------------------------------------

TITLE: pdf2json Output Data Structure Reference
DESCRIPTION: Describes the main sub-objects of the parsed PDF data output by pdf2json. Includes details on 'Transcoder', 'Agency' (deprecated), 'Id' (deprecated), 'Pages', and 'Width', along with the new 'Meta' object introduced in v2.0.0 for comprehensive metadata.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_13

LANGUAGE: APIDOC
CODE:
```
Output Data Structure:

- 'Transcoder': pdf2json version number.
- 'Agency': The main text identifier for the PDF document. If Id.AgencyId is present, it will be the same; otherwise, it will be set as the document title. (Deprecated since v2.0.0)
- 'Id': The XML metadata embedded in the PDF document. (Deprecated since v2.0.0)
  - Custom properties (from "Custom" tab of "Document Properties" in Acrobat Pro):
    - AgencyId: default "unknown"
    - Name: default "unknown"
    - MC: default false
    - Max: default -1
    - Parent: parent name, default "unknown"

- 'Meta' (v2.0.0 replacement for 'Agency' and 'Id'): Full metadata object.
- 'Pages': An array of 'Page' objects, each describing a page in the PDF, including sizes, lines, fills, and texts.
- 'Width': The PDF page width in page units.
```

LANGUAGE: javascript
CODE:
```
Meta: {
 PDFFormatVersion: '1.7',
 IsAcroFormPresent: true,
 IsXFAPresent: false,
 Author: 'SE:W:CAR:MP',
 Subject: 'U.S. Individual Income Tax Return',
 Creator: 'Adobe Acrobat Pro 10.1.8',
 Producer: 'Adobe Acrobat Pro 10.1.8',
 CreationDate: "D:20131203133943-08'00'",
 ModDate: "D:20140131180702-08'00'",
 Metadata: {
  'xmp:modifydate': '2014-01-31T18:07:02-08:00',
  'xmp:createdate': '2013-12-03T13:39:43-08:00',
  'xmp:metadatadate': '2014-01-31T18:07:02-08:00',
  'xmp:creatortool': 'Adobe Acrobat Pro 10.1.8',
  'dc:format': 'application/pdf',
  'dc:description': 'U.S. Individual Income Tax Return',
  'dc:creator': 'SE:W:CAR:MP',
  'xmpmm:documentid': 'uuid:4d81e082-7ef2-4df7-b07b-8190e5d3eadf',
  'xmpmm:instanceid': 'uuid:7ea96d1c-3d2f-284a-a469-f0f284a093de',
  'pdf:producer': 'Adobe Acrobat Pro 10.1.8',
  'adhocwf:state': '1',
  'adhocwf:version': '1.1'
 }
}
```

----------------------------------------

TITLE: pdf2json Page Object Structure Reference
DESCRIPTION: Detailed reference for the 'Page' object structure used in pdf2json, outlining its main fields (Height, Width, HLines, Vline, Fills, Texts) and their properties, including coordinate systems, styling, and version updates. It also notes support for external XML field attribute files.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_14

LANGUAGE: APIDOC
CODE:
```
Page Object:
  Height: number (page unit)
  Width: number (page unit) - moved from root to page object in v2.0.0
  HLines: array of HLine objects
    HLine Object:
      x: number (relative coordinate)
      y: number (relative coordinate)
      w: number (width in page unit)
      l: number (length in page unit)
  Vline: array of VLine objects
    VLine Object:
      x: number (relative coordinate)
      y: number (relative coordinate)
      w: number (width in page unit)
      l: number (length in page unit)
      clr: string (color, default 'black', if found in color dictionary)
      oc: string (original color, if not found in color dictionary)
      dsh: number (1 if dashed line, default 'solid') - added in v0.4.4
  Fills: array of Fill objects
    Fill Object:
      x: number (relative coordinate)
      y: number (relative coordinate)
      w: number (width in page unit)
      h: number (height in page unit)
      clr: number (color index in color dictionary)
  Texts: array of TextBlock objects
    TextBlock Object:
      x: number (relative coordinate)
      y: number (relative coordinate)
      clr: number (color index in color dictionary)
      oc: string (original color, if not found in color dictionary)
      A: string (text alignment: 'left', 'center', 'right')
      R: array of TextRun objects
        TextRun Object:
          T: string (actual text)
          S: number (style index from style dictionary)
          TS: array (fontFaceId: number, fontSize: number, bold: 0/1, italic: 0/1)

External Field Attributes:
  Support: pdf2json attempts to load field attributes from an XML file (pdfFileName_fieldInfo.xml) in the same directory as the PDF.
```

----------------------------------------

TITLE: pdf2json v2.0.0 Improved Stream Support and Events
DESCRIPTION: Details the enhanced stream support in v2.0.0, introducing new Readable Stream-like events (`readable`, `data`, `end`, `error`). These events offer more granular data flow control and can optionally replace older custom events like `pdfjs_parseDataReady` and `pdfjs_parseDataError`.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_44

LANGUAGE: APIDOC
CODE:
```
New Readable Stream-like Events:
  - "readable": Emits with Meta data
  - "data": Emits sequence for each PDF page result
  - "end"
  - "error"

Replaces/Supplements Custom Events:
  - "pdfjs_parseDataReady" (combines all pages)
  - "pdfjs_parseDataError"
```

----------------------------------------

TITLE: Extract Interactive Form Fields from PDF to JSON
DESCRIPTION: Explains how to parse a PDF and extract information specifically about its interactive form fields, then write this data to a JSON file using 'pdfParser.getAllFieldsTypes()'.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_6

LANGUAGE: javascript
CODE:
```
import fs from "fs";
import PDFParser from "pdf2json"; 

const pdfParser = new PDFParser();

pdfParser.on("pdfParser_dataError", (errData) =>
 console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
 fs.writeFile(
  "./pdf2json/test/F1040EZ.fields.json",
  JSON.stringify(pdfParser.getAllFieldsTypes()),
  () => {
   console.log("Done.");
  }
 );
});

pdfParser.loadPDF("./pdf2json/test/pdf/fd/form/F1040EZ.pdf");
```

----------------------------------------

TITLE: Load PDF File Asynchronously
DESCRIPTION: Initiates the asynchronous parsing of a PDF file from a specified file path. On failure, a 'pdfParser_dataError' event will be raised with an error object. On success, a 'pdfParser_dataReady' event will be raised with the parsed output data.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_10

LANGUAGE: javascript
CODE:
```
function loadPDF(pdfFilePath);
```

----------------------------------------

TITLE: Using pdf2json as a Command-Line Utility
DESCRIPTION: This section details how to use the pdf2json module as a command-line tool to transcode PDF files to JSON format. It covers basic file/directory conversion and specifying an output directory. The utility can process a single PDF file or scan an entire directory for '.pdf' files.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_30

LANGUAGE: javascript
CODE:
```
node pdf2json.js -f [input directory or pdf file]
```

LANGUAGE: javascript
CODE:
```
node pdf2json.js -f [input directory or pdf file] -o [output directory]
```

----------------------------------------

TITLE: Run pdf2json from Command Line
DESCRIPTION: These commands demonstrate how to execute pdf2json directly from the command line. Users can specify an input PDF file or directory, optionally providing an output directory for the generated JSON files. This is the primary method for batch processing PDFs.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_32

LANGUAGE: terminal
CODE:
```
pdf2json -f [input directory or pdf file]
```

LANGUAGE: terminal
CODE:
```
pdf2json -f [input directory or pdf file] -o [output directory]
```

----------------------------------------

TITLE: Pipe PDF Parsing with Input/Output Streams
DESCRIPTION: Demonstrates how to use Node.js streams to pipe PDF input to 'pdf2json' and then pipe the parsed output to a file. Includes examples for both v1.1.4 and v2.0.0 stream APIs.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_7

LANGUAGE: javascript
CODE:
```
import fs from "fs";
import PDFParser from "pdf2json";

const inputStream = fs.createReadStream(
 "./pdf2json/test/pdf/fd/form/F1040EZ.pdf",
 { bufferSize: 64 * 1024 }
);
const outputStream = fs.createWriteStream(
 "./pdf2json/test/target/fd/form/F1040EZ.json"
);

inputStream
 .pipe(new PDFParser())
 .pipe(new StringifyStream())
 .pipe(outputStream);
```

LANGUAGE: javascript
CODE:
```
inputStream
 .pipe(this.pdfParser.createParserStream())
 .pipe(new StringifyStream())
 .pipe(outputStream);
```

----------------------------------------

TITLE: Retrieve Raw Text Content from Parsed PDF
DESCRIPTION: Retrieves all textual content from the parsed PDF document. This function should be called within the 'pdfParser_dataReady' event handler. It returns the extracted text as a string.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_11

LANGUAGE: javascript
CODE:
```
function getRawTextContent();
```

----------------------------------------

TITLE: Extract Raw Text Content from PDF to TXT
DESCRIPTION: Shows how to parse a PDF and extract only its textual content, then write it to a plain text file using the 'pdfParser.getRawTextContent()' method.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_5

LANGUAGE: javascript
CODE:
```
import fs from "fs";
import PDFParser from "pdf2json"; 

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", (errData) =>
 console.error(errData.parserError)
);
pdfParser.on("pdfParser_dataReady", (pdfData) => {
 fs.writeFile(
  "./pdf2json/test/F1040EZ.content.txt",
  pdfParser.getRawTextContent(),
  () => {
   console.log("Done.");
  }
 );
});

pdfParser.loadPDF("./pdf2json/test/pdf/fd/form/F1040EZ.pdf");
```

----------------------------------------

TITLE: Handle Granular PDF Parsing Events (v2.0.0)
DESCRIPTION: Illustrates how to use more granular page-level parsing events ('readable', 'data', 'error') available in 'pdf2json' v2.0.0 to monitor the parsing process and access metadata or page-specific content.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_4

LANGUAGE: javascript
CODE:
```
pdfParser.on("readable", (meta) => console.log("PDF Metadata", meta));
pdfParser.on("data", (page) =>
 console.log(page ? "One page paged" : "All pages parsed", page)
);
pdfParser.on("error", (err) => console.error("Parser Error", err));
```

----------------------------------------

TITLE: Install pdf2json Globally
DESCRIPTION: This command installs the pdf2json package globally via npm. A global installation allows the `pdf2json` command to be executed directly from any command line, simplifying its usage without needing to specify the Node.js executable or full path.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_31

LANGUAGE: javascript
CODE:
```
npm install pdf2json -g
```

----------------------------------------

TITLE: pdf2json API Events Reference
DESCRIPTION: Details the events emitted by the pdf2json parser, including success, error, and alternative events introduced in v2.0.0 for more granular control over the parsing process.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_9

LANGUAGE: APIDOC
CODE:
```
Events:
  - pdfParser_dataError: Raised when parsing fails.
  - pdfParser_dataReady: Raised when parsing succeeds.

Alternative Events (v2.0.0):
  - readable: First event dispatched after PDF file metadata is parsed and before processing any page.
  - data: Dispatched when one parsed page succeeds. Null indicates the last page has been processed, signaling the end of the data stream.
  - error: Dispatched when an exception or error occurs during parsing.
```

----------------------------------------

TITLE: Accessing PDF2JSON Dictionaries via ES Module Import
DESCRIPTION: Illustrates how to import `kColors`, `kFontFaces`, and `kFontStyles` as ES modules from the `pdf2json` library. This method provides direct access to the dictionaries for client-side use, showing paths for both pre-3.1.0 and post-3.1.0 versions.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_18

LANGUAGE: javascript
CODE:
```
import { kColors, kFontFaces, kFontStyles } from "./lib/pdfconst.js"; // <-- pre 3.1.0
import { kColors, kFontFaces, kFontStyles } from "pdf2json"; // <-- since 3.1.0
```

----------------------------------------

TITLE: Control pdf2json logging
DESCRIPTION: Methods to suppress different types of logs in pdf2json, useful for CI/CD environments. This includes setting an environment variable, using a command-line flag, or configuring the verbosity level when invoking PDFParser.loadPDF.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_2

LANGUAGE: Shell
CODE:
```
export PDF2JSON_DISABLE_LOGS="1"
# Or for direct execution:
# PDF2JSON_DISABLE_LOGS=1 node your_script.js

# Pass -s (silent) in command line for CLI utility
# Example: p2jcli.js -s
```

LANGUAGE: JavaScript
CODE:
```
// When invoking PDFParser.loadPDF, pass VERBOSITY_LEVEL: 0
// Example usage:

const PDFParser = require("pdf2json");
const pdfParser = new PDFParser();

// Assuming 'filePath' is the path to your PDF file
pdfParser.loadPDF(filePath, { VERBOSITY_LEVEL: 0 });
```

----------------------------------------

TITLE: pdf2json Output: Text Block with Exact Style Data (TS)
DESCRIPTION: This JavaScript object illustrates a text block in the pdf2json parsing result, showcasing the new 'TS' field. The 'TS' array provides exact font face ID, font size, bold status, and italic status, allowing for more precise client rendering.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_28

LANGUAGE: javascript
CODE:
```
{
 x: 7.11,
 y: 2.47,
 w: 1.6,
 clr: 0,
 A: "left",
 R: [
  {
   T: "Modesty%20PDF%20Parser%20NodeJS",
   S: -1,
   TS: [0, 15, 1, 0]
  }
 ]
}
```

----------------------------------------

TITLE: Configure Logging Verbosity Programmatically
DESCRIPTION: This JavaScript snippet shows how to set the logging verbosity level when using pdf2json as a library within a web service or other Node.js application. The `loadPDF` method accepts a verbosity level (e.g., 5 for INFOS) as its second argument, allowing fine-grained control over output.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_34

LANGUAGE: javascript
CODE:
```
var pdfParser = new PFParser();
...
pdfParser.loadPDF(pdfFilePath, 5);
```

----------------------------------------

TITLE: Parsing Output for Text Input Box (Fields Array)
DESCRIPTION: This Javascript object demonstrates the structure of a parsed text input field within the 'Fields' array. It includes properties like style, type information (T), ID, position (x, y, w, h), and an optional 'V' for the field's value and 'TU' for alternative text.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_21

LANGUAGE: Javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "alpha",
  TypeInfo: { }
 },
 id: {
  Id: "p1_t40",
  EN: 0
 },
 TU: "alternative text", //for accessibility, added only when available from PDF stream. (v0.3.6).
 TI: 0,
 x: 6.19,
 y: 5.15,
 w: 30.94,
 h: 0.85,
 V: "field value" //only available when the text input box has value
}
```

----------------------------------------

TITLE: Parsing Output for Drop Down List Box (Fields Array)
DESCRIPTION: This Javascript object shows the structure of a parsed drop-down list field within the 'Fields' array. Key properties include 'PL' which contains 'V' for values and 'D' for display labels, along with standard field attributes like position and ID.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_22

LANGUAGE: Javascript
CODE:
```
{
 x: 60,
 y: 11,
 w: 4,
 h: 1,
 style: 48,
 TI: 13,
 AM: 388,
 mxL: 2,
 id: {
  Id: "ST",
  EN: 0
 },
 T: {
  Name: "alpha",
  TypeInfo: {
  }
 },
 PL: {
  V: [
   "",
   "AL",
   "AK"
  ],
  D: [
  "%28no%20entry%29",
  "Alabama",
  "Alaska"
  ]
 }
}
```

----------------------------------------

TITLE: Parsing Output for Checkbox and Radio Button Groups (Boxsets)
DESCRIPTION: This Javascript object illustrates the structure of the 'Boxsets' array, which contains parsed checkbox and radio button elements. Checkboxes have a single 'box' object, while radio button groups contain multiple 'box' objects within their 'boxes' array, indicating a group.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_20

LANGUAGE: Javascript
CODE:
```
Boxsets: [
{//first element, check box
 boxes: [ //only one box object object in this array
 {
  x: 47,
  y: 40,
  w: 3,
  h: 1,
  style: 48,
  TI: 39,
  AM: 4,
  id: {
   Id: "F8888"
  },
  T: {
   Name: "box"
  }
  }
  ],
  id: {
  Id: "A446"
  }
},//end of first element
{//second element, radio button group
 boxes:[// has two box elements in boxes array
 {
  x: 54,
  y: 41,
  w: 3,
  h: 1,
  style: 48,
  TI: 43,
  AM: 132,
  id: {
   Id: "ACCC"
  },
  T: {
   Name: "box"
  }
 },
 {
  x: 67,
  y: 41,
  w: 3,
  h: 1,
  style: 48,
  TI: 44,
  AM: 132,
  id: {
   Id: "ACCS",
   EN: 0
  },
  T: {
   Name: "box"
  }
 }
 ],
 id: {
  Id: "ACC",
  EN: 0
 }
}//end of second element
] //end of Boxsets array
```

----------------------------------------

TITLE: Parsing Output for Signature Form Element (Sig Property)
DESCRIPTION: This Javascript object illustrates the structure of a parsed signature field. If the field has been signed, the 'Sig' property will be present, containing details such as the signer's name ('Name'), signing time ('M'), location, reason, and contact information.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_25

LANGUAGE: Javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "signature",
  TypeInfo: {}
 },
 id: {
  Id: "SignatureFormField_1",
  EN: 0
 },
 TI: 0,
 AM: 16,
 x: 5.506,
 y: 31.394,
 w: 14.367,
 h: 4.241,
 Sig: {
  Name: "Signer Name",
  M: "2022-03-15T19:17:34-04:00"
 }
}
```

----------------------------------------

TITLE: Control Logging Verbosity in Command Line
DESCRIPTION: These commands illustrate how to suppress informative logging output when running pdf2json from the command line. The `-s` or `--silent` flags can be appended to reduce console noise, making it suitable for automated scripts or when only the final output is desired.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_33

LANGUAGE: terminal
CODE:
```
pdf2json -f [input directory or pdf file] -o [output directory] -s
```

LANGUAGE: terminal
CODE:
```
pdf2json -f [input directory or pdf file] -o [output directory] --silent
```

----------------------------------------

TITLE: Retrieve All Input Fields from Parsed PDF
DESCRIPTION: Retrieves information about all input fields present in the parsed PDF document. This function should be called within the 'pdfParser_dataReady' event handler. It returns an array of field objects.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_12

LANGUAGE: javascript
CODE:
```
function getAllFieldsTypes();
```

----------------------------------------

TITLE: pdf2json v3.0.0 ES Module Configuration
DESCRIPTION: Explains the conversion from CommonJS to ES Modules in v3.0.0. Projects upgrading must update their configuration files, such as `tsconfig.json`, to enable ES Modules (e.g., by setting `"module": "ESNext"`).
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_43

LANGUAGE: JSON
CODE:
```
{
  "compilerOptions":{
    "module":"ESNext"
  }
}
```

----------------------------------------

TITLE: Install pdf2json Globally via npm on Ubuntu
DESCRIPTION: Installs the pdf2json package globally using npm, making the 'pdf2json' command available system-wide. This snippet also includes output showing the installation process and subsequent commands to verify the installation path and version of pdf2json.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_51

LANGUAGE: terminal
CODE:
```
$ npm install -g pdf2json
npm http GET https://registry.npmjs.org/pdf2json
npm http 304 https://registry.npmjs.org/pdf2json
/usr/bin/pdf2json -> /usr/lib/node_modules/pdf2json/bin/pdf2json
pdf2json@0.6.1 /usr/lib/node_modules/pdf2json

$ which pdf2json
/usr/bin/pdf2json

$ pdf2json --version
0.6.2
```

----------------------------------------

TITLE: Create Node.js Symbolic Link on Ubuntu
DESCRIPTION: Removes any existing 'node' symbolic link and creates a new one pointing to 'nodejs'. This step is crucial for systems where the 'node' command might not be directly linked to the 'nodejs' executable, ensuring compatibility for npm and other tools.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_49

LANGUAGE: terminal
CODE:
```
sudo rm -f /usr/sbin/node
sudo ln -s /usr/bin/nodejs /usr/sbin/node
```

----------------------------------------

TITLE: Verify Node Command and Version on Ubuntu
DESCRIPTION: Confirms that the 'node' command is correctly linked and reports its version after the symbolic link has been created. This verification ensures that subsequent npm commands will correctly utilize the installed Node.js.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_50

LANGUAGE: terminal
CODE:
```
$ which node
/usr/sbin/node

$ node --version
v4.5.0
```

----------------------------------------

TITLE: Verify Node.js Installation on Ubuntu
DESCRIPTION: Checks the currently installed version of Node.js to ensure it meets the requirements before proceeding with the pdf2json installation. This command helps confirm Node.js is present and accessible.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_48

LANGUAGE: terminal
CODE:
```
$ nodejs --version
v0.10.22
```

----------------------------------------

TITLE: Parsing Output for Link Button (Fields Array)
DESCRIPTION: This Javascript object illustrates the structure of a parsed link button field within the 'Fields' array. The linked URL is specified in the 'FL.form.Id' property, allowing the button to launch a URL when clicked.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_23

LANGUAGE: Javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "link"
 },
 FL: {form: {Id:"http://www.github.com"},
 id: {
  Id: "quad8",
  EN: 0
 },
 TI: 0,
 x: 52.35,
 y: 28.35,
 w: 8.88,
 h: 0.85
}
```

----------------------------------------

TITLE: Example of Generated Fields JSON Content
DESCRIPTION: This JSON snippet provides an example of the `fields.json` file structure, which is generated when the `-t` command-line argument is used. It contains an array of objects, each representing a form field with its ID, type, calculation status, and initial value, useful for validation or data extraction.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_35

LANGUAGE: json
CODE:
```
[
 {"id":"ADDRCH","type":"alpha","calc":false,"value":"user input data"},
 {"id":"FSRB","type":"radio","calc":false,"value":"Single"},
 {"id":"APPROVED","type":"alpha","calc":true,"value":"Approved Form"}
]
```

----------------------------------------

TITLE: pdf2json v2.0.0 Output Data Field Changes
DESCRIPTION: Describes the breaking changes in the output data fields in v2.0.0. `Agency` and `Id` root properties are replaced with `Meta` (containing full PDF metadata), `formImage` is removed, and `Width` is moved from the root to each page object.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_42

LANGUAGE: APIDOC
CODE:
```
Root Properties:
  - "Agency" and "Id" replaced by "Meta" (full PDF metadata)
  - "formImage" removed
  - "Width" moved from root to each page object under "Pages"

Page Object Properties:
  - "Width" added
```

----------------------------------------

TITLE: Generate Multiple Output Streams for PDF Content
DESCRIPTION: Provides examples of private methods to generate additional output streams for merged text blocks, raw text content, and form field types, showcasing advanced stream processing capabilities. Note that these streams will not be processed if the primary JSON parsing encounters exceptions.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_8

LANGUAGE: javascript
CODE:
```
    //private methods
 #generateMergedTextBlocksStream() {
  return new Promise( (resolve, reject) => {
   const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".merged.json"), resolve, reject);
   this.pdfParser.getMergedTextBlocksStream().pipe(new StringifyStream()).pipe(outputStream);
  });
 }

    #generateRawTextContentStream() {
  return new Promise( (resolve, reject) => {
   const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".content.txt"), resolve, reject);
   this.pdfParser.getRawTextContentStream().pipe(outputStream);
  });
    }

    #generateFieldsTypesStream() {
  return new Promise( (resolve, reject) => {
   const outputStream = ParserStream.createOutputStream(this.outputPath.replace(".json", ".fields.json"), resolve, reject);
   this.pdfParser.getAllFieldsTypesStream().pipe(new StringifyStream()).pipe(outputStream);
  });
 }

 #processAdditionalStreams() {
        const outputTasks = [];
        if (PROCESS_FIELDS_CONTENT) {//needs to generate fields.json file
            outputTasks.push(this.#generateFieldsTypesStream());
        }
        if (PROCESS_RAW_TEXT_CONTENT) {//needs to generate content.txt file
            outputTasks.push(this.#generateRawTextContentStream());
        }
        if (PROCESS_MERGE_BROKEN_TEXT_BLOCKS) {//needs to generate json file with merged broken text blocks
            outputTasks.push(this.#generateMergedTextBlocksStream());
        }
  return Promise.allSettled(outputTasks);
 }
```

----------------------------------------

TITLE: pdf2json Output: Rotated Text Block (RA Field)
DESCRIPTION: This JavaScript object demonstrates how rotated text is represented in the pdf2json output. When text is rotated, an 'RA' field is added to the 'R' array's object, indicating the rotation angle in degrees (e.g., 90 for 90 degrees).
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_29

LANGUAGE: javascript
CODE:
```
{
 x: 7.11,
 y: 2.47,
 w: 1.6,
 clr: 0,
 A: "left",
 R: [
  {
   T: "Modesty%20PDF%20Parser%20NodeJS",
   S: -1,
   TS: [0, 15, 1, 0],
   RA: 90
  }
 ]
}
```

----------------------------------------

TITLE: Accessing PDF2JSON Dictionaries via PDFParser Static Getters
DESCRIPTION: Demonstrates accessing the `pdf2json` color, font face, and font style dictionaries through static getters (`colorDict`, `fontFaceDict`, `fontStyleDict`) of the `PDFParser` class. This provides a convenient way to retrieve the dictionary definitions programmatically.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_19

LANGUAGE: javascript
CODE:
```
console.dir(PDFParser.colorDict);
console.dir(PDFParser.fontFaceDict);
console.dir(PDFParser.fontStyleDict);
```

----------------------------------------

TITLE: pdf2json v1.1.4 Unified Event Data Structure
DESCRIPTION: Details the unified event data structure introduced in v1.1.4 for top-level events. It specifies the format for `pdfParser_dataError` and `pdfParser_dataReady` events, noting that `formImage` was removed from `pdfParser_dataReady` in v2.0.0.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_41

LANGUAGE: APIDOC
CODE:
```
event "pdfParser_dataError": {"parserError": errObj}
event "pdfParser_dataReady": {"formImage": parseOutput} // Note: "formImage" removed from v2.0.0
```

----------------------------------------

TITLE: Parsing Output for Read-Only Field Attribute (AM)
DESCRIPTION: This Javascript object demonstrates how the 'AM' (attribute mask) field indicates a read-only field. If the 'AM' value is 1024 (0x00000400), it signifies that the field is read-only, a common attribute set in Acrobat Pro.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_24

LANGUAGE: Javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "alpha",
  TypeInfo: { }
 },
 id: {
  Id: "p1_t40",
  EN: 0
 },
 TI: 0,
 AM: 1024, //If (AM & 0x00000400) set, it indicates this is a read-only filed
 x: 6.19,
 y: 5.15,
 w: 30.94,
 h: 0.85
}
```

----------------------------------------

TITLE: pdf2json Output: Number Field Format
DESCRIPTION: This JavaScript object illustrates the structure of a 'number' type field in the final JSON output generated by pdf2json. It shows how the detected format type is stored under the 'T' object with 'Name' as 'number'.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_26

LANGUAGE: javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "number",
  TypeInfo: { }
 },
 id: {
  Id: "FAGI",
  EN: 0
 },
 TI: 0,
 x: 68.35,
 y: 22.43,
 w: 21.77,
 h: 1.08
}
```

----------------------------------------

TITLE: pdf2json Output: Date Field Format
DESCRIPTION: This JavaScript object demonstrates the structure of a 'date' type field in the pdf2json output. Similar to number fields, the 'T' object's 'Name' property indicates 'date', reflecting the detected input field format.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_27

LANGUAGE: javascript
CODE:
```
{
 style: 48,
 T: {
  Name: "date",
  TypeInfo: { }
 },
 id: {
  Id: "Your Birth Date",
  EN: 0
 },
 TI: 0,
 x: 33.43,
 y: 20.78,
 w: 5.99,
 h: 0.89
}
```

----------------------------------------

TITLE: JavaScript Color Dictionary Definition
DESCRIPTION: Defines `kColors`, a JavaScript array of hexadecimal color codes. This dictionary optimizes data transfer by allowing color references via index, reducing payload size for PDF parsing objects.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_15

LANGUAGE: javascript
CODE:
```
const kColors = [
 "#000000", // 0
 "#ffffff", // 1
 "#4c4c4c", // 2
 "#808080", // 3
 "#999999", // 4
 "#c0c0c0", // 5
 "#cccccc", // 6
 "#e5e5e5", // 7
 "#f2f2f2", // 8
 "#008000", // 9
 "#00ff00", // 10
 "#bfffa0", // 11
 "#ffd629", // 12
 "#ff99cc", // 13
 "#004080", // 14
 "#9fc0e1", // 15
 "#5580ff", // 16
 "#a9c9fa", // 17
 "#ff0080", // 18
 "#800080", // 19
 "#ffbfff", // 20
 "#e45b21", // 21
 "#ffbfaa", // 22
 "#008080", // 23
 "#ff0000", // 24
 "#fdc59f", // 25
 "#808000", // 26
 "#bfbf00", // 27
 "#824100", // 28
 "#007256", // 29
 "#008000", // 30
 "#000080", // Last + 1
 "#008080", // Last + 2
 "#800080", // Last + 3
 "#ff0000", // Last + 4
 "#0000ff", // Last + 5
 "#008000", // Last + 6
 "#000000" // Last + 7
];
```

----------------------------------------

TITLE: JavaScript Font Face Dictionary Definition
DESCRIPTION: Defines `kFontFaces`, a JavaScript array listing various font families and their fallbacks. Each entry is indexed, enabling compact representation of font faces within the PDF parsing output.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_16

LANGUAGE: javascript
CODE:
```
const kFontFaces = [
 "QuickType,Arial,Helvetica,sans-serif", // 00 - QuickType - sans-serif variable font
 "QuickType Condensed,Arial Narrow,Arial,Helvetica,sans-serif", // 01 - QuickType Condensed - thin sans-serif variable font
 "QuickTypePi", // 02 - QuickType Pi
 "QuickType Mono,Courier New,Courier,monospace", // 03 - QuickType Mono - san-serif fixed font
 "OCR-A,Courier New,Courier,monospace", // 04 - OCR-A - OCR readable san-serif fixed font
 "OCR B MT,Courier New,Courier,monospace" // 05 - OCR-B MT - OCR readable san-serif fixed font
];
```

----------------------------------------

TITLE: JavaScript Font Style Dictionary Definition
DESCRIPTION: Defines `kFontStyles`, a JavaScript array specifying font properties like face index, size, bold, and italic. This dictionary allows for efficient storage and transmission of complex font styles by referencing pre-defined combinations.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_17

LANGUAGE: javascript
CODE:
```
const kFontStyles = [
 // Face  Size Bold Italic  StyleID(Comment)
 // ----- ---- ---- -----  -----------------
 [0, 6, 0, 0], //00
 [0, 8, 0, 0], //01
 [0, 10, 0, 0], //02
 [0, 12, 0, 0], //03
 [0, 14, 0, 0], //04
 [0, 18, 0, 0], //05
 [0, 6, 1, 0], //06
 [0, 8, 1, 0], //07
 [0, 10, 1, 0], //08
 [0, 12, 1, 0], //09
 [0, 14, 1, 0], //10
 [0, 18, 1, 0], //11
 [0, 6, 0, 1], //12
 [0, 8, 0, 1], //13
 [0, 10, 0, 1], //14
 [0, 12, 0, 1], //15
 [0, 14, 0, 1], //16
 [0, 18, 0, 1], //17
 [0, 6, 1, 1], //18
 [0, 8, 1, 1], //19
 [0, 10, 1, 1], //20
 [0, 12, 1, 1], //21
 [0, 14, 1, 1], //22
 [0, 18, 1, 1], //23
 [1, 6, 0, 0], //24
 [1, 8, 0, 0], //25
 [1, 10, 0, 0], //26
 [1, 12, 0, 0], //27
 [1, 14, 0, 0], //28
 [1, 18, 0, 0], //29
 [1, 6, 1, 0], //30
 [1, 8, 1, 0], //31
 [1, 10, 1, 0], //32
 [1, 12, 1, 0], //33
 [1, 14, 1, 0], //34
 [1, 18, 1, 0], //35
 [1, 6, 0, 1], //36
 [1, 8, 0, 1], //37
 [1, 10, 0, 1], //38
 [1, 12, 0, 1], //39
 [1, 14, 0, 1], //40
 [1, 18, 0, 1], //41
 [2, 8, 0, 0], //42
 [2, 10, 0, 0], //43
 [2, 12, 0, 0], //44
 [2, 14, 0, 0], //45
 [2, 12, 0, 0], //46
 [3, 8, 0, 0], //47
 [3, 10, 0, 0], //48
 [3, 12, 0, 0], //49
 [4, 12, 0, 0], //50
 [0, 9, 0, 0], //51
 [0, 9, 1, 0], //52
 [0, 9, 0, 1], //53
 [0, 9, 1, 1], //54
 [1, 9, 0, 0], //55
 [1, 9, 1, 0], //56
 [1, 9, 1, 1], //57
 [4, 10, 0, 0], //58
 [5, 10, 0, 0], //59
 [5, 12, 0, 0] //60
];
```

----------------------------------------

TITLE: Upgrade pdf2json to v1.x.x
DESCRIPTION: Instructions for upgrading the `pdf2json` library to v1.x.x by removing the local `node_modules` directory and re-running `npm install`. This ensures updated dependency packages and ES6/ES2015 compatibility.
SOURCE: https://github.com/modesty/pdf2json/blob/master/readme.md#_snippet_40

LANGUAGE: Shell
CODE:
```
rm -rf node_modules
npm install
```