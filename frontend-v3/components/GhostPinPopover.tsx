'use client';

import { InterestSignal, MICRO_EVENT_TEMPLATES } from '@/lib/types';

interface GhostPinPopoverProps {
  signal: InterestSignal | null;
  onClose: () => void;
  onExpressInterest: () => void;
}

export function GhostPinPopover({ signal, onClose, onExpressInterest }: GhostPinPopoverProps) {
  if (!signal) return null;

  const template = MICRO_EVENT_TEMPLATES.find(t => t.key === signal.templateKey);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="text-3xl mb-2">{template?.emoji || '💡'}</div>
            <h3 className="text-lg font-bold text-gray-900">
              {template?.title || 'Interest Signal'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {signal.interestedCount} {signal.interestedCount === 1 ? 'person' : 'people'} interested
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            {template?.description || 'Someone wants to see this kind of event in your area!'}
          </p>
        </div>

        {/* Location Info */}
        <p className="text-xs text-gray-500 mb-4">
          {signal.suburbType} • {signal.dominantCity}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={onExpressInterest}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            I'm Interested!
          </button>
        </div>
      </div>
    </div>
  );
}

