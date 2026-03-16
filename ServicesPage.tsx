import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useBusiness } from '../BusinessContext';
import { Plus, Trash2, Clock, DollarSign, List, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesPage: React.FC = () => {
  const { config, updateConfig, isLoading } = useBusiness();
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newService.name) return;
    // Ensure positive numbers
    const duration = Math.max(1, newService.duration);
    const price = Math.max(0, newService.price);
    
    const updatedServices = [
      ...config.services,
      { ...newService, duration, price, id: Math.random().toString(36).substr(2, 9) }
    ];
    updateConfig({ services: updatedServices });
    setIsAdding(false);
    setNewService({ name: '', duration: 30, price: 0 });
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    const updatedServices = config.services.filter(s => s.id !== serviceToDelete);
    updateConfig({ services: updatedServices });
    setServiceToDelete(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-bg-main">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-serif mb-1">Services</h2>
            <p className="text-text-secondary text-sm">Manage the services you offer to your customers</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-p text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-p-dark transition-all shadow-brand"
          >
            <Plus size={18} />
            Add service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.services.map((service) => (
            <motion.div 
              layout
              key={service.id} 
              className="bg-white p-6 rounded-2xl border border-border-main shadow-brand group relative flex flex-col"
            >
              <button 
                onClick={() => setServiceToDelete(service.id)}
                className="absolute top-4 right-4 text-text-muted hover:text-red-brand opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <h3 className="font-bold text-lg mb-4">{service.name}</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <Clock size={16} />
                  <span>{service.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <DollarSign size={16} />
                  <span>${service.price}</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.open('/booking', '_blank')}
                className="mt-auto w-full py-2.5 rounded-xl border border-p text-p font-bold text-sm hover:bg-p hover:text-white transition-all"
              >
                Book Now
              </button>
            </motion.div>
          ))}

          {config.services.length === 0 && !isAdding && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-border-main shadow-brand">
              <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center text-text-muted mx-auto mb-4">
                <List size={32} />
              </div>
              <h4 className="font-bold text-text-main mb-1">No services yet</h4>
              <p className="text-text-secondary text-sm">Add your first service to start accepting bookings</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-6 text-p font-bold hover:underline"
              >
                + Add your first service
              </button>
            </div>
          )}

          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-2xl border-2 border-dashed border-p shadow-brand"
            >
              <h3 className="font-bold text-lg mb-4">New Service</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Name</label>
                  <input 
                    type="text" 
                    value={newService.name}
                    onChange={e => setNewService({...newService, name: e.target.value})}
                    className="w-full p-2 border border-border-main rounded-lg text-sm outline-none focus:border-p"
                    placeholder="e.g. Haircut"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Duration (min)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newService.duration}
                      onChange={e => setNewService({...newService, duration: Math.max(1, parseInt(e.target.value) || 0)})}
                      className="w-full p-2 border border-border-main rounded-lg text-sm outline-none focus:border-p"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-muted uppercase mb-1">Price ($)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newService.price}
                      onChange={e => setNewService({...newService, price: Math.max(0, parseInt(e.target.value) || 0)})}
                      className="w-full p-2 border border-border-main rounded-lg text-sm outline-none focus:border-p"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 bg-p text-white py-2 rounded-lg font-bold text-sm"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 bg-bg-secondary text-text-secondary py-2 rounded-lg font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {serviceToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setServiceToDelete(null)} 
                className="absolute top-4 right-4 text-text-muted hover:text-text-main"
              >
                <X size={20} />
              </button>
              
              <div className="w-12 h-12 bg-red-light rounded-xl flex items-center justify-center text-red-brand mb-6">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Delete Service?</h3>
              <p className="text-text-secondary text-sm mb-8">
                Are you sure you want to delete this service? This action cannot be undone and will affect your booking page.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setServiceToDelete(null)}
                  className="flex-1 bg-bg-secondary text-text-secondary py-3 rounded-xl font-bold hover:bg-border-main transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-red-brand text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-brand/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
