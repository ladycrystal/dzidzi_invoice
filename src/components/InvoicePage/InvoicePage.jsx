import React, { useState } from "react";
import "./InvoicePage.css";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]); // State to store invoices
  const [invoiceCounter, setInvoiceCounter] = useState(1); // Counter for unique IDs

  // Function to add a new invoice
  const addInvoice = () => {
    const newInvoice = {
      id: invoiceCounter,
      date: new Date().toLocaleDateString(),
      title: `Invoice #${invoiceCounter}`,
      status: "Draft",
      amount: "$0.00",
    };

    setInvoices([...invoices, newInvoice]); // Update state
    setInvoiceCounter(invoiceCounter + 1); // Increment ID counter
  };

  // Function to delete an invoice
  const deleteInvoice = (id) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices); // Update state after deletion
  };

  return (
    <div className="invoice-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Invoices</h2>
        <ul>
          <li className="active">Overview</li>
          <li>Projects</li>
          <li>Invoices</li>
          <li>Recurring series</li>
          <li>Estimates</li>
          <li>Reports</li>
          <li>Apps</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="invoice-main">
        <header className="invoice-header">
          <h2>Invoices</h2>
          <button className="btn create-btn" onClick={addInvoice}>
            + Create Invoice
          </button>
        </header>

        {/* Display message if no invoices exist */}
        {invoices.length === 0 ? (
          <p className="empty-state">
            No invoices yet. Click "Create Invoice" to add one.
          </p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.date}</td>
                  <td>{invoice.title}</td>
                  <td className="draft-status">{invoice.status}</td>
                  <td>{invoice.amount}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteInvoice(invoice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default InvoicePage;
