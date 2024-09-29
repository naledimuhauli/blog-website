import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // To hold base64 image string
    const [imagePreview, setImagePreview] = useState(''); // To preview the image
    const navigate = useNavigate();

    // Function to handle file selection and convert it to base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set the base64 image string to state
                setImagePreview(reader.result); // Set imagePreview for displaying the preview
            };
            reader.readAsDataURL(file); // Convert image to base64
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the post data (including base64 image) to the backend
        fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, description, image }), // Include base64 image string
        })
            .then((res) => res.json())
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
                            accept="image/*" // Only accept image files
                            onChange={handleImageChange} // Handle image change
                        />
                    </div>

                    {/* Display image preview if available */}
                    {imagePreview && (
                        <div className="image-preview">
                            <h4>Image Preview:</h4>
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
