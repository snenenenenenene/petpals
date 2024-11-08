// app/components/StatDisplay.tsx
import { FC } from "react";

interface StatDisplayProps {
	label: string;
	value: number;
}

const StatDisplay: FC<StatDisplayProps> = ({ label, value }) => (
	<div className="flex justify-between items-center p-2 bg-secondary rounded-lg mb-2">
		<span>{label}</span>
		<span className="font-bold">{value}</span>
	</div>
);

export default StatDisplay;
