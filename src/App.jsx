import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const clientId = '345917399915-k1sa5clovj9f1t7lo89iokqmbgd4mee0.apps.googleusercontent.com'; // Replace with your Google Client ID

function App() {
    const [token, setToken] = useState(null);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

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
            const response = await axios.post('https://fileuploader-backend-aedkgadcgtfefgd5.canadacentral-01.azurewebsites.net/Files/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
            setStatus('File uploaded successfully!');
      } catch (error) {
            console.error('Error uploading file:', error);
            setStatus('Error uploading file!');
        }
    };


    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className='container'>
                <h1>Upload to Azure Blob</h1>

                {!token ? (
                    <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log('Login Failed')} />
                ) : (
                    <div>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={uploadFile}>Upload to Azure Blob</button>
                    </div>
                )}
                <p>{status}</p>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
