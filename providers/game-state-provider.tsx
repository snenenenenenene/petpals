// providers/game-state-provider.tsx
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

type GameState = {
	petName: string;
	level: number;
	experience: number;
	coins: number;
	inventory: any[];
	achievements: any[];
	stats: {
		hunger: number;
		happiness: number;
		energy: number;
		cleanliness: number;
	};
};

type GameAction =
	| { type: 'UPDATE_STATS'; payload: Partial<GameState['stats']> }
	| { type: 'ADD_EXPERIENCE'; payload: number }
	| { type: 'ADD_COINS'; payload: number }
	| { type: 'ADD_ITEM'; payload: any }
	| { type: 'USE_ITEM'; payload: any }
	| { type: 'UNLOCK_ACHIEVEMENT'; payload: any };

const initialState: GameState = {
	petName: '',
	level: 1,
	experience: 0,
	coins: 0,
	inventory: [],
	achievements: [],
	stats: {
		hunger: 100,
		happiness: 100,
		energy: 100,
		cleanliness: 100,
	},
};

const GameStateContext = createContext<{
	state: GameState;
	dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case 'UPDATE_STATS':
			return {
				...state,
				stats: { ...state.stats, ...action.payload },
			};
		case 'ADD_EXPERIENCE':
			const newExperience = state.experience + action.payload;
			const experienceToLevel = state.level * 100;
			if (newExperience >= experienceToLevel) {
				return {
					...state,
					level: state.level + 1,
					experience: newExperience - experienceToLevel,
				};
			}
			return { ...state, experience: newExperience };
		case 'ADD_COINS':
			return { ...state, coins: state.coins + action.payload };
		case 'ADD_ITEM':
			return { ...state, inventory: [...state.inventory, action.payload] };
		case 'USE_ITEM':
			return {
				...state,
				inventory: state.inventory.filter(item => item.id !== action.payload.id),
			};
		case 'UNLOCK_ACHIEVEMENT':
			return {
				...state,
				achievements: [...state.achievements, action.payload],
			};
		default:
			return state;
	}
}

export function GameStateProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(gameReducer, initialState);

	// Auto-save game state
	useEffect(() => {
		const savedState = localStorage.getItem('gameState');
		if (savedState) {
			const parsedState = JSON.parse(savedState);
			Object.entries(parsedState.stats).forEach(([key, value]) => {
				dispatch({ type: 'UPDATE_STATS', payload: { [key]: value } });
			});
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('gameState', JSON.stringify(state));
	}, [state]);

	return (
		<GameStateContext.Provider value={{ state, dispatch }}>
			{children}
		</GameStateContext.Provider>
	);
}

export const useGameState = () => {
	const context = useContext(GameStateContext);
	if (context === undefined)
		throw new Error('useGameState must be used within a GameStateProvider');
	return context;
};

