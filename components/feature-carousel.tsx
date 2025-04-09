"use client"

import { 
  Brain, 
  HeartPulse,
  Shield, 
  Activity, 
  LineChart,
  Users
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: "Advanced AI Analysis",
    description: "State-of-the-art voice analysis powered by deep learning models"
  },
  {
    icon: HeartPulse,
    title: "Early Detection",
    description: "Identify potential voice disorders before they become serious"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and never shared with third parties"
  },
  {
    icon: Activity,
    title: "Real-time Processing",
    description: "Get instant analysis and feedback on your voice health"
  },
  {
    icon: LineChart,
    title: "Detailed Reports",
    description: "Comprehensive analysis with actionable insights"
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Access to voice health professionals and resources"
  }
]

export function FeatureCarousel() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-[42rem] mx-auto">
            Experience the next generation of voice health analysis with our comprehensive suite of features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div 
                key={idx}
                className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-rose-50 p-3 group-hover:bg-rose-100 transition-colors">
                  <Icon className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 