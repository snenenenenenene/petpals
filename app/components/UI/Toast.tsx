// components/ui/Toast.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface ToastProps {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
	const icons = {
		success: <CheckCircle className="w-5 h-5 text-green-500" />,
		error: <X className="w-5 h-5 text-red-500" />,
		warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
		info: <Info className="w-5 h-5 text-blue-500" />
	};

	const colors = {
		success: 'bg-green-50 border-green-200',
		error: 'bg-red-50 border-red-200',
		warning: 'bg-yellow-50 border-yellow-200',
		info: 'bg-blue-50 border-blue-200'
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className={`${colors[type]} border rounded-lg p-4 shadow-lg flex items-center gap-3`}
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