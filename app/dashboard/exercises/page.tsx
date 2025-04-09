"use client"

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Info, Clock, BarChart, CheckCircle, Award } from 'lucide-react';
import { DashboardSidebar } from '../dashboard-sidebar';
import { useExercises, Exercise } from '@/lib/exercises-context';
import { useToast } from '@/components/ui/use-toast';

export default function ExercisesPage() {
  const { 
    completeExercise, 
    hasCompletedExercise, 
    streak, 
    todaysExercises 
  } = useExercises();
  
  const { toast } = useToast();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [exerciseInProgress, setExerciseInProgress] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Lip Trills',
      description: 'A gentle exercise that relaxes the vocal folds and improves breath control.',
      duration: '2-3 minutes',
      difficulty: 'Beginner',
      benefits: [
        'Reduces vocal tension',
        'Improves breath support',
        'Warms up the voice without strain'
      ],
      steps: [
        'Relax your lips and keep them loosely together',
        'Blow air through your lips to make them vibrate (like a motor sound)',
        'Add sound while continuing the lip vibration',
        'Glide up and down in pitch while maintaining the trill'
      ]
    },
    {
      id: '2',
      title: 'Humming Scales',
      description: 'A simple exercise that helps find resonance and proper placement.',
      duration: '3-5 minutes',
      difficulty: 'Beginner',
      benefits: [
        'Develops resonance',
        'Improves pitch accuracy',
        'Encourages proper vocal placement'
      ],
      steps: [
        'Start with your lips closed and relaxed',
        'Hum a comfortable note in your mid-range',
        'Slowly glide up five notes and back down',
        'Focus on feeling vibrations in your mask area (around the nose and cheeks)'
      ]
    },
    {
      id: '3',
      title: 'Vocal Sirens',
      description: 'An exercise that stretches the vocal range and improves flexibility.',
      duration: '2-3 minutes',
      difficulty: 'Intermediate',
      benefits: [
        'Extends vocal range',
        'Improves vocal flexibility',
        'Helps with smooth register transitions'
      ],
      steps: [
        'Start with an "oo" or "ee" vowel sound',
        'Begin at your lowest comfortable pitch',
        'Glide smoothly up to your highest comfortable pitch',
        'Then glide back down to the bottom',
        'Keep the sound connected and smooth throughout'
      ]
    },
    {
      id: '4',
      title: 'Straw Phonation',
      description: 'A semi-occluded vocal tract exercise that promotes efficient vocal fold vibration.',
      duration: '3-5 minutes',
      difficulty: 'Intermediate',
      benefits: [
        'Reduces vocal fold collision force',
        'Balances air pressure and vocal fold resistance',
        'Promotes vocal efficiency'
      ],
      steps: [
        'Place a straw between your lips',
        'Hum or sing through the straw',
        'Practice scales, sirens, or simple melodies',
        'Focus on keeping the sound steady and controlled'
      ]
    }
  ];

  // Start practicing an exercise
  const startExercise = (exercise: Exercise) => {
    if (hasCompletedExercise(exercise.id)) {
      toast({
        title: "Already Completed",
        description: `You've already completed the ${exercise.title} exercise today.`,
      });
      return;
    }
    
    setActiveExercise(exercise);
    setExerciseInProgress(true);
    setTimerValue(0);
    
    // Start a timer
    const interval = setInterval(() => {
      setTimerValue(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Complete an exercise
  const completeActiveExercise = () => {
    if (!activeExercise) return;
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Mark as completed
    completeExercise(activeExercise);
    
    // Show success message
    toast({
      title: "Exercise Completed",
      description: `Great job completing the ${activeExercise.title} exercise!`,
    });
    
    // Reset states
    setExerciseInProgress(false);
    setActiveExercise(null);
    setTimerValue(0);
  };

  // Cancel exercise
  const cancelExercise = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setExerciseInProgress(false);
    setActiveExercise(null);
    setTimerValue(0);
  };

  // Format timer value
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container py-12 flex flex-col md:flex-row gap-6">
          <DashboardSidebar />
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Vocal Exercises</h1>
              <div className="bg-rose-100 text-rose-800 px-4 py-2 rounded-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                <span className="font-medium">Streak: {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {exerciseInProgress && activeExercise ? (
              <Card className="mb-6 border-rose-200">
                <CardHeader className="bg-rose-50">
                  <div className="flex justify-between items-center">
                    <CardTitle>Practicing: {activeExercise.title}</CardTitle>
                    <div className="text-lg font-mono text-rose-600">{formatTime(timerValue)}</div>
                  </div>
                  <CardDescription>
                    Follow the steps below and complete when you're finished
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Steps:</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      {activeExercise.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-rose-200"
                      onClick={cancelExercise}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                      onClick={completeActiveExercise}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Mark Completed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardHeader className="bg-rose-50">
                  <CardTitle>Daily Vocal Practice</CardTitle>
                  <CardDescription>
                    Regular practice of these exercises can help maintain and improve your vocal health
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    These exercises are designed to help strengthen your voice, improve vocal quality, and prevent strain. 
                    For best results, practice these exercises daily for 10-15 minutes in a quiet, comfortable environment.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-rose-500" />
                      <span>10-15 minutes daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-rose-500" />
                      <span>Start with beginner exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-rose-500" />
                      <span>Track your progress</span>
                    </div>
                  </div>
                  
                  {todaysExercises.length > 0 && (
                    <div className="mt-4 p-4 bg-rose-50 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-rose-500 mr-2" />
                        Today's Progress
                      </h3>
                      <p className="text-sm mb-2">
                        You've completed {todaysExercises.length} exercise{todaysExercises.length !== 1 ? 's' : ''} today. Keep it up!
                      </p>
                      <div className="w-full bg-rose-100 h-2 rounded-full">
                        <div 
                          className="bg-rose-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (todaysExercises.length / exercises.length) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-6 md:grid-cols-2">
              {exercises.map((exercise) => {
                const isCompleted = hasCompletedExercise(exercise.id);
                
                return (
                  <Card key={exercise.id} className={`overflow-hidden ${isCompleted ? 'border-rose-200 bg-rose-50/30' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2">
                          {isCompleted && (
                            <div className="mt-1">
                              <CheckCircle className="h-4 w-4 text-rose-500" />
                            </div>
                          )}
                          <div>
                            <CardTitle>{exercise.title}</CardTitle>
                            <CardDescription>{exercise.description}</CardDescription>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exercise.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : exercise.difficulty === 'Intermediate'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {exercise.difficulty}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {exercise.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Steps:</h4>
                        <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
                          {exercise.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{exercise.duration}</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="gap-1"
                          variant={isCompleted ? "outline" : "default"}
                          disabled={exerciseInProgress || isCompleted}
                          onClick={() => startExercise(exercise)}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Completed
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" /> Practice Now
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 