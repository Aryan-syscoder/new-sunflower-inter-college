import { StudentApplication } from '../types.ts';

export function generateOwnerNotificationEmail(
  app: StudentApplication,
  ownerEmail: string
): { subject: string; html: string; text: string } {
  const subject = `[Admissions Alert] New Student Registration: ${app.fullName} (${app.classApplied}) - Ref: ${app.applicationNumber}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 28px 32px; text-align: left; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .badge { display: inline-block; background: #f59e0b; color: #0f172a; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; margin-top: 12px; }
    .body-content { padding: 32px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin: 24px 0 12px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .data-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .data-table td.label { width: 38%; color: #64748b; font-weight: 500; }
    .data-table td.value { color: #0f172a; font-weight: 600; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Sunflower Inter College</h1>
      <p>Daurada Road, Bodla Rd, Agra, Uttar Pradesh · Est. 1995</p>
      <div class="badge">Application Ref: ${app.applicationNumber}</div>
    </div>
    <div class="body-content">
      <p style="font-size: 15px; margin-top: 0;">A new candidate has submitted an online admission registration dossier for New Sunflower Inter College. Please review the details below:</p>
      
      <div class="section-title">Candidate Particulars</div>
      <table class="data-table">
        <tr><td class="label">Full Name</td><td class="value">${app.fullName}</td></tr>
        <tr><td class="label">Class Applied For</td><td class="value">${app.classApplied}</td></tr>
        <tr><td class="label">Date of Birth</td><td class="value">${app.dateOfBirth}</td></tr>
        <tr><td class="label">Father's Name</td><td class="value">${app.fatherName}</td></tr>
        <tr><td class="label">Mother's Name</td><td class="value">${app.motherName}</td></tr>
      </table>

      <div class="section-title">Contact & Residence</div>
      <table class="data-table">
        <tr><td class="label">Primary Phone</td><td class="value"><a href="tel:${app.phone}" style="color:#2563eb;text-decoration:none;">${app.phone}</a></td></tr>
        <tr><td class="label">Primary Email</td><td class="value"><a href="mailto:${app.email}" style="color:#2563eb;text-decoration:none;">${app.email}</a></td></tr>
        <tr><td class="label">Emergency Contact</td><td class="value">${app.emergencyContact || 'Not specified'}</td></tr>
        <tr><td class="label">Permanent Address</td><td class="value">${app.permanentAddress}</td></tr>
        <tr><td class="label">Previous School</td><td class="value">${app.previousSchool || 'First-time admission / Not specified'}</td></tr>
      </table>

      ${app.notes ? `
      <div class="section-title">Additional Remarks</div>
      <p style="font-size: 14px; background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 0; color: #334155;">${app.notes}</p>
      ` : ''}

      <div style="margin-top: 28px; padding: 16px; background: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-size: 13px; color: #92400e;">
          <strong>College Management Action:</strong> You can review, schedule an interview, approve, or cancel this application directly from the secure Admin Dashboard.
        </p>
      </div>
    </div>
    <div class="footer">
      Delivered to Registered Manager / Owner: ${ownerEmail} · New Sunflower Inter College Portal<br>
      Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra - 282010
    </div>
  </div>
</body>
</html>
  `;

  const text = `
New Sunflower Inter College, Agra - New Student Registration
Application Ref: ${app.applicationNumber}

Candidate: ${app.fullName}
Class Applied: ${app.classApplied}
DOB: ${app.dateOfBirth}
Father: ${app.fatherName}
Mother: ${app.motherName}
Phone: ${app.phone}
Email: ${app.email}
Address: ${app.permanentAddress}
Previous School: ${app.previousSchool || 'N/A'}
Notes: ${app.notes || 'None'}
Submitted At: ${app.submittedAt}
  `;

  return { subject, html, text };
}

