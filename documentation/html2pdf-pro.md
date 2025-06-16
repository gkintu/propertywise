TITLE: Complete html2canvas Example with Multiple Configuration Options
DESCRIPTION: Provides a comprehensive example of `html2canvas` usage, demonstrating various configuration options like `scale` for higher resolution, `backgroundColor`, `logging`, `imageTimeout`, and `ignoreElements`. It also shows how to use the `onclone` callback to modify the cloned document before rendering and how to handle the resulting canvas.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_8

LANGUAGE: typescript
CODE:
```
html2canvas(document.getElementById('capture'), {
    scale: 2, // 2x scale for higher resolution
    useCORS: true,
    backgroundColor: '#f5f5f5',
    logging: false,
    imageTimeout: 30000,
    ignoreElements: (element) => {
        return element.classList.contains('do-not-capture');
    },
    onclone: (clonedDoc) => {
        // Modify the cloned document before rendering
        const timestamp = clonedDoc.getElementById('timestamp');
        if (timestamp) {
            timestamp.textContent = new Date().toLocaleString();
        }
    }
}).then(canvas => {
    // Use the resulting canvas
    document.body.appendChild(canvas);
    
    // Or convert to image
    const image = canvas.toDataURL('image/png');
    // Do something with the image...
});
```

----------------------------------------

TITLE: Asynchronous Same-Origin Validation with html2canvas
DESCRIPTION: Shows how to use `customIsSameOrigin` with an `async` function that returns a Promise, allowing for asynchronous URL validation. This example fetches data from an API to determine if a URL will redirect, providing a flexible way to handle complex same-origin checks.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_6

LANGUAGE: typescript
CODE:
```
html2canvas(element, {
    useCORS: true,
    customIsSameOrigin: async (src, oldFn) => {
        // You could check against an API that knows which URLs will redirect
        const response = await fetch('/api/check-redirect?url=' + encodeURIComponent(src));
        const data = await response.json();
        return !data.willRedirect;
    },
    // any other options...
});
```

----------------------------------------

TITLE: html2canvas-pro Image Handling Configuration Options
DESCRIPTION: Describes options for managing image processing and loading within html2canvas-pro, such as custom same-origin checks, image loading timeouts, proxy usage for cross-origin images, and CORS settings.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
customIsSameOrigin:
  Default: null
  Description: Custom function to determine if an image URL is same-origin. Accepts two parameters: (src: string, oldFn: (src: string) => boolean) => boolean | Promise<boolean> where src is the image URL and oldFn is the default same-origin check function
  Example: See examples below
imageTimeout:
  Default: 15000
  Description: Timeout for loading an image (in milliseconds). Set to 0 to disable timeout
  Example: 30000
proxy:
  Default: null
  Description: Url to the proxy which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded
  Example: "https://proxy.example.com/"
useCORS:
  Default: false
  Description: Whether to attempt to load images from a server using CORS
  Example: true
```

----------------------------------------

TITLE: Styling Pseudo-elements with CSS
DESCRIPTION: Demonstrates various applications of `::before` and `::after` pseudo-elements in CSS, including adding text content, embedding images via `url()`, setting background images, and controlling visibility with `display: none;`.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/pseudoelements.html#_snippet_0

LANGUAGE: CSS
CODE:
```
:root .text *::before { content:" root before!"; } .text *::before { content:" before!"; } .text *::after { content:" after!"; } .img *::before{ content: url(../assets/image.jpg); } .img *::after{ content: url(../assets/image2.jpg); } .background *::before{ background: url(../assets/image_1.jpg); border: 5px solid red; } .background *::after{ background: url(../assets/image2_1.jpg); } .none *::before { display:none; } .none *::after { display:none; } body { font-family: Arial; }
```

----------------------------------------

TITLE: Configure html2canvas-pro to Ignore Elements
DESCRIPTION: This JavaScript snippet defines an `h2cOptions` object, which includes an `ignoreElements` function. This function serves as a predicate to determine which DOM elements should be excluded from the rendering process based on their class name. It's crucial for controlling the output of the canvas capture.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/options/ignore.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
h2cOptions = {ignoreElements: function(element) { return element.className === 'ignored'; }};
```

