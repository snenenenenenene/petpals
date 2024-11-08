// types/theme.ts
export type ThemeColor = {
	50: string;
	100: string;
	200: string;
	300: string;
	400: string;
	500: string;
	600: string;
	700: string;
	800: string;
	900: string;
  };
  
  export type Theme = {
	name: string;
	id: string;
	colors: {
	  primary: ThemeColor;
	  accent: {
		sage: string;
		rose: string;
		lavender: string;
		moss: string;
	  };
	  background: string;
	  foreground: string;
	  muted: string;
	  card: string;
	  border: string;
	};
  };
  