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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 'template' ? 'Host a Micro-Event' : selectedTemplate?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'template' ? (
            <div>
              <p className="text-gray-600 mb-4">
                Choose a template for your neighborhood gathering
              </p>
              <TemplateGrid onSelectTemplate={handleTemplateSelect} />
            </div>
          ) : (
            <div className="space-y-4">
              {selectedTemplate && (
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="text-3xl mb-2">{selectedTemplate.emoji}</div>
                  <p className="text-sm text-gray-700">{selectedTemplate.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add any details neighbors should know..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('template')}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!startTime}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

