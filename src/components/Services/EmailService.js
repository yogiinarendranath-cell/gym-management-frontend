// src/components/Services/EmailService.js
export const sendEmail = async (to, subject, body) => {
  try {
    const response = await fetch('http://localhost:5053/api/Email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body })
    });
    return response.ok;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

export const sendMemberWelcome = async (member) => {
  if (!member.email || member.email === 'N/A') {
    console.warn('No email provided for member:', member.name);
    return false;
  }
  
  const subject = 'Welcome to GymManager! 🏋️';
  const body = `
    Hello ${member.name},
    
    Welcome to GymManager! We're excited to have you as a member.
    
    Your membership details:
    • Plan: ${member.membershipPlan?.name || 'Basic'}
    • Status: ${member.status || 'Active'}
    • Joined: ${new Date(member.joinDate).toLocaleDateString()}
    
    If you have any questions, please don't hesitate to contact us.
    
    Best regards,
    GymManager Team
  `;
  
  return sendEmail(member.email, subject, body);
};

export const sendPaymentReceipt = async (payment) => {
  if (!payment.memberEmail) {
    console.warn('No email provided for payment:', payment.paymentId);
    return false;
  }
  
  const subject = 'Payment Receipt - GymManager 💳';
  const body = `
    Hello ${payment.memberName},
    
    Thank you for your payment!
    
    Receipt Details:
    • Receipt #: ${payment.paymentId}
    • Amount: $${payment.amount}
    • Date: ${new Date(payment.date).toLocaleDateString()}
    • Status: ${payment.status || 'Completed'}
    
    Thank you for being a valued member of GymManager!
    
    Best regards,
    GymManager Team
  `;
  
  return sendEmail(payment.memberEmail, subject, body);
};

export const sendAttendanceReminder = async (member) => {
  if (!member.email || member.email === 'N/A') {
    return false;
  }
  
  const subject = 'Don\'t forget your workout today! 💪';
  const body = `
    Hello ${member.name},
    
    This is a friendly reminder that your workout is waiting for you at GymManager!
    
    Come in today and make progress toward your fitness goals.
    
    We look forward to seeing you!
    
    Best regards,
    GymManager Team
  `;
  
  return sendEmail(member.email, subject, body);
};

export const sendMembershipExpiryReminder = async (member) => {
  if (!member.email || member.email === 'N/A') {
    return false;
  }
  
  const daysUntilExpiry = Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  const subject = `Your membership expires in ${daysUntilExpiry} days ⏰`;
  const body = `
    Hello ${member.name},
    
    This is a reminder that your GymManager membership will expire on ${new Date(member.expiryDate).toLocaleDateString()}.
    
    Days remaining: ${daysUntilExpiry}
    
    Please renew your membership to continue enjoying our facilities.
    
    Best regards,
    GymManager Team
  `;
  
  return sendEmail(member.email, subject, body);
};

export default {
  sendEmail,
  sendMemberWelcome,
  sendPaymentReceipt,
  sendAttendanceReminder,
  sendMembershipExpiryReminder
};
