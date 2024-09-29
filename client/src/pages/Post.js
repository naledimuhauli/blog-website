import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to dynamically import images
    const getImage = (imageName) => {
        if (imageName?.startsWith('data:image')) {
            return imageName; // For base64 images
        } else {
            return `/images/${imageName}`;  // For images stored in public/images folder
        }
    };

    useEffect(() => {
        fetch(`http://localhost:5000/api/posts/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            fetch(`http://localhost:5000/api/posts/${id}`, {
                method: 'DELETE',
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Failed to delete post');
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(data.message);  // Success message
                    navigate('/');  // Navigate back to the main page after deleting the post
                })
                .catch((error) => console.error('Error deleting post:', error));
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container containers">
            <div className="post">
                <h1 className='post-h1'>{post.title}</h1>
                <p className='post-description'>{post.description}</p>

                <div className="row">
                    {/* Conditionally render image only if it exists */}
                    {post.image && (
                        <div className="col-md-6">
                            <img
                                src={getImage(post.image)}
                                alt={post.title}
                                className="img-fluid post-img"
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <div className={`col-md-${post.image ? '6' : '12'}`}>
                        <p className='post-p'>{post.content}</p>
                    </div>
                </div>

                <button onClick={handleDelete} className="btn btn-danger mt-3">Delete Post</button>
            </div>
        </div>
    );
}

export default Post;
