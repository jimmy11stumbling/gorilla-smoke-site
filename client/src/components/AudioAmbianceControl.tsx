import { useState } from 'react';
import { useAudioAmbiance } from '@/hooks/use-audio-ambiance';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function AudioAmbianceControl() {
  const { 
    isPlaying, 
    volume, 
    isLoaded, 
    error, 
    toggleAudio, 
    setVolume 
  } = useAudioAmbiance();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };
  
  // Get appropriate icon based on volume level
  const getVolumeIcon = () => {
    if (volume === 0 || !isPlaying) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  // Don't render the control if audio isn't supported or not loaded
  if (error || !isLoaded) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-12 w-12 shadow-md bg-card/80 backdrop-blur-sm hover:bg-card border-primary/20 ${
                    isPlaying ? 'text-primary border-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => {
                    if (!isOpen) {
                      toggleAudio();
                    }
                  }}
                  disabled={!isLoaded}
                  aria-label={isPlaying ? "Turn off kitchen ambiance sounds" : "Turn on kitchen ambiance sounds"}
                >
                  {getVolumeIcon()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" side="top">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Kitchen Ambiance</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleAudio}
                      className="text-xs"
                    >
                      {isPlaying ? 'Turn Off' : 'Turn On'}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Volume</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      aria-label="Adjust volume"
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Experience the authentic sounds of a busy kitchen and restaurant ambiance!
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Kitchen Ambiance Sounds</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}