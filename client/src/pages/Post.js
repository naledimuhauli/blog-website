import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();  // Hook to navigate after deleting the post
    const [post, setPost] = useState(null);

    // Helper function to dynamically import images
    const getImage = (imageName) => {
        return `/images/${imageName}`;  // Assuming images are stored in 'public/images'
    };

    useEffect(() => {
        fetch(`http://localhost:5000/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => setPost(data))
            .catch((error) => console.error('Error fetching post:', error));
    }, [id]);

    const handleDelete = () => {
        fetch(`http://localhost:5000/api/posts/${id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);  // Success message
                navigate('/');  // Navigate back to the main page after deleting the post
            })
            .catch((error) => console.error('Error deleting post:', error));
    };

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container containers">
            <div className="post">
                <h1 className='post-h1'>{post.title}</h1>
                <p className='post-description'>{post.description}</p>
                <div className="row">
                    <div className="col-md-6">
                        <img src={getImage(post.image)} alt={post.title} className="img-fluid post-img" />
                    </div>
                    <div className="col-md-6">
                        <p className='post-p'>{post.content}</p>
                    </div>
                </div>
                <button onClick={handleDelete} className="btn btn-danger mt-3">Delete Post</button>
            </div>
        </div>
    );
}

export default Post;