export function generateStudentConfirmationEmail(
  app: StudentApplication
): { subject: string; html: string; text: string } {
  const subject = `Application Received: ${app.applicationNumber} - Welcome to New Sunflower Inter College, Agra`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 36px 32px; text-align: center; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; font-family: Georgia, serif; }
    .header p { margin: 0; font-size: 14px; color: #cbd5e1; }
    .status-banner { background: #f0fdf4; border-bottom: 1px solid #bbf7d0; padding: 14px 32px; font-size: 13px; color: #166534; font-weight: 600; text-align: center; }
    .body-content { padding: 32px; }
    .ref-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0; }
    .ref-number { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: 0.05em; font-family: monospace; }
    .steps-list { margin: 20px 0; padding-left: 20px; color: #334155; font-size: 14px; }
    .steps-list li { margin-bottom: 8px; }
    .footer { background: #f8fafc; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Sunflower Inter College</h1>
      <p>Recognized Intermediate Arts & Science Streams · Est. 1995 · Agra, UP</p>
    </div>
    <div class="status-banner">
      ✓ Application Received & Under Official College Review
    </div>
    <div class="body-content">
      <p style="margin-top:0; font-size:15px;">Dear <strong>${app.fatherName}</strong> & <strong>${app.motherName}</strong>,</p>
      <p style="font-size: 14px; color: #334155;">
        Thank you for choosing <strong>New Sunflower Inter College</strong> for the academic journey of <strong>${app.fullName}</strong>. We have successfully registered your application for <strong>${app.classApplied}</strong> for the upcoming session.
      </p>

      <div class="ref-box">
        <div style="font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Official Application Reference Number</div>
        <div class="ref-number">${app.applicationNumber}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Please quote this number for all campus queries</div>
      </div>

      <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 24px 0 10px 0;">Next Steps in Admission Procedure:</h3>
      <ol class="steps-list">
        <li><strong>Document Verification:</strong> Please bring original Transfer Certificate (TC), previous marksheet, and Aadhaar card copies to the college administrative office.</li>
        <li><strong>Office Hours:</strong> The admissions desk operates Monday to Saturday from <strong>7:00 AM to 3:00 PM</strong> at our Bodla Road campus.</li>
        <li><strong>Stream Allocation:</strong> For Class 11 & 12, subject allocations in Science Stream (PCM / PCB) or Arts Stream (Humanities) will be finalized.</li>
      </ol>

      <div style="margin-top: 24px; padding: 16px; background: #fefce8; border-radius: 8px; border: 1px solid #fef08a;">
        <p style="margin: 0; font-size: 13px; color: #854d0e;">
          <strong>College Office Telephone:</strong> <a href="tel:05622214303" style="color:#854d0e; font-weight:700;">0562 221 4303</a> | Campus: Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra 282010.
        </p>
      </div>

      <p style="font-size: 14px; color: #334155; margin-top: 28px;">
        Warm regards,<br>
        <strong>Office of the Principal</strong><br>
        New Sunflower Inter College, Agra
      </p>
    </div>
    <div class="footer">
      New Sunflower Inter College · Daurada Road, Bodla, Agra, Uttar Pradesh 282010<br>
      Recognized Intermediate College · Phone: 0562 221 4303
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Dear ${app.fatherName} & ${app.motherName},

Thank you for registering ${app.fullName} for ${app.classApplied} at New Sunflower Inter College, Agra.
Your application is currently Under Review.

Application Reference Number: ${app.applicationNumber}

Next Steps:
1. Document Verification at College Office
2. Stream Confirmation (Intermediate Arts / Science)
3. Fee Payment & Class Timetable (Campus open 7:00 AM to 3:00 PM)

Campus Address: Daurada Road, Bodla Rd, near Mahadev Mandir, Keshar Vihar, Balaji Puram, Agra 282010
Phone: 0562 221 4303
Warm regards,
Principal Desk, New Sunflower Inter College
  `;

  return { subject, html, text };
}

export function generateCancellationEmail(
  app: StudentApplication,
  reason?: string
): { subject: string; html: string; text: string } {
  const subject = `Update on Application ${app.applicationNumber} - New Sunflower Inter College, Agra`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 28px 32px; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .notice-bar { background: #fef2f2; border-bottom: 1px solid #fecaca; padding: 12px 32px; font-size: 13px; color: #991b1b; font-weight: 600; }
    .body-content { padding: 32px; }
    .reason-box { background: #f8fafc; border-left: 4px solid #ef4444; border-radius: 4px; padding: 14px 16px; margin: 20px 0; font-size: 14px; color: #334155; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Sunflower Inter College</h1>
      <p style="margin:0; font-size:13px; color:#94a3b8;">Bodla Road, Agra, Uttar Pradesh</p>
    </div>
    <div class="notice-bar">
      Application Status Update: Cancelled / Not Proceeded
    </div>
    <div class="body-content">
      <p style="margin-top:0; font-size:15px;">Dear <strong>${app.fatherName}</strong> & <strong>${app.motherName}</strong>,</p>
      <p style="font-size: 14px; color: #334155;">
        This is an official notice regarding the admission registration for <strong>${app.fullName}</strong> (${app.classApplied}, Application Ref: <strong>${app.applicationNumber}</strong>) at New Sunflower Inter College.
      </p>
      <p style="font-size: 14px; color: #334155;">
        Following an evaluation of current stream capacity and applicant records, this application has been marked as cancelled for the present admissions cycle.
      </p>

      <div class="reason-box">
        <strong>Administrative Remarks:</strong><br>
        ${reason || 'Seat capacity reached for requested stream/class or eligibility documents require updating.'}
      </div>

      <p style="font-size: 14px; color: #334155;">
        For further clarifications or to inquire about alternative streams, please visit our college office at Daurada Road, Bodla, Agra or call <a href="tel:05622214303" style="color:#2563eb;">0562 221 4303</a>.
      </p>

      <p style="font-size: 14px; color: #334155; margin-top: 24px;">
        Sincerely,<br>
        <strong>Office of Administration</strong><br>
        New Sunflower Inter College, Agra
      </p>
    </div>
    <div class="footer">
      New Sunflower Inter College · Daurada Road, Bodla, Agra - 282010 · Phone: 0562 221 4303
    </div>
  </div>
</body>
</html>
  `;

  const text = `
New Sunflower Inter College, Agra - Application Status Update
Application Ref: ${app.applicationNumber}
Candidate: ${app.fullName} (${app.classApplied})

Dear ${app.fatherName} & ${app.motherName},

We regret to inform you that the registration for ${app.fullName} has been cancelled for the current admissions round.

Administrative Remarks:
${reason || 'Seat capacity reached for requested stream/class or eligibility criteria review.'}

For inquiries, contact 0562 221 4303 or visit the college office at Daurada Road, Bodla, Agra.
Administration, New Sunflower Inter College
  `;

  return { subject, html, text };
}

export function generateApprovalEmail(
  app: StudentApplication
): { subject: string; html: string; text: string } {
  const subject = `Admission Confirmed: ${app.applicationNumber} - New Sunflower Inter College, Agra`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #047857; color: #ffffff; padding: 36px 32px; text-align: center; }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 700; font-family: Georgia, serif; }
    .header p { margin: 0; font-size: 14px; color: #a7f3d0; }
    .body-content { padding: 32px; }
    .offer-card { background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Sunflower Inter College</h1>
      <p>Recognized Arts & Science Intermediate College · Agra</p>
    </div>
    <div class="body-content">
      <p style="margin-top:0; font-size:15px;">Dear <strong>${app.fatherName}</strong> & <strong>${app.motherName}</strong>,</p>
      <p style="font-size: 14px; color: #334155;">
        Congratulations! We are delighted to inform you that the application for <strong>${app.fullName}</strong> has been provisionally <strong>Approved</strong> for admission into <strong>${app.classApplied}</strong> at New Sunflower Inter College, Agra!
      </p>

      <div class="offer-card">
        <div style="font-size: 12px; text-transform: uppercase; color: #047857; font-weight: 700;">Enrollment Ref</div>
        <div style="font-size: 22px; font-weight: 800; color: #065f46; font-family: monospace;">${app.applicationNumber}</div>
        <div style="font-size: 13px; color: #047857; margin-top: 6px;">Status: Approved & Seat Reserved</div>
      </div>

      <p style="font-size: 14px; color: #334155;">
        Please visit the college administrative counter with original documents, 2 passport size photographs, and fee payment within 7 working days (Office hours: 7:00 AM – 3:00 PM).
      </p>

      <p style="font-size: 14px; color: #334155; margin-top: 24px;">
        Warmest regards,<br>
        <strong>Principal & Management</strong><br>
        New Sunflower Inter College, Agra
      </p>
    </div>
    <div class="footer">
      New Sunflower Inter College · Daurada Road, Bodla, Agra, UP 282010 · Phone: 0562 221 4303
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Congratulations!
New Sunflower Inter College, Agra has provisionally accepted ${app.fullName} for admission into ${app.classApplied}.
Reference: ${app.applicationNumber}
Please visit the college office on Bodla Road, Agra within 7 working days (7 AM to 3 PM).
Phone: 0562 221 4303
Principal & Management, New Sunflower Inter College
  `;

  return { subject, html, text };
}
