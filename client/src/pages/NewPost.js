import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        })
            .then((res) => res.json())
            .then(() => {
                navigate('/');
            })
            .catch((error) => console.error('Error creating post:', error));
    };

    return (
        <div className='new-post'>
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="decription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default NewPost;
