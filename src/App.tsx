/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { FacilitiesSection } from './components/FacilitiesSection.tsx';
import { LeadershipSection } from './components/LeadershipSection.tsx';
import { FeeStructureSection } from './components/FeeStructureSection.tsx';
import { RegistrationFormSection } from './components/RegistrationFormSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminGatekeeperModal } from './components/AdminPortal/AdminGatekeeperModal.tsx';
import { GradeLevel } from './types.ts';

function SchoolAppContent() {
  const { setSelectedGradeForApply } = useSchool();
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  const handleOpenAdmin = () => {
    setIsAdminPortalOpen(true);
  };

  const handleNavigateToApply = () => {
    const el = document.getElementById('admissions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToFees = () => {
    const el = document.getElementById('fees');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectGradeFromFees = (grade: GradeLevel) => {
    setSelectedGradeForApply(grade);
    handleNavigateToApply();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Sticky Header Top-Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        onNavigateToApply={handleNavigateToApply}
      />

      <main className="flex-1">
        {/* 1. Hero Section with 3D/Parallax effects */}
        <HeroSection
          onApplyClick={handleNavigateToApply}
          onFeesClick={handleNavigateToFees}
        />

        {/* 2. Educational Pillars & Live Synchronized School Timings */}
        <AboutSection />

        {/* 3. Modern Infrastructure & Facilities Bento Grid */}
        <FacilitiesSection />

        {/* 4. Governing Leadership (Director & Principal Cards) */}
        <LeadershipSection />

        {/* 5. Dynamic Filterable Fee Structure (Nursery to 12th) */}
        <FeeStructureSection
          onSelectGradeForApply={handleSelectGradeFromFees}
        />

        {/* 6. Comprehensive Student Registration Form & Double-Sided Automated Email Dispatch */}
        <RegistrationFormSection />

        {/* 7. Contact Us with Functional WhatsApp, Phone, Email & Instagram */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Direct Password Gatekeeper UI & Animated Full Dashboard */}
      <AdminGatekeeperModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <SchoolAppContent />
    </SchoolProvider>
  );
}