----------------------------------------

TITLE: Render HTML element to canvas with html2canvas-pro
DESCRIPTION: Shows a basic example of using html2canvas-pro to capture a DOM element (e.g., the document body) and render it onto an HTML canvas, which is then appended to the document.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/getting-started.md#_snippet_2

LANGUAGE: javascript
CODE:
```
html2canvas(document.body).then(function(canvas) {
    document.body.appendChild(canvas);
});
```

----------------------------------------

TITLE: Select Specific Element for html2canvas-pro Rendering
DESCRIPTION: This JavaScript snippet shows how to select a specific DOM element using `document.querySelector` and assign it to `h2cSelector`. This indicates that html2canvas-pro should render only this particular element, rather than the entire document.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/options/ignore-2.html#_snippet_2

LANGUAGE: JavaScript
CODE:
```
var forceElement = document.querySelector('#div1'); h2cSelector = forceElement;
```

----------------------------------------

TITLE: Exclude Elements from html2canvas-pro Rendering
DESCRIPTION: Demonstrates how to prevent specific HTML elements from being rendered by html2canvas-pro by adding the `data-html2canvas-ignore` attribute. This is useful for excluding sensitive or unnecessary content from the captured image.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_3

LANGUAGE: HTML
CODE:
```
<div>
  This will be rendered
  <div data-html2canvas-ignore>This will NOT be rendered</div>
</div>
```

----------------------------------------

TITLE: Install html2canvas-pro via npm, pnpm, or yarn
DESCRIPTION: Instructions on how to install the html2canvas-pro library using common Node.js package managers like npm, pnpm, or yarn.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/getting-started.md#_snippet_0

LANGUAGE: sh
CODE:
```
npm install html2canvas-pro
pnpm / yarn add html2canvas-pro
```

----------------------------------------

TITLE: Configure html2canvas-pro for large canvas elements
DESCRIPTION: This snippet demonstrates how to configure html2canvas-pro to handle large canvas elements by setting the windowWidth and windowHeight options. This helps prevent issues where the produced canvas is empty or cut off due to browser-specific canvas size limitations, ensuring the entire element is captured.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/faq.md#_snippet_0

LANGUAGE: JavaScript
CODE:
```
import html2canvas from 'html2canvas-pro';

await html2canvas(element, {
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
});
```

----------------------------------------

TITLE: Applying Various Text Shadow and Text Styling Effects with CSS
DESCRIPTION: This snippet provides a comprehensive set of CSS rules for applying different text shadow effects and general text styling. It includes examples for single and multiple shadows, transparent text with shadows, and combining shadows with other properties like color, font-size, and text-decoration. These styles can be applied to HTML elements to enhance their visual presentation.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/text/shadow.html#_snippet_0

LANGUAGE: css
CODE:
```
.shadow1 span{ text-shadow: 1px 1px 3px #888; }
.shadow1 strong { text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; }
.shadow2 { font-size: 48px; }
.shadow2 span{ color: transparent; text-shadow: 0 0 5px #00f, 2px 2px 0 #f00; }
.shadow2 strong { color: rgba(0, 255, 0, 0.5); text-shadow: 0 0 5px #00f, 2px 2px 0 #f00; text-decoration: underline; }
.white-text-with-blue-shadow { text-shadow: 1px 1px 2px black, 0 0 1em blue, 0 0 0.2em blue; color: white; font: 1.5em Georgia, serif; }
.red-text-shadow { text-shadow: 0 -2px; }
body { font-family: Arial; }
```

----------------------------------------

TITLE: Import html2canvas-pro in JavaScript
DESCRIPTION: Demonstrates how to import the html2canvas-pro library into a JavaScript module using an ES6 import statement.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/README.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import html2canvas from 'html2canvas-pro';
```

----------------------------------------

TITLE: html2canvas-pro Rendering Control Options
DESCRIPTION: Outlines options that influence how content is rendered to the canvas, including ForeignObject rendering, element exclusion, and callbacks for modifying the cloned document before rendering.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_2

LANGUAGE: APIDOC
CODE:
```
foreignObjectRendering:
  Default: false
  Description: Whether to use ForeignObject rendering if the browser supports it
  Example: true
