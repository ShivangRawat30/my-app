"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Upload, Download, Loader2, Mic } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@supabase/supabase-js";

export default function VoiceChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadReady, setIsDownloadReady] = useState(false);

  const SUPABASE_URL = "https://hhyjrtqiffnbchwzpmqo.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoeWpydHFpZmZuYmNod3pwbXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NzcyMzcsImV4cCI6MjA0NzM1MzIzN30.kAPaNO0UuUFS08S_o5FiQG1P7UBq9AiS6I1ynAXEsho";

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const uploadToSupabase = async (file: any) => {
    console.log(file)
    try {
      const { data, error } = await supabase.storage
        .from("audios")
        .upload(`audio_${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File is too large. Please upload a file smaller than 5MB.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError("");
      }
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleGenerate = async() => {
    if (!file) {
      setError("Please upload a voice file first.");
      return;
    }
    if (text.length === 0) {
      setError("Please enter some text to generate.");
      return;
    }
    if (text.length > 500) {
      setError("Text is too long. Please limit to 500 characters.");
      return;
    }
    setError("");
    await uploadToSupabase(file);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsDownloadReady(true);
    }, 2000);
  };

  const handleDownload = async () => {
   
    console.log("Downloading generated voice file");
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 flex flex-col items-center justify-center p-4 sm:p-8">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-center text-white text-4xl sm:text-6xl lg:text-7xl font-black mb-8 animate-pulse">
            VOICE<span className="text-teal-400">MORPH</span>
          </h1>
          <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white text-2xl">
                Voice Changer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <label
                  htmlFor="voice-file"
                  className="block text-sm font-medium text-white"
                >
                  Upload Voice File (max 5MB)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="voice-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/30 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-white group-hover:scale-110 transition-transform" />
                      <p className="mb-2 text-sm text-white">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-white/70">
                        MP3, WAV up to 5MB
                      </p>
                    </div>
                    <input
                      id="voice-file"
                      type="file"
                      className="hidden"
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <p className="text-sm text-white/70 mt-2">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="new-text"
                  className="block text-sm font-medium text-white"
                >
                  Enter New Text (max 500 characters)
                </label>
                <Textarea
                  id="new-text"
                  placeholder="Type your message here..."
                  value={text}
                  onChange={handleTextChange}
                  maxLength={500}
                  className="h-32 bg-white/5 border-white/20 text-white placeholder-white/50 rounded-xl resize-none"
                />
                <p className="text-sm text-white/70 text-right">
                  {text.length}/500 characters
                </p>
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-500/20 border-red-500/50 rounded-xl"
                >
                  <AlertCircle className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={66} className="w-full" />
                  <p className="text-sm text-white/70 text-center">
                    Generating voice...
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/10 p-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !file || text.length === 0}
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-6 py-2 flex items-center space-x-2 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    <span>Generate Voice</span>
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownload}
                disabled={!isDownloadReady}
                variant="outline"
                className="border-white/20 text-black hover:bg-white/10 rounded-xl px-6 py-2 flex items-center space-x-2 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}
