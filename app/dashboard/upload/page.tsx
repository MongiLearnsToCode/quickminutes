"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: string;
}

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const transcribe = async (meetingId: string) => {
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId }),
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      toast.success("Transcription started");
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === meetingId ? { ...file, status: "transcribing" } : file,
        ),
      );
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Failed to start transcription");
    }
  };

  const summarize = async (meetingId: string) => {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingId }),
      });

      if (!response.ok) {
        throw new Error("Summarization failed");
      }

      toast.success("Summarization started");
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === meetingId ? { ...file, status: "summarizing" } : file,
        ),
      );
    } catch (error) {
      console.error("Summarization error:", error);
      toast.error("Failed to start summarization");
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith("audio/")) {
        toast.error(`${file.name} is not an audio file`);
        continue;
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 20;
          });
        }, 200);

        const response = await fetch("/api/upload-audio", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { uploadedFile } = await response.json();

        const newFile: UploadedFile = {
          id: uploadedFile.id,
          name: file.name,
          url: uploadedFile.filePath,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(uploadedFile.createdAt),
          status: uploadedFile.status,
        };

        setUploadedFiles((prev) => [newFile, ...prev]);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Upload Meeting</h1>
        <p className="text-muted-foreground mt-2">
          Upload an audio file to transcribe and summarize your meeting.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Audio
            </CardTitle>
            <CardDescription>
              Upload an audio file (mp3, wav). Max 100MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Input
                type="file"
                accept="audio/*"
                multiple
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <div className="space-y-2">
                <FileAudio className="h-10 w-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {dragActive
                      ? "Drop files here"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, WAV up to 100MB
                  </p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About QuickMinutes</CardTitle>
            <CardDescription>
              QuickMinutes uses AI to transcribe and summarize your meetings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Fast Transcription</p>
                  <p className="text-muted-foreground">
                    Get a text transcript of your meeting in minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">AI Summaries</p>
                  <p className="text-muted-foreground">Key points and action items, automatically generated.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Secure Storage</p>
                  <p className="text-muted-foreground">
                    Your files are stored securely in the cloud.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Meetings ({uploadedFiles.length})</CardTitle>
            <CardDescription>
              Recently uploaded meetings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-3">
                    <p
                      className="font-medium text-sm truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.uploadedAt.toLocaleDateString()}</span>
                      <Badge variant={file.status === 'transcribed' ? 'default' : 'secondary'}>{file.status}</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => transcribe(file.id)}
                        className="flex-1 text-xs"
                      >
                        Transcribe
                      </Button>
                      {file.status === 'transcribed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => summarize(file.id)}
                          className="flex-1 text-xs"
                        >
                          Summarize
                        </Button>
                      )}
                      <Link href={`/dashboard/meeting/${file.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
