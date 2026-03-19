import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCamera, FaLock, FaTrash, FaBox, FaArrowLeft, 
  FaCog, FaExclamationTriangle, FaSignOutAlt, 
  FaRegEdit, FaCheckCircle, FaChevronRight, FaStore
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    if (!isEditingProfile) {
      try {
        const data = new FormData();
        data.append("first_name", profileForm.first_name);
        data.append("last_name", profileForm.last_name);
        data.append("phone_number", contactForm.phone_number);
        data.append("address", contactForm.address);
        data.append("profile_picture", file);

        await api.post("user/profile/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        showMessage("Profile picture updated!", "success");
        fetchProfile();
      } catch (err) {
        showMessage("Failed to update picture.", "error");
      }
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("first_name", profileForm.first_name);
      data.append("last_name", profileForm.last_name);
      data.append("phone_number", contactForm.phone_number);
      data.append("address", contactForm.address);
      if (selectedFile) data.append("profile_picture", selectedFile);

      await api.post("user/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showMessage("Profile updated successfully!", "success");
      setIsEditingProfile(false);
      fetchProfile();
    } catch (err) {
      showMessage("Failed to update profile.", "error");
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
      showMessage("Contact info updated!", "success");
      fetchProfile();
    } catch (err) {
      showMessage("Update failed.", "error");
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      await api.post("user/change-password/", passwordForm);
      showMessage("Password changed successfully!", "success");
      setPasswordForm({ current_password: "", new_password: "" });
    } catch (err) {
      showMessage(err.response?.data?.error || "Failed to change password.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("user/delete-account/");
      handleLogout();
    } catch (err) {
      showMessage("Failed to delete account.", "error");
      setShowDeleteConfirm(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50/50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  const userInitial = user?.first_name?.[0] || user?.username?.[0] || "?";

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />
      
      <main className="flex-grow container mx-auto max-w-[1440px] px-6 lg:px-10 py-10">
        
        {/* ─── DASHBOARD WRAPPER ─── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          {/* ─── LEFT SIDEBAR (STICKY) ─── */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-32 space-y-6">
            
            {/* User Quick Identity Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-light"></div>
              
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-1 shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[1.25rem] bg-white overflow-hidden flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    {user?.profile_picture ? (
                      <img 
                        src={`http://localhost:8000${user.profile_picture}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-primary uppercase">{userInitial}</span>
                    )}
                  </div>
                </div>
                <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-white shadow-xl border border-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-primary border-none">
                  <FaCamera size={14} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{user?.first_name} {user?.last_name}</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6">{user?.email}</p>

              <div className="h-[1px] bg-gray-50 w-full mb-6"></div>
              
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-gray-900 leading-none">0</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Orders</span>
                </div>
                <div className="w-[1px] h-6 bg-gray-100"></div>
                <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-gray-900 leading-none">0</span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Reviews</span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="bg-white p-3 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 space-y-1">
              {[
                { id: 'profile', icon: <FaUser />, label: 'My Profile' },
                { id: 'orders', icon: <FaBox />, label: 'Order History' },
                { id: 'settings', icon: <FaCog />, label: 'Account Settings' }
              ].map(nav => (
                <button 
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    activeTab === nav.id 
                    ? 'bg-primary/5 text-primary' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs">{nav.icon}</span>
                    {nav.label}
                  </div>
                  {activeTab === nav.id && <FaChevronRight size={10} className="animate-in fade-in slide-in-from-left-1" />}
                </button>
              ))}
              <div className="h-[1px] bg-gray-50 mx-4 my-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <FaSignOutAlt className="text-xs" /> Logout
              </button>
            </nav>
          </aside>

          {/* ─── MAIN CONTENT AREA ─── */}
          <div className="flex-grow min-w-0 relative">
            
            {/* Persistent Success/Error Popups */}
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 items-center pointer-events-none">
                {errorMSG && (
                    <div className="bg-white border-l-4 border-red-500 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4 animate-fade-up pointer-events-auto">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                            <FaExclamationTriangle />
                        </div>
                        <p className="text-sm font-black text-gray-900">{errorMSG}</p>
                    </div>
                )}
                {successMSG && (
                    <div className="bg-white border-l-4 border-primary shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-4 animate-fade-up pointer-events-auto">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <FaCheckCircle />
                        </div>
                        <p className="text-sm font-black text-gray-900">{successMSG}</p>
                    </div>
                )}
            </div>

            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <div className="animate-fade-up space-y-8">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Main Profile</h2>
                        <p className="text-gray-400 font-medium text-sm">Personal identity and account verification status.</p>
                    </div>
                    {!isEditingProfile && (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-white hover:border-primary/30 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                      >
                        <FaRegEdit /> Edit
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">First Name</label>
                        {isEditingProfile ? (
                          <input 
                            name="first_name" value={profileForm.first_name} onChange={handleProfileChange}
                            className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900"
                          />
                        ) : (
                          <div className="px-6 py-4 bg-gray-50/30 rounded-[1.25rem] font-black text-gray-900 border border-gray-50">{user?.first_name || "—"}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Last Name</label>
                        {isEditingProfile ? (
                          <input 
                            name="last_name" value={profileForm.last_name} onChange={handleProfileChange}
                            className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-gray-900"
                          />
                        ) : (
                          <div className="px-6 py-4 bg-gray-50/30 rounded-[1.25rem] font-black text-gray-900 border border-gray-50">{user?.last_name || "—"}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                      <div className="relative group">
                        <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-amber-500 transition-colors" />
                        <div className="w-full px-14 py-4 bg-gray-50/20 border border-gray-100 rounded-[1.25rem] font-black text-gray-400 cursor-not-allowed">
                          {user?.email}
                        </div>
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 bg-amber-50 text-amber-600 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-amber-100/50">Secondary Uneditable</span>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex gap-4 justify-end pt-6">
                        <button 
                          type="button"
                          onClick={() => { setIsEditingProfile(false); setSelectedFile(null); }}
                          className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all font-sans"
                        >
                          Discard
                        </button>
                        <button 
                          type="submit"
                          className="bg-gradient-to-r from-primary to-primary-light text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                        >
                          Update Profile
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm text-2xl">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-emerald-900">Verified Member</h4>
                            <p className="text-emerald-800/60 text-xs font-medium uppercase tracking-wider">Nepal Sports Alliance Active</p>
                        </div>
                     </div>
                     <Link to="/products" className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6 group hover:translate-x-1 transition-all no-underline">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white text-2xl">
                            <FaStore />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white">Marketplace</h4>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wider group-hover:text-primary-light transition-colors">Continue Discovery Journey →</p>
                        </div>
                     </Link>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
              <div className="animate-fade-up">
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[500px]">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">Order History</h2>
                    <p className="text-gray-400 font-medium text-sm mb-12">Tracking all your gear acquisitions and service history.</p>
                    
                    {loadingOrders ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <FaBox className="text-5xl text-gray-100 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">The Archive is Empty</h3>
                            <p className="text-gray-400 max-w-xs mx-auto text-sm font-medium mb-10">"Every athlete's journey begins with the first piece of equipment."</p>
                            <Link 
                                to='/products'
                                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest no-underline shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all inline-block"
                            >
                                Shop Gears Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order.id} className="group bg-gray-50/30 border border-gray-100 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500">
                                    <div className="h-24 w-24 bg-white rounded-2xl shadow-sm overflow-hidden p-2 group-hover:scale-105 transition-transform">
                                        {order.image ? (
                                            <img src={order.image} alt={order.product_name} className="h-full w-full object-cover rounded-xl"/>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-100 bg-gray-50"><FaBox size={32} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <span className="bg-gray-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">#{order.id}</span>
                                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{order.date}</span>
                                        </div>
                                        <h4 className="font-black text-gray-900 text-xl tracking-tight mb-1">{order.product_name}</h4>
                                        <p className="text-xs text-gray-400 font-bold flex items-center justify-center md:justify-start gap-2">
                                            <FaStore className="text-primary" /> SOLD BY {order.vendor_name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                                        <div className="text-2xl font-black text-gray-900">Rs. {Number(order.amount).toLocaleString()}</div>
                                        <span className={`px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm
                                            ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                            order.status === 'shipped' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                                            'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === "settings" && (
              <div className="animate-fade-up space-y-10">
                
                {/* Contact Settings Card */}
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Delivery Intelligence</h2>
                  <p className="text-gray-400 font-medium text-sm mb-10">Global shipping routes and contact verification points.</p>
                  
                  <form onSubmit={handleSaveContact} className="max-w-2xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Link</label>
                            <div className="relative group">
                                <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                <input 
                                    name="phone_number" value={contactForm.phone_number} onChange={handleContactChange}
                                    placeholder="e.g. +977-98..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Main Address</label>
                            <div className="relative group">
                                <FaMapMarkerAlt className="absolute left-6 top-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                                <textarea 
                                    name="address" value={contactForm.address} onChange={handleContactChange}
                                    rows="1" placeholder="City, Location..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white transition-all font-bold text-gray-900 resize-none h-[56px]"
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
                       Sync Details
                    </button>
                  </form>
                </div>

                {/* Password Box */}
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Security Vault</h2>
                  <p className="text-gray-400 font-medium text-sm mb-10">Advanced key management and security protocol updates.</p>
                  
                  <form onSubmit={handleSavePassword} className="max-w-2xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Legacy Key</label>
                            <div className="relative group">
                                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="password" name="current_password" value={passwordForm.current_password} onChange={handlePasswordChange}
                                    placeholder="Current Password"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Future Key</label>
                            <div className="relative group">
                                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange}
                                    placeholder="New Password"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.25rem] focus:outline-none focus:border-primary/20 focus:bg-white transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20">
                       Override Password
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/30 p-8 md:p-12 rounded-[2.5rem] border border-red-100">
                  <h2 className="text-xl font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-3">
                    <FaSignOutAlt /> Terminal Protocol
                  </h2>
                  <p className="text-gray-500 font-medium text-sm mb-10 max-w-xl">
                    "Deleting your account will result in permanent loss of all gear history, credits, and verification certificates. This action is irrevocable."
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-white border-2 border-red-100 text-red-500 hover:bg-red-500 hover:text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-100"
                    >
                      Initialize Deletion
                    </button>
                  ) : (
                    <div className="bg-white p-10 rounded-[2rem] border border-red-200 shadow-2xl animate-fade-in text-center max-w-md mx-auto">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
                        <FaExclamationTriangle size={32}/>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">FINAL WARNING</h3>
                      <p className="text-gray-400 font-medium text-sm mb-10">Are you absolutely sure you want to scrub your identity from GearUp Nepal?</p>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-100"
                        >
                          Confirm Permanent Wipe
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                        >
                          Maintain Account
                        </button>
                      </div>
                    </div>
                  )}
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
