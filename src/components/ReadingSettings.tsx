import React from "react";
import { AlignCenter, AlignLeft, AlignRight, Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ReadingSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  alignment: "left" | "center" | "right";
  setAlignment: (alignment: "left" | "center" | "right") => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 p-3 bg-secondary/80 rounded-lg mb-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.max(fontSize - 1, 12))}
              disabled={fontSize <= 12}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Decrease Font Size</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.min(fontSize + 1, 24))}
              disabled={fontSize >= 24}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Increase Font Size</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="h-6 w-0.5 bg-border mx-1"></div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={alignment === "left" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setAlignment("left")}
            >
              <AlignLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={alignment === "center" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setAlignment("center")}
            >
              <AlignCenter className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={alignment === "right" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setAlignment("right")}
            >
              <AlignRight className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="h-6 w-0.5 bg-border mx-1"></div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDarkMode ? "Light Mode" : "Dark Mode"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};