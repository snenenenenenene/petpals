// app/dashboard/page.tsx
import DogProfile from "../components/DogProfile";
import Card from "../components/UI/Card";
import InventoryItemCard from "../components/UI/InventoryItemCard";
import Achievement from "../components/UI/Achievement";
import ThemeToggle from "../components/UI/ThemeToggle";

export default function Dashboard() {
	return (
		<div className="flex flex-col items-center min-h-screen bg-background text-text">
			<header className="w-full flex justify-between items-center px-4 py-2">
				<h1 className="text-4xl font-bold mt-8">PetPals Prototype</h1>
				<ThemeToggle />
			</header>

			<Card>
				<DogProfile />
			</Card>

			<section className="w-full max-w-lg mt-8">
				<h2 className="text-2xl font-bold mb-4">Inventory</h2>
				<InventoryItemCard itemName="Ball" itemDescription="A simple ball your pet loves to play with." />
				<InventoryItemCard itemName="Bone" itemDescription="A tasty treat to keep your pet happy." />
			</section>

			<section className="w-full max-w-lg mt-8">
				<h2 className="text-2xl font-bold mb-4">Achievements</h2>
				<Achievement title="First Walk" description="You took your pet for the first walk!" />
				<Achievement title="First Feed" description="You fed your pet for the first time!" />
			</section>
		</div>
	);
}
