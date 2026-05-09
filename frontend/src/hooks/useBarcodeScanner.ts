import { useEffect, useRef } from 'react';

interface UseBarcodeScannerProps {
  onScan: (barcode: string) => void;
  // Delay between keystrokes to consider it a scanner (ms)
  // Scanners typically fire keystrokes with < 20-30ms delay
  delay?: number;
}

export function useBarcodeScanner({ onScan, delay = 200 }: UseBarcodeScannerProps) {
  const buffer = useRef('');
  const lastKeyTime = useRef(Date.now());
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key combinations
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const currentTime = Date.now();
      
      // If typing speed is slower than humanly possible for a scanner, clear the buffer
      if (currentTime - lastKeyTime.current > delay) {
        buffer.current = '';
      }
      lastKeyTime.current = currentTime;

      // Ensure we only process when the key is Enter
      if (e.key === 'Enter') {
        if (buffer.current.length > 3) {
          // It's likely a barcode scan
          onScanRef.current(buffer.current);
          buffer.current = '';
        }
      } else if (e.key.length === 1) { // Single character keys only
        buffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [delay]);
}
