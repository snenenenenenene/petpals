// hooks/useSounds.ts
export const useSounds = () => {
	const playSound = (soundName: 'button' | 'notification') => {
	  try {
		const audio = new Audio(`/sounds/ui/${soundName}.mp3`);
		audio.volume = 0.5; // Adjust as needed
		audio.play();
	  } catch (error) {
		console.error('Error playing sound:', error);
	  }
	};
  
	return { playSound };
  };