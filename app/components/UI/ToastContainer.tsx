// components/ui/ToastContainer.tsx
import { useToast } from '@/hooks/useToast';
import { Toast } from './Toast';
import { motion, AnimatePresence } from 'framer-motion';

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