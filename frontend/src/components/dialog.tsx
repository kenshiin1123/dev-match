import { useEffect, useRef, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

const Dialog: React.FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const modal = document.getElementById("modal");
  if (!modal) return null;

  return createPortal(
    <motion.dialog
      animate={{ opacity: [0, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="h-[100%] mx-auto w-full mt-5 bg-background/40 flex justify-center"
      ref={ref}
    >
      {children}
    </motion.dialog>,
    modal
  );
};

export default Dialog;
