import React from "react";

interface BookContentProps {
  content: string;
  fontSize: number;
  alignment: "left" | "center" | "right";
  isDarkMode: boolean;
}

export const BookContent: React.FC<BookContentProps> = ({
  content,
  fontSize,
  alignment,
  isDarkMode,
}) => {
  const textAlign = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div
      className={`prose max-w-none ${isDarkMode ? 'prose-invert bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out`}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: '1.8',
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={`mb-4 ${textAlign[alignment]}`}>
          {paragraph}
        </p>
      ))}
    </div>
  );
};