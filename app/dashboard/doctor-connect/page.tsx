"use client"

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DashboardSidebar } from '../dashboard-sidebar';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video flex items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function DoctorConnectPage() {
  // Indian doctors data with specialties in voice pathology
  const doctors = [
    {
      id: 1,
      name: "Dr. Arjun Sharma",
      specialty: "Voice Pathologist",
      distance: "1.8 km",
      address: "123 Medical Center, Bandra, Mumbai",
      phone: "+91 98765 43210",
      email: "dr.sharma@voicehealth.in",
      availability: "Mon-Fri: 10am-6pm",
      position: [19.058, 72.831] // Mumbai coordinates with slight offset
    },
    {
      id: 2,
      name: "Dr. Priya Patel",
      specialty: "Speech-Language Pathologist",
      distance: "3.2 km",
      address: "456 Health Parkway, Andheri, Mumbai",
      phone: "+91 87654 32109",
      email: "dr.patel@voicecare.org",
      availability: "Tue-Sat: 9am-5pm",
      position: [19.113, 72.869] // Mumbai coordinates with slight offset
    },
    {
      id: 3,
      name: "Dr. Rajesh Gupta",
      specialty: "ENT Specialist & Voice Therapist",
      distance: "4.6 km",
      address: "789 Wellness Blvd, Powai, Mumbai",
      phone: "+91 76543 21098",
      email: "dr.gupta@entclinic.in",
      availability: "Mon, Wed, Fri: 11am-7pm",
      position: [19.121, 72.908] // Mumbai coordinates with slight offset
    }
  ];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Find Voice Specialists</h1>
            </div>
            
            <Card className="overflow-hidden border-rose-100">
              <CardHeader className="bg-rose-50/50">
                <CardTitle className="text-gray-900">Voice Specialists in Mumbai</CardTitle>
                <CardDescription>Connect with specialists in your area</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <MapWithNoSSR doctors={doctors} />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden border-rose-100 hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 bg-rose-50/30">
                    <CardTitle className="text-lg text-gray-900">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p>{doctor.address}</p>
                        <p className="text-xs text-muted-foreground">{doctor.distance} away</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-rose-500" />
                      <p>{doctor.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-rose-500" />
                      <p>{doctor.email}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-medium">Availability</p>
                      <p className="text-xs text-muted-foreground">{doctor.availability}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 gap-1 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    >
                      Book Appointment <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 