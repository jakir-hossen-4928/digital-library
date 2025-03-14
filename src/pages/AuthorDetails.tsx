import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BookCard } from "@/components/BookCard";
import Loading from "./Loading";
import { motion, AnimatePresence } from "framer-motion";
import { FiShare2, FiArrowLeft } from "react-icons/fi";


interface Author {
  id: string;
  author: string;
  bio: string;
  profileUrl: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
}

const AuthorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [authorsResponse, booksResponse] = await Promise.all([
          axios.get(`${backendUrl}/admin/authors`),
          axios.get(`${backendUrl}/admin/books`),
        ]);

        const decodedAuthorName = decodeURIComponent(id || "");
        const foundAuthor = authorsResponse.data.find(
          (a: Author) => a.author.toLowerCase() === decodedAuthorName.toLowerCase()
        );

        setAuthor(foundAuthor || null);

        if (foundAuthor) {
          const booksByAuthor = booksResponse.data
            .filter((book: Book) => book.author.toLowerCase() === foundAuthor.author.toLowerCase())
            .sort((a: Book, b: Book) => parseInt(b.id) - parseInt(a.id));
          setAuthorBooks(booksByAuthor);
        } else {
          setError(`Author "${decodedAuthorName}" not found`);
        }
      } catch (error) {
        console.error('Error fetching author details:', error);
        setError('Failed to load author details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const shareProfile = async () => {
    try {
      await navigator.share({
        title: `${author?.author}'s Profile`,
        text: `Check out ${author?.author}'s profile and books on our platform!`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };


  if (loading) return <Loading />;

  if (error) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4"
    >
      <div className="max-w-md text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 mx-auto hover:bg-gray-700 transition-colors"
        >
          <FiArrowLeft /> Back to Safety
        </button>
      </div>
    </motion.div>
  );

  if (!author) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Author Profile Section */}
        <section className="mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-8 p-8">
              {/* Author Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 mx-auto"
              >
                <img
                  src={author.profileUrl}
                  alt={author.author}
                  className="rounded-full object-cover w-full h-full shadow-lg border-4 border-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://source.unsplash.com/random/800x600/?portrait';
                  }}
                />
              </motion.div>

              {/* Author Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{author.author}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{author.bio}</p>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={shareProfile}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <FiShare2 /> Share Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Books Section */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex flex-wrap justify-between items-center gap-4"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Published Works
              <span className="text-gray-500 ml-3 text-xl">({authorBooks.length})</span>
            </h2>
          </motion.div>

          <AnimatePresence>
            {authorBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {authorBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BookCard
                      book={book}
                      variants={{
                        hover: { y: -8 },
                        tap: { scale: 0.95 }
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-200"
              >
                <p className="text-gray-500 text-lg">No books available yet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  );
};

export default AuthorDetails;