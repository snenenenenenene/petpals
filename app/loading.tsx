// app/loading.tsx
export default function Loading() {
	return (
	  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-neutral-50">
		<div className="flex flex-col items-center">
		  <div className="relative">
			<div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
			<div className="absolute inset-0 flex items-center justify-center">
			  <span className="text-2xl">🐕</span>
			</div>
		  </div>
		  <p className="mt-4 text-primary-600 font-medium animate-pulse">
			Loading...
		  </p>
		</div>
	  </div>
	);
  }