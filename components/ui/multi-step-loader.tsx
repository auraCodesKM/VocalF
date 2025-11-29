"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface LoadingState {
    text: string;
}

const LoaderCore = ({
    loadingStates,
    value = 0,
}: {
    loadingStates: LoadingState[];
    value?: number;
}) => {
    const progress = ((value + 1) / loadingStates.length) * 100;

    return (
        <div className="flex relative justify-center items-center flex-col max-w-2xl mx-auto">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                Analyzing Voice...
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* All Steps Visible */}
            <div className="w-full space-y-3">
                {loadingStates.map((loadingState, index) => {
                    const isActive = index === value;
                    const isComplete = index < value;
                    const isPending = index > value;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600'
                                    : isComplete
                                        ? 'bg-green-50 dark:bg-green-900/10 border-l-4 border-green-600'
                                        : 'bg-gray-50 dark:bg-gray-800/30 border-l-4 border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                {isComplete ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : isActive ? (
                                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                                ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-400 dark:border-gray-600" />
                                )}
                            </div>
                            <p className={`text-base transition-colors duration-300 ${isActive
                                    ? 'text-gray-900 dark:text-white font-semibold'
                                    : isComplete
                                        ? 'text-gray-700 dark:text-gray-300'
                                        : 'text-gray-500 dark:text-gray-500'
                                }`}>
                                {loadingState.text}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress Percentage */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                {Math.round(progress)}% Complete
            </div>
        </div>
    );
};

export const MultiStepLoader = ({
    loadingStates,
    loading,
    duration = 3500,
    loop = false,
}: {
    loadingStates: LoadingState[];
    loading?: boolean;
    duration?: number;
    loop?: boolean;
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm"
                >
                    <div className="relative z-10 w-full max-w-2xl px-8">
                        <LoaderCore value={currentState} loadingStates={loadingStates} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
