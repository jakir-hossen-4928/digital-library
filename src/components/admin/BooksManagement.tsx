import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Loading from '@/pages/Loading';
import { Trash2, Edit2, PlusCircle, X, Save, RefreshCw, Upload, BookOpen } from 'lucide-react';

const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    content: '',
    coverImageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { token } = useAuth();
  const { toast } = useToast();
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  const OPENROUTER_API_KEY = import.meta.env.VITE_MYSCHOOL_AI_API;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Only close if clicking on backdrop (not inside delete confirmation)
        if (!isDeleteModalOpen) {
          setIsModalOpen(false);
          resetForm();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, isDeleteModalOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksResponse, authorsResponse] = await Promise.all([
        axios.get('http://localhost:5000/admin/books'),
        axios.get('http://localhost:5000/admin/authors'),
      ]);

      // Sort books by id in descending order (last added first)
      const sortedBooks = booksResponse.data.sort((a, b) =>
        parseInt(b.id) - parseInt(a.id)
      );

      setBooks(sortedBooks);
      setAuthors(authorsResponse.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching data');
      console.error('Fetch Error:', err.response || err.message);
      setLoading(false);
    }
  };

  const enhanceContentWithAI = async () => {
    if (!formData.content) {
      toast({ title: 'Error', description: 'Please enter content to enhance.', variant: 'destructive' });
      return;
    }
    try {
      setAiLoading(true);

      // First update to show processing
      setFormData(prev => ({
        ...prev,
        content: prev.content + "\n\n[AI Enhancement in progress...]"
      }));
      adjustTextareaHeight();

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'E-Book Reader',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen/qwq-32b-preview:free',
          messages: [{ role: 'user', content: `Enhance this content: ${formData.content.replace("[AI Enhancement in progress...]", "")}` }],
        }),
      });

      const data = await response.json();
      const enhancedContent = data.choices[0].message.content;

      setFormData(prev => ({
        ...prev,
        content: enhancedContent
      }));

      adjustTextareaHeight();
      toast({
        title: 'AI Enhancement Complete',
        description: 'Content has been improved and enriched!',
        variant: 'success'
      });
      setAiLoading(false);
    } catch (err) {
      setError('Error enhancing content with AI');
      setFormData(prev => ({
        ...prev,
        content: prev.content.replace("[AI Enhancement in progress...]", "\n\n[AI Enhancement failed]")
      }));
      adjustTextareaHeight();
      setAiLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'content') adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async () => {
    if (!imageFile) return formData.coverImageUrl;
    setUploadingImage(true);

    const formDataImg = new FormData();
    formDataImg.append('image', imageFile);
    formDataImg.append('key', IMGBB_API_KEY);

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formDataImg);
      setUploadingImage(false);
      return response.data.data.url;
    } catch (err) {
      setError('Error uploading image to ImgBB');
      setUploadingImage(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('No authentication token available. Please log in.');
      return;
    }
    try {
      setLoading(true);

      // Only upload a new image if there's a file
      let coverImageUrl = formData.coverImageUrl;
      if (imageFile) {
        coverImageUrl = await uploadImageToImgBB();
        if (!coverImageUrl) throw new Error('Image upload failed');
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dataToSend = { ...formData, coverImageUrl };

      if (isEditing) {
        const response = await axios.put(`http://localhost:5000/admin/books/${formData.id}`, dataToSend, config);
        setBooks(books.map((book) => (book.id === formData.id ? response.data.book : book)));
        toast({
          title: 'Book Updated',
          description: `"${formData.title}" has been successfully updated!`,
          variant: 'success'
        });
      } else {
        const response = await axios.post('http://localhost:5000/admin/books', dataToSend, config);
        setBooks([response.data.book, ...books]);
        toast({
          title: 'Book Added',
          description: `"${formData.title}" has been successfully added to your library!`,
          variant: 'success'
        });
      }

      resetForm();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving book');
      setLoading(false);
    }
  };

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/admin/books/${bookToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      toast({
        title: 'Book Deleted',
        description: `"${bookToDelete.title}" has been removed from your library.`,
        variant: 'success'
      });
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting book');
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setFormData(book);
    setIsEditing(true);
    setIsModalOpen(true);
    setTimeout(adjustTextareaHeight, 0);
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', author: '', content: '', coverImageUrl: '' });
    setImageFile(null);
    setPreviewUrl('');
    setIsEditing(false);
    setError(null);
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
        } else if (isModalOpen) {
          setIsModalOpen(false);
          resetForm();
        }
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen, isDeleteModalOpen]);

  return (
    <div className="container mx-auto px-4 py-6 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <BookOpen className="mr-2 h-7 w-7 text-indigo-600" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Books Management
          </h2>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
          <div className="mr-2 mt-0.5">⚠️</div>
          <div>
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
          </div>
          <button
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => setError(null)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6 hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                    Cover
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">{book.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
                        <div className="font-medium truncate max-w-xs">{book.title}</div>
                        <div className="text-xs text-gray-500 md:hidden mt-1">{book.author}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6 hidden md:table-cell">{book.author}</td>
                      <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                        <div className="h-16 w-12 md:h-20 md:w-14 relative group">
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="h-full w-full object-cover rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium sm:px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(book)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No books available</p>
                        <p className="text-sm text-gray-400 mt-1">Add your first book to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Book Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 transform animate-fadeIn"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                {isEditing ? (
                  <>
                    <Edit2 className="h-5 w-5 mr-2 text-indigo-600" />
                    Edit Book
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-indigo-600" />
                    Add New Book
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter book title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                      <select
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      >
                        <option value="">Select an author</option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.author}>
                            {author.author}
                          </option>
                        ))}
                      </select>
                      {authors.length === 0 && (
                        <p className="text-sm text-amber-600 mt-1">No authors available. Please add an author first.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                      <div className="flex items-start space-x-4">
                        <div className="flex-grow">
                          <label
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="text-sm text-gray-500">Click to upload cover image</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                          </label>
                        </div>

                        <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                          {(previewUrl || formData.coverImageUrl) ? (
                            <img
                              src={previewUrl || formData.coverImageUrl}
                              alt="Cover Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <BookOpen className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <div className="relative h-full">
                        <textarea
                          ref={textareaRef}
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          placeholder="Enter book content or URL"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px] resize-none transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={enhanceContentWithAI}
                          disabled={aiLoading || loading}
                          className={`mt-2 px-4 py-2 rounded-lg text-white flex items-center space-x-2 transition-colors ${
                            aiLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {aiLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Enhancing...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4" />
                              <span>Enhance with AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsModalOpen(false);
                    }}
                    className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploadingImage || aiLoading}
                    className={`px-6 py-2 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${
                      loading || uploadingImage || aiLoading
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } transition-colors`}
                  >
                    {loading || uploadingImage ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>{uploadingImage ? 'Uploading...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{isEditing ? 'Update Book' : 'Add Book'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-center text-red-500 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
                <Trash2 className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-bold text-center mb-2">Delete Book</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <span className="font-semibold">"{bookToDelete?.title}"</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white flex items-center justify-center space-x-2 ${
                    loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  } transition-colors`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksManagement;