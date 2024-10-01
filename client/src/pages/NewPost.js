import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function NewPost() {
    // State to manage the post's title, content, description, and the uploaded image
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);  // Base64-encoded image string to be sent to the backend
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    // Function to handle file selection and convert it to base64 for image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Get the first file selected by the user

        if (file) {
            const reader = new FileReader();  // Create a FileReader to read the image file
            reader.onloadend = () => {
                setImage(reader.result);  // Set the base64-encoded image string in the state
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);  // Convert the image to base64 format
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the post data to the backend API
        fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  // Set headers to accept JSON
            body: JSON.stringify({ title, content, description, image }),
        })
            .then((res) => res.json())  // Parse the response as JSON
            .then(() => {
                navigate('/');
            })
            .catch((error) => console.error('Error creating post:', error));
    };

    return (
        <div className="form">
            <div className="new-posts">
                <h1 className='new-post-h1'>Create New Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    className='new-post-title'
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <textarea
                                    placeholder="Description"
                                    value={description}
                                    className='new-post-description'
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <br />
                    <textarea
                        placeholder="Content"
                        value={content}
                        className='new-post-content'
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Upload Image</label>
                        <input
                            className="form-control media"
                            type="file"
                            id="formFile"
                            accept="image/*"  // Restrict file input to image files
                            onChange={handleImageChange}  // Handle image change and convert to base64
                        />
                    </div>

                    {imagePreview && (
                        <div className="image-preview">
                            <h4>Image Preview:</h4>
                            {/* Render the image preview */}
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '350px', height: 'auto' }} />
                        </div>
                    )}
                    <button type="submit" className='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
