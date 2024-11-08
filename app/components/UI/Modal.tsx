// app/(components)/UI/Modal.tsx
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<motion.div
				className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<button
					className="absolute top-2 right-2 text-gray-600"
					onClick={onClose}
				>
					&times;
				</button>
				{children}
			</motion.div>
		</div>
	);
};

export default Modal;
