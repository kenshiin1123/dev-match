import type { PropsWithChildren } from "react";

const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default PageContainer;
