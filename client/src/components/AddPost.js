import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddPost() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            title,
            body,
            author
        };

        // Use fetch to send a POST request to the backend
        fetch('http://localhost:5000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Post added:', data);
                navigate('/');
            })
            .catch(error => console.error('Error adding post:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Post</h2>
            <label>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />

            <label>Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />

            <button type="submit">Add Post</button>
        </form>
    );
}

export default AddPost;
