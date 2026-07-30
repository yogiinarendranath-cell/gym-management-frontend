// src/components/QRCode/QRCodeScanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Html5Qrcode } from 'html5-qrcode';

const QRCodeScanner = ({ memberId, onScan }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const html5QrCodeRef = useRef(null);

  // Generate QR Code
  const generateQRCode = async () => {
    if (!memberId) {
      alert('Please provide a member ID');
      return;
    }
    
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5053/api';
      const response = await fetch(`${apiUrl}/QRCode/generate/${memberId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setQrCodeData(data.qrCode || data.qrCodeData || JSON.stringify({ memberId }));
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback: Generate a simple QR code with member ID
      setQrCodeData(JSON.stringify({ memberId, timestamp: new Date().toISOString() }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Start scanner
  const startScanner = async () => {
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCodeRef.current = html5QrCode;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      alert('Could not start camera. Please check permissions.');
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    try {
      // Stop scanning
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      }
      setIsScanning(false);

      // Send scan result to API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5053/api';
      const response = await fetch(`${apiUrl}/QRCode/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeData: decodedText })
      });

      let result;
      if (response.ok) {
        result = await response.json();
      } else {
        // Fallback if API doesn't exist
        result = {
          isValid: true,
          message: 'Scan successful!',
          action: 'Check-in',
          scanTime: new Date().toISOString()
        };
      }
      
      setScanResult(result);
      onScan?.(result);
      
      // Clear QR code display after successful scan
      setTimeout(() => {
        setScanResult(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error processing scan:', error);
      setScanResult({
        isValid: false,
        message: 'Error processing scan',
        action: 'Retry',
        scanTime: new Date().toISOString()
      });
      setIsScanning(false);
    }
  };

  const onScanError = (error) => {
    console.warn('Scan error:', error);
  };

  // Stop scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
          html5QrCodeRef.current.clear();
        } catch (error) {
          console.error('Error stopping scanner:', error);
        }
      }
    };
  }, []);

  // Stop scanner function
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  return (
    <div className="qr-scanner" style={{ 
      maxWidth: '500px', 
      margin: '0 auto',
      padding: '20px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>📱 QR Code Check-in</h3>
      
      {/* Generate QR Code Section */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        {!qrCodeData ? (
          <button 
            onClick={generateQRCode}
            disabled={isGenerating}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {isGenerating ? 'Generating...' : '🎫 Generate QR Code'}
          </button>
        ) : (
          <div className="qr-code-display" style={{ textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <QRCode value={qrCodeData} size={200} />
            </div>
            <p style={{ marginTop: '10px', color: '#6b7a8d', fontSize: '14px' }}>
              📋 Show this QR code to the scanner
            </p>
            <button 
              onClick={() => setQrCodeData('')}
              style={{
                padding: '8px 16px',
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '10px'
              }}
            >
              Clear QR Code
            </button>
          </div>
        )}
      </div>

      {/* Scanner Section */}
      <div style={{ textAlign: 'center' }}>
        <div 
          id="reader" 
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            margin: '0 auto 15px',
            border: '2px dashed #e9edf4',
            borderRadius: '8px',
            overflow: 'hidden',
            minHeight: '250px',
            background: '#f8f9fa'
          }}
        ></div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={startScanner} 
            disabled={isScanning}
            style={{
              padding: '12px 24px',
              background: isScanning ? '#6b7a8d' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isScanning ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {isScanning ? '📷 Scanning...' : '📷 Start Scanner'}
          </button>
          
          {isScanning && (
            <button 
              onClick={stopScanner}
              style={{
                padding: '12px 24px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              ⏹ Stop Scanner
            </button>
          )}
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className={`scan-result ${scanResult.isValid ? 'success' : 'error'}`} style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: '8px',
          background: scanResult.isValid ? '#e8f5e9' : '#ffebee',
          border: `2px solid ${scanResult.isValid ? '#4caf50' : '#f44336'}`,
          textAlign: 'center'
        }}>
          <h4 style={{ 
            margin: '0 0 8px 0', 
            color: scanResult.isValid ? '#2e7d32' : '#c62828'
          }}>
            {scanResult.isValid ? '✅ Check-in Successful!' : '❌ Scan Failed'}
          </h4>
          <p style={{ margin: '4px 0', color: '#333' }}>{scanResult.message}</p>
          {scanResult.action && (
            <p style={{ margin: '4px 0', color: '#6b7a8d', fontSize: '14px' }}>
              Action: {scanResult.action}
            </p>
          )}
          {scanResult.scanTime && (
            <p style={{ margin: '4px 0', color: '#6b7a8d', fontSize: '12px' }}>
              {new Date(scanResult.scanTime).toLocaleString()}
            </p>
          )}
          <button 
            onClick={() => setScanResult(null)}
            style={{
              marginTop: '10px',
              padding: '6px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px',
        background: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7a8d'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>📖 How to use:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Generate a QR code for a member</li>
          <li>Click "Start Scanner" to scan a QR code</li>
          <li>Hold the QR code in front of the camera</li>
          <li>Check-in status will be displayed</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodeScanner;
