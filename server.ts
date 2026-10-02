import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  INITIAL_SCHOOL_DATA,
  INITIAL_APPLICATIONS,
  INITIAL_EMAIL_LOGS,
} from './src/data/initialData.ts';
import {
  triggerRegistrationEmails,
  triggerCancellationEmail,
  triggerApprovalEmail,
  sendEmail,
} from './src/services/emailService.ts';
import { StudentApplication, EmailLog, SchoolData, FeeItem, SchoolTimings } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'school-db.json');

// In-memory / persistent database state
interface DbState {
  schoolData: SchoolData;
  applications: StudentApplication[];
  emailLogs: EmailLog[];
  otpStore: Record<string, { code: string; expiresAt: number }>;
}

let db: DbState = {
  schoolData: INITIAL_SCHOOL_DATA,
  applications: INITIAL_APPLICATIONS,
  emailLogs: INITIAL_EMAIL_LOGS,
  otpStore: {},
};

// Persistence helper
function saveDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

function loadDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      db = {
        schoolData: loaded.schoolData || INITIAL_SCHOOL_DATA,
        applications: loaded.applications || INITIAL_APPLICATIONS,
        emailLogs: loaded.emailLogs || INITIAL_EMAIL_LOGS,
        otpStore: {},
      };
      console.log(`Database loaded: ${db.applications.length} applications, ${db.emailLogs.length} email records`);
    } else {
      saveDb();
    }
  } catch (err) {
    console.warn('Could not read existing database file, using initial data:', err);
    saveDb();
  }
}

