"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  el?: keyof React.JSX.IntrinsicElements;
  once?: boolean;
  style?: React.CSSProperties;
}

const defaultAnimations = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const AnimatedText = ({
  text,
  className,
  el: Wrapper = "p",
  once = true,
  style,
}: AnimatedTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  // Split text by lines (e.g. \n) or just use words if it's a single string
  const lines = text.split("\n");

  return (
    <Wrapper className={className} style={style}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ staggerChildren: 0.1 }}
        aria-hidden
        className="block"
      >
        {lines.map((line, lineIndex) => (
          <span className="block" key={`line-${lineIndex}`}>
            {line.split(" ").map((word, wordIndex) => (
              <span className="inline-flex overflow-hidden" key={`${lineIndex}-${wordIndex}`}>
                <motion.span
                  className="inline-block"
                  variants={defaultAnimations}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}&nbsp;
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
