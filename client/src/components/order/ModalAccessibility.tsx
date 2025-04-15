import { useEffect, useRef } from "react";

interface ModalAccessibilityProps {
  isOpen: boolean;
  onClose: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

/**
 * This component handles accessibility features for the modal:
 * - Focus trap within the modal
 * - Escape key to close
 * - Focus management on open/close
 * - ARIA attributes
 */
export function useModalAccessibility({ isOpen, onClose, modalRef }: ModalAccessibilityProps) {
  // Create ref for the close button to focus it when modal opens
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Store previous active element to restore focus when modal closes
  useEffect(() => {
    if (isOpen) {
      // Store the active element to restore focus later
      const previousActiveElement = document.activeElement as HTMLElement;
      
      // Focus the close button when the modal opens
      setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);
      
      // Set up clean-up function to restore focus when component unmounts or modal closes
      return () => {
        if (previousActiveElement) {
          previousActiveElement.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Trap focus inside the modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      // Get all focusable elements inside the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // If shift + tab and we're on the first element, move to the last
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab and we're on the last element, move to the first
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, modalRef]);

  return {
    closeButtonRef
  };
}