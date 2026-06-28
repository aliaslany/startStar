import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-400">Ready for Description</h1>
        <p className="text-gray-300">
          The environment is set up and ready. Please describe the application you would like to build.
        </p>
      </div>
    </div>
  );
};

export default App;