import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="new-post">
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Upload Image</label>
                    <input
                        className="form-control"
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
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                )}

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default NewPost;
