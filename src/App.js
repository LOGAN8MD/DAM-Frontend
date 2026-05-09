import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import AssetList from './components/AssetList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Digital Asset Manager</h1>
        </header>
        <main>
          <div className="dashboard-row">
            <div className="dashboard-col-md-4">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
            <div className="dashboard-col-md-8">
              <AssetList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
