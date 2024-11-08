import { AnimatePresence } from "framer-motion";

// components/ui/ToastContainer.tsx
export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence mode="popLayout">
				{children}
			</AnimatePresence>
		</div>
	);
};