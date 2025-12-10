'use client';

import { MICRO_EVENT_TEMPLATES, MicroEventTemplate } from '@/lib/types';

interface TemplateGridProps {
  onSelectTemplate: (template: MicroEventTemplate) => void;
}

export function TemplateGrid({ onSelectTemplate }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MICRO_EVENT_TEMPLATES.map((template) => (
        <button
          key={template.key}
          onClick={() => onSelectTemplate(template)}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
        >
          <div className="text-3xl mb-2">{template.emoji}</div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">
            {template.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">
            {template.description}
          </p>
        </button>
      ))}
    </div>
  );
}

