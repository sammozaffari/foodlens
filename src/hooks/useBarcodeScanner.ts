'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface BarcodeScannerState {
  status: 'idle' | 'requesting-permission' | 'scanning' | 'error' | 'no-camera';
  error: string | null;
  lastBarcode: string | null;
}

export interface BarcodeScannerControls {
  start: (containerId: string) => Promise<void>;
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

  const scannerRef = useRef<unknown>(null);
  const onDetectedRef = useRef(onDetected);
  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const stop = useCallback(() => {
    if (scannerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scanner = scannerRef.current as any;
      if (scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
      scannerRef.current = null;
    }
    setIsFlashlightOn(false);
    setIsFlashlightSupported(false);
    setState((prev) => ({ ...prev, status: 'idle' }));
  }, []);

  const start = useCallback(
    async (containerId: string) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setState({ status: 'no-camera', error: 'No camera available on this device.', lastBarcode: null });
        return;
      }

      setState((prev) => ({ ...prev, status: 'requesting-permission' }));

      try {
        // Check camera permission first without keeping the stream
        const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
        testStream.getTracks().forEach((track) => track.stop());

        // Let html5-qrcode manage the single camera stream
        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = scanner;

        setState((prev) => ({ ...prev, status: 'scanning' }));

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
            // No barcode found in frame — ignore
          }
        );

        // Check flashlight support from the scanner's active stream
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const runningState = (scanner as any).getRunningTrackSettings?.();
        if (runningState) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const capabilities = (scanner as any).getRunningTrackCameraCapabilities?.();
          if (capabilities?.torchFeature?.isSupported?.()) {
            setIsFlashlightSupported(true);
          }
        }
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
    if (!scannerRef.current || !isFlashlightSupported) return;

    const newState = !isFlashlightOn;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scanner = scannerRef.current as any;
      const capabilities = scanner.getRunningTrackCameraCapabilities?.();
      if (capabilities?.torchFeature) {
        await capabilities.torchFeature.apply(newState);
        setIsFlashlightOn(newState);
      }
    } catch {
      // Flashlight toggle failed silently
    }
  }, [isFlashlightOn, isFlashlightSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return [
    state,
    { start, stop, toggleFlashlight, isFlashlightOn, isFlashlightSupported },
  ];
}
