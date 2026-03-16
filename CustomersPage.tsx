import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Search, Filter, MoreHorizontal, Mail, Phone, ChevronDown, Users } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-serif mb-1">Customers</h2>
          <p className="text-text-secondary text-sm">View and manage your customer database</p>
        </div>

        <div className="bg-white rounded-2xl border border-border-main shadow-brand overflow-hidden">
          <div className="p-4 border-b border-border-main flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-main rounded-xl text-sm outline-none focus:border-p"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-border-main rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-secondary">
                <Filter size={16} />
                Filter
              </button>
              <button className="bg-p text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-p-dark shadow-brand">
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {customers.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-secondary text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Bookings</th>
                    <th className="px-6 py-4">Last Seen</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-bg-secondary transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs", c.color)}>
                            {c.initial}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-main">{c.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-text-muted">
                              <span className="flex items-center gap-0.5"><Mail size={10} /> {c.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          <select 
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={cn(
                              "appearance-none text-[10px] font-bold px-3 py-1 pr-7 rounded-full cursor-pointer outline-none border-none transition-all",
                              c.status === 'Active' ? "bg-teal-light text-teal-brand" : "bg-bg-secondary text-text-muted"
                            )}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{c.bookings}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{c.lastSeen}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-text-muted hover:text-text-main">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center text-text-muted mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h4 className="font-bold text-text-main mb-1">No customers yet</h4>
                <p className="text-text-secondary text-sm">Your customer database will grow as people book your services</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
