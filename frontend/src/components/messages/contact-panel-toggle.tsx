import { ArrowLeftRightIcon } from "lucide-react";
import { motion } from "motion/react";

const ContactPanelToggle: React.FC<{
  toggleContactDisplay: () => void;
  state: { expandContacts: boolean; isMobile: boolean };
}> = ({ toggleContactDisplay, state }) => {
  const MotionArrowLeftRightIcon = motion.create(ArrowLeftRightIcon);

  return (
    <motion.button
      onClick={toggleContactDisplay}
      className="flex items-center gap-3 mb-5"
      title={state.expandContacts ? "Shrink" : "Expand"}
      animate={{
        marginLeft:
          state.expandContacts && state.isMobile
            ? 260
            : state.isMobile
            ? 15
            : 0,
      }}
    >
      <MotionArrowLeftRightIcon
        size={25}
        animate={{ rotate: state.expandContacts ? 180 : -180 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ContactPanelToggle;
