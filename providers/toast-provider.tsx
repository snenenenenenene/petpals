// providers/toast-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Toast = {
	id: string;
	title: string;
	description?: string;
	type?: 'success' | 'error' | 'info';
};

type ToastContextType = {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id'>) => void;
	removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (toast: Omit<Toast, 'id'>) => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts(prev => [...prev, { ...toast, id }]);
		setTimeout(() => removeToast(id), 5000);
	};

	const removeToast = (id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<div className="fixed bottom-4 right-4 z-50">
				<AnimatePresence>
					{toasts.map(toast => (
						<motion.div
							key={toast.id}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -50 }}
							className="mb-2"
						>
							<div className="bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
								<h3 className="font-medium">{toast.title}</h3>
								{toast.description && (
									<p className="text-sm text-gray-600">{toast.description}</p>
								)}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined)
		throw new Error('useToast must be used within a ToastProvider');
	return context;
};