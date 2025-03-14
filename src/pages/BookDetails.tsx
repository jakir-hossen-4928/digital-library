import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ReadingSettings } from "@/components/ReadingSettings";
import { BookContent } from "@/components/BookContent";
import { BookHeader } from "@/components/BookHeader";
import Loading from "./Loading";

interface Book {
  id: string;
  title: string;
  author: string;
  content: string;
  coverImageUrl: string;
}

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Reading settings state
  const [fontSize, setFontSize] = useState(16);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${backendUrl}/admin/books`);
        const foundBook = response.data.find((b: Book) => b.id === id);
        setBook(foundBook);
        if (!foundBook) {
          toast({
            title: "Book not found",
            description: "The book you're looking for doesn't exist.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast({
          title: "Error",
          description: "Failed to load book details.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate, toast]);

  if (loading) return<Loading/>;
  if (!book) return null;

  return (
    <div className={`transition-colors duration-300 min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <BookHeader book={book} />
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            {/* <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="sticky top-8">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />

              </div>
            </div> */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <ReadingSettings
                fontSize={fontSize}
                setFontSize={setFontSize}
                alignment={alignment}
                setAlignment={setAlignment}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />
              <BookContent
                content={book.content}
                fontSize={fontSize}
                alignment={alignment}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;