import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const clientId =  import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google Client ID

function App() {
    const [token, setToken] = useState(null);
    const [file, setFile] = useState(null);

    const handleLoginSuccess = (credentialResponse) => {
        setToken(credentialResponse.credential);
        console.log('Logged in with token:', credentialResponse.credential);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async () => {
      if (!token) {
          alert('Please log in first.');
          return;
      }
  
      if (!file) {
          alert('Please select a file to upload.');
          return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
          const response = await axios.post( `${import.meta.env.VITE_AZURE_DEPLOY_URL}/Files/upload`
            , formData, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data'
              }
          });
          console.log('File uploaded successfully:', response.data);
      } catch (error) {
          console.error('Error uploading file:', error);
          
      }
  };
  

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div>
                <h1>Google Sign-In File Uploader</h1>
                
                {!token ? (
                    <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
                ) : (
                    <div>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={uploadFile}>Upload to Azure Blob</button>
                    </div>
                )}
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