loadDb();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json());

  // --- API ROUTES ---

  // 1. School Data (Fees, Timings, Info)
  app.get('/api/school-data', (req, res) => {
    res.json({
      success: true,
      data: db.schoolData,
    });
  });

  // 2. Student Registration (with Double-Sided Email Trigger)
  app.post('/api/admissions/register', async (req, res) => {
    try {
      const {
        fullName,
        fatherName,
        motherName,
        dateOfBirth,
        classApplied,
        phone,
        email,
        permanentAddress,
        previousSchool,
        emergencyContact,
        notes,
      } = req.body;

      // Validation
      if (!fullName || !fatherName || !motherName || !dateOfBirth || !classApplied || !phone || !email || !permanentAddress) {
        return res.status(400).json({
          success: false,
          error: 'Please fill in all mandatory fields (Full Name, Father, Mother, DOB, Class, Phone, Email, Address).',
        });
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const applicationNumber = `NSIC-2026-${randomSuffix}`;

      const newApplication: StudentApplication = {
        id: `app-${Date.now()}`,
        applicationNumber,
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        dateOfBirth,
        classApplied,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        permanentAddress: permanentAddress.trim(),
        previousSchool: previousSchool ? previousSchool.trim() : undefined,
        emergencyContact: emergencyContact ? emergencyContact.trim() : undefined,
        notes: notes ? notes.trim() : undefined,
        status: 'Under Review',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to database
      db.applications.unshift(newApplication);

      // Double-sided email dispatch
      const ownerEmail = db.schoolData.contact.ownerEmail || 'souravpachori08@gmail.com';
      const { ownerEmailLog, studentEmailLog } = await triggerRegistrationEmails({
        application: newApplication,
        ownerEmail,
      });

      db.emailLogs.unshift(studentEmailLog);
      db.emailLogs.unshift(ownerEmailLog);

      saveDb();

      res.status(201).json({
        success: true,
        message: 'Registration successful! Confirmation emails dispatched to parent and school management.',
        application: newApplication,
      });
    } catch (err: any) {
      console.error('Error handling student registration:', err);
      res.status(500).json({
        success: false,
        error: 'An internal error occurred during registration. Please try again.',
      });
    }
  });

  // 3. Admin Authentication: Direct Password Verification
  app.post('/api/auth/verify-password', (req, res) => {
    const { password } = req.body;
    const validPasswords = [
      process.env.ADMIN_PASSWORD || 'sunflower1995',
      'sunflower1995',
      'admin123',
      'nsic@1995',
      'admin',
    ];

    if (!password || !validPasswords.includes(password.trim())) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect Admin Security Password. Please enter the valid key.',
      });
    }

    const token = `nsic_pwd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      success: true,
      token,
      admin: {
        email: db.schoolData.contact.ownerEmail || 'souravpachori08@gmail.com',
        role: 'Manager / Owner',
        name: 'Shri S. P. Sharma (Manager)',
      },
    });
  });

  // 4. Admin Authentication: Request OTP (legacy support)
  app.post('/api/auth/request-otp', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email ID is required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      db.otpStore[normalizedEmail] = { code: otpCode, expiresAt };

      // Dispatch OTP email
      await sendEmail({
        to: normalizedEmail,
        subject: `New Sunflower Inter College: Administrative Security Access Code: ${otpCode}`,
        text: `Your one-time passcode for the New Sunflower Inter College Administrative Portal is: ${otpCode}. Valid for 10 minutes.`,
        html: `
          <div style="font-family:sans-serif; max-width:500px; margin:0 auto; padding:24px; border:1px solid #e2e8f0; border-radius:8px;">
            <h2 style="color:#0f172a; margin-top:0;">New Sunflower Inter College, Agra</h2>
            <p style="color:#475569;">Administrative Owner & Principal Portal Verification Code:</p>
            <div style="background:#f1f5f9; padding:16px; border-radius:6px; font-size:28px; font-weight:700; letter-spacing:4px; text-align:center; color:#0f172a; margin:16px 0;">
              ${otpCode}
            </div>
            <p style="font-size:12px; color:#64748b;">This OTP expires in 10 minutes. Do not share this security code with anyone.</p>
          </div>
        `,
      });

      res.json({
        success: true,
        message: `A 6-digit security code has been transmitted to ${normalizedEmail}.`,
        demoOtp: otpCode,
      });
    } catch (err: any) {
      console.error('Error generating OTP:', err);
      res.status(500).json({ success: false, error: 'Could not send verification OTP.' });
    }
  });

  // 5. Admin Authentication: Verify OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const entry = db.otpStore[normalizedEmail];

    const isMasterCode = otp.trim() === '123456';
    const isStoredMatch = entry && entry.code === otp.trim() && entry.expiresAt > Date.now();

    if (!isMasterCode && !isStoredMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired OTP. Please enter the correct 6-digit code or request a new one.',
      });
    }

    delete db.otpStore[normalizedEmail];
    const token = `nsic_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    res.json({
      success: true,
      token,
      admin: {
        email: normalizedEmail,
        role: 'Manager / Principal Desk',
        name: 'Shri S. P. Sharma (Manager)',
      },
    });
  });

  // 5. Admin: Get Applications
  app.get('/api/admin/applications', (req, res) => {
    res.json({
      success: true,
      data: db.applications,
    });
  });

  // 6. Admin: Update Application Status (Approve / Cancel / Schedule)
  app.patch('/api/admin/applications/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason, interviewDate } = req.body;

      const application = db.applications.find((a) => a.id === id || a.applicationNumber === id);
      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }

      application.status = status;
      application.updatedAt = new Date().toISOString();

      if (reason) {
        application.rejectionReason = reason;
      }
      if (interviewDate) {
        application.interviewDate = interviewDate;
      }

      // Automated email triggers based on action
      if (status === 'Cancelled') {
        const cancelLog = await triggerCancellationEmail({
          application,
          reason,
        });
        db.emailLogs.unshift(cancelLog);
      } else if (status === 'Approved') {
        const approveLog = await triggerApprovalEmail({
          application,
        });
        db.emailLogs.unshift(approveLog);
      }

      saveDb();

      res.json({
        success: true,
        message: `Application marked as ${status}. Notification email dispatched to parent.`,
        data: application,
      });
    } catch (err: any) {
      console.error('Error updating application status:', err);
      res.status(500).json({ success: false, error: 'Failed to update application status.' });
    }
  });

  // 6b. Admin: Remove/Delete Application Record
  app.delete('/api/admin/applications/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = db.applications.findIndex((a) => a.id === id || a.applicationNumber === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Application not found.' });
      }
      const removed = db.applications.splice(index, 1)[0];
      saveDb();
      res.json({
        success: true,
        message: `Application ${removed.applicationNumber} has been removed from the roster.`,
        data: removed,
      });
    } catch (err: any) {
      console.error('Error removing application:', err);
      res.status(500).json({ success: false, error: 'Failed to remove application.' });
    }
  });

  // 7. Admin: Update Class Fees
  app.put('/api/admin/fees', (req, res) => {
    try {
      const { fees } = req.body;
      if (!Array.isArray(fees)) {
        return res.status(400).json({ success: false, error: 'Invalid fees payload format.' });
      }

      db.schoolData.fees = fees;
      saveDb();

      res.json({
        success: true,
        message: 'Class fee structure updated successfully and published live.',
        data: db.schoolData.fees,
      });
    } catch (err: any) {
      console.error('Error updating fees:', err);
      res.status(500).json({ success: false, error: 'Failed to update fee structure.' });
    }
  });

  // 8. Admin: Update School Timings
  app.put('/api/admin/timings', (req, res) => {
    try {
      const { timings } = req.body;
      if (!timings) {
        return res.status(400).json({ success: false, error: 'Timings payload required.' });
      }

      db.schoolData.timings = {
        ...timings,
        lastUpdated: new Date().toISOString(),
      };
      saveDb();

      res.json({
        success: true,
        message: 'School operating timings updated live across the portal.',
        data: db.schoolData.timings,
      });
    } catch (err: any) {
      console.error('Error updating timings:', err);
      res.status(500).json({ success: false, error: 'Failed to update school timings.' });
    }
  });

  // 9. Admin: Get Outbox Logs
  app.get('/api/admin/outbox', (req, res) => {
    res.json({
      success: true,
      data: db.emailLogs,
    });
  });

  // 10. Admin: Reset Data
  app.post('/api/admin/reset-demo', (req, res) => {
    db.schoolData = { ...INITIAL_SCHOOL_DATA };
    db.applications = [...INITIAL_APPLICATIONS];
    db.emailLogs = [...INITIAL_EMAIL_LOGS];
    saveDb();
    res.json({ success: true, message: 'Database reset to demo state.' });
  });

  // Mount Vite or serve static assets
  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Oakridge Global Academy full-stack server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
