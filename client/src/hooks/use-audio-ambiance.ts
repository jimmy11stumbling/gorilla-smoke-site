import { useState, useEffect, useCallback, useRef } from 'react';

// Define audio sources
const AUDIO_SOURCES = [
  '/audio/kitchen-sizzle.mp3',
  '/audio/kitchen-dishes.mp3',
  '/audio/restaurant-chatter.mp3',
  '/audio/kitchen-ambiance.mp3'
];

interface AudioState {
  isPlaying: boolean;
  volume: number;
  isLoaded: boolean;
  error: boolean;
}

export function useAudioAmbiance() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    volume: 0.5, // Default volume at 50%
    isLoaded: false,
    error: false
  });
  
  // Use refs to persist audio elements between renders
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio on first mount
  useEffect(() => {
    // Check if browser supports Web Audio API
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.error("Web Audio API is not supported in this browser");
      setAudioState(prev => ({ ...prev, error: true }));
      return;
    }
    
    try {
      // Create audio elements and load sources
      AUDIO_SOURCES.forEach((src, index) => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = 0; // Start muted until we use the gain node
        
        // Handle load errors
        audio.onerror = () => {
          console.error(`Error loading audio file: ${src}`);
          setAudioState(prev => ({ ...prev, error: true }));
        };
        
        audioRefs.current[index] = audio;
      });
      
      // Create audio context
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      // Create master gain node for volume control
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = audioState.volume;
      masterGainRef.current.connect(audioContextRef.current.destination);
      
      // Connect all sources to the audio context
      const sourceNodes: MediaElementAudioSourceNode[] = [];
      audioRefs.current.forEach((audio, index) => {
        if (audioContextRef.current) {
          const source = audioContextRef.current.createMediaElementSource(audio);
          source.connect(masterGainRef.current!);
          sourceNodes[index] = source;
        }
      });
      
      setAudioState(prev => ({ ...prev, isLoaded: true }));
      
      // Cleanup function to disconnect and unload audio
      return () => {
        stopAudio();
        sourceNodes.forEach(source => {
          try {
            source.disconnect();
          } catch (e) {
            console.warn('Error disconnecting audio source', e);
          }
        });
        
        if (masterGainRef.current) {
          try {
            masterGainRef.current.disconnect();
          } catch (e) {
            console.warn('Error disconnecting gain node', e);
          }
        }
        
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {
            console.warn('Error closing audio context', e);
          }
        }
      };
    } catch (error) {
      console.error('Error initializing audio system:', error);
      setAudioState(prev => ({ ...prev, error: true }));
    }
  }, []);
  
  // Play all audio sources with staggered timing
  const playAudio = useCallback(() => {
    if (!audioState.isLoaded || audioState.error) return;
    
    // Resume audio context if it's suspended (needed for some browsers)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Play each audio source with a slight delay for a more natural effect
    audioRefs.current.forEach((audio, index) => {
      setTimeout(() => {
        try {
          // Some browsers require a user interaction before playing audio
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.warn('Audio play was prevented:', error);
            });
          }
        } catch (e) {
          console.warn('Error playing audio:', e);
        }
      }, index * 500); // Stagger by 500ms
    });
    
    setAudioState(prev => ({ ...prev, isPlaying: true }));
  }, [audioState.isLoaded, audioState.error]);
  
  // Stop all audio sources
  const stopAudio = useCallback(() => {
    audioRefs.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {
        console.warn('Error stopping audio:', e);
      }
    });
    
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  }, []);
  
  // Toggle playing state
  const toggleAudio = useCallback(() => {
    if (audioState.isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }, [audioState.isPlaying, playAudio, stopAudio]);
  
  // Set volume level (0-1)
  const setVolume = useCallback((volume: number) => {
    if (volume < 0 || volume > 1) {
      console.warn('Volume must be between 0 and 1');
      return;
    }
    
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
    
    setAudioState(prev => ({ ...prev, volume }));
  }, []);
  
  return {
    ...audioState,
    playAudio,
    stopAudio,
    toggleAudio,
    setVolume
  };
}

// For TypeScript compatibility
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}