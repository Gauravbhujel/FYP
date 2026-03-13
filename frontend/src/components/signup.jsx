import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const [accountType, setAccountType] = useState("customer");
  const navigate = useNavigate();

  // Fields sent to backend
  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Security
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User created successfully 🎉");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      alert("Failed to connect to backend. Is Django running?");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-5">
      <div className="w-full max-w-[900px] bg-white rounded-xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2.5 mb-5">
          <h2 className="text-3xl font-bold m-0">GearUp Nepal</h2>
        </div>

        <h3 className="text-2xl font-bold mb-1 m-0 pointer-events-none">
          Create Your Account
        </h3>
        <p className="text-[#555] mb-6">Join our multi-vendor marketplace</p>

        <form onSubmit={handleSubmit}>
          {/* --- Personal Information --- */}
          <h4 className="text-left text-base font-bold text-primary mt-5 mb-4 border-b border-[#eee] pb-1.5">
            Personal Information
          </h4>
          <div className="flex flex-col md:flex-row gap-5 mb-4">
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">First Name</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaUser className="text-lg text-[#6c757d]" />
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">Last Name</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaUser className="text-lg text-[#6c757d]" />
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 mb-4">
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">Email Address</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaEnvelope className="text-lg text-[#6c757d]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">Phone Number</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaPhone className="text-lg text-[#6c757d]" />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
          </div>

          {/* --- Account Security --- */}
          <h4 className="text-left text-base font-bold text-primary mt-5 mb-4 border-b border-[#eee] pb-1.5">
            Account Security
          </h4>
          <div className="flex-1 flex flex-col mb-4">
            <label className="mb-1.5 font-medium">Username</label>
            <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
              <FaUser className="text-lg text-[#6c757d]" />
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-none outline-none bg-transparent w-full ml-2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 mb-4">
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">Password</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaLock className="text-lg text-[#6c757d]" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1.5 font-medium">Confirm Password</label>
              <div className="flex items-center bg-[#f1f3f5] p-2.5 rounded-lg border border-transparent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
                <FaLock className="text-lg text-[#6c757d]" />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-none outline-none bg-transparent w-full ml-2"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
            <input type="checkbox" required className="w-4 h-4" /> I agree to
            the{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </label>

          <button
            className="w-full py-3 bg-secondary text-white border-none rounded-lg text-base cursor-pointer transition-all duration-300 hover:bg-[#157347]"
            type="submit"
          >
            Create Customer Account
          </button>
        </form>

        <div className="h-px bg-[#eee] my-5"></div>

        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary no-underline font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center">
          Register as Vendor  <FaArrowRight />{" "}
          <Link
            to="/vendor/signup"
            className="text-primary no-underline font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
