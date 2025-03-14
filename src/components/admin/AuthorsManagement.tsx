import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Loading from '@/pages/Loading';
import {
  X,
  Upload,
  Trash2,
  Edit,
  Plus,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const AuthorsManagement = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    author: '',
    bio: '',
    profileUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const { token } = useAuth();
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/admin/authors`);
      const sortedAuthors = response.data.sort((a, b) =>
        parseInt(b.id) - parseInt(a.id)
      );
      setAuthors(sortedAuthors);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching authors');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async () => {
    if (!imageFile) return formData.profileUrl;

    setIsUploading(true);
    const imageFormData = new FormData();
    imageFormData.append('image', imageFile);
    imageFormData.append('key', IMGBB_API_KEY);

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', imageFormData);
      setIsUploading(false);
      return response.data.data.url;
    } catch (err) {
      setError('Error uploading image to ImgBB');
      setIsUploading(false);
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
      const profileUrl = await uploadImageToImgBB();
      if (imageFile && !profileUrl) throw new Error('Image upload failed');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dataToSend = { ...formData, profileUrl: profileUrl || formData.profileUrl };

      if (isEditing) {
        const response = await axios.put(`${backendUrl}/admin/authors/${formData.id}`, dataToSend, config);
        setAuthors(authors.map((a) => (a.id === formData.id ? response.data.author : a)));
        toast({
          title: 'Updated!',
          description: 'Author updated successfully.',
          variant: 'success'
        });
      } else {
        const response = await axios.post(`${backendUrl}/admin/authors`, dataToSend, config);
        setAuthors([response.data.author, ...authors]);
        toast({
          title: 'Success!',
          description: 'New author added successfully.',
          variant: 'success'
        });
      }

      resetForm();
      setIsModalOpen(false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving author');
      setLoading(false);
    }
  };

  const initiateDelete = (author) => {
    setAuthorToDelete(author);
    setDeleteConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!authorToDelete) return;

    try {
      setLoading(true);
      await axios.delete(`${backendUrl}/admin/authors/${authorToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthors(authors.filter((a) => a.id !== authorToDelete.id));
      toast({
        title: 'Deleted!',
        description: 'Author has been removed successfully.',
        variant: 'success'
      });
      setDeleteConfirmModalOpen(false);
      setAuthorToDelete(null);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting author');
      setLoading(false);
    }
  };

  const handleEdit = (author) => {
    setFormData(author);
    setIsEditing(true);
    setIsModalOpen(true);
    if (author.profileUrl) {
      setImagePreview(author.profileUrl);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', author: '', bio: '', profileUrl: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setError(null);
  };

  useEffect(() => {
    if (token) fetchAuthors();
  }, [token]);

  // Truncate long text for mobile view
  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          Authors Management
          {loading && !isModalOpen && (
            <Loader2 className="ml-3 h-5 w-5 animate-spin text-gray-500" />
          )}
        </h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Add Author</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading && !isModalOpen ? (
        <Loading />
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          {authors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="mb-4">No authors found</p>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Add your first author
              </button>
            </div>
          ) : (
            <>
              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile Image
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {authors.map((author) => (
                      <tr key={author.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {author.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {author.author}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          <div className="line-clamp-2">{author.bio || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {author.profileUrl ? (
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={author.profileUrl}
                                alt={author.author}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <button
                            onClick={() => handleEdit(author)}
                            disabled={loading}
                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 mr-4 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => initiateDelete(author)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view */}
              <div className="md:hidden divide-y divide-gray-200">
                {authors.map((author) => (
                  <div key={author.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {author.profileUrl ? (
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <img
                              src={author.profileUrl}
                              alt={author.author}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                            N/A
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{author.author}</h3>
                          <p className="text-xs text-gray-500">ID: {author.id}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(author)}
                          disabled={loading}
                          className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => initiateDelete(author)}
                          disabled={loading}
                          className="p-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <p className="line-clamp-2">{truncateText(author.bio) || 'No bio available'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Author Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isEditing ? 'Edit Author' : 'Add New Author'}
              </h3>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                disabled={loading || isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                  disabled={loading || isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter author bio"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y transition-colors"
                  disabled={loading || isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>

                <div className="mt-1 flex items-center gap-4">
                  {(imagePreview || formData.profileUrl) && (
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                      <img
                        src={imagePreview || formData.profileUrl}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <label
                      className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm font-medium ${
                        loading || isUploading
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-white text-indigo-600 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      <span>{imageFile ? 'Change Image' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        disabled={loading || isUploading}
                      />
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, or GIF. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="flex-1 px-6 py-2.5 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {loading || isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isUploading ? 'Uploading...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{isEditing ? 'Update Author' : 'Add Author'}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  disabled={loading || isUploading}
                  className="flex-1 px-6 py-2.5 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModalOpen && authorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the author "{authorToDelete.author}"?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirmModalOpen(false)}
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
        </div>
      )}
    </div>
  );
};

export default AuthorsManagement;