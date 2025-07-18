import SideNav from '@/app/ui/dashboard/sidenav';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="z-50 w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow pb-6 pl-6 pr-6 pt-1 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
