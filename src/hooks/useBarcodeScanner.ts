'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface BarcodeScannerState {
  status: 'idle' | 'requesting-permission' | 'scanning' | 'error' | 'no-camera';
  error: string | null;
  lastBarcode: string | null;
}

export interface BarcodeScannerControls {
  start: (videoElement: HTMLVideoElement) => Promise<void>;
  stop: () => void;
  toggleFlashlight: () => Promise<void>;
  isFlashlightOn: boolean;
  isFlashlightSupported: boolean;
}

export function useBarcodeScanner(
  onDetected: (barcode: string) => void
): [BarcodeScannerState, BarcodeScannerControls] {
  const [state, setState] = useState<BarcodeScannerState>({
    status: 'idle',
    error: null,
    lastBarcode: null,
  });
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isFlashlightSupported, setIsFlashlightSupported] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<unknown>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onDetectedRef = useRef(onDetected);
  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scannerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scanner = scannerRef.current as any;
      if (scanner.stop) {
        scanner.stop().catch(() => {});
      }
      scannerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsFlashlightOn(false);
    setState((prev) => ({ ...prev, status: 'idle' }));
  }, []);

  const start = useCallback(
    async (videoElement: HTMLVideoElement) => {
      videoRef.current = videoElement;

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setState({ status: 'no-camera', error: 'No camera available on this device.', lastBarcode: null });
        return;
      }

      setState((prev) => ({ ...prev, status: 'requesting-permission' }));

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        streamRef.current = stream;
        videoElement.srcObject = stream;
        await videoElement.play();

        // Check flashlight support
        const track = stream.getVideoTracks()[0];
        if (track) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const capabilities = track.getCapabilities() as any;
          if (capabilities && capabilities.torch) {
            setIsFlashlightSupported(true);
          }
        }

        setState((prev) => ({ ...prev, status: 'scanning' }));

        // Use html5-qrcode for barcode detection
        const { Html5Qrcode } = await import('html5-qrcode');

        // Create a container for html5-qrcode (it needs a DOM element)
        const containerId = 'barcode-scanner-container';
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.display = 'none';
          document.body.appendChild(container);
        }

        const scanner = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 160 },
            aspectRatio: 1.75,
          },
          (decodedText: string) => {
            // Only accept EAN-13 (13 digits) and EAN-8 (8 digits)
            if (/^\d{8}$|^\d{13}$/.test(decodedText)) {
              setState((prev) => ({ ...prev, lastBarcode: decodedText }));
              onDetectedRef.current(decodedText);
              stop();
            }
          },
          () => {
            // Scan failure (no barcode found in frame) — ignore
          }
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error && err.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera access in your browser settings.'
            : err instanceof Error
              ? err.message
              : 'Unable to start camera.';
        setState({ status: 'error', error: errorMessage, lastBarcode: null });
      }
    },
    [stop]
  );

  const toggleFlashlight = useCallback(async () => {
    if (!streamRef.current || !isFlashlightSupported) return;

    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    const newState = !isFlashlightOn;
    try {
      await track.applyConstraints({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        advanced: [{ torch: newState } as any],
      });
      setIsFlashlightOn(newState);
    } catch {
      // Flashlight toggle failed silently
    }
  }, [isFlashlightOn, isFlashlightSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      // Remove the hidden container
      const container = document.getElementById('barcode-scanner-container');
      if (container) {
        container.remove();
      }
    };
  }, [stop]);

  return [
    state,
    { start, stop, toggleFlashlight, isFlashlightOn, isFlashlightSupported },
  ];
}
