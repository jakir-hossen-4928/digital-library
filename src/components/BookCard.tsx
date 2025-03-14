import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
  genre?: string;
  rating?: number;
  publishYear?: number;
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/books/${book.id}`} className="block">
      <Card
        className="overflow-hidden transition-all duration-300 h-full flex flex-col hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50 rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <CardHeader className="p-0 overflow-hidden">
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden">
              <img
                src={book.coverImageUrl || "/api/placeholder/300/400"}
                alt={book.title}
                className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </div>
          </CardHeader>
          {book.genre && (
            <Badge className="absolute top-2 right-2 bg-primary/80 hover:bg-primary backdrop-blur-sm text-xs">
              {book.genre}
            </Badge>
          )}
        </div>

        <CardContent className="flex-grow p-4 space-y-2">
          <h3 className="text-base sm:text-lg font-semibold line-clamp-2 leading-tight">{book.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">by {book.author}</p>
          {book.publishYear && (
            <p className="text-xs text-muted-foreground">{book.publishYear}</p>
          )}
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between items-center border-t border-border/50">
          <div className="flex items-center space-x-1">
            <BookOpen size={16} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Read now</span>
          </div>

          <div className="flex items-center">
            {book.rating && (
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.round(book.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};