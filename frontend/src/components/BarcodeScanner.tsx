"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Camera, CameraOff, RefreshCw } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<any>(null);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  // Step 1: Request camera permission and enumerate devices
  useEffect(() => {
    async function init() {
      try {
        // Request permission first (required before enumerating labels)
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(t => t.stop()); // release immediately

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === "videoinput");
        setCameras(videoDevices);

        // Prefer back camera
        const back = videoDevices.find(d =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("rear") ||
          d.label.toLowerCase().includes("environment")
        );
        setSelectedCamera(back?.deviceId || videoDevices[0]?.deviceId || "");
      } catch (err: any) {
        setError("Camera permission denied. Please allow camera access and try again.");
      }
    }
    init();
  }, []);

  // Step 2: Start scanning once a camera is selected
  useEffect(() => {
    if (!selectedCamera || !videoRef.current) return;

    let stopped = false;

    async function startScanning() {
      try {
        setError(null);
        setReady(false);

        // Stop any existing stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }
        if (controlsRef.current) {
          controlsRef.current.stop?.();
        }

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const controls = await reader.decodeFromVideoDevice(
          selectedCamera,
          videoRef.current!,
          (result, err) => {
            if (stopped) return;
            if (result) {
              const text = result.getText();
              setLastResult(text);
              setFlash(true);
              setTimeout(() => setFlash(false), 500);
              onDetected(text);
            }
          }
        );

        controlsRef.current = controls;
        if (!stopped) setReady(true);
      } catch (err: any) {
        if (!stopped) {
          setError("Could not start camera: " + (err?.message || "Unknown error"));
        }
      }
    }

    startScanning();

    return () => {
      stopped = true;
      controlsRef.current?.stop?.();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [selectedCamera]);

  const handleClose = () => {
    controlsRef.current?.stop?.();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#EFF6FF] rounded-lg flex items-center justify-center">
              <Camera size={18} className="text-[#1D4ED8]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Web Barcode Scanner</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {error ? "Error" : ready ? "Scanning — point at a barcode" : "Starting camera…"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera Feed */}
        <div className="relative bg-black" style={{ aspectRatio: "4/3" }}>
          {/* Scan overlay — only show when ready */}
          {ready && !error && (
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
              <div className="relative w-56 h-36">
                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-[#1D4ED8] rounded-tl" />
                <span className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-[#1D4ED8] rounded-tr" />
                <span className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-[#1D4ED8] rounded-bl" />
                <span className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-[#1D4ED8] rounded-br" />
                {/* Animated laser */}
                <div className="animate-scan-line" />
              </div>
            </div>
          )}

          {/* Success flash */}
          {flash && (
            <div className="absolute inset-0 z-20 bg-green-400/40 pointer-events-none" />
          )}

          {/* Video element — always in DOM so ref attaches */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4 px-6 text-center">
              <CameraOff size={36} className="text-red-400" />
              <p className="text-sm font-semibold text-red-300">{error}</p>
              <button
                onClick={() => setSelectedCamera(prev => prev)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-colors"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* Loading overlay */}
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-white/20 border-t-[#1D4ED8] rounded-full animate-spin" />
                <span className="text-white/70 text-xs font-semibold">Starting camera…</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 space-y-3">
          {/* Last detected */}
          {lastResult && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Last Detected</p>
                <p className="text-sm font-bold text-[#1D4ED8] font-mono tracking-widest">{lastResult}</p>
              </div>
            </div>
          )}

          {/* Camera selector */}
          {cameras.length > 1 && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">Camera:</label>
              <select
                className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1D4ED8] font-medium text-slate-700"
                value={selectedCamera}
                onChange={e => setSelectedCamera(e.target.value)}
              >
                {cameras.map((cam, i) => (
                  <option key={cam.deviceId} value={cam.deviceId}>
                    {cam.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full bg-[#1D4ED8] text-white hover:bg-[#1e40af] py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Done Scanning
          </button>
        </div>
      </div>
    </div>
  );
}
