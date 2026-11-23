import React, { useEffect } from 'react';
import { useKharcha } from '../context/KharchaContext';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { toastMessage, hideToast } = useKharcha();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  if (!toastMessage) return null;

  return (
    <div id="toast-container" role="status" aria-live="polite">
      <CheckCircle size={16} />
      <span>{toastMessage}</span>
    </div>
  );
}
