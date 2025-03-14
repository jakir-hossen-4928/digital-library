import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookCard } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import Loading from "./Loading";
import { Book } from "@/components/BookCard";

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/books`);
        const sortedBooks = response.data.sort((a: Book, b: Book) =>
          parseInt(b.id) - parseInt(a.id)
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
    const lowercaseQuery = query.toLowerCase();
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery)
    );
    setFilteredBooks(filtered);
  };

  // Group books by author and limit to a few titles per author
  const authorsWithBooks = filteredBooks.reduce((acc, book) => {
    if (!acc[book.author]) {
      acc[book.author] = {
        author: book.author,
        books: [],
      };
    }
    acc[book.author].books.push(book);
    return acc;
  }, {} as { [key: string]: { author: string; books: Book[] } });

  // Limit to 3 book titles per author for display and assign ID
  const authorList = Object.values(authorsWithBooks).map((authorData) => ({
    ...authorData,
    books: authorData.books.slice(0, 3), // Show up to 3 books
    id: encodeURIComponent(authorData.author),
  }));

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Digital Library
      </h1>
      <div className="mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Authors Section */}
      <div className="mb-12">
        {/* <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Authors & Their Works
        </h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorList.map((authorData) => (
            <Link
              to={`/authors/${authorData.id}`}
              key={authorData.author}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {authorData.author}
                  </h3>
                </div>
                <div className="pl-2 border-l-2 border-indigo-100">
                  <ul className="text-sm text-gray-600 space-y-2">
                    {authorData.books.map((book) => (
                      <li key={book.id} className="truncate flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        {book.title}
                      </li>
                    ))}
                    {authorData.books.length < authorsWithBooks[authorData.author].books.length && (
                      <li className="text-xs text-gray-500 italic mt-1">
                        +{authorsWithBooks[authorData.author].books.length - authorData.books.length} more books
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-gray-600 hover:text-gray-800 text-sm font-medium inline-flex items-center">
                    See All Books
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Books Section */}
      {/* <div>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          All Books
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Index;