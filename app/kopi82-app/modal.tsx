"use client";

import React from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={20} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
