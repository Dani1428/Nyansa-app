import React, { useState, useEffect } from 'react';
import './PaymentManagement.css';

interface Payment {
  id: number;
  annotator_name: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  provider: string;
  created_at: string;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/payments/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleProcessAll = async () => {
    if (!window.confirm('Are you sure you want to process all pending payments?')) return;
    
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/payments/process_all/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      if (res.ok) {
        alert('All payments processed successfully!');
        fetchPayments();
      }
    } catch (err) {
      console.error('Error processing payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Annotator', 'Amount', 'Provider', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.id,
      p.annotator_name,
      p.amount,
      p.provider,
      p.status,
      new Date(p.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nyansa_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="payment-management">
      <header className="payment-header">
        <div className="header-content">
          <h1>Payment Management</h1>
          <p>Track and process annotator earnings via Wave Mobile Money.</p>
        </div>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="label">Total Pending</span>
            <span className="value">{totalPending.toLocaleString()} FCFA</span>
          </div>
          <button 
            className="process-all-btn" 
            onClick={handleProcessAll}
            disabled={isLoading || totalPending === 0}
          >
            {isLoading ? 'Processing...' : 'Process All Payments'}
          </button>
        </div>
      </header>

      <div className="table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Annotator</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.annotator_name}</td>
                <td className="amount">{Number(payment.amount).toLocaleString()} FCFA</td>
                <td>{payment.provider}</td>
                <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`status-pill ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <button className="small-action-btn" onClick={() => alert(`Details for Payment #${payment.id}`)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="export-section">
        <h3>Export for Batch Processing</h3>
        <p>Download the CSV file for Wave Business bulk payments.</p>
        <button className="export-btn" onClick={exportCSV}>Export CSV for Wave</button>
      </div>
    </div>
  );
};

export default PaymentManagement;
