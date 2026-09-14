import React, { useState } from 'react';
import { X, Search, Calendar, UserCheck } from 'lucide-react';

export default function AssignResearchModal({ isOpen, onClose, person, onAssignResearch, showToast }) {
  const [employee, setEmployee] = useState('Vikram Sethi (Expansion Head)');
  const [dueDate, setDueDate] = useState('2026-09-25');
  const [priority, setPriority] = useState('High');
  const [instructions, setInstructions] = useState('Scout commercial prime locations with 2,500+ sq.ft carpet area and high footfall.');

  if (!isOpen || !person) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssignResearch(person.id, {
      assignedTo: employee,
      dueDate,
      priority,
      instructions,
      researchStatus: `Assigned to ${employee.split(' ')[0]} (Due: ${dueDate})`
    });
    showToast(`Assigned research for ${person.name} to ${employee}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#171722] text-[#1C1D24] dark:text-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-[#2D2D3F] relative animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2D2D3F]">
          <div>
            <h3 className="text-base font-bold">Assign Property Research</h3>
            <p className="text-xs text-gray-500 dark:text-[#8B8CA0]">
              Candidate: <span className="font-semibold text-black dark:text-white">{person.name}</span> ({person.city})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-[#232333] flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Assign to Employee</label>
            <select 
              value={employee} 
              onChange={e=>setEmployee(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
            >
              <option value="Vikram Sethi (Expansion Head)">Vikram Sethi (Expansion Head)</option>
              <option value="Ananya Roy (Senior Analyst)">Ananya Roy (Senior Analyst)</option>
              <option value="Karan Malhotra (Real Estate Lead)">Karan Malhotra (Real Estate Lead)</option>
              <option value="Pooja Sharma (Sourcing Manager)">Pooja Sharma (Sourcing Manager)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Completion Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e=>setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                value={priority} 
                onChange={e=>setPriority(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Urgent">Urgent (Express)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Research Brief & Criteria</label>
            <textarea 
              rows={3} 
              value={instructions} 
              onChange={e=>setInstructions(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg dark:bg-[#232333] dark:border-[#2D2D3F] dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-[#2D2D3F] flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-[#2D2D3F]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#C99029] text-white hover:bg-[#a97a20] transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
