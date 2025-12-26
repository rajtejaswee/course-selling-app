import React from 'react';

function CourseCard({ title, description, price, imageUrl, onClick, buttonText = "View Details" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={imageUrl || "https://placehold.co/600x400?text=Course+Thumbnail"} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Price Tag Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm text-gray-900">
           ${price}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {description}
        </p>
        
        <button 
            onClick={onClick}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all"
        >
            {buttonText}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;