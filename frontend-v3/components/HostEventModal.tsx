'use client';

import { useState } from 'react';
import { MicroEventTemplate } from '@/lib/types';
import { TemplateGrid } from './TemplateGrid';

interface HostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    templateKey: string;
    title: string;
    description: string;
    startTime: string;
  }) => void;
}

export function HostEventModal({ isOpen, onClose, onSubmit }: HostEventModalProps) {
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<MicroEventTemplate | null>(null);
  const [startTime, setStartTime] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleTemplateSelect = (template: MicroEventTemplate) => {
    setSelectedTemplate(template);
    setStep('details');
    
    // Set default time to 1 hour from now
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    setStartTime(now.toISOString().slice(0, 16));
  };

  const handleSubmit = () => {
    if (!selectedTemplate || !startTime) return;

    onSubmit({
      templateKey: selectedTemplate.key,
      title: selectedTemplate.title,
      description,
      startTime: new Date(startTime).toISOString(),
    });

    // Reset
    setStep('template');
    setSelectedTemplate(null);
    setStartTime('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-[#0D0D0F] bg-opacity-60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="backdrop-blur-xl bg-white/95 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200/50 transform transition-all duration-300 ease-in-out"
        style={{ 
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        {/* Gold accent strip */}
        <div className="h-1 bg-gradient-to-r from-[#F6C56A] via-[#E8A34A] to-[#F6C56A]"></div>
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#1C1C1E]">
            {step === 'template' ? 'Host a Micro-Event' : selectedTemplate?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#1C1C1E] transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {step === 'template' ? (
            <div>
              <p className="text-[#3A3A3C] mb-6 text-center">
                Choose a template for your neighborhood gathering
              </p>
              <TemplateGrid onSelectTemplate={handleTemplateSelect} />
            </div>
          ) : (
            <div className="space-y-5">
              {selectedTemplate && (
                <div className="bg-gradient-to-br from-[#F6C56A]/10 to-[#E8A34A]/10 rounded-2xl p-5 border border-[#F6C56A]/20">
                  <div className="text-4xl mb-3">{selectedTemplate.emoji}</div>
                  <p className="text-sm text-[#3A3A3C] leading-relaxed">{selectedTemplate.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C56A] focus:border-[#F6C56A] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C1C1E] mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add any details neighbors should know..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C56A] focus:border-[#F6C56A] outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('template')}
                  className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-xl font-semibold text-[#1C1C1E] hover:bg-gray-50 transition-all duration-200 active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!startTime}
                  className="flex-1 px-5 py-3.5 bg-[#F6C56A] text-[#0D0D0F] rounded-xl font-bold hover:bg-[#E8A34A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Create Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
