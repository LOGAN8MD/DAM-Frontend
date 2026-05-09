import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import AssetList from './components/AssetList';

function App() {
  return (
    <div className="App">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Digital Asset Manager</h1>
        </header>
        <main>
          <div className="dashboard-row">
            <div className="dashboard-col-md-4">
              <FileUpload />
            </div>
            <div className="dashboard-col-md-8">
              <AssetList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
