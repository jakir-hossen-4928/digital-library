import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookCard } from "@/components/BookCard";
import { SearchBar } from "@/components/SearchBar";
import Loading from "./Loading";

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
}

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
        console.error('Error fetching books:', error);
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

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-4xl font-bold text-center mb-8">Digital Library</h1>
      <div className="mb-12">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Index;