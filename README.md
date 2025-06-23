# 📧 MBOX Webviewer

A modern, privacy-first React application for viewing and browsing MBOX email archive files directly in your browser. No server required, no data transmission - your emails stay on your device.

## ✨ Key Features

### 🔒 **Privacy-First Design**
- **100% Client-Side**: All processing happens in your browser
- **No Data Transmission**: Your emails never leave your computer
- **Local Storage**: Settings saved locally, no cloud dependencies
- **No Tracking**: Zero analytics or data collection

### 🎯 **Smart Email Processing**
- **MIME Decoding**: Automatically handles UTF-8 encoded subjects and headers
- **Quoted-Printable**: Fixes broken lines and decodes hex characters
- **Multi-language Support**: Properly displays accented characters and international text
- **Auto-detection**: Intelligently detects and fixes encoding issues

### 🌐 **Three Rendering Modes**
1. **📄 Plain Text**: Clean, safe text-only view
2. **🌐 Safe HTML**: Formatted emails with security filtering
3. **⚠️ Full HTML**: Complete rendering with warnings (for trusted emails)

### 🔍 **Advanced Search & Navigation**
- **Real-time Search**: Search across subjects, senders, and content
- **Email Statistics**: View counts, date ranges, and unique senders
- **Smart Previews**: Intelligent email content previews
- **Header Inspection**: View all email headers and metadata

### ⚙️ **Configurable Settings**
- **Encoding Options**: Control how emails are processed
- **Auto-detection**: Automatic encoding issue detection
- **Formatting Preserved**: Maintain original email structure
- **Persistent Settings**: Your preferences saved between sessions

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd MBOX-Webviewer

# Install dependencies
npm install

# Start development server
npm start
```

### Usage
1. **Open your browser** to `http://localhost:3000`
2. **Drag & drop** your MBOX file or click to select
3. **Browse emails** with search and filtering
4. **Click any email** to view full content
5. **Adjust settings** using the ⚙️ button for encoding options

## 📁 Supported File Formats

- **MBOX files** (`.mbox`, `.mbx`)
- **Thunderbird exports**
- **Apple Mail archives**
- **Email backup files**

## 🌍 International Support

The app handles emails in multiple languages and encodings:

- **UTF-8 MIME encoding**: `=?UTF-8?Q?text?=` → proper Unicode
- **Quoted-printable**: `=C3=89` → `É`
- **Base64 encoding**: `=?UTF-8?B?base64?=` → decoded text
- **Multi-byte characters**: Accented letters, special symbols, non-Latin scripts

### Example Transformations
```
Before: "=?UTF-8?Q?Shipping_label_/_=C3=89tiquette_d'exp=C3=A9dition?="
After:  "Shipping label / Étiquette d'expédition"

Before: "=?UTF-8?Q?R=C3=A9sum=C3=A9_du_projet?="
After:  "Résumé du projet"
```

## 🛡️ Security Features

### HTML Rendering Safety
- **Script Removal**: Automatically strips JavaScript
- **Event Handler Filtering**: Removes onclick and other events
- **Iframe Blocking**: Prevents embedded frames
- **Safe Links**: Filters javascript: protocols

### Content Warnings
- **Visual Indicators**: Clear warnings for unsafe content
- **Mode Selection**: Choose rendering safety level
- **Header Inspection**: View raw headers for verification

## 📊 Email Analysis

### Statistics Dashboard
- **Total Email Count**: Number of emails in archive
- **Date Range**: Earliest and latest email dates
- **Unique Senders**: Count of different email addresses
- **Search Results**: Real-time filtering statistics

### Search Capabilities
- **Subject Search**: Find emails by title
- **Sender Search**: Filter by email address
- **Content Search**: Search within email bodies
- **Case-insensitive**: Automatic case matching

## ⚙️ Configuration Options

### Email Processing Settings
- **Decode Quoted-Printable & MIME**: Fix encoding issues automatically
- **Auto-detect Encoding Issues**: Smart detection of problems
- **Preserve Original Formatting**: Maintain email structure

### User Preferences
- **Local Storage**: Settings persist between sessions
- **Reset Options**: Return to default settings
- **Real-time Updates**: Changes apply immediately

## 🔧 Technical Architecture

### Frontend Stack
- **React 18**: Modern component-based UI
- **TypeScript**: Type-safe development
- **CSS3**: Modern styling with animations
- **Web APIs**: File API, TextDecoder, localStorage

### Email Processing
- **Custom MBOX Parser**: Handles MBOX format parsing
- **MIME Decoder**: UTF-8 and quoted-printable support
- **HTML Sanitizer**: Security-focused content filtering
- **Encoding Detection**: Automatic issue identification

### Performance Features
- **Efficient Parsing**: Optimized for large MBOX files
- **Lazy Loading**: Content loaded on demand
- **Memory Management**: Proper cleanup and garbage collection
- **Search Optimization**: Fast filtering with memoization

## 📱 Browser Compatibility

### Supported Browsers
- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required Features
- **File API**: For reading MBOX files
- **TextDecoder**: For UTF-8 decoding
- **localStorage**: For settings persistence
- **ES6+ Support**: For modern JavaScript features

## 🚨 Limitations

### File Size
- **Large Files**: Files >100MB may take time to process
- **Memory Usage**: Very large archives may impact performance
- **Browser Limits**: Subject to browser memory constraints

### Content Support
- **Attachments**: Binary attachments not extracted
- **HTML Emails**: Displayed as plain text in text mode
- **Complex Encoding**: Some edge cases may not parse perfectly

## 🤝 Contributing

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### Code Structure
```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # Drag & drop interface
│   ├── EmailList.tsx    # Email list with search
│   ├── EmailDetail.tsx  # Individual email viewer
│   └── ConfigModal.tsx  # Settings modal
├── utils/               # Utility functions
│   ├── mboxParser.ts    # MBOX file parsing
│   ├── emailProcessor.ts # Email content processing
│   └── configManager.ts # Settings management
├── contexts/            # React contexts
│   └── ConfigContext.tsx # Configuration state
└── types.ts             # TypeScript definitions
```

## 🙏 Acknowledgments

- **MBOX Format**: Standard email archive format
- **MIME Standards**: RFC 2047 for encoded words
- **React Community**: Excellent documentation and tools
- **Open Source**: Built with amazing open source libraries

---