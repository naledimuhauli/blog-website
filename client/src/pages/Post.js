import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

function Post() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');

    // Helper function to dynamically import images
    const getImage = (imageName) => {
        if (imageName?.startsWith('data:image')) {
            return imageName; // For base64 images
        } else {
            return `/images/${imageName}`;  // For images stored in public/images folder
        }
    };

    useEffect(() => {
        // Fetch the post data
        fetch(`http://localhost:5000/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setComments(data.comments || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();

        // Send a POST request to add the new comment
        fetch(`http://localhost:5000/api/posts/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, comment: newComment }),
        })
            .then((res) => res.json())
            .then((newComment) => {
                setComments([...comments, newComment]);  // Add the new comment to the list
                setNewComment('');  // Clear the comment input field
                setUsername('');    // Clear the username input field
            })
            .catch((error) => console.error('Error adding comment:', error));
    };

    const handleDeleteComment = (index) => {
        // Send a DELETE request to remove the comment
        fetch(`http://localhost:5000/api/posts/${id}/comments/${index}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);  // Show success message
                setComments(comments.filter((_, i) => i !== index));  // Remove the comment locally
            })
            .catch((error) => console.error('Error deleting comment:', error));
    };

    const handleDeletePost = () => {
        // Send a DELETE request to remove the post
        fetch(`http://localhost:5000/api/posts/${id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);  // Show success message
                navigate('/');  // Navigate back to the main page
            })
            .catch((error) => console.error('Error deleting post:', error));
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

                {/* Comments Section */}
                <div className="comments-section">
                    <h2>Comments</h2>
                    {comments.length === 0 ? (
                        <p>No comments yet. Be the first to comment!</p>
                    ) : (
                        <ul className="comments-list">
                            {comments.map((comment, index) => (
                                <li key={index} className="comment-item">
                                    <strong>{comment.username}</strong>: {comment.comment}
                                    <div><small>{comment.date}</small></div>
                                    <button
                                        onClick={() => handleDeleteComment(index)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete Comment
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Add Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit" className="btn btn-primary">Add Comment</button>
                    </form>
                </div>

                {/* Delete Post Button */}
                <div className="delete-post">
                    <button
                        onClick={handleDeletePost}
                        className="btn btn-danger mt-3"
                    >
                        Delete Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Post;
