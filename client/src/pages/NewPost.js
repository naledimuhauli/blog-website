import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function NewPost() {
    // State to manage the post's title, content, description, and the uploaded image
    const [title, setTitle] = useState('');  // Post title
    const [content, setContent] = useState('');  // Post content
    const [description, setDescription] = useState('');  // Short description of the post
    const [image, setImage] = useState(null);  // Base64-encoded image string to be sent to the backend
    const [imagePreview, setImagePreview] = useState('');  // Preview of the uploaded image
    const navigate = useNavigate();  // Navigation hook to redirect after submission

    // Function to handle file selection and convert it to base64 for image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Get the first file selected by the user

        if (file) {
            const reader = new FileReader();  // Create a FileReader to read the image file
            reader.onloadend = () => {
                setImage(reader.result);  // Set the base64-encoded image string in the state
                setImagePreview(reader.result);  // Set the preview image to display in the form
            };
            reader.readAsDataURL(file);  // Convert the image to base64 format
        }
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent the default form submission behavior

        // Send the post data (including the base64-encoded image) to the backend API
        fetch('http://localhost:5000/api/posts', {
            method: 'POST',  // HTTP method to create a new post
            headers: { 'Content-Type': 'application/json' },  // Set headers to accept JSON
            body: JSON.stringify({ title, content, description, image }),  // Convert post data to JSON string
        })
            .then((res) => res.json())  // Parse the response as JSON
            .then(() => {
                navigate('/');  // Navigate to the homepage after successful post creation
            })
            .catch((error) => console.error('Error creating post:', error));  // Handle any errors
    };

    return (
        <div className="form">
            <div className="new-posts">
                <h1 className='new-post-h1'>Create New Post</h1>
                {/* Form to create a new blog post */}
                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-6">
                                {/* Input for post title */}
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={title}  // Bind the input to the title state
                                    className='new-post-title'
                                    onChange={(e) => setTitle(e.target.value)}  // Update the title state when input changes
                                />
                            </div>
                            <div className="col-6">
                                {/* Textarea for post description */}
                                <textarea
                                    placeholder="Description"
                                    value={description}  // Bind the input to the description state
                                    className='new-post-description'
                                    onChange={(e) => setDescription(e.target.value)}  // Update the description state
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <br />
                    {/* Textarea for post content */}
                    <textarea
                        placeholder="Content"
                        value={content}  // Bind the input to the content state
                        className='new-post-content'
                        onChange={(e) => setContent(e.target.value)}  // Update the content state when input changes
                    ></textarea>

                    {/* Input for image file upload */}
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

                    {/* Display image preview if an image is selected */}
                    {imagePreview && (
                        <div className="image-preview">
                            <h4>Image Preview:</h4>
                            {/* Render the image preview */}
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '350px', height: 'auto' }} />
                        </div>
                    )}

                    {/* Submit button to create a new post */}
                    <button type="submit" className='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default NewPost;
