// src/components/Invoices/Invoices.jsx
import React, { useState, useEffect } from 'react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // This would need a new endpoint or use payment endpoint
      const response = await fetch('http://localhost:5053/api/Payment');
      const data = await response.json();
      setInvoices(data.map(p => ({ ...p, invoiceNumber: `INV-${p.paymentId}` })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading invoices...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#2c3e50' }}>📄 Invoices</h2>
      
      <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
        {invoices.map((inv) => (
          <div key={inv.paymentId} style={{ background: 'white', padding: '16px 20px', borderRadius: '8px', border: '1px solid #e9edf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{inv.invoiceNumber}</div>
              <div style={{ fontSize: '14px', color: '#6b7a8d' }}>Amount: ${inv.amount}</div>
              <div style={{ fontSize: '14px', color: '#6b7a8d' }}>Date: {new Date(inv.date).toLocaleDateString()}</div>
            </div>
            <div>
              <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: inv.status === 'Paid' ? '#e8f5e9' : '#fff3e0', color: inv.status === 'Paid' ? '#2e7d32' : '#e65100' }}>
                {inv.status || 'Pending'}
              </span>
              <button style={{ marginLeft: '10px', padding: '4px 12px', background: '#2a7de1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                View PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;