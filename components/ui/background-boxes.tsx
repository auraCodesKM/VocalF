"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
    // Reduced for better performance
    const rows = new Array(80).fill(1);
    const cols = new Array(60).fill(1);
    const colors = [
        "hsl(270, 100%, 87%)",  // light purple
        "hsl(270, 100%, 80%)",  // medium purple
        "hsl(270, 100%, 70%)",  // darker purple
        "hsl(245, 100%, 87%)",  // light indigo
        "hsl(245, 100%, 80%)",  // medium indigo
        "hsl(245, 100%, 70%)",  // darker indigo
    ];
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            style={{
                transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
                willChange: "transform",
            }}
            className={cn(
                "absolute left-1/4 p-4 -top-1/4 flex  -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 ",
                className
            )}
            {...rest}
        >
            {rows.map((_, i) => (
                <motion.div
                    key={`row` + i}
                    className="w-16 h-8 border-l border-slate-300/40 dark:border-slate-700/60 relative"
                >
                    {cols.map((_, j) => (
                        <motion.div
                            whileHover={{
                                backgroundColor: getRandomColor(),
                                transition: { duration: 0, ease: "linear" },
                            }}
                            animate={{
                                backgroundColor: "rgba(0,0,0,0)",
                                transition: { duration: 0.15, ease: "linear" },
                            }}
                            key={`col` + j}
                            className="w-16 h-8 border-r border-t border-slate-300/40 dark:border-slate-700/60 relative cursor-pointer"
                            style={{ willChange: "background-color" }}
                        >
                            {j % 2 === 0 && i % 2 === 0 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-300/40 dark:text-slate-700/60 stroke-[1px] pointer-events-none"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v12m6-6H6"
                                    />
                                </svg>
                            ) : null}
                        </motion.div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};

export const Boxes = React.memo(BoxesCore);
