"use client"
// app/(components)/UI/ThemeToggle.tsx
import { useState, FC } from "react";

const ThemeToggle: FC = () => {
	const [theme, setTheme] = useState("light");

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.classList.toggle("dark");
	};

	return (
		<button
			onClick={toggleTheme}
			className="bg-accent text-white px-4 py-2 rounded-lg hover:shadow-md transition duration-200"
		>
			{theme === "light" ? "Switch to Dark" : "Switch to Light"}
		</button>
	);
};

export default ThemeToggle;
