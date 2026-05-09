# Digital Asset Manager - Frontend

This is the React frontend for the Digital Asset Manager. It provides a clean, responsive user interface to upload, view, and search digital assets.

## Features

- **File Upload Interface**: Select and upload files directly to the backend.
- **Live Progress Tracking**: Visual progress bar tracking the exact upload percentage utilizing Axios `onUploadProgress`.
- **Asset Grid View**: Displays all uploaded assets neatly with details like original name, file size, type, and upload date.
- **Advanced Filtering**: Filter your assets using multiple parameters simultaneously:
  - Text search (Filename or tags)
  - File Type dropdown (Image, Video, PDF)
  - Date Range picker
  - Comma-separated tags
- **View & Download**: Quick action buttons to preview the file in a new tab or trigger a direct download.

## Prerequisites

- Node.js
- The backend server must be running (defaults to `http://localhost:1999`).

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Endpoint (Optional)
The application is currently configured to point to `http://localhost:1999/api/assets`. If your backend is running on a different port or host, update the `API_URL` variable in `src/services/assetService.js`.

### 3. Start the Application
```bash
npm start
```
This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure
- `src/components/FileUpload.js`: Handles the file selection and upload UI.
- `src/components/AssetList.js`: Renders the grid of uploaded files.
- `src/components/AssetFilter.js`: The search and filter toolbar.
- `src/services/assetService.js`: Centralized Axios logic for interacting with the backend APIs.

## Built With
- React
- Axios
