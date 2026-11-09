import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TrainerSidebar from './TrainerSidebar';
import TrainerNavbar from './TrainerNavbar';

export default function TrainerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TrainerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <TrainerNavbar
        collapsed={collapsed}
        setMobileOpen={setMobileOpen}
      />
      <main
        className={`pt-16 transition-all duration-300 min-h-screen ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
