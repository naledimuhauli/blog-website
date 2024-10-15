import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

function Post() {
    // Get the post ID from the URL parameters using useParams
    const { id } = useParams();
    const navigate = useNavigate();

    // State to store the fetched post data
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState('');

    // function to get images
    const getImage = (imageName) => {
        if (imageName?.startsWith('data:image')) {
            return imageName;
        } else {
            return `/images/${imageName}`;
        }
    };

    // useEffect hook to fetch post data 
    useEffect(() => {
        // Fetch the post data by its ID
        fetch(`http://localhost:5001/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);
                setComments(data.comments || []);  // Set the comments if available
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [id]);  // Run effect when the post ID changes

    // Handle submission of a new comment
    const handleCommentSubmit = (e) => {
        e.preventDefault();

        // Send a POST request to add a new comment
        fetch(`http://localhost:5001/api/posts/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, comment: newComment }),  // Send the username and comment
        })
            .then((res) => res.json())
            .then((newComment) => {
                // Add the newly added comment to the current list of comments
                setComments([...comments, newComment]);
                // Clear the comment input field
                setNewComment('');
                // Clear the username input field
                setUsername('');
            })
            .catch((error) => console.error('Error adding comment:', error));
    };

    // Handle the deletion of a comment
    const handleDeleteComment = (index) => {
        // Send a DELETE request to remove the comment by its index
        fetch(`http://localhost:5001/api/posts/${id}/comments/${index}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                // Remove the comment from the local state by filtering it out
                setComments(comments.filter((_, i) => i !== index));
            })
            .catch((error) => console.error('Error deleting comment:', error));
    };

    // Handle the deletion of the post
    const handleDeletePost = () => {
        // Send a DELETE request to remove the post by its ID
        fetch(`http://localhost:5001/api/posts/${id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                // Navigate back to the main page after post deletion
                navigate('/');
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
                <button onClick={() => navigate(-1)} className='btn btn-primary back-button'>Back</button>
                <h1 className='post-h1'>{post.title}</h1>
                <p className='post-description'>{post.description}</p>

                <div className="row">
                    {post.image && (
                        <div className="col-md-6">
                            <img
                                src={getImage(post.image)}
                                alt={post.title}
                                className="img-fluid post-img"
                                style={{ width: '500px', height: '500px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <div className={`col-md-${post.image ? '6' : '12'}`}>
                        <p className='post-p'>{post.content}</p>
                    </div>
                </div>
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

                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}  // Update username state on change
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
