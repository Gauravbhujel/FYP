import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCamera, FaLock, FaTrash, FaBox, FaArrowLeft, 
  FaCog, FaExclamationTriangle 
} from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // profile, orders, settings
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Feedback messages
  const [errorMSG, setErrorMSG] = useState("");
  const [successMSG, setSuccessMSG] = useState("");

  // Forms State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: "", last_name: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  const [contactForm, setContactForm] = useState({ phone_number: "", address: "" });
  
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Delete Confirm State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const showMessage = (msg, type) => {
    if (type === "success") {
      setSuccessMSG(msg);
      setErrorMSG("");
    } else {
      setErrorMSG(msg);
      setSuccessMSG("");
    }
    setTimeout(() => {
      setSuccessMSG("");
      setErrorMSG("");
    }, 5000);
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get("user/profile/");
      setUser(response.data);
      setProfileForm({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
      });
      setContactForm({
        phone_number: response.data.phone_number || "",
        address: response.data.address || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      showMessage("Failed to load profile information.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.get("user/orders/");
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showMessage("Failed to load orders.", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("first_name", profileForm.first_name);
      data.append("last_name", profileForm.last_name);
      // Keep existing contact info so it's not overwritten as blank
      data.append("phone_number", contactForm.phone_number);
      data.append("address", contactForm.address);
      if (selectedFile) {
        data.append("profile_picture", selectedFile);
      }

      await api.post("user/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("Profile updated successfully!", "success");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      showMessage(err.response?.data?.error || "Failed to update profile.", "error");
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("first_name", profileForm.first_name);
      data.append("last_name", profileForm.last_name);
      data.append("phone_number", contactForm.phone_number);
      data.append("address", contactForm.address);

      await api.post("user/profile/", data);
      showMessage("Contact information updated successfully!", "success");
      fetchProfile();
    } catch (err) {
      showMessage("Failed to update contact info.", "error");
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current_password || !passwordForm.new_password) {
      showMessage("Please fill in both password fields.", "error");
      return;
    }
    try {
      await api.post("user/change-password/", passwordForm);
      showMessage("Password changed successfully!", "success");
      setPasswordForm({ current_password: "", new_password: "" });
    } catch (err) {
      showMessage(err.response?.data?.error || "Failed to change password.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("user/delete-account/");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      window.location.reload();
    } catch (err) {
      showMessage("Failed to delete account.", "error");
      setShowDeleteConfirm(false);
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Header & Back Button */}
        <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
          >
            <FaArrowLeft className="text-sm" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">My Account</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        
        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex flex-col items-center">
              <div className="relative h-20 w-20 rounded-full bg-white shadow-sm border-2 border-primary/20 overflow-hidden mb-3 flex items-center justify-center">
                {user?.profile_picture ? (
                  <img 
                    src={`http://localhost:8000${user.profile_picture}`} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-primary text-2xl font-bold uppercase">
                    {user?.first_name?.[0] || user?.username?.[0] || "?"}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-center">{user?.first_name} {user?.last_name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{user?.email}</p>
            </div>

            <nav className="flex-1 py-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-6 py-3 font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <FaUser /> Profile
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-6 py-3 font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <FaBox /> Order History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-6 py-3 font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <FaCog /> Settings
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10 relative">
            
            {/* Global Messages */}
            {errorMSG && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded shadow-md z-10 text-sm font-medium flex items-center gap-2">
                <FaExclamationTriangle /> {errorMSG}
              </div>
            )}
            {successMSG && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded shadow-md z-10 text-sm font-medium">
                ✅ {successMSG}
              </div>
            )}


            {/* ======================= PROFILE TAB ======================= */}
            {activeTab === "profile" && (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
                  {!isEditingProfile && (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="text-sm font-semibold text-primary hover:text-emerald-700 transition"
                    >
                      Edit Basic Info
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSaveProfile}>
                  <div className="flex flex-col sm:flex-row gap-8 mb-8">
                    {/* Picture Update Area */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group h-28 w-28 rounded-full border-4 border-slate-100 bg-slate-50 shadow-sm overflow-hidden flex items-center justify-center">
                        {user?.profile_picture ? (
                          <img 
                            src={`http://localhost:8000${user.profile_picture}`} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUser className="text-4xl text-slate-300" />
                        )}
                        {isEditingProfile && (
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <FaCamera className="text-xl mb-1" />
                            <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                          </label>
                        )}
                      </div>
                      {isEditingProfile && selectedFile && (
                        <span className="text-xs text-primary font-medium">{selectedFile.name}</span>
                      )}
                    </div>

                    {/* Basic Info Fields */}
                    <div className="flex-1 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                          {isEditingProfile ? (
                            <input 
                              name="first_name" value={profileForm.first_name} onChange={handleProfileChange}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition"
                            />
                          ) : (
                            <p className="text-slate-800 font-medium py-2">{user?.first_name || "-"}</p>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                          {isEditingProfile ? (
                            <input 
                              name="last_name" value={profileForm.last_name} onChange={handleProfileChange}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition"
                            />
                          ) : (
                            <p className="text-slate-800 font-medium py-2">{user?.last_name || "-"}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-slate-300" />
                          <p className="text-slate-500 font-medium">{user?.email}</p>
                        </div>
                        <p className="text-[10px] text-slate-400">(Email address cannot be changed)</p>
                      </div>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setSelectedFile(null);
                        }}
                        className="px-5 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition shadow-sm"
                      >
                        Save Profile
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}


            {/* ======================= ORDERS TAB ======================= */}
            {activeTab === "orders" && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Order History</h2>
                
                {loadingOrders ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-100">
                    <FaBox className="text-5xl text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No Orders Yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mt-2">Looks like you haven't made any purchases yet. Start shopping to see your orders here!</p>
                    <button 
                      onClick={() => navigate('/products')}
                      className="mt-6 text-primary font-semibold hover:underline"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center hover:border-primary/40 transition bg-white shadow-sm">
                        <div className="h-20 w-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {order.image ? (
                           <img src={order.image} alt={order.product_name} className="h-full w-full object-cover"/>
                          ) : (
                           <div className="h-full w-full flex items-center justify-center text-slate-300"><FaBox /></div>
                          )}
                        </div>
                        <div className="flex-1 my-auto text-center md:text-left">
                          <h4 className="font-bold text-slate-800 text-lg">{order.product_name}</h4>
                          <p className="text-sm text-slate-500">Sold by {order.vendor_name}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm justify-center md:justify-start">
                             <span className="font-medium">Order: <span className="text-slate-600">{order.id}</span></span>
                             <span className="font-medium">Date: <span className="text-slate-600">{order.date}</span></span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end justify-center gap-2">
                           <span className="font-bold text-lg text-slate-800">Rs. {order.amount.toFixed(2)}</span>
                           <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider
                             ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                               order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                               'bg-yellow-100 text-yellow-700'}`}>
                             {order.status}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}


            {/* ======================= SETTINGS TAB ======================= */}
            {activeTab === "settings" && (
              <div className="animate-fadeIn space-y-10">
                
                {/* Contact Settings */}
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Contact Information</h2>
                  <p className="text-sm text-slate-500 mb-5">Update where your orders should be delivered and how we contact you.</p>
                  
                  <form onSubmit={handleSaveContact} className="max-w-md space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                        <input 
                          name="phone_number" value={contactForm.phone_number} onChange={handleContactChange}
                          placeholder="e.g. +977-9800000000"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Delivery Address</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-slate-400 text-sm" />
                        <textarea 
                          name="address" value={contactForm.address} onChange={handleContactChange}
                          rows="2" placeholder="Street layout, city, country"
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition resize-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                       Update Contact Info
                    </button>
                  </form>
                </div>

                <hr className="border-slate-100" />

                {/* Password Settings */}
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Change Password</h2>
                  <p className="text-sm text-slate-500 mb-5">Ensure your account is using a long, random password to stay secure.</p>
                  
                  <form onSubmit={handleSavePassword} className="max-w-md space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Current Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                        <input 
                          type="password" name="current_password" value={passwordForm.current_password} onChange={handlePasswordChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">New Password</label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                        <input 
                          type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary transition"
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                       Update Password
                    </button>
                  </form>
                </div>

                <hr className="border-slate-100 border-2 border-dashed" />

                {/* Advanced Settings -> Delete */}
                <div>
                  <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2"><FaTrash /> Advanced Settings</h2>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-5 max-w-xl">
                    <h3 className="font-bold text-slate-800 mb-1">Delete Account</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain. All your data including order history and wishlist will be permanently removed.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="border border-red-300 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm animate-fadeIn">
                        <p className="font-bold text-red-600 mb-3"><FaExclamationTriangle className="inline mr-1"/> Are you absolutely sure?</p>
                        <p className="text-xs text-slate-500 mb-4">This action cannot be undone. This will permanently delete your account.</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold transition"
                          >
                            Yes, Delete Account
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm font-bold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
