// components/dashboard/RejectionBanner.tsx
import { X, AlertCircle } from 'lucide-react';

type RejectionBannerProps = {
  message: string;
  onDismiss: () => void;
};

export default function RejectionBanner({ message, onDismiss }: RejectionBannerProps) {
  return (
    <div className="mx-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 dark:text-red-200 font-medium text-sm">
              Investment Rejected
            </h4>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              {message}
            </p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}