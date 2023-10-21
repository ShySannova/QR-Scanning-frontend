import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useAuth } from '../context/AuthContext';

function filterResults(results) {
  let filteredResults = [];
  for (var i = 0; i < results.length; ++i) {
    if (i === 0) {
      filteredResults.push(results[i]);
      continue;
    }

    if (results[i].decodedText !== results[i - 1].decodedText) {
      filteredResults.push(results[i]);
    }
  }
  return filteredResults;
}

// const ResultContainerList = ({ data, onSave }) => {
//   return (
    
//   );
// }

const ResultContainerPlugin = (props) => {
  const { user } = useAuth();
  console.log(user)
  const results = filterResults(props.results);
  const [savedResults, setSavedResults] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const qrCodeRef = useRef(null);

  

  const openSignupModal=()=>{
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }
  const openLoginModal=()=>{
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false)
  };

  console.log(savedResults)

const handleSave = (resultToSave) => {
  // Check if the user is logged in
  if (!user) {
    // User is not logged in, open the login modal
    setIsLoginModalOpen(true);
    return;
  }

  // Check if the user has savedResults property and if the content is not already in savedResults
  if (user.savedResults) {
    const existingResult = user.savedResults.find((result) => result.content === resultToSave.decodedText);
    if (existingResult) {
      // Result with the same content already exists
      return;
    }
  }

  // Generate a QR code image by rendering QRCode component
  const qrCodeImage = qrCodeRef?.current;

  const savedResult = {
    content: resultToSave.decodedText,
  };

  htmlToImage
    .toPng(qrCodeImage)
    .then(function (dataUrl) {
      savedResult.thumbnail = dataUrl;

      // Update the user's savedResults array
      user.savedResults = user.savedResults || [];
      user.savedResults.push(savedResult);

      // Remove 'savedResult' from the object and directly send the content
      fetch('https://qrscanner-9svs.onrender.com/qrcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Send the user's token for authentication
        },
        body: JSON.stringify({ savedResult }), // Send only 'content'
      })
        .then(response => {
          if (response.ok) {
            setSavedResults([...savedResults, savedResult]);
            fetch('https://qrscanner-9svs.onrender.com/qrcodes', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${user.token}`, // Include the user's token for authentication
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
                setSavedResults(data)
                onClose(); // Close the modal
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            // Handle API response error
            console.error('Failed to save result:', response.statusText);
          }
        })
        .catch(function (error) {
          console.error('Failed to save QR code as an image:', error);
        });
    })
    .catch(function (error) {
      console.error('Failed to save QR code as an image:', error);
    });
};

const deleteSavedQR = (qrCodeId) => {
  fetch(`https://qrscanner-9svs.onrender.com/qrcodes/${qrCodeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`, // Include the user's token for authentication
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to delete the QR code');
      }
    })
    .then((data) => {
      // Fetch the updated saved results for the user
      fetch('https://qrscanner-9svs.onrender.com/qrcodes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`, // Include the user's token for authentication
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
          // Update user.savedResults with the retrieved data
          user.savedResults = data;

          // Update the component's savedResults state
          setSavedResults(data);

          // Handle the response data (e.g., a success message) here
          console.log('Deleted QR code:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};






  return (
    <div className="Result-container">
      <div className="Result-header">Scanned result</div>
      <div className="Result-section">
      {results.length>0?<>
        
        
        <div className='Result-section-grid'>
      {results.map((result, i) => (
        <div key={i}>
          <strong># {i + 1}</strong> 
          
          <div ref={qrCodeRef}>
        <QRCode  value={result.decodedText} size={128} />
        </div>
          <strong>Content:</strong> {result.decodedText}
          <strong>Format:</strong> {result.result.format.formatName}
          <button onClick={() => handleSave(result)}>Save</button>
        </div>
      ))}
    </div>
      </>:
      <div className='Result-section-Nodata'>
        <h2>Your scanned QR details will be showed here</h2>
      </div>
      }
        
        

      </div>
      <div className="Saved-results">
        <h3>Saved Results:</h3>
     
        {savedResults.map((savedResult, i) =>{
          console.log(savedResult)
          return(
          <div key={i}>
            
            <span>

            <strong>Content:</strong>
            <p>
              {savedResult.content}
              </p> 
            </span>
            <div>
            {savedResult.thumbnail && (
              <img src={savedResult.thumbnail} alt={`QR Code ${i}`} />
            )}
            </div>
            <button onClick={()=>{deleteSavedQR(savedResult?._id)}}>Delete</button>
          </div>)
        } )}
      </div>
      {isLoginModalOpen && <LoginModal onClose={handleCloseModal} setSavedResults={setSavedResults}  openSignupModal={openSignupModal} />}
      {isRegisterModalOpen && <SignupModal onClose={handleCloseModal} openLoginModal={openLoginModal}/>}
    </div>
  );
};

export default ResultContainerPlugin;
