import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { TelemetryProvider } from './context/TelemetryContext';
import './styles/App.css';

function App() {
  return (
    <TelemetryProvider>
      <div className="App">
        <Dashboard />
      </div>
    </TelemetryProvider>
  );
}

export default App;