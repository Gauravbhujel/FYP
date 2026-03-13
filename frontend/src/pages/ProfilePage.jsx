import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("user/profile/");
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        phone_number: response.data.phone_number || "",
        address: response.data.address || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("phone_number", formData.phone_number);
      data.append("address", formData.address);
      if (selectedFile) {
        data.append("profile_picture", selectedFile);
      }

      await api.post("user/profile/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700 rounded shadow-sm">
              {success}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 h-32 border-b border-gray-100"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 mb-8 px-4 gap-4">
                <div className="relative group">
                  <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center ring-4 ring-primary/5">
                    {user?.profile_picture ? (
                      <img 
                        src={`http://localhost:8000${user.profile_picture}`} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-4xl font-bold">
                        {user?.first_name?.[0] || user?.username?.[0] || "?"}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                      <span className="text-sm font-medium">Change Photo</span>
                    </label>
                  )}
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-primary hover:text-white hover:border-primary px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm active:scale-95"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-8 px-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user?.first_name} {user?.last_name || ""}
                  </h1>
                  <p className="text-gray-500 mt-1">@{user?.username}</p>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">First Name</label>
                        {isEditing ? (
                          <input 
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-4 py-1">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                              <FaUser className="text-sm" />
                            </div>
                            <p className="text-gray-900 font-medium">{user?.first_name}</p>
                          </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Last Name</label>
                        {isEditing ? (
                          <input 
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        ) : (
                          <div className="flex items-center gap-4 py-1">
                            <div className="bg-primary/5 p-2 rounded-lg text-primary">
                              <FaUser className="text-sm" />
                            </div>
                            <p className="text-gray-900 font-medium">{user?.last_name || "Not provided"}</p>
                          </div>
                        )}
                    </div>

                    <div className="space-y-2 opacity-80">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address (Non-editable)</label>
                      <div className="flex items-center gap-4 py-1">
                        <div className="bg-gray-100 p-2 rounded-lg text-gray-400">
                          <FaEnvelope className="text-sm" />
                        </div>
                        <p className="text-gray-500 font-medium italic">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                      {isEditing ? (
                        <input 
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          placeholder="+977-XXXXXXXXXX"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-4 py-1">
                          <div className="bg-primary/5 p-2 rounded-lg text-primary">
                            <FaPhone className="text-sm" />
                          </div>
                          <p className="text-gray-900 font-medium">{user?.phone_number || "Not provided"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Address</label>
                      {isEditing ? (
                        <textarea 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="1"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        />
                      ) : (
                        <div className="flex items-center gap-4 py-1">
                          <div className="bg-primary/5 p-2 rounded-lg text-primary">
                            <FaMapMarkerAlt className="text-sm" />
                          </div>
                          <p className="text-gray-900 font-medium">{user?.address || "Not provided"}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Role</label>
                        <div className="flex items-center gap-2">
                          <FaShieldAlt className="text-primary text-xs" />
                          <p className="text-gray-900 font-bold text-sm capitalize">{user?.role}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Member Since</label>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400 text-xs" />
                          <p className="text-gray-900 font-medium text-sm">
                            {user?.date_joined ? new Date(user.date_joined).getFullYear() : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
