'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Body, Heading3 } from '@/components/atoms';
import { Card } from '@/components/atoms';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';

interface ScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  className?: string;
}

interface ManualEntryFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

function ManualEntryForm({ value, onChange, onSubmit, inputRef }: ManualEntryFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      role="form"
      aria-label="Manual barcode entry"
      className="flex gap-2 w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter barcode number"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={13}
        fullWidth
      />
      <Button type="submit" size="md">Look up</Button>
    </form>
  );
}

export function Scanner({ onScan, onClose, className }: ScannerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const manualInputRef = useRef<HTMLInputElement>(null);

  const [state, controls] = useBarcodeScanner(onScan);

  // Focus management
  useEffect(() => {
    if (showManualEntry && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [showManualEntry]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Start scanning on mount if idle
  useEffect(() => {
    if (state.status === 'idle' && videoRef.current) {
      controls.start(videoRef.current);
    }
  }, [state.status, controls]);

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onScan(manualBarcode.trim());
    }
  };

  // Permission request / idle state
  if (state.status === 'idle' || state.status === 'requesting-permission') {
    return (
      <div className={`fixed inset-0 bg-overlay flex items-center justify-center p-4 z-50 ${className || ''}`}>
        <Card variant="elevated" padding="lg" className="max-w-sm w-full text-center space-y-4">
          <Heading3>Camera Access Needed</Heading3>
          <Body className="text-text-muted">
            FoodLens needs camera access to scan barcodes on food products. Your camera feed is processed on your device and never sent to our servers.
          </Body>
          <div className="space-y-2">
            <Button
              fullWidth
              onClick={() => {
                if (videoRef.current) controls.start(videoRef.current);
              }}
            >
              Allow Camera Access
            </Button>
            <Button variant="ghost" fullWidth onClick={() => router.push('/search')}>
              Search Instead
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setShowManualEntry(true)}>
              Enter Barcode Manually
            </Button>
          </div>
          {showManualEntry && (
            <div className="mt-4">
              <ManualEntryForm
                value={manualBarcode}
                onChange={setManualBarcode}
                onSubmit={handleManualSubmit}
                inputRef={manualInputRef}
              />
            </div>
          )}
        </Card>
        {/* Hidden video element for permission request */}
        <video ref={videoRef} className="hidden" playsInline muted aria-hidden="true" />
      </div>
    );
  }

  // Error state
  if (state.status === 'error') {
    return (
      <div className={`fixed inset-0 bg-overlay flex items-center justify-center p-4 z-50 ${className || ''}`}>
        <Card variant="elevated" padding="lg" className="max-w-sm w-full text-center space-y-4">
          <Heading3>Camera Not Available</Heading3>
          <Body className="text-text-muted">{state.error}</Body>
          <div className="space-y-2">
            <Button fullWidth onClick={() => router.push('/search')}>
              Search by Name
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setShowManualEntry(true)}>
              Enter Barcode Manually
            </Button>
          </div>
          {showManualEntry && (
            <div className="mt-4">
              <ManualEntryForm
                value={manualBarcode}
                onChange={setManualBarcode}
                onSubmit={handleManualSubmit}
                inputRef={manualInputRef}
              />
            </div>
          )}
        </Card>
      </div>
    );
  }

  // No camera state
  if (state.status === 'no-camera') {
    return (
      <div className={`fixed inset-0 bg-overlay flex items-center justify-center p-4 z-50 ${className || ''}`}>
        <Card variant="elevated" padding="lg" className="max-w-sm w-full text-center space-y-4">
          <Heading3>No Camera Detected</Heading3>
          <Body className="text-text-muted">
            No camera detected. You can search for products by name or enter a barcode number directly.
          </Body>
          <div className="space-y-2">
            <Button fullWidth onClick={() => router.push('/search')}>
              Search by Name
            </Button>
            <Button variant="secondary" fullWidth onClick={() => setShowManualEntry(true)}>
              Enter Barcode Manually
            </Button>
          </div>
          {showManualEntry && (
            <div className="mt-4">
              <ManualEntryForm
                value={manualBarcode}
                onChange={setManualBarcode}
                onSubmit={handleManualSubmit}
                inputRef={manualInputRef}
              />
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Scanning state
  return (
    <div className={`fixed inset-0 bg-black flex flex-col z-50 ${className || ''}`}>
      {/* Video feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        aria-hidden="true"
      />

      {/* Scan region overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[280px] h-[160px] border-2 border-white rounded-lg opacity-80" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Close scanner"
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 mt-auto p-4 bg-background/80 backdrop-blur-sm">
        {showManualEntry ? (
          <ManualEntryForm
            value={manualBarcode}
            onChange={setManualBarcode}
            onSubmit={handleManualSubmit}
            inputRef={manualInputRef}
          />
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowManualEntry(true)}
              className="text-sm text-primary font-medium cursor-pointer"
            >
              Enter manually
            </button>
            {controls.isFlashlightSupported && (
              <button
                onClick={controls.toggleFlashlight}
                aria-label="Toggle flashlight"
                aria-pressed={controls.isFlashlightOn}
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10 2v2M10 16v2M4 10H2M18 10h-2M5.64 5.64L4.22 4.22M15.78 15.78l-1.42-1.42M5.64 14.36l-1.42 1.42M15.78 4.22l-1.42 1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
