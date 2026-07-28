"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LiveWaveform } from "@/components/ai/live-waveform";
import { cn } from "@/lib/utils";
import { Mic02Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type SpeechInputMode = "speech-recognition" | "media-recorder" | "none";

export type SpeechInputProps = ComponentProps<typeof Button> & {
  onTranscriptionChange?: (text: string) => void;
  /**
   * Called whenever recording starts or stops. Useful for parents that
   * change layout while the waveform strip is visible.
   */
  onListeningChange?: (listening: boolean) => void;
  /**
   * Callback for when audio is recorded using MediaRecorder fallback.
   * This is called in browsers that don't support the Web Speech API (Firefox, Safari).
   * The callback receives an audio Blob that should be sent to a transcription service.
   * Return the transcribed text, which will be passed to onTranscriptionChange.
   */
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  lang?: string;
  /**
   * Tooltip label for the icon button. Defaults to a state-aware label;
   * pass `null` to render without a tooltip.
   */
  tooltip?: ReactNode;
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"];
};

const detectSpeechInputMode = (): SpeechInputMode => {
  if (typeof window === "undefined") {
    return "none";
  }

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    return "speech-recognition";
  }

  if ("MediaRecorder" in window && "mediaDevices" in navigator) {
    return "media-recorder";
  }

  return "none";
};

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const SpeechInput = ({
  className,
  onTranscriptionChange,
  onAudioRecorded,
  onListeningChange,
  lang = "en-US",
  tooltip,
  tooltipSide = "top",
  ...props
}: SpeechInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mode] = useState<SpeechInputMode>(detectSpeechInputMode);
  const [isRecognitionReady, setIsRecognitionReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const onTranscriptionChangeRef = useRef<
    SpeechInputProps["onTranscriptionChange"]
  >(onTranscriptionChange);
  const onAudioRecordedRef =
    useRef<SpeechInputProps["onAudioRecorded"]>(onAudioRecorded);
  const onListeningChangeRef =
    useRef<SpeechInputProps["onListeningChange"]>(onListeningChange);

  // Keep refs in sync
  onTranscriptionChangeRef.current = onTranscriptionChange;
  onAudioRecordedRef.current = onAudioRecorded;

  useEffect(() => {
    onListeningChangeRef.current = onListeningChange;
  });

  // Reset the timer whenever recording starts or stops, adjusting during
  // render so the first paint never shows a stale duration.
  const [lastListening, setLastListening] = useState(false);
  if (lastListening !== isListening) {
    setLastListening(isListening);
    setElapsedSeconds(0);
  }

  // Notify parents and run the recording timer
  useEffect(() => {
    onListeningChangeRef.current?.(isListening);

    if (!isListening) {
      return;
    }

    const startedAt = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 250);

    return () => clearInterval(interval);
  }, [isListening]);

  // Initialize Speech Recognition when mode is speech-recognition
  useEffect(() => {
    if (mode !== "speech-recognition") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognition = new SpeechRecognition();

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = lang;

    const handleStart = () => {
      setIsListening(true);
    };

    const handleEnd = () => {
      setIsListening(false);
    };

    const handleResult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      let finalTranscript = "";

      for (
        let i = speechEvent.resultIndex;
        i < speechEvent.results.length;
        i += 1
      ) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        }
      }

      if (finalTranscript) {
        onTranscriptionChangeRef.current?.(finalTranscript);
      }
    };

    const handleError = () => {
      setIsListening(false);
    };

    speechRecognition.addEventListener("start", handleStart);
    speechRecognition.addEventListener("end", handleEnd);
    speechRecognition.addEventListener("result", handleResult);
    speechRecognition.addEventListener("error", handleError);

    recognitionRef.current = speechRecognition;
    setIsRecognitionReady(true);

    return () => {
      speechRecognition.removeEventListener("start", handleStart);
      speechRecognition.removeEventListener("end", handleEnd);
      speechRecognition.removeEventListener("result", handleResult);
      speechRecognition.removeEventListener("error", handleError);
      speechRecognition.stop();
      recognitionRef.current = null;
      setIsRecognitionReady(false);
    };
  }, [mode, lang]);

  // Cleanup MediaRecorder and stream on unmount
  useEffect(
    () => () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    },
    []
  );

  // Start MediaRecorder recording
  const startMediaRecorder = useCallback(async () => {
    if (!onAudioRecordedRef.current) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStop = async () => {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        if (audioBlob.size > 0 && onAudioRecordedRef.current) {
          setIsProcessing(true);
          try {
            const transcript = await onAudioRecordedRef.current(audioBlob);
            if (transcript) {
              onTranscriptionChangeRef.current?.(transcript);
            }
          } catch {
            // Error handling delegated to the onAudioRecorded caller
          } finally {
            setIsProcessing(false);
          }
        }
      };

      const handleError = () => {
        setIsListening(false);
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      };

      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.addEventListener("stop", handleStop);
      mediaRecorder.addEventListener("error", handleError);

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, []);

  // Stop MediaRecorder recording
  const stopMediaRecorder = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (mode === "speech-recognition" && recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } else if (mode === "media-recorder") {
      if (isListening) {
        stopMediaRecorder();
      } else {
        startMediaRecorder();
      }
    }
  }, [mode, isListening, startMediaRecorder, stopMediaRecorder]);

  // Determine if button should be disabled
  const isDisabled =
    mode === "none" ||
    (mode === "speech-recognition" && !isRecognitionReady) ||
    (mode === "media-recorder" && !onAudioRecorded) ||
    isProcessing;

  const tooltipContent =
    tooltip === undefined
      ? isProcessing
        ? "Transcribing..."
        : isListening
          ? "Stop listening"
          : "Start voice input"
      : tooltip;

  const button = (
    <Button
      className={cn("relative z-10 rounded-full", className)}
      disabled={isDisabled}
      onClick={toggleListening}
      {...props}
      size="icon-sm"
      variant={isListening ? "secondary" : "ghost"}
    >
      {isProcessing && <Spinner />}
      {!isProcessing && isListening && (
        <HugeiconsIcon
          className="size-3 fill-current"
          icon={StopIcon}
          strokeWidth={2}
        />
      )}
      {!(isProcessing || isListening) && (
        <HugeiconsIcon icon={Mic02Icon} strokeWidth={1.5} />
      )}
    </Button>
  );

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        isListening && "w-full min-w-0 flex-1 justify-end gap-2"
      )}
    >
      {/* Live waveform and elapsed time while recording */}
      {isListening && (
        <>
          <div className="relative min-w-0 flex-1">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dotted border-muted-foreground/20" />
            <LiveWaveform
              active
              mode="scrolling"
              height={24}
              barWidth={2}
              barGap={2}
              historySize={512}
              updateRate={50}
              fadeWidth={12}
              sensitivity={2}
              className="text-foreground"
            />
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">
            {formatDuration(elapsedSeconds)}
          </span>
        </>
      )}

      {/* Main record button */}
      {tooltipContent == null ? (
        button
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={button} />
            <TooltipContent side={tooltipSide}>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
