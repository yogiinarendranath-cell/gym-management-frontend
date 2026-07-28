// src/components/Notifications/EmailNotifications.jsx
import React, { useState, useEffect } from "react";
import {
  sendMemberWelcome,
  sendPaymentReceipt,
  sendAttendanceReminder,
  sendMembershipExpiryReminder
} from "../Services/EmailService";

const EmailNotifications = () => {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailType, setEmailType] = useState("welcome");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [customEmail, setCustomEmail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const membersRes = await fetch("http://localhost:5053/api/Members");
      const membersData = await membersRes.json();
      setMembers(membersData);

      const paymentsRes = await fetch("http://localhost:5053/api/Payment");
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSendEmail = async () => {
    if (!selectedMember && !selectedPayment) {
      showMessage("error", "Please select a member or payment");
      return;
    }

    setLoading(true);
    try {
      let success = false;

      if (customEmail) {
        // Send custom email
        success = await sendEmail(
          selectedMember?.email || selectedPayment?.memberEmail,
          emailSubject,
          emailBody
        );
      } else {
        // Send predefined email
        switch (emailType) {
          case "welcome":
            success = await sendMemberWelcome(selectedMember);
            break;
          case "payment":
            success = await sendPaymentReceipt(selectedPayment);
            break;
          case "attendance":
            success = await sendAttendanceReminder(selectedMember);
            break;
          case "expiry":
            success = await sendMembershipExpiryReminder(selectedMember);
            break;
          default:
            showMessage("error", "Invalid email type");
            setLoading(false);
            return;
        }
      }

      if (success) {
        showMessage("success", "✅ Email sent successfully!");
      } else {
        showMessage("error", "❌ Failed to send email");
      }
    } catch (error) {
      showMessage("error", "❌ Error sending email: " + error.message);
    }
    setLoading(false);
  };

  const handleMemberSelect = (memberId) => {
    const member = members.find(m => m.memberId === memberId);
    setSelectedMember(member);
    setSelectedPayment(null);
  };

  const handlePaymentSelect = (paymentId) => {
    const payment = payments.find(p => p.paymentId === paymentId);
    setSelectedPayment(payment);
    setSelectedMember(null);
  };

  const getEmailTemplate = (type) => {
    const templates = {
      welcome: {
        subject: "Welcome to GymManager! 🏋️",
        body: `Hello [Member Name],

Welcome to GymManager! We're excited to have you as a member.

Your membership details:
• Plan: [Plan Name]
• Status: Active
• Joined: [Join Date]

If you have any questions, please don't hesitate to contact us.

Best regards,
GymManager Team`
      },
      payment: {
        subject: "Payment Receipt - GymManager 💳",
        body: `Hello [Member Name],

Thank you for your payment!

Receipt Details:
• Receipt #: [Payment ID]
• Amount: $[Amount]
• Date: [Date]
• Status: Completed

Thank you for being a valued member of GymManager!

Best regards,
GymManager Team`
      },
      attendance: {
        subject: "Don't forget your workout today! 💪",
        body: `Hello [Member Name],

This is a friendly reminder that your workout is waiting for you at GymManager!

Come in today and make progress toward your fitness goals.

We look forward to seeing you!

Best regards,
GymManager Team`
      },
      expiry: {
        subject: "Your membership is expiring soon ⏰",
        body: `Hello [Member Name],

This is a reminder that your GymManager membership will expire on [Expiry Date].

Please renew your membership to continue enjoying our facilities.

Best regards,
GymManager Team`
      }
    };
    return templates[type] || templates.welcome;
  };

  const updateEmailTemplate = (type) => {
    const template = getEmailTemplate(type);
    setEmailSubject(template.subject);
    setEmailBody(template.body);
  };

  const handleEmailTypeChange = (type) => {
    setEmailType(type);
    setCustomEmail(false);
    updateEmailTemplate(type);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📧 Email Notifications</h2>

      {message.text && (
        <div style={{
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontWeight: "500",
          background: message.type === "success" ? "#e8f5e9" : "#ffebee",
          color: message.type === "success" ? "#2e7d32" : "#c62828",
          border: message.type === "success" ? "1px solid #c8e6c9" : "1px solid #ffcdd2"
        }}>
          {message.text}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>
        {/* Left Column - Select Recipient */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e9edf4"
        }}>
          <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Select Recipient</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
              Select Member
            </label>
            <select
              value={selectedMember?.memberId || ""}
              onChange={(e) => handleMemberSelect(Number(e.target.value))}
              style={{ width: "100%", padding: "10px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }}
            >
              <option value="">-- Select a member --</option>
              {members.map(m => (
                <option key={m.memberId} value={m.memberId}>
                  {m.name} - {m.email || "No email"}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
              Select Payment (Optional)
            </label>
            <select
              value={selectedPayment?.paymentId || ""}
              onChange={(e) => handlePaymentSelect(Number(e.target.value))}
              style={{ width: "100%", padding: "10px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }}
            >
              <option value="">-- Select a payment --</option>
              {payments.map(p => (
                <option key={p.paymentId} value={p.paymentId}>
                  ${p.amount} - {p.memberName || "Unknown"} - {p.status || "Pending"}
                </option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              marginBottom: "12px"
            }}>
              <strong>Selected:</strong> {selectedMember.name}
              {selectedMember.email && <div>📧 {selectedMember.email}</div>}
              {!selectedMember.email && <div style={{ color: "#c62828" }}>⚠️ No email on file</div>}
            </div>
          )}
        </div>

        {/* Right Column - Email Content */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e9edf4"
        }}>
          <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Email Content</h3>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
              Email Type
            </label>
            <select
              value={emailType}
              onChange={(e) => handleEmailTypeChange(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }}
            >
              <option value="welcome">Welcome Email</option>
              <option value="payment">Payment Receipt</option>
              <option value="attendance">Attendance Reminder</option>
              <option value="expiry">Membership Expiry</option>
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
              Subject
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{ width: "100%", padding: "10px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
              Body
            </label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows="6"
              style={{ width: "100%", padding: "10px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
            />
          </div>

          <button
            onClick={handleSendEmail}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "⏳ Sending..." : "📧 Send Email"}
          </button>
        </div>
      </div>

      {/* Recent Email History */}
      <div style={{
        marginTop: "20px",
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e9edf4"
      }}>
        <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>📋 Quick Actions</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              const member = members.find(m => m.email && m.email !== "N/A");
              if (member) {
                setSelectedMember(member);
                setEmailType("welcome");
                updateEmailTemplate("welcome");
                showMessage("success", "📧 Ready to send welcome email to " + member.name);
              } else {
                showMessage("error", "No member with email found");
              }
            }}
            style={{ padding: "10px 20px", background: "#e3f2fd", color: "#1565c0", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Send Welcome Email
          </button>
          <button
            onClick={() => {
              const member = members.find(m => m.email && m.email !== "N/A" && m.expiryDate);
              if (member) {
                setSelectedMember(member);
                setEmailType("expiry");
                updateEmailTemplate("expiry");
                showMessage("success", "📧 Ready to send expiry reminder to " + member.name);
              } else {
                showMessage("error", "No member with email found");
              }
            }}
            style={{ padding: "10px 20px", background: "#fff3e0", color: "#e65100", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Send Expiry Reminder
          </button>
          <button
            onClick={() => {
              const member = members.find(m => m.email && m.email !== "N/A");
              if (member) {
                setSelectedMember(member);
                setEmailType("attendance");
                updateEmailTemplate("attendance");
                showMessage("success", "📧 Ready to send attendance reminder to " + member.name);
              } else {
                showMessage("error", "No member with email found");
              }
            }}
            style={{ padding: "10px 20px", background: "#e8f5e9", color: "#2e7d32", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Send Attendance Reminder
          </button>
          <button
            onClick={() => {
              const payment = payments.find(p => p.memberEmail);
              if (payment) {
                setSelectedPayment(payment);
                setEmailType("payment");
                updateEmailTemplate("payment");
                showMessage("success", "📧 Ready to send payment receipt");
              } else {
                showMessage("error", "No payment with email found");
              }
            }}
            style={{ padding: "10px 20px", background: "#fce4ec", color: "#c62828", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            Send Payment Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;
