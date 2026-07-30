// src/components/Settings/Settings.jsx
import React from 'react';

const Settings = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>⚙️ Settings</h1>
      <p>Application settings and configuration</p>
      <div style={{ marginTop: '20px' }}>
        <h3>System Settings</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>Theme:</strong> Light/Dark mode
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>Language:</strong> English
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>Notifications:</strong> Enabled
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>API URL:</strong> http://localhost:5053/api
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
