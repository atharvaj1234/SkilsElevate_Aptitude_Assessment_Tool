import React, { useState } from 'react';
import { storage } from './firebase'; // Assuming you have already set up Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AdminUploadBadge = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [badgeUrl, setBadgeUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const storageRef = ref(storage, `badges/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBadgeUrl(downloadURL);
          console.log('File available at', downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <h2>Upload Badge Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
      {badgeUrl && (
        <div>
          <p>Badge URL: {badgeUrl}</p>
          <img src={badgeUrl} alt="Badge" style={{ maxWidth: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default AdminUploadBadge;