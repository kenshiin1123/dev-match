import { motion, type Variants } from "motion/react";

export const FeaturesDisplay: React.FC<{
  featureItems: { icon: any; title: string; description: string }[];
  title: string;
}> = ({ featureItems, title }) => {
  const motionVariant: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4 } },
    "visible-2": { opacity: 1, x: 0, transition: { duration: 0.5 } },
    "visible-3": { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  // Parent variant
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <motion.h2
        variants={motionVariant}
        initial={{ opacity: 0, y: 10 }}
        whileInView={"visible"}
        className="indent-5 w-full text-3xl font-extrabold mt-5"
      >
        {title}
      </motion.h2>
      <motion.div
        className={`grid w-full gap-3 ${
          featureItems.length > 3 ? "grid-cols-2" : "sm:grid-cols-3"
        }`}
        variants={container}
        initial="hidden"
        whileInView="show"
      >
        {featureItems.map((item, i) => {
          return (
            <FeatureCard
              key={i}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          );
        })}
      </motion.div>
    </>
  );
};

const FeatureCard: React.FC<{
  icon: any;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  // Child variant
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      variants={item}
      className="rounded-md border p-5 space-y-5 shadow"
    >
      {title.length > 0 ? (
        <>
          <header className="flex gap-3">
            {icon}
            <h1 className="text-lg">{title}</h1>
          </header>
          <p>{description}</p>
        </>
      ) : (
        <>
          <header className="flex gap-3">
            {icon}
            <p>{description}</p>
          </header>
        </>
      )}
    </motion.div>
  );
};
