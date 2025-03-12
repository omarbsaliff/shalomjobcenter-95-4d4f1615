
import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

export const useStatusMessages = () => {
  const { loadData } = useLocalStorage();
  const [messages, setMessages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Use refs to prevent infinite re-renders and track initialization
  const loadedRef = useRef(false);
  const initializedRef = useRef(false);

  // Fonction pour charger les messages du stockage local
  const loadMessages = useCallback(() => {
    try {
      if (loadedRef.current) return; // Prevent multiple initial loads
      
      // Try loading admin status messages first
      const storedMessages = loadData('admin-status-messages', []);
      let adminMessages = Array.isArray(storedMessages) ? storedMessages : [];
      
      // Also try to load user statuses as a fallback
      const userStatuses = loadData('user-statuses', []);
      
      // Convert user statuses to the same format if needed
      const convertedUserStatuses = Array.isArray(userStatuses) ? userStatuses.map((status: any) => ({
        id: String(status.id || Date.now()),
        text: status.content || '',
        imageUrl: status.image || '',
        createdAt: status.timestamp instanceof Date ? status.timestamp.toISOString() : new Date().toISOString(),
        active: true,
        type: 'info',
        backgroundColor: '#3498db',
        textColor: '#ffffff'
      })) : [];
      
      // Combine both sources of statuses
      let allMessages = [...adminMessages];
      
      // Only add converted user statuses if they don't duplicate admin messages
      convertedUserStatuses.forEach((userStatus: any) => {
        if (!allMessages.some(msg => String(msg.id) === String(userStatus.id))) {
          allMessages.push(userStatus);
        }
      });
      
      // Filter for active messages only
      const activeMessages = allMessages.filter((msg: any) => {
        // Safety check for message structure
        if (!msg) return false;
        
        // Check if message is active
        const isActive = msg.active !== false;
        
        // Check if message has a createdAt date
        if (!msg.createdAt) return isActive;
        
        // Check if message is less than 24 hours old
        try {
          const createdAt = new Date(msg.createdAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          const isRecent = hoursDiff < 24;
          return isActive && isRecent;
        } catch (e) {
          console.error("Error parsing date:", e);
          return isActive;
        }
      });
      
      setMessages(activeMessages);
      setIsVisible(activeMessages.length > 0 && !isDismissed);
      
      if (activeMessages.length > 0 && currentIndex >= activeMessages.length) {
        setCurrentIndex(0);
      }
      
      setHasLoaded(true);
      loadedRef.current = true; // Mark as loaded
      
      console.info("Statuts actifs chargés:", activeMessages.length);
    } catch (error) {
      console.error("Erreur lors du chargement des messages de statut:", error);
      setMessages([]);
      setIsVisible(false);
      setHasLoaded(true);
      loadedRef.current = true; // Mark as loaded even on error
    }
  }, [loadData, currentIndex, isDismissed]);

  // Charger les messages au montage du composant
  useEffect(() => {
    // Only run initialization once
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    // Wrapping in try-catch for added safety
    try {
      loadMessages();
      
      // Ajouter un écouteur d'événement pour les mises à jour du stockage
      const handleStorageChange = (e: StorageEvent) => {
        // Only reload if relevant storage items change
        if (e.key === 'admin-status-messages' || e.key === 'user-statuses') {
          loadedRef.current = false; // Reset loaded state to allow reloading
          loadMessages();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      // Check for new messages every minute
      const intervalId = setInterval(() => {
        loadedRef.current = false; // Reset loaded state to allow reloading
        loadMessages();
      }, 60000);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(intervalId);
      };
    } catch (error) {
      console.error("Error in useEffect:", error);
      setHasLoaded(true); // Ensure loading state is completed even on error
    }
  }, [loadMessages]);

  // Fonction pour passer au message suivant
  const nextMessage = useCallback(() => {
    if (messages.length > 1) {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }
  }, [messages.length]);

  // Fonction pour masquer la bannière
  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
  }, []);

  // Safe getter for current message with type checking
  const getCurrentMessage = () => {
    try {
      if (!messages || messages.length === 0 || currentIndex >= messages.length) {
        return null;
      }
      return messages[currentIndex];
    } catch (error) {
      console.error("Error getting current message:", error);
      return null;
    }
  };

  return {
    currentMessage: getCurrentMessage(),
    hasMessages: messages.length > 0,
    isVisible,
    hasLoaded,
    isDismissed,
    setIsDismissed,
    messages,
    currentIndex,
    nextMessage,
    dismissBanner
  };
};