ignoreElements:
  Default: (element) => false
  Description: Predicate function which removes the matching elements from the render
  Example: (el) => el.classList.contains('no-capture')
onclone:
  Default: null
  Description: Callback function which is called when the Document has been cloned for rendering, can be used to modify the contents that will be rendered without affecting the original source document
  Example: (doc) => doc.querySelector('.date').textContent = new Date().toISOString()
x:
  Default: Element x-offset
  Description: Crop canvas x-coordinate
  Example: 10
y:
  Default: Element y-offset
  Description: Crop canvas y-coordinate
  Example: 20
scrollX:
  Default: Element scrollX
  Description: The x-scroll position to use when rendering element (for example if the Element uses position: fixed)
  Example: 0
scrollY:
  Default: Element scrollY
  Description: The y-scroll position to use when rendering element (for example if the Element uses position: fixed)
  Example: 100
windowWidth:
  Default: Window.innerWidth
  Description: Window width to use when rendering Element, which may affect things like Media queries
  Example: 1920
windowHeight:
  Default: Window.innerHeight
  Description: Window height to use when rendering Element, which may affect things like Media queries
  Example: 1080
```

----------------------------------------

TITLE: Basic Usage of html2canvas with Custom Same-Origin Logic
DESCRIPTION: Demonstrates basic usage of `html2canvas` with `useCORS` enabled and a custom `customIsSameOrigin` function for synchronous URL validation. This example checks if a URL's pathname starts with '/some-redirect-prefix' to determine if it should be treated as a redirect URL, thus not same-origin.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/configuration.md#_snippet_5

LANGUAGE: typescript
CODE:
```
html2canvas(element, {
    useCORS: true,
    customIsSameOrigin: (src, oldFn) => {
        // If old logic thinks it's not same origin, certainly it's not
        if (!oldFn(src)) {
            return false;
        }
        // Otherwise, we need to check if it's a redirect url
        const targetUrl = new URL(src);
        const pathname = targetUrl.pathname;
        // You can replace it with any logic you want. Including but not limited to: using regular expressions, using asynchronous validation logic
        // Here we simply suppose your biz url starts with /some-redirect-prefix and treat it as a redirect url just for example
        return !pathname.startsWith('/some-redirect-prefix');
    },
    // any other options...
});
```

----------------------------------------

TITLE: Install html2canvas-pro via npm, pnpm, or yarn
DESCRIPTION: Instructions for installing the html2canvas-pro library using common Node.js package managers like npm, pnpm, or yarn.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/README.md#_snippet_0

LANGUAGE: sh
CODE:
```
npm install html2canvas-pro
pnpm / yarn add html2canvas-pro
```

----------------------------------------

TITLE: Generate Content with Image URL and Data Attribute in CSS
DESCRIPTION: This snippet shows how to use the `content` property to insert an image via `url()` and text from an HTML data attribute (`attr(data-text)`) after an element. It's useful for dynamically adding visual and textual content.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/pseudo-content.html#_snippet_5

LANGUAGE: CSS
CODE:
```
.attr-url > div::after { content: url(../assets/image.jpg) "///" attr(data-text); }
```

----------------------------------------

TITLE: CSS Styling for Z-Index and Absolute Positioning
DESCRIPTION: Defines CSS rules for a container and two child elements, illustrating absolute positioning, dimensions, background colors, and z-index properties to control stacking order within a relative parent.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index20.html#_snippet_0

LANGUAGE: CSS
CODE:
```
.container { width: 375px; height: 603px; background-color: #999; position: relative; margin-bottom: 30px; } .child1 { height: 500px; width: 200px; background-color: red; z-index: 20; position: absolute; left: 0; top: 0; } .child2 { height: 50px; width: 100px; background-color: blue; z-index: 20; position: absolute; left: 30px; top: 30px; }
```

----------------------------------------

TITLE: CSS Styles for Z-index Stacking Context Testing
DESCRIPTION: Defines various CSS properties including font, width, height, position, border, background-color, padding, opacity, and z-index for nested div elements. These styles are designed to create a visual hierarchy and test how different z-index values interact with positioning to determine the stacking order of elements.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index3.html#_snippet_0

LANGUAGE: CSS
CODE:
```
div { font: 12px Arial; }
span.bold { font-weight: bold; }
div.lev1 { width: 250px; height: 70px; position: relative; border: 2px solid #669966; background-color: #ccffcc; padding-left: 5px; }
#container1 { z-index: 1; position: absolute; top: 30px; left: 75px; }
div.lev2 { opacity: 0.9; width: 200px; height: 60px; position: relative; border: 2px solid #990000; background-color: #ffdddd; padding-left: 5px; }
#container2 { z-index: 1; position: absolute; top: 20px; left: 110px; }
div.lev3 { z-index: 10; width: 100px; position: relative; border: 2px outset #000099; background-color: #ddddff; padding-left: 5px; }
```

----------------------------------------

TITLE: Supported CSS Properties in html2canvas-pro
DESCRIPTION: Lists all CSS properties and their specific values that are currently supported by html2canvas-pro for accurate rendering.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/features.md#_snippet_0

LANGUAGE: APIDOC
CODE:
```
Supported CSS Properties:
- background
  - background-clip (Does not support `text`)
  - background-color
  - background-image
    - url()
    - linear-gradient()
    - radial-gradient()
  - background-origin
  - background-position
  - background-size
- border
  - border-color
  - border-radius
  - border-style
  - border-width
- bottom
- box-sizing
- content
- color
- display
- flex
- float
- font
  - font-family
  - font-size
  - font-style
  - font-variant
  - font-weight
- height
- left
- letter-spacing
- line-break
- list-style
  - list-style-image
  - list-style-position
  - list-style-type
- margin
- max-height
- max-width
- min-height
- min-width
- opacity
- overflow
- overflow-wrap
- padding
- paint-order
- position
- right
- text-align
- text-decoration
  - text-decoration-color
  - text-decoration-line
  - text-decoration-style (Only supports `solid`)
- text-shadow
- text-transform
- top
- transform (Limited support)
- visibility
- white-space
- width
- webkit-text-stroke
- word-break
- word-spacing
- word-wrap
- z-index
- oklch
- object-fit
```

----------------------------------------

TITLE: Unsupported CSS Properties in html2canvas-pro
DESCRIPTION: Lists CSS properties that are not currently supported by html2canvas-pro and may not render as expected.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/docs/features.md#_snippet_1

LANGUAGE: APIDOC
CODE:
```
Unsupported CSS Properties:
- background-blend-mode
- border-image
- box-decoration-break
- box-shadow
- filter
- font-variant-ligatures
- mix-blend-mode
- object-position
- repeating-linear-gradient()
- writing-mode
- zoom
```

----------------------------------------

TITLE: CSS Styles for Z-index and Positioning
DESCRIPTION: This CSS snippet defines styles for multiple div elements and a span, demonstrating how `z-index` interacts with different positioning contexts. It includes examples for elements with no explicit positioning, `position: relative`, and `position: absolute`, each with a distinct `z-index` value to illustrate stacking order.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index9.html#_snippet_0

LANGUAGE: CSS
CODE:
```
div {
  opacity: 0.7;
  font: 12px Arial;
}
span.bold {
  font-weight: bold;
}
#normdiv {
  z-index: 8;
  height: 70px;
  border: 1px solid #999966;
  background-color: #ffffcc;
  margin: 0px 50px 0px 50px;
  text-align: center;
}
#reldiv1 {
  z-index: 3;
  height: 100px;
  position: relative;
  top: 30px;
  border: 1px solid #669966;
  background-color: #ccffcc;
  margin: 0px 50px 0px 50px;
  text-align: center;
}
#reldiv2 {
  z-index: 2;
  height: 100px;
  position: relative;
  top: 15px;
  left: 20px;
  border: 1px solid #669966;
  background-color: #ccffcc;
  margin: 0px 50px 0px 50px;
  text-align: center;
}
#absdiv1 {
  z-index: 5;
  position: absolute;
  width: 150px;
  height: 350px;
  top: 10px;
  left: 10px;
  border: 1px solid #990000;
  background-color: #ffdddd;
  text-align: center;
}
#absdiv2 {
  z-index: 1;
  position: absolute;
  width: 150px;
  height: 350px;
  top: 10px;
  right: 10px;
  border: 1px solid #990000;
  background-color: #ffdddd;
  text-align: center;
}
```

----------------------------------------

TITLE: Applying Various CSS List Styling Properties
DESCRIPTION: This CSS snippet defines styles for list items and different list classes, showcasing the usage of `margin`, `list-style-type` (circle, lower-roman, hiragana, simp-chinese-informal, lower-alpha), `list-style-image` (with URL and linear-gradient), `list-style-position`, and `display` properties to control the appearance and layout of HTML lists.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/list/liststyle.html#_snippet_0

LANGUAGE: CSS
CODE:
```
li { margin: 10px 5%; }
.list1 { list-style-type: circle; }
.list2 { list-style-image: url(../../assets/image.jpg); }
.list3 { list-style-image: linear-gradient(60deg, deeppink, aquamarine); list-style-position: inside; }
.list4 { }
.list5 { list-style-type: lower-roman; }
.list6 { list-style-type: hiragana; }
.list7 { list-style-type: simp-chinese-informal; }
.list8 { list-style-type: lower-roman; }
.list8 li { display: block; }
.list9 { display: list-item; list-style-type: lower-alpha; margin: 10px; position: relative; left: 200px; }
```

----------------------------------------

TITLE: CSS Styling for Z-Index Behavior Demonstration
DESCRIPTION: Defines CSS rules for `.outer` and `.inner` elements to illustrate `z-index` interactions. The `.outer` element is a relatively positioned container, while the `.inner` element is absolutely positioned with a negative `z-index`, causing it to render behind the `.outer` element's background. Basic font styling is also applied to the `body`.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index13.html#_snippet_0

LANGUAGE: CSS
CODE:
```
.outer { background-color:cyan; width:200px; height:200px; z-index:0; position:relative; }
.inner { background-color:green; width:100px; height:100px; z-index:-1; position:absolute; top:0;left:0; }
body { font-family: Arial; }
```

----------------------------------------

TITLE: Configure html2canvas-pro options for iframe capture
DESCRIPTION: This JavaScript snippet demonstrates how to set `h2cOptions` to enable Cross-Origin Resource Sharing (CORS) and explicitly set the proxy to null. This configuration is often essential when attempting to capture content from iframes using html2canvas-pro to prevent security restrictions.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/iframe.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
h2cOptions = { useCORS: true, proxy: null };
```

