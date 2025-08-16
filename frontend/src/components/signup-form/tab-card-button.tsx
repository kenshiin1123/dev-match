import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import type { PropsWithChildren } from "react";

export const TabCardButton: React.FC<
  PropsWithChildren<{
    value: string;
    className?: string;
    disabled?: boolean;
  }>
> = ({ value, className, children, disabled }) => {
  return (
    <TabsList className={`p-0 ${className}`}>
      <TabsTrigger
        value={value}
        className="px-0 m-0 disabled:opacity-50"
        disabled={disabled}
      >
        <div className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md">
          {children}
        </div>
      </TabsTrigger>
    </TabsList>
  );
};
