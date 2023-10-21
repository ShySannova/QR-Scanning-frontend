import React, { useState } from 'react';

const SignupModal = ({ onClose, onSignup, openLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async (email,password) => {
    try {
      const response = await fetch('https://qrscanner-9svs.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        onSignup();
        onClose(); // Close the modal
      } else {
        setError('User already exists or registration failed');
      }
    } catch (error) {
      setError('Failed to sign up'); // Handle registration error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  

  const handleSubmit = () => {
    // Perform signup logic here, e.g., call an API
    handleSignup(email,password)
  };

  return (
    <div className="signup-modal">
      <div className='modal-wrapper'>

        <h2>Sign Up</h2>
        <input
          type="text"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
        />
        
        <button onClick={handleSubmit}>Sign Up</button>
        <div className='signUp-btn-container'><p>Already registered!</p>
        <button className='signUp-btn' onClick={openLoginModal}>Login</button> {/* Button to open SignupModal */}
        </div>
        <button className='close-btn' onClick={onClose}>x</button>
      </div>
      </div>
  );
};

export default SignupModal;
