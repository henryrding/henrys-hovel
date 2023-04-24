import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { ShopContext } from '../components/ShopContext';

export default function AuthPage({ action }) {
  const navigate = useNavigate();
  const { user, handleSignIn } = useContext(ShopContext);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate])

  const welcomeMessage = action === 'sign-in'
    ? 'Please sign in to continue'
    : 'Create an account to get started!';
  return (
    <div className='container'>
      <div className="row pt-4 align-items-center">
        <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-xl-4 offset-xl-4">
          <header className="text-center">
            <h2 className="mb-2">Henry's</h2>
            <h2 className="mb-2">Hovel</h2>
            <p className="text-muted mb-4">{welcomeMessage}</p>
          </header>
          <div className="card p-3 ">
            <AuthForm
              key={action}
              action={action}
              onSignIn={handleSignIn} />
          </div>
        </div>
      </div>
    </div>
  );
}
