"use client"

import { useState, useRef, useEffect } from "react"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Mic, Upload, StopCircle, PlayCircle, Activity } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/config"
import { useAuth } from "@/lib/auth-context"
import { ReportService } from "@/lib/reportService"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"

// Sample phrases for recording
const PHRASES = [
  "The human voice is a remarkable instrument that can convey emotions, ideas, and personality through subtle variations in tone, pitch, and rhythm that our technology can analyze with precision.",
  "Regular monitoring of your vocal health is essential for professionals who rely on their voice daily, such as teachers, singers, public speakers, and customer service representatives who speak for extended periods.",
  "VocalWell.ai uses advanced machine learning algorithms to detect early warning signs of vocal strain, nodules, polyps, and other voice disorders before they become serious medical conditions requiring intensive treatment.",
  "When reading this passage, please maintain your normal speaking voice and pace so our system can accurately analyze your vocal patterns, frequency range, and potential signs of fatigue or strain.",
  "The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly nearby, demonstrating a wide range of phonetic sounds that help our system assess your complete vocal profile."
];

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [plotPath, setPlotPath] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [reportPath, setReportPath] = useState<string | null>(null)
  const [reportFile, setReportFile] = useState<File | null>(null)
  const { user } = useAuth();
  const reportService = new ReportService();
  const { toast } = useToast();

  // State for final result to show in loader
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Loading states for multi-step loader
  const loadingStates = [
    { text: "Uploading voice recording..." },
    { text: "Processing audio data..." },
    { text: "Analyzing vocal patterns..." },
    { text: "Detecting voice characteristics..." },
    { text: "Generating comprehensive report..." },
    { text: "Analysis complete!" },
  ];

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedPhrase, setSelectedPhrase] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const phraseWords = selectedPhrase.split(" ")

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
  const MAX_RECORDING_TIME = 30; // 30 seconds max

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    }
  }, [audioUrl]);

  // Word highlighting timer
  useEffect(() => {
    if (isRecording && selectedPhrase && currentWordIndex < phraseWords.length) {
      const wordTimer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 1000); // Adjust timing as needed

      return () => clearTimeout(wordTimer);
    }
  }, [isRecording, currentWordIndex, selectedPhrase, phraseWords.length]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "File is too large. Please upload a WAV file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    // Check for both common WAV MIME types and file extension
    const isWavFile = selectedFile && (
      selectedFile.type === "audio/wav" ||
      selectedFile.type === "audio/wave" ||
      selectedFile.type === "audio/x-wav" ||
      selectedFile.name.toLowerCase().endsWith('.wav')
    )

    if (isWavFile) {
      setFile(selectedFile)
      setAudioUrl(URL.createObjectURL(selectedFile))
      setRecordedBlob(null)
    } else {
      toast({
        title: "Error",
        description: "Please upload a valid .wav file. The file must be in WAV format.",
        variant: "destructive"
      });
    }
  }

  const startRecording = async () => {
    try {
      // Reset states
      setCurrentWordIndex(0);
      setSelectedPhrase(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
      setRecordingTime(0);
      setRecordedBlob(null);
      setAudioUrl(null);
      setFile(null);
      chunksRef.current = [];

      // Start countdown
      setCountdown(3);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(null);

      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setRecordedBlob(blob);

        // Convert to File object for analysis
        const audioFile = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
        setFile(audioFile);
        setAudioUrl(URL.createObjectURL(blob));

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Setup timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      setCountdown(null);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
    setCurrentWordIndex(0);
  };

  const analyzeAudio = async () => {
    if (!file || !user) {
      toast({
        title: "Error",
        description: "Please upload or record a .wav file first and ensure you're logged in",
        variant: "destructive"
      });
      return;
    }

    setLoading(true)
    setResult(null)
    setPlotPath(null)
    setReportPath(null)
    setReportFile(null)

    try {
      // Ensure loader shows all 6 steps (6 steps × 2 seconds = 12 seconds minimum)
      const minLoadingTime = 12000;
      const startTime = Date.now();

      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch(API_ENDPOINTS.AUDIO, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Wait for minimum time if API was faster
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }

      // Set the result to show in loader
      setAnalysisResult(data.Prediction || "Voice analysis completed successfully");

      // Wait 2 more seconds to show the completion message
      await new Promise(resolve => setTimeout(resolve, 2000));

      setResult(data.Prediction)
      setPlotPath(data.PlotPath)
      setReportPath(data.ReportPath)

      // Fetch the generated report file
      const reportResponse = await fetch(API_ENDPOINTS.REPORT(data.ReportPath))
      const reportBlob = await reportResponse.blob()
      const reportFile = new File([reportBlob], `voice_analysis_${Date.now()}.pdf`, { type: 'application/pdf' })
      setReportFile(reportFile)

      // Store report on IPFS and Firebase
      try {
        toast({
          title: "Processing",
          description: "Storing your report securely...",
        });

        const report = await reportService.storeReport(
          user.uid,
          reportFile,
          `Voice Analysis Report - ${new Date().toLocaleDateString()}`
        );

        toast({
          title: "Success",
          description: "Report stored successfully on IPFS and in your account.",
        });

        console.log('Report stored successfully:', report);
      } catch (error) {
        console.error('Error storing report:', error);
        toast({
          title: "Warning",
          description: "Report generated but there was an error storing it. You can still download it below.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Error analyzing audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false)
    }
  }

  const viewReport = async () => {
    if (!reportPath) return;

    try {
      window.open(API_ENDPOINTS.REPORT(reportPath), '_blank');
    } catch (error) {
      console.error("Error viewing report:", error);
      toast({
        title: "Error",
        description: "Error viewing report. Please try again.",
        variant: "destructive"
      });
    }
  }

  const downloadReport = async () => {
    if (!reportPath) return;

    try {
      window.open(API_ENDPOINTS.REPORT_DOWNLOAD(reportPath), '_blank');
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Error",
        description: "Error downloading report. Please try again.",
        variant: "destructive"
      });
    }
  }

  return (
    <Layout>
      <ProtectedRoute>
        {/* Multi-Step Loader for Analysis */}
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={loading}
          duration={2000}
          loop={false}
          finalResult={analysisResult}
        />

        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Voice Analysis</h1>

          <div className="grid gap-8">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Audio
                </TabsTrigger>
                <TabsTrigger value="record" className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Record Audio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Audio</CardTitle>
                    <CardDescription>
                      Upload a WAV file of your voice for analysis. Maximum file size is 10MB.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept=".wav"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-500 file:text-white
                          hover:file:bg-indigo-600"
                      />

                      {audioUrl && !isRecording && !recordedBlob && (
                        <div className="space-y-4">
                          <audio controls src={audioUrl} className="w-full" />
                          <Button
                            onClick={analyzeAudio}
                            disabled={loading}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                          >
                            {loading ? "Analyzing..." : "Analyze Voice"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="record">
                <Card>
                  <CardHeader>
                    <CardTitle>Record Audio</CardTitle>
                    <CardDescription>
                      Record your voice directly for analysis. Maximum recording time is 30 seconds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Countdown Display */}
                      {countdown !== null && (
                        <div className="flex items-center justify-center h-32">
                          <motion.div
                            key={countdown}
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="text-6xl font-bold text-indigo-500"
                          >
                            {countdown}
                          </motion.div>
                        </div>
                      )}

                      {/* Recording Interface */}
                      {isRecording && countdown === null && (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                              <span className="font-medium">Recording in progress</span>
                            </div>
                            <span className="text-indigo-500 font-mono">
                              {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                              {(recordingTime % 60).toString().padStart(2, '0')}
                            </span>
                          </div>

                          <div className="p-6 bg-indigo-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-3">Please read the following phrase:</p>
                            <div className="text-xl font-medium text-center space-y-2">
                              {phraseWords.map((word, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    "inline-block mx-1 transition-all duration-300",
                                    idx === currentWordIndex
                                      ? "text-indigo-500 font-semibold scale-110"
                                      : idx < currentWordIndex
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                  )}
                                >
                                  {word}
                                </span>
                              ))}
                            </div>
                          </div>

                          <Button
                            onClick={stopRecording}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2"
                          >
                            <StopCircle className="h-4 w-4" />
                            Stop Recording
                          </Button>
                        </div>
                      )}

                      {/* Recording Controls and Preview */}
                      {!isRecording && countdown === null && (
                        <div className="space-y-4">
                          {!recordedBlob ? (
                            <Button
                              onClick={startRecording}
                              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center gap-2"
                            >
                              <Mic className="h-4 w-4" />
                              Start Recording
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <audio controls src={audioUrl as string} className="w-full" />
                              <div className="grid grid-cols-2 gap-4">
                                <Button
                                  onClick={startRecording}
                                  variant="outline"
                                  className="border-indigo-200 hover:bg-indigo-50 text-indigo-500"
                                >
                                  Record Again
                                </Button>
                                <Button
                                  onClick={analyzeAudio}
                                  disabled={loading}
                                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                                >
                                  {loading ? "Analyzing..." : "Analyze Voice"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {loading && (
              <Card className="border-indigo-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    <span className="ml-3 text-indigo-500">Analyzing your voice...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Simple Result Display */}
                <div className="space-y-3">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Diagnosis
                  </h2>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {result}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on voice pattern analysis
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800"></div>

                {/* Plot */}
                {plotPath && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Waveform Analysis
                    </h2>
                    <img
                      src={API_ENDPOINTS.PLOT(plotPath)}
                      alt="Voice Analysis"
                      className="w-full"
                    />
                  </div>
                )}

                {/* Report Download */}
                {reportPath && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-800"></div>
                    <div className="space-y-3">
                      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Full Report
                      </h2>
                      <div className="flex gap-3">
                        <button
                          onClick={viewReport}
                          className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          View →
                        </button>
                        <button
                          onClick={downloadReport}
                          className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          Download ↓
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  )
}