----------------------------------------

TITLE: CSS Styles for z-index Layering Demonstration
DESCRIPTION: Defines base styles for `div` elements, then specific styles for `div.z0` and `div.z1` to illustrate how `z-index` affects their stacking order. `div.z0` is given `z-index: 0` and positioned to overlap, while `div.z1` has `z-index: 1`.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index6.html#_snippet_0

LANGUAGE: CSS
CODE:
```
div { width: 250px; height: 70px; position: relative; border: 2px solid #669966; background-color: #ccffcc; padding-left: 5px; }
div.z0 { z-index: 0; top:105px; left:20px; background-color: #ffdddd; }
div.z1 { z-index: 1; }
body { font-family: Arial; }
```

----------------------------------------

TITLE: Apply Fixed Position and Z-Index to an Element
DESCRIPTION: This CSS snippet defines a class `.z` that applies a fixed position to an element, placing it at the top of the viewport with a height of 100px and a z-index of 10. It also includes basic styling for the body, setting its background color and font family.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index17.html#_snippet_0

LANGUAGE: CSS
CODE:
```
z-index17 .z { background: darkolivegreen; position: fixed; right: 0; left: 0; height: 100px; z-index: 10; top: 0; } body { background: violet; } body { font-family: Arial; }
```

----------------------------------------

