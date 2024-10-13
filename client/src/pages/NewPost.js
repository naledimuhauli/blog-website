import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set base64 image string
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5001/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, description, image }),
        })
            .then((res) => res.json())
            .then(() => {
                navigate('/'); // Redirect after post creation
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
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

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
