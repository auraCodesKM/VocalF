"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Sparkles, Activity, FileAudio, Brain, FileText, CheckCheck } from "lucide-react";

interface LoadingState {
    text: string;
}

const getStepIcon = (index: number, isActive: boolean, isComplete: boolean) => {
    const iconClass = `h-6 w-6 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isComplete ? 'text-green-500' : 'text-gray-400'}`;

    const icons = [
        <FileAudio className={iconClass} />,
        <Activity className={iconClass} />,
        <Brain className={iconClass} />,
        <Sparkles className={iconClass} />,
        <FileText className={iconClass} />,
        <CheckCheck className={iconClass} />,
    ];

    return icons[index] || <Loader2 className={iconClass} />;
};

const LoaderCore = ({
    loadingStates,
    value = 0,
}: {
    loadingStates: LoadingState[];
    value?: number;
}) => {
    const progress = ((value + 1) / loadingStates.length) * 100;

    return (
        <div className="flex relative justify-center items-center flex-col">
            {/* Circular Progress Indicator */}
            <div className="relative mb-12">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        strokeDasharray="352"
                        strokeDashoffset="0"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        key={value}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        {Math.round(progress)}%
                    </motion.div>
                </div>
            </div>

            {/* Loading Steps */}
            <div className="w-full max-w-md space-y-3">
                {loadingStates.map((loadingState, index) => {
                    const isActive = index === value;
                    const isComplete = index < value;
                    const isFuture = index > value;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                                opacity: isFuture ? 0.3 : 1,
                                x: 0,
                                scale: isActive ? 1.02 : 1
                            }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isActive
                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20'
                                    : isComplete
                                        ? 'bg-green-500/5 dark:bg-green-500/10 border border-green-500/20'
                                        : 'bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20'
                                }`}
                        >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isActive
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50'
                                    : isComplete
                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                        : 'bg-gray-300 dark:bg-gray-700'
                                }`}>
                                {isComplete ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-white" />
                                    </motion.div>
                                ) : isActive ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Loader2 className="h-6 w-6 text-white" />
                                    </motion.div>
                                ) : (
                                    getStepIcon(index, isActive, isComplete)
                                )}
                            </div>

                            <div className="flex-1">
                                <motion.p
                                    className={`text-sm font-medium ${isActive
                                            ? 'text-gray-900 dark:text-white'
                                            : isComplete
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                    animate={{ x: isActive ? [0, 5, 0] : 0 }}
                                    transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                                >
                                    {loadingState.text}
                                </motion.p>
                            </div>

                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="flex-shrink-0"
                                >
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export const MultiStepLoader = ({
    loadingStates,
    loading,
    duration = 2000,
    loop = true,
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
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl bg-white/80 dark:bg-gray-950/90"
                >
                    {/* Gradient Orbs Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="relative z-10 w-full max-w-2xl px-4">
                        <LoaderCore value={currentState} loadingStates={loadingStates} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
