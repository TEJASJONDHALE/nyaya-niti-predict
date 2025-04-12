
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user } = useAuth();

  // If the user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-legal-primary mb-2">Nyaya Niti Predict</h1>
          <p className="text-gray-600">AI-powered legal case outcome prediction</p>
        </div>
        
        {isSignIn ? (
          <SignInForm onSwitchToSignUp={() => setIsSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setIsSignIn(true)} />
        )}
      </div>
    </div>
  );
};

export default Auth;
