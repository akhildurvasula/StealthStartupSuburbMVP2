'use client';

import { useState } from 'react';
import { MicroEventTemplate } from '@/lib/types';
import { TemplateGrid } from './TemplateGrid';

interface InterestSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (templateKey: string) => void;
}

export function InterestSignalModal({ isOpen, onClose, onSubmit }: InterestSignalModalProps) {
  if (!isOpen) return null;

  const handleTemplateSelect = (template: MicroEventTemplate) => {
    onSubmit(template.key);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Suggest an Idea
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Not ready to host? Signal interest instead
            </p>
          </div>
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              💡 Create a "ghost pin" to show what you'd like to see in your area. 
              Others can express interest too!
            </p>
          </div>
          
          <TemplateGrid onSelectTemplate={handleTemplateSelect} />
        </div>
      </div>
    </div>
  );
}

