"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Upload, Activity, Brain, Sparkles, FileText, CheckCircle2 } from "lucide-react";

const CheckIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
};

const CheckFilled = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
            />
        </svg>
    );
};

// Icon mapping for each step
const stepIcons = [
    Upload,
    Activity,
    Brain,
    Sparkles,
    FileText,
    CheckCircle2,
];

interface LoadingState {
    text: string;
}

const LoaderCore = ({
    loadingStates,
    value = 0,
    finalResult,
}: {
    loadingStates: LoadingState[];
    value?: number;
    finalResult?: string | null;
}) => {
    const progress = Math.round(((value + 1) / loadingStates.length) * 100);
    const isComplete = value === loadingStates.length - 1;

    return (
        <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
            {/* Progress Percentage or Completion */}
            <div className="mb-6 text-center">
                {isComplete && finalResult ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                            ✓ Analysis Complete!
                        </div>
                        <div className="text-xl text-gray-700 dark:text-gray-300 mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                            {finalResult}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={progress}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        {progress}%
                    </motion.div>
                )}
                {!isComplete && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Processing your voice analysis...
                    </p>
                )}
            </div>

            {loadingStates.map((loadingState, index) => {
                const distance = Math.abs(index - value);
                const opacity = Math.max(1 - distance * 0.3, 0);
                const IconComponent = stepIcons[index];

                return (
                    <motion.div
                        key={index}
                        className={`text-left flex gap-3 mb-4 items-center`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: opacity }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex-shrink-0">
                            {index > value && (
                                <IconComponent className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            )}
                            {index <= value && index < value && (
                                <CheckFilled className="h-5 w-5 text-green-500" />
                            )}
                            {index === value && (
                                <IconComponent className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                            )}
                        </div>
                        <span
                            className={`text-base ${value === index
                                ? "text-black dark:text-white font-medium"
                                : value > index
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-500"
                                }`}
                        >
                            {loadingState.text}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export const MultiStepLoader = ({
    loadingStates,
    loading,
    duration = 2000,
    loop = false,
    finalResult,
}: {
    loadingStates: LoadingState[];
    loading?: boolean;
    duration?: number;
    loop?: boolean;
    finalResult?: string | null;
}) => {
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        if (!loading) {
            setCurrentState(0);
            return;
        }
        const timeout = setTimeout(() => {
            setCurrentState((prevState) =>
                loop
                    ? prevState === loadingStates.length - 1
                        ? 0
                        : prevState + 1
                    : Math.min(prevState + 1, loadingStates.length - 1)
            );
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentState, loading, loop, loadingStates.length, duration]);
    return (
        <AnimatePresence mode="wait">
            {loading && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
                >
                    <div className="h-96  relative">
                        <LoaderCore value={currentState} loadingStates={loadingStates} finalResult={finalResult} />
                    </div>

                    <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
