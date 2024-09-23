import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:1337/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('An email has been sent for password reset.');
      } else {
        setError(data.message || 'Failed to send reset email.');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body">
              <h1 className="text-center">Forget Password</h1>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleForgetPassword}>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Send Reset Email</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
