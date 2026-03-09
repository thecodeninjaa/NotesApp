import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="text-center max-w-md relative z-10">
                <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300 mb-4">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-white mb-2">Page not found</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)]"
                >
                    <FiArrowLeft size={16} />
                    Go back home
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
