const React = require('react')

// Basic element wrappers used in components (e.g., PDFIcon)
const Svg = (props) => React.createElement('svg', props, props.children)
const Path = (props) => React.createElement('path', props, props.children)
const Circle = (props) => React.createElement('circle', props, props.children)
const Rect = (props) => React.createElement('rect', props, props.children)
const G = (props) => React.createElement('g', props, props.children)
const Polygon = (props) => React.createElement('polygon', props, props.children)

// Common React-PDF primitives as no-op components for tests
const Document = ({ children }) => React.createElement('div', { 'data-mock': 'Document' }, children)
const Page = ({ children }) => React.createElement('div', { 'data-mock': 'Page' }, children)
const Text = ({ children }) => React.createElement('span', { 'data-mock': 'Text' }, children)
const View = ({ children }) => React.createElement('div', { 'data-mock': 'View' }, children)

const Font = {
  register: jest.fn(),
}

const StyleSheet = {
  create: (styles) => styles,
}

const PDFDownloadLink = ({ children }) => React.createElement(
  'a',
  {
    href: '#',
    'data-mock': 'PDFDownloadLink',
    onClick: (e) => e.preventDefault(),
  },
  typeof children === 'function'
    ? children({ blob: null, url: '#', loading: false, error: null })
    : children
)

module.exports = {
  Svg,
  Path,
  Circle,
  Rect,
  G,
  Polygon,
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  PDFDownloadLink,
  default: {
    Svg,
    Path,
    Circle,
    Rect,
    G,
    Polygon,
    Document,
    Page,
    Text,
    View,
    Font,
    StyleSheet,
    PDFDownloadLink,
  }
}
