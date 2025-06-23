# MBOX Webviewer

A modern, frontend-only React application for viewing and browsing MBOX email archive files directly in your browser.

## Features

- 📧 **Drag & Drop Interface**: Simply drag your MBOX file onto the browser window or click to select
- 🔍 **Search Functionality**: Search through emails by subject, sender, or content
- 📊 **Statistics Dashboard**: View email counts, date ranges, and sender information
- 💌 **Email Details**: Read individual emails with proper formatting and header information
- 🎨 **Modern UI**: Clean, responsive design with smooth animations
- 🔒 **Privacy-First**: All processing happens locally in your browser - no data is sent to any server

## What is MBOX?

MBOX is a standard format for storing email messages. It's commonly used by email clients like Thunderbird, Apple Mail, and various email backup tools. Each MBOX file contains multiple email messages in a single file.

## How to Use

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Open Your Browser**: Navigate to `http://localhost:3000`

4. **Upload Your MBOX File**: 
   - Drag and drop your `.mbox` file onto the upload area
   - Or click "Select MBOX File" to browse for your file

5. **Browse Your Emails**:
   - View the statistics and summary of your email archive
   - Use the search box to find specific emails
   - Click on any email to view its full content

## File Structure

```
src/
├── components/
│   ├── EmailDetail.tsx    # Individual email viewer
│   ├── EmailList.tsx      # Email list with search
│   └── FileUpload.tsx     # Drag & drop file upload
├── utils/
│   └── mboxParser.ts      # MBOX file parsing logic
├── types.ts               # TypeScript interfaces
├── App.tsx                # Main application component
├── index.tsx              # React entry point
└── index.css              # Global styles
```

## Supported Features

- **Email Headers**: From, To, CC, BCC, Date, Subject
- **Email Body**: Full email content with basic formatting
- **Search**: Case-insensitive search across all email fields
- **Statistics**: Total count, date range, unique senders
- **File Formats**: `.mbox`, `.mbx` files

## Browser Compatibility

This application works in all modern browsers that support:
- File API for reading local files
- ES6+ JavaScript features
- CSS Grid and Flexbox

## Privacy & Security

- **No Server Required**: All processing happens in your browser
- **Local Processing**: MBOX files are parsed entirely on your device
- **No Data Transmission**: Your emails never leave your computer
- **No Storage**: Files are not stored permanently; refresh to clear

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder that can be served from any static file server.

## Technical Details

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Pure CSS with modern features (Grid, Flexbox, CSS Variables)
- **File Processing**: Custom MBOX parser using JavaScript File API
- **State Management**: React hooks (useState, useMemo)
- **Performance**: Efficient parsing and search with debounced filtering

## Known Limitations

- Large MBOX files (>100MB) may take time to process
- Binary attachments are not extracted or displayed
- HTML emails are displayed as plain text
- Some complex email encodings might not parse perfectly

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the MBOX Webviewer!

## License

MIT License - Feel free to use this project for personal or commercial purposes. 