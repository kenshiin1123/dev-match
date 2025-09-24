import { cn } from "@/lib/utils";
import capitalizeFirstLetter from "@/util/capitalizeFirstLetter";
import { motion, type Variants } from "motion/react";

const LabelWithParagraphItem: React.FC<{
  label: string;
  paragraph: string;
  className?: string;
  isItemTag?: boolean;
  animate?: boolean;
}> = ({ label, paragraph, className, isItemTag = true, animate = true }) => {
  const listItemVariant: Variants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: -50, opacity: 0 },
  };

  return isItemTag ? (
    <motion.li
      variants={animate ? listItemVariant : {}}
      className={cn(
        "flex border p-3 divide-x font-semibold text-wrap mt-5 rounded w-full",
        className
      )}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <label className="pr-4">{label}</label>
      <p className="pl-4">{capitalizeFirstLetter(paragraph)}</p>
    </motion.li>
  ) : (
    <motion.div
      className={`flex border p-3 w-fit divide-x font-semibold text-wrap mt-5 rounded ${className}`}
      exit="hidden"
    >
      <label className="pr-4">{label}</label>
      <p className="pl-4">{capitalizeFirstLetter(paragraph)}</p>
    </motion.div>
  );
};

export default LabelWithParagraphItem;
