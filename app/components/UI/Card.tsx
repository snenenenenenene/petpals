// components/ui/Card.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  hover = true,
  interactive = false,
  onClick,
  ...props
}, ref) => {
  const Component = interactive ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={cn(
        "bg-neutral-50 rounded-lg p-4 shadow-soft",
        hover && "hover:shadow-medium transition-shadow duration-200",
        interactive && "cursor-pointer",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => (
  <h3
    className={cn(
      "font-heading text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => (
  <p
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("p-4 pt-0", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  >
    {children}
  </div>
);

export default Card;