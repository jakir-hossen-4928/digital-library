import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
}

interface BookHeaderProps {
  book: Book;
}

export const BookHeader: React.FC<BookHeaderProps> = ({ book }) => {
  const handleShare = () => {
    // Create share content with book title, author, and image
    const shareText = `Check out "${book.title}" by ${book.author}`;

    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: shareText,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.log('Error copying:', err));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 pb-4 border-b border-gray-200"
    >
      {/* Top Navigation with Back Button and Share */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link to="/">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Library</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1 rounded-md px-3 py-1"
          title="Share this book"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>

      {/* Book Title & Author */}
      <div className="px-1">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{book.title}</h1>
        <Link
          to={`/authors/${encodeURIComponent(book.author)}`}
          className="text-primary hover:underline transition-colors inline-block"
        >
          by {book.author}
        </Link>
      </div>
    </motion.div>
  );
};