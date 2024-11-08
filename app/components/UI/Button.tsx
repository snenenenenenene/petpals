// app/(components)/UI/Button.tsx
import { FC, ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
	onClick: () => void;
	children: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children }) => (
	<motion.button
		onClick={onClick}
		className="bg-primary text-white rounded-lg px-4 py-2 hover:shadow-lg"
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
	>
		{children}
	</motion.button>
);

export default Button;
