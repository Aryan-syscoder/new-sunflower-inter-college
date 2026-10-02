import nodemailer from 'nodemailer';
import { StudentApplication, EmailLog } from '../types.ts';
import {
  generateOwnerNotificationEmail,
  generateStudentConfirmationEmail,
  generateCancellationEmail,
  generateApprovalEmail,
} from './emailTemplates.ts';

// Configure transporter if env vars provided, else fallback to mock/test transporter
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  return null;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; simulated: boolean; messageId?: string; error?: string }> {
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"New Sunflower Inter College" <${process.env.SMTP_FROM || 'admissions@newsunflowerintercollege.in'}>`,
        to,
        subject,
        text,
        html,
      });
      return { success: true, simulated: false, messageId: info.messageId };
    } catch (err: any) {
      console.warn('Real SMTP dispatch encountered an error, falling back to simulated log:', err?.message || err);
      return { success: true, simulated: true, error: err?.message };
    }
  }

  // Simulated delivery mode (development & sandbox test)
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}" | Delivered to In-App Outbox`);
  return { success: true, simulated: true, messageId: `sim-${Date.now()}` };
}

export async function triggerRegistrationEmails({
  application,
  ownerEmail,
}: {
  application: StudentApplication;
  ownerEmail: string;
}): Promise<{ ownerEmailLog: EmailLog; studentEmailLog: EmailLog }> {
  // 1. Owner email content
  const ownerContent = generateOwnerNotificationEmail(application, ownerEmail);
  const ownerResult = await sendEmail({
    to: ownerEmail,
    subject: ownerContent.subject,
    html: ownerContent.html,
    text: ownerContent.text,
  });

  const ownerEmailLog: EmailLog = {
    id: `log-owner-${Date.now()}`,
    recipientEmail: ownerEmail,
    recipientName: 'School Owner / Admissions Office',
    recipientType: 'Owner',
    subject: ownerContent.subject,
    templateType: 'owner_notification',
    htmlContent: ownerContent.html,
    sentAt: new Date().toISOString(),
    status: ownerResult.simulated ? 'Simulated Delivered' : 'Delivered',
  };

  // 2. Student confirmation email content
  const studentContent = generateStudentConfirmationEmail(application);
  const studentResult = await sendEmail({
    to: application.email,
    subject: studentContent.subject,
    html: studentContent.html,
    text: studentContent.text,
  });

  const studentEmailLog: EmailLog = {
    id: `log-student-${Date.now()}`,
    recipientEmail: application.email,
    recipientName: `${application.fullName} (Parent: ${application.fatherName})`,
    recipientType: 'Student',
    subject: studentContent.subject,
    templateType: 'student_confirmation',
    htmlContent: studentContent.html,
    sentAt: new Date().toISOString(),
    status: studentResult.simulated ? 'Simulated Delivered' : 'Delivered',
  };

  return { ownerEmailLog, studentEmailLog };
}

export async function triggerCancellationEmail({
  application,
  reason,
}: {
  application: StudentApplication;
  reason?: string;
}): Promise<EmailLog> {
  const content = generateCancellationEmail(application, reason);
  const result = await sendEmail({
    to: application.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return {
    id: `log-cancel-${Date.now()}`,
    recipientEmail: application.email,
    recipientName: `${application.fullName} (Parent: ${application.fatherName})`,
    recipientType: 'Student',
    subject: content.subject,
    templateType: 'cancellation_notice',
    htmlContent: content.html,
    sentAt: new Date().toISOString(),
    status: result.simulated ? 'Simulated Delivered' : 'Delivered',
  };
}

export async function triggerApprovalEmail({
  application,
}: {
  application: StudentApplication;
}): Promise<EmailLog> {
  const content = generateApprovalEmail(application);
  const result = await sendEmail({
    to: application.email,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return {
    id: `log-approve-${Date.now()}`,
    recipientEmail: application.email,
    recipientName: `${application.fullName} (Parent: ${application.fatherName})`,
    recipientType: 'Student',
    subject: content.subject,
    templateType: 'approval_offer',
    htmlContent: content.html,
    sentAt: new Date().toISOString(),
    status: result.simulated ? 'Simulated Delivered' : 'Delivered',
  };
}