TITLE: Apply CSS Text Decoration Styles
DESCRIPTION: Demonstrates various `text-decoration` CSS properties including `none`, `underline`, `overline`, and `line-through`. These properties control the line drawn on or through text, affecting its visual presentation.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/text/text.html#_snippet_1

LANGUAGE: CSS
CODE:
```
text-decoration:none;
text-decoration:underline;
text-decoration:overline;
text-decoration:line-through;
```

----------------------------------------

TITLE: Demonstrating word-break: break-all Behavior
DESCRIPTION: Shows `word-break: break-all`, where words can be broken at any character to prevent overflow, even in the middle of a word. This ensures content always fits within its container.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/text/word-break.html#_snippet_2

LANGUAGE: CSS
CODE:
```
.breakAll { word-break: break-all; }
```

LANGUAGE: HTML
CODE:
```
<div class="narrow breakAll">
  This is a long and Supercalifragilisticexpialidocious sentence. 次の単語グレートブリテンおよび北アイルランド連合王国で本当に大きな言葉
</div>
```

----------------------------------------

TITLE: Configure html2canvas-pro Cropping Options
DESCRIPTION: Defines an options object for html2canvas-pro to specify the cropping area. The `x` and `y` properties set the top-left corner, while `width` and `height` define the dimensions of the crop region.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/options/crop.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
h2cOptions = { x: 250, y: 250, width: 100, height: 100 };
```

----------------------------------------

TITLE: Complete CSS Styles for Z-index Stacking Context Demonstration
DESCRIPTION: Provides the full CSS stylesheet used to demonstrate the effects of `z-index` and `position` properties on element stacking. Includes general resets, base typography, and specific styles for six distinct `div` elements, each with varying `z-index` and `position` values to illustrate stacking behavior.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index10.html#_snippet_0

LANGUAGE: css
CODE:
```
* { margin: 0; } html { padding: 20px; font: 12px/20px Arial, sans-serif; } div { opacity: 0.7; position: relative; } h1 { font: inherit; font-weight: bold; } #div1, #div2 { border: 1px solid #696; padding: 10px; background-color: #cfc; } #div1 { z-index: 5; margin-bottom: 190px; } #div2 { z-index: 2; } #div3 { z-index: 4; opacity: 1; position: absolute; top: 40px; left: 180px; width: 330px; border: 1px solid #900; background-color: #fdd; padding: 40px 20px 20px; } #div4, #div5 { border: 1px solid #996; background-color: #ffc; } #div4 { z-index: 6; margin-bottom: 15px; padding: 25px 10px 5px; } #div5 { z-index: 1; margin-top: 15px; padding: 5px 10px; } #div6 { z-index: 3; position: absolute; top: 20px; left: 180px; width: 150px; height: 125px; border: 1px solid #009; padding-top: 125px; background-color: #ddf; text-align: center; } code { font-family: monospace; }
```

----------------------------------------

TITLE: Configure html2canvas-pro to Ignore Elements by Class
DESCRIPTION: This JavaScript snippet demonstrates how to set the `ignoreElements` option for html2canvas-pro. It uses a predicate function that returns `true` for any element with the class name 'ignored', effectively preventing it from being rendered by html2canvas.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/options/ignore-2.html#_snippet_0

LANGUAGE: JavaScript
CODE:
```
h2cOptions = {ignoreElements: function(element) { return element.className === 'ignored'; }};
```

----------------------------------------

TITLE: Implement Nested List Numbering with CSS Counters
DESCRIPTION: This CSS provides a method for creating custom, nested list numbering using `counter-reset`, `counter-increment`, and `counters()`. It ensures that each `ol` element creates a new counter instance and `li` elements display their hierarchical position.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/pseudo-content.html#_snippet_6

LANGUAGE: CSS
CODE:
```
ol { counter-reset: section; /* Creates a new instance of the section counter with each ol element */
list-style-type: none; }
li::before { counter-increment: section; /* Increments only this instance of the section counter */
content: counters(section, ".") " "; /* Combines the values of all instances of the section counter, separated by a period */ }
```

----------------------------------------

TITLE: Apply CSS Counter to Flexbox Items (Issue 2639)
DESCRIPTION: This snippet addresses a specific issue (Issue 2639) by applying a counter to flexbox items. It ensures that the counter `ol0` is reset for the first child and increments for subsequent flex items, displaying a numbered prefix.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/pseudo-content.html#_snippet_7

LANGUAGE: CSS
CODE:
```
.issue-2639 { display: flex; }
.issue-2639::before { content: counter(ol0) '. '; counter-increment: ol0; }
.issue-2639:first-child { counter-reset: ol0; }
```

----------------------------------------

TITLE: CSS for Element Visibility Testing
DESCRIPTION: Defines basic styling for elements, including a border for divs, a class to hide elements using `display:none`, and a default font for the body. This CSS is used to test how elements are rendered based on their visibility properties.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/visibility.html#_snippet_0

LANGUAGE: CSS
CODE:
```
div{ border:2px solid black; } .none { display:none } body { font-family: Arial; }
```

----------------------------------------

TITLE: CSS Styles for Animations and Transformations
DESCRIPTION: Defines base styles for a paragraph element, then applies different animation and transformation effects using `@keyframes`, `transform`, `transition`, and `animation` properties. It illustrates how to control animation states and delays for visual elements.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/animation.html#_snippet_0

LANGUAGE: css
CODE:
```
body { font-family: Arial; } @keyframes rotate0 { 0% { transform: rotate(0deg); } } @keyframes rotate45 { 0% { transform: rotate(45deg); } } p { font: 22px/1 Arial, sans-serif; position: absolute; top: 25%; left: 25%; width: 50%; height: 50%; color: #fff; background-color: #666; line-height: 90px; text-align: center; } .transformed.working p { transform: rotate(45deg); } .animated.working p { animation-name: rotate0; animation-duration: 1ms, 1ms; animation-play-state: paused; } .animated.broken p { animation-name: rotate45; animation-duration: 1ms; animation-play-state: paused; } .transitioned p { transition: 1ms, 1ms; transform: rotate(45deg) } .transition-delay { transition: 1ms; transition-delay: 50ms; transform: rotate(45deg) } div { float: left; clear: left; margin-right: 10px; background-color: #ccc; width: 180px; height: 180px; position: relative; }
```

----------------------------------------

TITLE: Comprehensive CSS for Z-index and Positioning Examples
DESCRIPTION: Defines a set of CSS rules for multiple `div` elements, illustrating the application of `font`, `font-weight`, `z-index`, `height`, `position`, `border`, `background-color`, `padding-left`, `opacity`, `width`, `top`, `left`, `text-align`, and `margin` properties to control their appearance, layout, and stacking context.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index2.html#_snippet_0

LANGUAGE: css
CODE:
```
div {
  font: 12px Arial;
}
span.bold {
  font-weight: bold;
}
#div2 {
  z-index: 2;
}
#div3 {
  z-index: 1;
}
#div4 {
  z-index: 10;
}
#div1, #div3 {
  height: 80px;
  position: relative;
  border: 1px solid #669966;
  background-color: #ccffcc;
  padding-left: 5px;
}
#div2 {
  opacity: 0.8;
  position: absolute;
  width: 150px;
  height: 200px;
  top: 20px;
  left: 170px;
  border: 1px solid #990000;
  background-color: #ffdddd;
  text-align: center;
}
#div4 {
  opacity: 0.8;
  position: absolute;
  width: 200px;
  height: 70px;
  top: 65px;
  left: 50px;
  border: 1px solid #000099;
  background-color: #ddddff;
  text-align: left;
  padding-left: 10px;
}
#div5 {
  border: 1px solid #669966;
  background-color: #ccffcc;
  padding-left: 5px;
  position: relative;
  margin-bottom: -15px;
  height: 50px;
  margin-top: 10px;
}
#div6 {
  border: 1px solid #000099;
  background-color: #ddddff;
  text-align: left;
  padding-left: 10px;
}
```

----------------------------------------

TITLE: Define CSS Styles for Z-Index Layout Testing
DESCRIPTION: This CSS snippet defines styles for various div elements to test z-index behavior and positioning. It includes base styles for fonts and specific styles for four div elements, demonstrating relative and absolute positioning with different z-index values to observe layering effects. The styles are designed to create a visual layout for html2canvas-pro rendering tests.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index1.html#_snippet_0

LANGUAGE: CSS
CODE:
```
div { font: 12px Arial; } span.bold { font-weight: bold; } #div1,#div3 { height: 80px; position: relative; border: 1px solid #669966; background-color: #ccffcc; padding-left: 5px; } #div2 { opacity: 0.8; z-index: 1; position: absolute; width: 150px; height: 200px; top: 20px; left: 170px; border: 1px solid #990000; background-color: #ffdddd; text-align: center; } #div4 { opacity: 0.8; z-index: 2; position: absolute; width: 200px; height: 70px; top: 65px; left: 50px; border: 1px solid #000099; background-color: #ddddff; text-align: left; padding-left: 10px; }
```

----------------------------------------

TITLE: CSS Styles for Stacking Contexts
DESCRIPTION: Defines styles for various `div` and `span` elements, including font properties, borders, background colors, dimensions, and positioning. It specifically demonstrates `position: relative` and `position: absolute` to illustrate their effects on element placement and stacking order without explicit `z-index` values. Opacity is also used to show overlapping.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index7.html#_snippet_0

LANGUAGE: css
CODE:
```
div { font: 12px Arial; }
span.bold { font-weight: bold; }
#normdiv { height: 70px; border: 1px solid #999966; background-color: #ffffcc; margin: 0px 50px 0px 50px; text-align: center; }
#reldiv1 { opacity: 0.7; height: 100px; position: relative; top: 30px; border: 1px solid #669966; background-color: #ccffcc; margin: 0px 50px 0px 50px; text-align: center; }
#reldiv2 { opacity: 0.7; height: 100px; position: relative; top: 15px; left: 20px; border: 1px solid #669966; background-color: #ccffcc; margin: 0px 50px 0px 50px; text-align: center; }
#absdiv1 { opacity: 0.7; position: absolute; width: 150px; height: 350px; top: 10px; left: 10px; border: 1px solid #990000; background-color: #ffdddd; text-align: center; }
#absdiv2 { opacity: 0.7; position: absolute; width: 150px; height: 350px; top: 10px; right: 10px; border: 1px solid #990000; background-color: #ffdddd; text-align: center; }
```

----------------------------------------

TITLE: Embed SVG Graphic Directly as XML Data URI
DESCRIPTION: An example of embedding a complex SVG path definition directly as XML within a data URI. This method allows for inline SVG content without external file dependencies, demonstrating a custom shape with specific fill, stroke, and transformation properties.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/images/svg/native_only.html#_snippet_3

LANGUAGE: svg
CODE:
```
<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="306" height="296"><defs id="defs4" /><g transform="translate(-162.46995,-477.2863)" id="layer1"><path d="m 314.15745,481.69558 c -59.20089,0.53774 -114.80979,36.72219 -137.3125,95.34375 -29.39129,76.56693 8.83932,162.45246 85.40625,191.84375 l 34.03125,-88.6875 c -20.0678,-7.71358 -34.3125,-27.15324 -34.3125,-49.9375 0,-29.54723 23.95277,-53.5 53.5,-53.5 29.54723,0 53.5,23.95277 53.5,53.5 0,22.78426 -14.2447,42.22392 -34.3125,49.9375 l 34.03125,88.6875 c 39.29085,-15.08234 70.3239,-46.1154 85.40625,-85.40625 29.39129,-76.56693 -8.83932,-162.48371 -85.40625,-191.875 -17.94537,-6.88859 -36.40853,-10.07087 -54.53125,-9.90625 z" id="path2830" style="fill:#40aa54;fill-opacity:1;stroke:#20552a;stroke-width:7.99999952;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" /></g></svg>
```

----------------------------------------

TITLE: CSS Styling for Layering and Backgrounds
DESCRIPTION: Applies universal margin/padding reset, sets background colors for `html` and `body`, and positions a `div` (`#div1`) with a negative `z-index` to place it behind other elements. Also sets a default font for the body.
SOURCE: https://github.com/yorickshan/html2canvas-pro/blob/main/tests/reftests/zindex/z-index15.html#_snippet_0

LANGUAGE: CSS
CODE:
```
* {margin:0;padding:0;}
html {background-color: gray;}
body { background-color: green; }
#div1 { background-color:cyan; width:200px; height:200px; z-index:-1; position:absolute; top:0; left:0; }
body { font-family: Arial; }
```