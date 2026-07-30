import React, { useState, useEffect } from 'react';
import './Invoices.css';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5053/api/Invoice/member/3');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleDownloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:5053/api/Invoice/${invoiceId}/pdf`);
      if (!response.ok) throw new Error('Failed to download PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download PDF: ' + err.message);
    }
  };

  const handleEmailInvoice = async (invoiceId, email) => {
    if (!email) {
      email = prompt('Enter email address to send invoice:');
      if (!email) return;
    }
    try {
      const response = await fetch(`http://localhost:5053/api/Invoice/${invoiceId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        alert('✅ Invoice sent successfully!');
      } else {
        alert('❌ Failed to send invoice');
      }
    } catch (err) {
      alert('Error sending invoice: ' + err.message);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'all' || inv.status?.toLowerCase() === filterStatus;
    const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.memberName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-state">
        <i className="fas fa-spinner fa-spin"></i>
        Loading invoices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle"></i>
        {error}
        <button onClick={fetchInvoices}>Retry</button>
      </div>
    );
  }

  return (
    <div className="invoices-page">
      <div className="page-header">
        <div className="header-left">
          <h2>📄 Invoices</h2>
          <span className="total-count">{invoices.length} invoices</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by invoice # or member name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn-refresh" onClick={fetchInvoices}>
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      <div className="invoices-grid">
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-file-invoice"></i>
            <p>No invoices found</p>
            <span>Generate invoices from payments or create member invoices</span>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <div key={invoice.invoiceId || invoice.id} className="invoice-card">
              <div className="invoice-header">
                <div className="invoice-number">
                  <span className="label">Invoice #</span>
                  <span className="value">{invoice.invoiceNumber || `INV-${invoice.invoiceId || invoice.id}`}</span>
                </div>
                <div className={`invoice-status ${invoice.status?.toLowerCase() || 'pending'}`}>
                  {invoice.status || 'Pending'}
                </div>
              </div>

              <div className="invoice-body">
                <div className="invoice-member">
                  <strong>{invoice.memberName || 'Member'}</strong>
                  {invoice.memberEmail && <div className="email">{invoice.memberEmail}</div>}
                </div>

                <div className="invoice-details">
                  <div className="detail">
                    <span className="label">Amount</span>
                    <span className="amount">${invoice.amount || invoice.total || 0}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Date</span>
                    <span className="date">{new Date(invoice.createdAt || invoice.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {invoice.items && invoice.items.length > 0 && (
                  <div className="invoice-items">
                    {invoice.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="item">
                        <span>{item.description || item.name}</span>
                        <span>${item.amount || item.price || 0}</span>
                      </div>
                    ))}
                    {invoice.items.length > 2 && (
                      <div className="item-more">+{invoice.items.length - 2} more items</div>
                    )}
                  </div>
                )}
              </div>

              <div className="invoice-actions">
                <button className="action-btn view-btn" onClick={() => handleViewInvoice(invoice)}>
                  <i className="fas fa-eye"></i> View
                </button>
                <button className="action-btn pdf-btn" onClick={() => handleDownloadPDF(invoice.invoiceId || invoice.id)}>
                  <i className="fas fa-file-pdf"></i> PDF
                </button>
                <button className="action-btn email-btn" onClick={() => handleEmailInvoice(invoice.invoiceId || invoice.id)}>
                  <i className="fas fa-envelope"></i> Email
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Details Modal */}
      {showModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice #{selectedInvoice.invoiceNumber || selectedInvoice.invoiceId || selectedInvoice.id}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="invoice-details-modal">
                <div className="detail-row">
                  <span className="label">Member:</span>
                  <span className="value">{selectedInvoice.memberName || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">${selectedInvoice.amount || selectedInvoice.total || 0}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedInvoice.status?.toLowerCase() || 'pending'}`}>
                    {selectedInvoice.status || 'Pending'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedInvoice.createdAt || selectedInvoice.date).toLocaleString()}</span>
                </div>
                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <div className="items-list">
                    <h4>Items:</h4>
                    {selectedInvoice.items.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <span>{item.description || item.name}</span>
                        <span>${item.amount || item.price || 0}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn-primary" onClick={() => handleDownloadPDF(selectedInvoice.invoiceId || selectedInvoice.id)}>
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
              <button className="btn-primary" onClick={() => handleEmailInvoice(selectedInvoice.invoiceId || selectedInvoice.id)}>
                <i className="fas fa-envelope"></i> Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;