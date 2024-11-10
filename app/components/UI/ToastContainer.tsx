"use client"
// components/ui/ToastContainer.tsx
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

function Toast({ message, type, onClose }: {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	onClose: () => void;
}) {
	const icons = {
		success: <CheckCircle className="w-5 h-5 text-green-500" />,
		error: <X className="w-5 h-5 text-red-500" />,
		warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
		info: <Info className="w-5 h-5 text-blue-500" />
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`bg-white rounded-lg p-4 shadow-lg flex items-center gap-3
        border-l-4 ${type === 'success' ? 'border-green-500' :
					type === 'error' ? 'border-red-500' :
						type === 'warning' ? 'border-yellow-500' :
							'border-blue-500'
				}`}
		>
			{icons[type]}
			<p className="text-gray-700">{message}</p>
			<button
				onClick={onClose}
				className="ml-auto text-gray-400 hover:text-gray-600"
			>
				<X className="w-4 h-4" />
			</button>
		</motion.div>
	);
}

export function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</AnimatePresence>
		</div>
	);
}