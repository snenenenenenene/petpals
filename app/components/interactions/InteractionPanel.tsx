
  // components/interactions/InteractionPanel.tsx
export const InteractionPanel = () => {
	const { availableInteractions, startInteraction } = useInteractionStore();
	const { stats } = usePetStore();
  
	return (
	  <motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="grid grid-cols-1 gap-4"
	  >
		{availableInteractions.map((interaction) => (
		  <InteractionButton
			key={interaction.type}
			interaction={interaction}
			onInteract={() => startInteraction(interaction.type)}
		  />
		))}
	  </motion.div>
	);
  };