// providers/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemeColors = {
	primary: string;
	secondary: string;
	accent: string;
};

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	systemTheme: Theme;
	colors: ThemeColors;
	setColors: (colors: ThemeColors) => void;
};

const initialState: ThemeProviderState = {
	theme: 'system',
	setTheme: () => null,
	systemTheme: 'light',
	colors: {
		primary: '#8b5e2f',
		secondary: '#d08770',
		accent: '#ebcb8b',
	},
	setColors: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = 'system',
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [systemTheme, setSystemTheme] = useState<Theme>('light');
	const [colors, setColors] = useState<ThemeColors>(initialState.colors);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');

		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? 'dark'
				: 'light';
			root.classList.add(systemTheme);
			setSystemTheme(systemTheme);
		} else {
			root.classList.add(theme);
		}
	}, [theme]);

	return (
		<ThemeProviderContext.Provider
			value={{
				theme,
				setTheme,
				systemTheme,
				colors,
				setColors,
			}}
		>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined)
		throw new Error('useTheme must be used within a ThemeProvider');
	return context;
};

