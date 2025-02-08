import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

function Modal({ isOpen, onClose, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-md relative z-10 transform transition-all">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-3 md:right-4 top-3 md:top-4 bg-[#f3fae7] hover:bg-[#e9f5d8] p-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="mt-2">
          {title && (
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              {title}
            </h3>
          )}
          <p className="text-gray-600 text-sm md:text-base">
            {message}
          </p>
        </div>

        {/* OK Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-[#ABF600] text-black border-black border-2 hover:shadow-[0_6px_0px_0px_rgba(25,26,35,1)] transition-all duration-200 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-medium text-sm md:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;