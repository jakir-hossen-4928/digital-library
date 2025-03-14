import React, { useState, useRef, useEffect } from "react";
import { Search, X, History, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  onSearch,
  suggestions = [],
  recentSearches = [],
  placeholder = "Search books by title or author...",
  className = ""
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchValue(query);
    onSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Only show suggestions if there's input and suggestions are available
    if (value && (suggestions.length > 0 || recentSearches.length > 0)) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className={`
        relative flex items-center overflow-hidden transition-all duration-300
        rounded-full bg-background border
        ${isFocused ? 'border-primary shadow-md' : 'border-input'}
      `}>
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}
        />

        <Input
          ref={inputRef}
          type="text"
          value={searchValue}
          placeholder={placeholder}
          className="flex-1 border-0 pl-10 pr-12 py-6 h-10 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full hover:bg-muted"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}

       
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (searchValue || recentSearches.length > 0) && (
        <div className="absolute w-full mt-1 bg-background rounded-md shadow-lg border border-border z-10 max-h-64 overflow-y-auto">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-1 px-2">Recent Searches</h3>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  className="flex items-center gap-2 text-sm w-full px-3 py-1.5 hover:bg-muted rounded-md text-left"
                  onClick={() => handleSearch(search)}
                >
                  <History className="h-3 w-3 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-1 px-2">Suggestions</h3>
              {suggestions
                .filter(suggestion => suggestion.toLowerCase().includes(searchValue.toLowerCase()))
                .map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    className="flex items-center gap-2 text-sm w-full px-3 py-1.5 hover:bg-muted rounded-md text-left"
                    onClick={() => handleSearch(suggestion)}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    {suggestion}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};