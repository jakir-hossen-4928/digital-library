import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import Loading from "./Loading";
import { Book } from "@/components/BookCard";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // For animations

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/books`);
        const sortedBooks = response.data.sort((a: Book, b: Book) =>
          parseInt(b.id) - parseInt(a.id) // Last added books first (already correct)
        );
        setBooks(sortedBooks);
        setFilteredBooks(sortedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query
    const lowercaseQuery = query.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredBooks(filtered);
  };

  // Group books by author and limit to a few titles per author
  const authorsWithBooks = books.reduce((acc, book) => {
    if (!acc[book.author]) {
      acc[book.author] = {
        author: book.author,
        books: [],
      };
    }
    acc[book.author].books.push(book);
    return acc;
  }, {} as { [key: string]: { author: string; books: Book[] } });

  // Limit to 3 book titles per author for display and assign a unique ID
  const authorList = Object.values(authorsWithBooks).map((authorData) => ({
    ...authorData,
    books: authorData.books.slice(0, 3), // Show up to 3 books
    id: encodeURIComponent(authorData.author),
  }));

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 ">
        Digital Library
      </h1>
      <div className="mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Author Section (Hidden during search) */}
      <AnimatePresence>
        {searchQuery === "" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
              Authors & Their Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorList.map((authorData) => (
                <motion.div
                  key={authorData.author}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link to={`/authors/${authorData.id}`} className="block">


<div className="bg-yellow-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
  <h3 className="text-lg font-semibold text-gray-800 mb-3">
    {authorData.author}
  </h3>
  <ul className="text-sm text-gray-600 space-y-2">
    {authorData.books.map((book) => (
      <li key={book.id} className="truncate flex items-center">
        <BookOpen  className="h-4 w-4 mr-2" />
        {book.title}
      </li>
    ))}
  </ul>
  <button className="mt-3 text-gray-900 hover:text-gray-800 text-sm flex items-center">
    See More
    <ArrowRight className="ml-1 h-4 w-4" />
  </button>
</div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Card Section */}
      <div>
        {searchQuery && (
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
            Search Results
          </h2>
        )}
        {filteredBooks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-600">
              No books found matching your search.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Try a different search term or explore authors above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;