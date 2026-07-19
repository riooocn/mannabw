"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const ParallaxImage = ({ src, alt, className, priority = false }: ParallaxImageProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden border border-primary bg-surface-container ${className}`}>
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%] pointer-events-none">
        {src ? (
          <Image 
            src={src} 
            alt={alt} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover" 
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-anton text-2xl text-on-surface-variant">
            [ IMAGE ]
          </div>
        )}
      </motion.div>
    </div>
  );
};
