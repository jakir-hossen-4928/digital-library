import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/pages/Loading';
import { motion } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
}

interface Author {
  id: string;
  author: string;
  bio: string;
  profileUrl: string;
}

interface AuthorWithBooks {
  name: string;
  count: number;
}

const AdminOverview = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'authors'>('dashboard');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksResponse, authorsResponse] = await Promise.all([
          axios.get(`${backendUrl}/admin/books`),
          axios.get(`${backendUrl}/admin/authors`),
        ]);

        // Sort books and authors by id in descending order (last added first)
        const sortedBooks = booksResponse.data.sort((a: Book, b: Book) =>
          parseInt(b.id) - parseInt(a.id)
        );
        const sortedAuthors = authorsResponse.data.sort((a: Author, b: Author) =>
          parseInt(b.id) - parseInt(a.id)
        );

        setBooks(sortedBooks);
        setAuthors(sortedAuthors);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error fetching data');
        console.error('Fetch Error:', err.response || err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate totals
  const totalBooks = books.length;
  const totalAuthors = authors.length;

  // Calculate books per author
  const booksByAuthor: AuthorWithBooks[] = authors.map((author) => {
    const authorBooksCount = books.filter(
      (book) => book.author.toLowerCase() === author.author.toLowerCase()
    ).length;
    return {
      name: author.author,
      count: authorBooksCount,
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-8 text-red-500 font-semibold bg-red-50 rounded-lg mx-4 my-8 p-6 shadow"
    >
      {error}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto">
          <div className="bg-white p-1 rounded-xl shadow-md flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('authors')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'authors'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Authors
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* Summary Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              variants={containerVariants}
            >
              {/* Total Books */}
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Books</h2>
                    <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{totalBooks}</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Total Authors */}
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Authors</h2>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{totalAuthors}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Placeholder for Future Metric */}
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Active Users</h2>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">N/A</p>
                    <p className="text-xs text-gray-500 mt-1">Coming soon...</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Books by Author Section */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Books by Author
              </h2>
              {totalAuthors === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No authors available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Author Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Number of Books
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {booksByAuthor.map((item, index) => (
                        <motion.tr
                          key={index}
                          className="hover:bg-indigo-50 transition-colors duration-150"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {item.count}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'authors' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {authors.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg"
                variants={itemVariants}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">No authors available.</p>
              </motion.div>
            ) : (
              authors.map((author, index) => (
                <motion.div
                  key={author.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  variants={itemVariants}
                >
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    {author.profileUrl ? (
                      <img
                        src={author.profileUrl}
                        alt={author.author}
                        className="w-24 h-24 rounded-full object-cover absolute bottom-0 left-6 transform translate-y-1/2 border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 absolute bottom-0 left-6 transform translate-y-1/2 border-4 border-white shadow-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">{author.author.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-16 pb-6 px-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{author.author}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600">
                        {booksByAuthor.find(item => item.name === author.author)?.count || 0} books
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {author.bio || "No biography available."}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;