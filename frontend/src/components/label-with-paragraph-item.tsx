import { motion, type Variants } from "motion/react";

const LabelWithParagraphItem: React.FC<{
  label: string;
  paragraph: string;
  className?: string;
  isItemTag?: boolean;
}> = ({ label, paragraph, className, isItemTag = true }) => {
  const listItemVariant: Variants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: -50, opacity: 0 },
  };

  return isItemTag ? (
    <motion.li
      variants={listItemVariant}
      className={`flex border p-3 w-fit divide-x font-semibold text-wrap mt-5 rounded ${className}`}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <label className="pr-4">{label}</label>
      <p className="pl-4">
        {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}
      </p>
    </motion.li>
  ) : (
    <motion.div
      className={`flex border p-3 w-fit divide-x font-semibold text-wrap mt-5 rounded ${className}`}
      exit="hidden"
    >
      <label className="pr-4">{label}</label>
      <p className="pl-4">
        {paragraph.charAt(0).toUpperCase() + paragraph.slice(1)}
      </p>
    </motion.div>
  );
};

export default LabelWithParagraphItem;
