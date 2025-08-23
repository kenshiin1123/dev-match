import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import {
  User,
  Waypoints,
  BriefcaseBusiness,
  Search,
  Users,
  BookText,
  Bell,
} from "lucide-react";
import { FeaturesDisplay } from "@/components/features-display";
import { useSelector } from "react-redux";

const howItWorkItems = [
  {
    icon: <User />,
    title: "Developer",
    description: "Build your profile and & your skill",
  },
  {
    icon: <BriefcaseBusiness />,
    title: "Employers",
    description: "Post jobs & find qualified candidates",
  },
  {
    icon: <Waypoints />,
    title: "Connections",
    description: "Grow your personal network",
  },
];

const featureItems = [
  {
    icon: <Search />,
    title: "",
    description: "Smart job search & filtering",
  },
  {
    icon: <Users />,
    title: "",
    description: "Connect with developers & employers",
  },
  {
    icon: <BookText />,
    title: "",
    description: "Apply & track job applications",
  },
  {
    icon: <Bell />,
    title: "",
    description: "Real-time notifications",
  },
];

export default function Home() {
  const role = useSelector((state: any) => state.user.role);
  const motionVariant: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.4 } },
    "visible-2": { opacity: 1, x: 0, transition: { duration: 0.5 } },
    "visible-3": { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div className="mt-5 sm:mt-1 p-5 md:p-10 flex flex-col gap-5 items-center md:items-start pb-30">
      {/* Main Heading */}
      <motion.h1
        variants={motionVariant}
        initial="hidden"
        whileInView="visible"
        className="text-3xl lg:text-6xl font-extrabold w-[100%]"
      >
        Connecting Developers and Employers, Seamlessly
      </motion.h1>
      {/* Sub Heading */}
      <motion.p
        className="indent-2 text-xl font-bold"
        variants={motionVariant}
        initial="hidden"
        whileInView="visible-2"
      >
        Find your next job, connect with top developers, or hire talent with
        ease.
      </motion.p>

      {/* How it works */}
      <FeaturesDisplay featureItems={howItWorkItems} title="How it Works" />
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-[url(/images/job_1.jpg)] h-100 bg-center bg-cover w-full rounded border shadow"
      />
      <FeaturesDisplay featureItems={featureItems} title="Features" />
      {role === "anonymous" && (
        <>
          <motion.h2
            variants={motionVariant}
            initial={{ opacity: 0, x: -10 }}
            whileInView={"visible"}
            className="indent-5 w-full text-3xl font-extrabold mt-5 text-center"
          >
            Join Dev Match Today
          </motion.h2>
          <motion.p
            className="indent-2 text-xl font-bold text-center w-full"
            variants={motionVariant}
            initial="hidden"
            whileInView="visible-2"
          >
            Whether you're looking for your next job or your next hire, we're
            got you covered.
          </motion.p>
          {/* Call to action buttons */}
          <motion.div
            className="w-full flex justify-center gap-4"
            variants={motionVariant}
            initial="hidden"
            animate="visible-3"
          >
            <Link to={"/signup?role=developer"}>
              <Button size={"lg"} className="font-bold">
                Join as Developer
              </Button>
            </Link>
            <Link to={"/signup?role=employer"}>
              <Button size={"lg"} className="font-bold">
                Join as Employer
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
