"use client"

import React, { useRef, useEffect, useState } from "react"
import { Layout } from "@/components/layout"
import Link from "next/link"
import { ArrowRight, Mic, Activity, MessageSquare, Sparkles, Heart, Book, BrainCircuit, Users, PlayCircle, ChevronRight, BadgeCheck, Volume2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { HeadMetadata } from "@/components/head-metadata"

export default function HomePage() {
  const { user } = useAuth();
  const featuresRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg"
  ];

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HeadMetadata />
      <Layout featuresRef={featuresRef}>
        {/* Hero Section with Radial Gradient - Extends to top */}
        <section className="relative min-h-screen -mt-24 pt-32 pb-16 flex items-center overflow-hidden">
          {/* Background with layered gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-gray-950"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light"></div>

          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]"></div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-[40%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div className="space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]">
                    <Sparkles className="h-5 w-5 text-white" />
                    <span className="text-sm font-semibold text-white tracking-wide">
                      Advanced Voice Analysis
                    </span>
                  </span>

                  <h1 className="text-6xl lg:text-8xl font-display font-bold tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1] text-shadow-sm">
                    Your Voice.<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400">Your Health.</span>
                  </h1>

                  <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-md leading-relaxed font-light mb-8">
                    Early detect voice disorders with our AI-powered voice analysis. Upload a recording and get results.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Button
                    className="px-10 py-7 text-base font-medium bg-gradient-to-r from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 shadow-indigo-600/20 rounded-xl"
                    size="lg"
                    asChild
                  >
                    <Link href={user ? "/analysis" : "/signup"}>
                      Upload Voice Recording
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 blur-2xl -z-10"></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl"></div>

                {/* Image Slider */}
                <div className="relative h-[550px] rounded-2xl shadow-2xl overflow-hidden">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Showcase image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Image Navigation Dots */}
                  <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentImage
                          ? "bg-white scale-110"
                          : "bg-white/50 hover:bg-white/70"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Redesigned */}
        <section className="relative py-24 sm:py-32">
          {/* Background with subtle gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/5 dark:to-gray-950"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-soft-light"></div>

          <div className="container relative z-10 px-4 sm:px-6">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
              <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium tracking-wide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1.5">
                  <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                AI-Powered Technology
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-gray-900 dark:text-white mb-6 tracking-tight">
                Voice Analysis <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Redefined</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Our comprehensive platform analyzes vocal patterns with precision, providing insights that were previously unavailable to medical professionals.
              </p>
            </div>

            {/* Features Grid - Bento Box Redesign */}
            <div className="mb-10" ref={featuresRef} id="premium-features">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-gray-900 dark:text-white">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Premium</span> Features
                  </h3>
                </div>
                <div className="hidden md:flex">
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">Innovative voice analysis technology</span>
                </div>
              </div>
            </div>

            {/* Bento Box Grid */}
            <div className="grid grid-cols-12 gap-5 md:gap-6">
              {/* Feature 1: Voice Analysis - Large Tile */}
              <div className="col-span-12 md:col-span-8 group">
                <div className="h-full rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950/40 shadow-md hover:shadow-xl transition-all duration-500 border border-indigo-100/70 dark:border-indigo-900/20 relative group">
                  {/* Background Decorative Elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-300/20 to-blue-300/20 dark:from-indigo-700/10 dark:to-blue-700/10 rounded-full blur-3xl"></div>

                  <div className="p-8">
                    <div className="flex items-center mb-5">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-4">
                        <Volume2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Real-time Voice Analysis</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="aspect-video overflow-hidden rounded-2xl shadow-lg relative">
                        <video
                          src="/Untitled design-2.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        ></video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-3 right-3">
                          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            <span>Live Processing</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center space-y-4">
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm">
                          <div className="flex items-center">
                            <BadgeCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">AI-Powered Detection</span>
                          </div>
                        </div>

                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl shadow-sm">
                          <div className="flex items-center">
                            <BadgeCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">Multi-Language Support</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link href="/analysis" className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group">
                      Explore Voice Analysis
                      <div className="ml-1 h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 2: AI Technology - Medium Tile */}
              <div className="col-span-12 md:col-span-4 group">
                <div className="h-full rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950/40 shadow-md hover:shadow-xl transition-all duration-500 border border-purple-100/70 dark:border-purple-900/20 relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 dark:from-purple-700/10 dark:to-indigo-700/10 rounded-full blur-3xl"></div>

                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mr-4">
                        <BrainCircuit className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">AI Technology</h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          title: "Deep Neural Networks",
                        },
                        {
                          title: "Acoustic Extraction",
                        },
                        {
                          title: "Continuous Learning",
                        }
                      ].map((item, i) => (
                        <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow transition duration-300">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-3">
                              <BadgeCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link href="/technology" className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group">
                      Learn About Our Tech
                      <div className="ml-1 h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 3: AI Assistant - Small Tile */}
              <div className="col-span-12 sm:col-span-6 md:col-span-4 group">
                <div className="h-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-950/40 shadow-md hover:shadow-xl transition-all duration-500 border border-blue-100/70 dark:border-blue-900/20 relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-700/10 dark:to-indigo-700/10 rounded-full blur-3xl"></div>

                  <div className="p-6">
                    <div className="flex mb-6">
                      <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">AI Assistant</h3>

                    <div className="mb-6">
                      {/* Chat Messages */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex space-x-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-blue-50 dark:bg-gray-700/50 p-2 rounded-lg text-xs text-gray-700 dark:text-gray-200">
                            Your recent analysis shows improvement in vocal clarity.
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">You</span>
                          </div>
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-xs text-gray-700 dark:text-gray-200">
                            Suggest breathing exercises
                          </div>
                        </div>
                      </div>

                      {/* Feature Pills */}
                      <div className="flex space-x-2 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full flex items-center">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center mr-1">
                            <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-xs text-blue-700 dark:text-blue-300">Personalized</span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full flex items-center">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center mr-1">
                            <BadgeCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-xs text-blue-700 dark:text-blue-300">24/7 Support</span>
                        </div>
                      </div>
                    </div>

                    <Link href="/assistant" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group">
                      Try Assistant
                      <div className="ml-1 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 4: Research - Small Tile */}
              <div className="col-span-12 sm:col-span-6 md:col-span-4 group">
                <div className="h-full rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-amber-950/40 shadow-md hover:shadow-xl transition-all duration-500 border border-amber-100/70 dark:border-amber-900/20 relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-300/20 to-orange-300/20 dark:from-amber-700/10 dark:to-orange-700/10 rounded-full blur-3xl"></div>

                  <div className="p-6">
                    <div className="flex mb-6">
                      <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Book className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Research</h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">98%</div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Accuracy</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">25+</div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Publications</span>
                      </div>
                    </div>

                    <Link href="/research" className="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors group">
                      View Research
                      <div className="ml-1 h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 5: Vocal Exercises - Small Tile */}
              <div className="col-span-12 md:col-span-4 group">
                <div className="h-full rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-950/40 shadow-md hover:shadow-xl transition-all duration-500 border border-emerald-100/70 dark:border-emerald-900/20 relative">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/10 dark:to-teal-700/10 rounded-full blur-3xl"></div>

                  <div className="p-6">
                    <div className="flex mb-6">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <PlayCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Vocal Exercises</h3>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {[
                        { icon: <Mic />, label: "Breathing" },
                        { icon: <Volume2 />, label: "Resonance" },
                        { icon: <Activity />, label: "Pitch" },
                        { icon: <Sparkles />, label: "Clarity" }
                      ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-2.5 flex items-center justify-center shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-2">
                            {React.cloneElement(item.icon, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" })}
                          </div>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/exercises" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group">
                      View Exercises
                      <div className="ml-1 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/40 transition-colors">
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900/50 dark:to-gray-950"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-soft-light"></div>

          <div className="container relative z-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-block">
                <div className="px-3 py-1 bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium tracking-wide rounded-full mb-4">
                  Trusted by Professionals
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 dark:text-white mb-6">
                Transforming Vocal Health Assessment
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join medical professionals worldwide who trust our platform for fast, accurate vocal analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "This platform has revolutionized how we detect early signs of vocal disorders. The AI analysis is remarkably accurate.",
                  author: "Dr. Ashish Pandit",
                  role: "ENT Specialist",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "The ability to track vocal changes over time has been invaluable for our patients undergoing voice therapy treatments.",
                  author: "Prof. Mohit Yadav",
                  role: "Speech Pathologist",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "I've been amazed by how the system detects subtle voice changes that would otherwise go unnoticed in routine examinations.",
                  author: "Dr. Mohnish Sharma",
                  role: "Neurologist",
                  avatar: "https://randomuser.me/api/portraits/women/68.jpg"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700/50 relative group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-bl-3xl rounded-tr-2xl -z-10"></div>

                  <div className="mb-6">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="inline-block w-5 h-5 text-amber-400 fill-current mr-1" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-indigo-100 dark:ring-indigo-900/50" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{testimonial.author}</div>
                      <div className="text-sm text-indigo-600 dark:text-indigo-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

