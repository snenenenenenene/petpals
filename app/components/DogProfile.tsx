"use client"
// app/components/DogProfile.tsx
import { FC } from "react";
import { Button } from "@/components/ui/Button";
import StatDisplay from "./StatDisplay";
import { useDogStore } from "../../store/dogStore";

const DogProfile: FC = () => {
	const { hunger, happiness, energy, feedDog, playWithDog, restDog } = useDogStore();

	return (
		<div className="bg-background p-4 rounded-lg shadow-lg w-full max-w-md">
			<div className="bg-gray-300 h-48 w-48 rounded-full mx-auto mb-4">
				{/* Placeholder for Dog Image */}
			</div>
			<h2 className="text-center text-2xl mb-2">Your Pet</h2>
			<StatDisplay label="Hunger" value={hunger} />
			<StatDisplay label="Happiness" value={happiness} />
			<StatDisplay label="Energy" value={energy} />

			<div className="flex gap-2 mt-4">
				<Button onClick={feedDog}>Feed</Button>
				<Button onClick={playWithDog}>Play</Button>
				<Button onClick={restDog}>Rest</Button>
			</div>
		</div>
	);
};

export default DogProfile;
