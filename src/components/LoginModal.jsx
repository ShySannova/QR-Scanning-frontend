import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ onClose, setSavedResults, openSignupModal }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://qrscanner-9svs.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        // Call the login function from the context to authenticate the user
        login({ email, token });
        getSavedQR(token)
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Failed to log in'); // Handle login error or show an error message
    }
  };

  const getSavedQR=(token)=>{
    fetch('https://qrscanner-9svs.onrender.com/qrcodes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the user's token for authentication
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to retrieve QR codes');
        }
      })
      .then((data) => {
        // Handle the retrieved QR codes data here (data will contain the QR codes)
        console.log('Retrieved QR codes:', data);
        setSavedResults(data)
        onClose(); // Close the modal
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  

  const closeSignupModal = () => {
    setShowSignupModal(false);
  };

  return (
    <div className="login-modal">
      <div className='modal-wrapper'>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='login-btn' onClick={handleLogin}>Log In</button>
        <div className='signUp-btn-container'><p>not register yet?</p>
        <button className='signUp-btn' onClick={openSignupModal}>Sign Up</button> {/* Button to open SignupModal */}
        </div>
        <button className='close-btn' onClick={onClose}>x</button>

      
      </div>
    </div>
  );
};


export default LoginModal;
