
import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatusMessages } from './useStatusMessages';
import { StatusContent } from './StatusContent';
import { BannerBackground } from './BannerBackground';
import { CloseButton } from './CloseButton';

// Using memo to prevent unnecessary re-renders
export const StatusBanner: React.FC = memo(() => {
  const { 
    messages,
    currentIndex,
    isVisible,
    hasLoaded,
    isDismissed,
    setIsDismissed,
    currentMessage
  } = useStatusMessages();
  
  // Early return if banner should not be visible
  if (!hasLoaded || !isVisible || isDismissed || !messages || messages.length === 0) {
    return null;
  }

  // Safely extract message text with memoization
  const messageText = useMemo(() => {
    try {
      if (!currentMessage) return "";
      return typeof currentMessage === 'object' && currentMessage !== null 
        ? (currentMessage.text || "") 
        : String(currentMessage || "");
    } catch (error) {
      console.error("Error formatting message:", error);
      return "";
    }
  }, [currentMessage]);

  // If no valid message text, don't render
  if (!messageText) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="w-full overflow-hidden rounded-lg shadow-md max-w-7xl mx-auto h-28 sm:h-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <div 
          className="relative flex items-center h-full overflow-hidden bg-white"
          style={{ 
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            borderRadius: '10px',
            border: '1px solid #f0f0f0'
          }}
        >
          {/* Éléments abstraits en arrière-plan */}
          <BannerBackground />
          
          {/* Contenu défilant */}
          <div className="relative flex items-center justify-center w-full h-full px-4">
            <StatusContent message={messageText} />
          </div>
          
          {/* Bouton de fermeture */}
          <CloseButton onClose={() => setIsDismissed(true)} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

StatusBanner.displayName = 'StatusBanner';
