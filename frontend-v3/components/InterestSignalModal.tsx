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
    <div className="fixed inset-0 bg-[#0D0D0F] bg-opacity-60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="backdrop-blur-xl bg-white/95 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200/50 transform transition-all duration-300 ease-in-out"
        style={{ 
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        {/* Gold accent strip */}
        <div className="h-1 bg-gradient-to-r from-[#E8A34A] via-[#F6C56A] to-[#E8A34A] opacity-60"></div>
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1E]">
              Suggest an Idea
            </h2>
            <p className="text-sm text-[#3A3A3C] mt-1">
              Not ready to host? Signal interest instead
            </p>
          </div>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-[#F6C56A] border-opacity-30 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-sm text-[#1C1C1E] font-medium leading-relaxed">
                  Create a "ghost pin" to show what you'd like to see in your area. Others can express interest too!
                </p>
              </div>
            </div>
          </div>
          
          <TemplateGrid onSelectTemplate={handleTemplateSelect} />
        </div>
      </div>
    </div>
  );
}
