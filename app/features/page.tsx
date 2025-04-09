"use client"

import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mic, 
  Activity, 
  MessageSquare, 
  Sparkles, 
  Heart, 
  Book, 
  BrainCircuit, 
  Users, 
  PlayCircle, 
  ChevronRight, 
  BadgeCheck, 
  Volume2, 
  Zap,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Our advanced algorithms analyze your voice patterns with 98% accuracy, detecting subtle changes that could indicate potential health issues.",
    icon: <BrainCircuit className="h-6 w-6" />,
    color: "from-indigo-500 to-indigo-600",
    darkColor: "from-indigo-400 to-indigo-500"
  },
  {
    title: "Personalized Exercises",
    description: "Get customized vocal exercises based on your analysis results, designed to improve your vocal health and prevent potential issues.",
    icon: <PlayCircle className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
    darkColor: "from-purple-400 to-purple-500"
  },
  {
    title: "24/7 AI Assistant",
    description: "Our AI assistant is always available to answer your questions, provide guidance, and help you maintain optimal vocal health.",
    icon: <MessageSquare className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
    darkColor: "from-blue-400 to-blue-500"
  },
  {
    title: "Comprehensive Reports",
    description: "Receive detailed reports with actionable insights, progress tracking, and recommendations for maintaining vocal health.",
    icon: <Book className="h-6 w-6" />,
    color: "from-rose-500 to-rose-600",
    darkColor: "from-rose-400 to-rose-500"
  }
];

const steps = [
  {
    title: "Record Your Voice",
    description: "Simply record a short voice sample using our easy-to-use interface. Our system will guide you through the process.",
    icon: <Mic className="h-8 w-8" />,
    color: "bg-indigo-500"
  },
  {
    title: "AI Analysis",
    description: "Our advanced AI analyzes your voice patterns, detecting subtle changes and potential health indicators.",
    icon: <BrainCircuit className="h-8 w-8" />,
    color: "bg-purple-500"
  },
  {
    title: "Get Results",
    description: "Receive immediate feedback, personalized recommendations, and a detailed health report.",
    icon: <Activity className="h-8 w-8" />,
    color: "bg-blue-500"
  }
];

export default function FeaturesPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
    setIsAutoPlaying(false);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
    setIsAutoPlaying(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] py-16 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
              Advanced Voice Analysis <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Technology</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover how our cutting-edge AI technology helps you maintain optimal vocal health through advanced analysis and personalized care.
            </p>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-lg shadow-indigo-500/25">
              <Link href="/analysis">Try Voice Analysis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Works</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our process is simple, yet powerful. Just follow these three steps to get started with your vocal health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className={`h-16 w-16 rounded-xl ${step.color} flex items-center justify-center mb-4`}>
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">{step.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="py-20 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/50 dark:to-gray-950">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Features</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover the powerful features that make our voice analysis platform stand out.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${features[currentFeature].color} dark:${features[currentFeature].darkColor} flex items-center justify-center mb-6`}>
                      {features[currentFeature].icon}
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{features[currentFeature].title}</CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300">{features[currentFeature].description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentFeature(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentFeature
                      ? "bg-indigo-600 dark:bg-indigo-400 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 dark:text-white mb-4">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Us</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're dedicated to revolutionizing vocal health through advanced AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  We're on a mission to make advanced vocal health analysis accessible to everyone. Our platform combines cutting-edge AI technology with medical expertise to provide accurate, actionable insights about your vocal health.
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-100/50 dark:border-indigo-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Our Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Powered by state-of-the-art machine learning algorithms, our platform can detect subtle changes in voice patterns that may indicate potential health issues, helping you take proactive steps towards better vocal health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/50 dark:to-gray-950">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 dark:text-white mb-6">
              Ready to Start Your Vocal Health Journey?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who are already taking control of their vocal health with our advanced analysis platform.
            </p>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white shadow-lg shadow-indigo-500/25">
              <Link href="/analysis">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
} 