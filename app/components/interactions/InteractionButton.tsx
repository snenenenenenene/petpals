import { cn } from "@/lib/utils";
import { useInteractionStore } from "@/store/interactionStore";
import { usePetStore } from "@/store/petStore";
import { Interaction } from "@/types/interactions";
import { motion } from "framer-motion";

// components/interactions/InteractionButton.tsx
interface InteractionButtonProps {
	interaction: Interaction;
	onInteract: () => void;
	disabled?: boolean;
}

export const InteractionButton = ({
	interaction,
	onInteract,
	disabled
}: InteractionButtonProps) => {
	const { checkCooldown } = useInteractionStore();
	const { stats } = usePetStore();

	const isOnCooldown = !checkCooldown(interaction.type);
	const hasEnoughEnergy = (stats.energy >= (interaction.requirements?.energy || 0));
	const meetsLevelRequirement = true; // Implement level check

	const canInteract = !disabled && !isOnCooldown && hasEnoughEnergy && meetsLevelRequirement;

	return (
		<motion.button
			onClick={canInteract ? onInteract : undefined}
			className={cn(
				"relative w-full p-4 rounded-lg",
				"flex items-center gap-3",
				"transition-colors duration-200",
				canInteract
					? "bg-white hover:bg-primary-50"
					: "bg-gray-100 cursor-not-allowed"
			)}
			whileHover={canInteract ? { scale: 1.02 } : undefined}
			whileTap={canInteract ? { scale: 0.98 } : undefined}
		>
			<span className="text-2xl">{interaction.icon}</span>
			<div className="flex-1">
				<h3 className="font-medium">{interaction.name}</h3>
				<p className="text-sm text-gray-600">{interaction.description}</p>
			</div>
			{isOnCooldown && (
				<div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
					<CooldownTimer type={interaction.type} />
				</div>
			)}
		</motion.button>
	);
};