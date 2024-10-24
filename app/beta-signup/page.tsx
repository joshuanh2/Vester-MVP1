import React from 'react';

const BetaSignup: React.FC = () => {
  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Beta Signup</h1>
      <p className="mb-6">Sign up for the beta version of Vester AI by filling out our form!</p>
      
      {/* Link to the Typeform page */}
      <a
        href="https://your-typeform-link-here"  // Replace this with your actual Typeform link
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#129de8] text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Sign Up via Typeform
      </a>
    </div>
  );
};

export default BetaSignup;
