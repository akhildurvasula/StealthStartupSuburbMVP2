'use client';

import { MICRO_EVENT_TEMPLATES, MicroEventTemplate } from '@/lib/types';

interface TemplateGridProps {
  onSelectTemplate: (template: MicroEventTemplate) => void;
}

export function TemplateGrid({ onSelectTemplate }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {MICRO_EVENT_TEMPLATES.map((template) => (
        <button
          key={template.key}
          onClick={() => onSelectTemplate(template)}
          className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-[#F6C56A] hover:bg-gradient-to-br hover:from-[#F6C56A]/5 hover:to-[#E8A34A]/5 transition-all duration-200 text-left group active:scale-95 shadow-sm hover:shadow-lg"
        >
          <div className="text-4xl mb-3 transition-transform group-hover:scale-110 duration-200">
            {template.emoji}
          </div>
          <h3 className="font-bold text-sm text-[#1C1C1E] mb-2 group-hover:text-[#E8A34A] transition-colors">
            {template.title}
          </h3>
          <p className="text-xs text-[#3A3A3C] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </button>
      ))}
    </div>
  );
}
