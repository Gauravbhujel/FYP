import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const LegalPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const response = await api.get(`pages/${slug}/`);
        setPage(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching legal page:', err);
        setError('Page not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-black text-primary mb-4">404</h1>
          <p className="text-gray-500 mb-8 max-w-md">
            The legal document you are looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      
      {/* Header Section */}
      <section className="bg-primary pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-accent/20 border border-accent/30 rounded-full mb-6">
            <span className="text-accent text-xs font-bold uppercase tracking-widest">Legal Document</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            {page.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-gray-300 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Last updated: {new Date(page.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-grow -mt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-primary"
              dangerouslySetInnerHTML={{ __html: page.content }} 
            />
          </div>

          <div className="mt-12 text-center text-gray-400 text-sm">
            Interested in learning more about how we protect your data? 
            <Link to="/about" className="text-accent font-bold ml-1 hover:underline">About Us</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
