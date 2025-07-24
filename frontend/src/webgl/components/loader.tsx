import React from "react";

interface LoaderProps {
    isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed left-7 bottom-16  z-50">
            <div className="w-4 h-4 border-2 border-b-transparent border-black/30 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;