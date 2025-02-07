// Modal.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

interface ModalProps {
    message: string;
    onClose?: () => void;
}

const ResponseMessage: React.FC<ModalProps> & {
    show: (message: string) => void;
} = ({ message, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-md mx-auto rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Mensaje</h2>
                {message}
                <div className="mt-6 text-right">
                    <button
                        onClick={handleClose}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Static method to show the modal
ResponseMessage.show = (message: string) => {
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);

    const root = ReactDOM.createRoot(modalContainer);

    const handleClose = () => {
        root.unmount();
        modalContainer.remove();
    };

    root.render(<ResponseMessage message={message} onClose={handleClose} />);
};

export default ResponseMessage;
