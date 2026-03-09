import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';

function ComingSoonPage({ title }) {
    return (
        <div className="flex-1 flex items-center justify-center bg-transparent p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                    <FiClock className="text-amber-400" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                    This feature is currently under development. We're working hard to bring it to you soon!
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-amber-500 dark:text-amber-400 hover:text-amber-400 dark:hover:text-amber-300 font-semibold text-sm transition-colors"
                >
                    <FiArrowLeft size={16} />
                    Back to Notes
                </Link>
            </div>
        </div>
    );
}

export default ComingSoonPage;
