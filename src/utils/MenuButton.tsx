"use client";

import { MotionConfig, motion } from "framer-motion";

interface Iactive {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuButton = ({ active, setActive }: Iactive) => {
  return (
    <MotionConfig transition={{ duration: 0.4, ease: "easeInOut" }}>
      <motion.button initial={false} onClick={() => setActive(!active)} animate={active ? "open" : "closed"} className="relative h-12 w-12 rounded-full bg-white/0 transition-colors hover:bg-white/20">
        <motion.span
          style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
          variants={{
            open: {
              rotate: [0, 45],
              top: ["35%", "50%"],
            },
            closed: {
              rotate: [45, 0],
              top: ["50%", "35%"],
            },
          }}
          className="absolute h-1 w-8 rounded-lg bg-indigo-600"
        ></motion.span>
        <motion.span
          style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          variants={{
            open: {
              rotate: [0, -45],
            },
            closed: {
              rotate: [-45, 0],
            },
          }}
          className="absolute h-1 w-8 rounded-lg bg-indigo-600"
        ></motion.span>
        <motion.span
          style={{
            left: "calc(50% + 10px)",
            bottom: "35%",
            x: "-50%",
            y: "50%",
          }}
          className="absolute h-1 w-4 rounded-lg bg-indigo-600"
          variants={{
            open: {
              rotate: [0, 45],
              left: "50%",
              bottom: ["35%", "50%"],
            },
            closed: {
              rotate: [45, 0],
              left: "calc(50% + 8px)",
              bottom: ["50%", "35%"],
            },
          }}
        ></motion.span>
      </motion.button>
    </MotionConfig>
  );
};

export default MenuButton;
