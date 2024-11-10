// hooks/useToast.ts
import { create } from 'zustand';

interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
}

interface ToastStore {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id'>) => void;
	removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
	toasts: [],
	addToast: (toast) => {
		const id = Math.random().toString(36).substr(2, 9);
		set((state) => ({
			toasts: [...state.toasts, { ...toast, id }]
		}));

		setTimeout(() => {
			set((state) => ({
				toasts: state.toasts.filter((t) => t.id !== id)
			}));
		}, toast.duration || 3000);
	},
	removeToast: (id) => {
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id)
		}));
	}
}));