import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './pages.css';

function Post() {
    // Get the post ID from the URL parameters using useParams
    const { id } = useParams();
    // useNavigate hook to programmatically navigate to other routes
    const navigate = useNavigate();
    // State to store the fetched post data
    const [post, setPost] = useState(null);
    // State to handle loading status
    const [loading, setLoading] = useState(true);
    // State to handle any errors that occur while fetching data
    const [error, setError] = useState(null);
    // State to store the list of comments
    const [comments, setComments] = useState([]);
    // State for handling new comment text input
    const [newComment, setNewComment] = useState('');
    // State for handling username input for new comments
    const [username, setUsername] = useState('');

    // Helper function to get images
    // If image is base64, it returns the image directly
    // Otherwise, it fetches the image from the public/images folder
    const getImage = (imageName) => {
        if (imageName?.startsWith('data:image')) {
            return imageName; // For base64 images
        } else {
            return `/images/${imageName}`;  // For images stored in public/images folder
        }
    };

    // useEffect hook to fetch post data when the component mounts or the post ID changes
    useEffect(() => {
        // Fetch the post data by its ID
        fetch(`http://localhost:5000/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setPost(data);              // Set the post data
                setComments(data.comments || []);  // Set the comments if available
                setLoading(false);           // Stop loading once data is fetched
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setError(error.message);     // Set error message if any issue occurs
                setLoading(false);           // Stop loading even if there's an error
            });
    }, [id]);  // Run effect when the post ID changes

    // Handle submission of a new comment
    const handleCommentSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submit behavior

        // Send a POST request to add a new comment
        fetch(`http://localhost:5000/api/posts/${id}/comments`, {
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
        fetch(`http://localhost:5000/api/posts/${id}/comments/${index}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);  // Show a success message
                // Remove the comment from the local state by filtering it out
                setComments(comments.filter((_, i) => i !== index));
            })
            .catch((error) => console.error('Error deleting comment:', error));
    };

    // Handle the deletion of the post
    const handleDeletePost = () => {
        // Send a DELETE request to remove the post by its ID
        fetch(`http://localhost:5000/api/posts/${id}`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);  // Show a success message
                // Navigate back to the main page after post deletion
                navigate('/');
            })
            .catch((error) => console.error('Error deleting post:', error));
    };

    // Show loading state while fetching post data
    if (loading) {
        return <p>Loading...</p>;
    }

    // Show error message if there is any issue fetching the post data
    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container containers">
            <div className="post">
                {/* Display the post title and description */}
                <h1 className='post-h1'>{post.title}</h1>
                <p className='post-description'>{post.description}</p>

                <div className="row">
                    {/* If the post has an image, display it */}
                    {post.image && (
                        <div className="col-md-6">
                            <img
                                src={getImage(post.image)}  // Use helper function to get the image
                                alt={post.title}
                                className="img-fluid post-img"
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    {/* Display the post content */}
                    <div className={`col-md-${post.image ? '6' : '12'}`}>
                        <p className='post-p'>{post.content}</p>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                    <h2>Comments</h2>
                    {/* If no comments, prompt users to leave the first comment */}
                    {comments.length === 0 ? (
                        <p>No comments yet. Be the first to comment!</p>
                    ) : (
                        <ul className="comments-list">
                            {/* Render each comment */}
                            {comments.map((comment, index) => (
                                <li key={index} className="comment-item">
                                    <strong>{comment.username}</strong>: {comment.comment}
                                    <div><small>{comment.date}</small></div>
                                    {/* Button to delete a comment */}
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

                    {/* Form to add a new comment */}
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={username}          // Bind username state to input value
                            onChange={(e) => setUsername(e.target.value)}  // Update username state on change
                            required
                        />
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}        // Bind newComment state to textarea value
                            onChange={(e) => setNewComment(e.target.value)}  // Update newComment state on change
                            required
                        ></textarea>
                        <button type="submit" className="btn btn-primary">Add Comment</button>
                    </form>
                </div>

                {/* Delete Post Button */}
                <div className="delete-post">
                    {/* Button to delete the post */}
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
