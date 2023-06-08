import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpOrIn } from '../lib';


export default function AuthForm({ action, onSignIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { username, password, firstName, lastName, email } = Object.fromEntries(formData.entries());
    try {
      const result = await signUpOrIn(action, username, password, firstName, lastName, email);
      if (action === 'sign-up') {
        navigate('/sign-in');
      } else if (result.user && result.token) {
        onSignIn(result);
      }
    } catch (err) {
      setError(err);
    }
  }

  const handleDemoUser = () => {
    setUsername('johnsmith');
    setPassword('password');
  }

  const handleDemoAdmin = () => {
    setUsername('admin');
    setPassword('PASSWORD');
  }

  const alternateActionTo = action === 'sign-up'
    ? '/sign-in'
    : '/sign-up';
  const alternateActionText = action === 'sign-up'
    ? 'Sign in instead'
    : 'Register now';
  const submitButtonText = action === 'sign-up'
    ? 'Register'
    : 'Log In';
  return (
    <form className="w-100" onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          Username:
          <input
            required
            autoFocus
            type="text"
            name="username"
            autoComplete="username"
            className="form-control bg-light"
            value={username}
            onChange={(event) => setUsername(event.target.value)} />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Password:
          <input
            required
            type="password"
            name="password"
            autoComplete={action === 'sign-up' ? "current-password" : "new-password"}
            className="form-control bg-light"
            value={password}
            onChange={(event) => setPassword(event.target.value)} />
        </label>
      </div>
      {action === 'sign-up' &&
        <>
          <div className="mb-3">
            <label className="form-label">
              First Name:
              <input
                required
                type="text"
                name="firstName"
                className="form-control bg-light" />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Last Name:
              <input
                required
                type="text"
                name="lastName"
                className="form-control bg-light" />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Email:
              <input
                required
                type="email"
                name="email"
                className="form-control bg-light" />
            </label>
          </div>
        </>
      }
      <div className="d-flex justify-content-between align-items-center">
        <small>
          <Link className="text-muted" style={{ textDecorationSkipInk: "none" }} to={alternateActionTo}>
            {alternateActionText}
          </Link>
        </small>
        <button type="submit" className="btn btn-primary">
          {submitButtonText}
        </button>
      </div>
      {action === 'sign-in' && (
        <div className="d-flex align-items-center">
          <button type="button" className="btn btn-secondary" onClick={handleDemoUser}>
            Demo User
          </button>
          <button type="button" className="btn btn-secondary mx-1" onClick={handleDemoAdmin}>
            Demo Admin
          </button>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
}
