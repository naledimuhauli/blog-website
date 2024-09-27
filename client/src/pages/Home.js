import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/hero';
import About from '../components/About';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);  // New state to track loading
    const [error, setError] = useState(null);      // New state to track errors

    useEffect(() => {
        fetch('http://localhost:5000/api/posts')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);   // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(error.message); // Set error message
                setLoading(false);   // Stop loading if there's an error
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;  // Display a loading message while fetching posts
    }

    if (error) {
        return <div>Error: {error}</div>;  // Display the error message if there's an issue
    }

    return (
        <div className='homepage'>
            <Hero />
            <About />
            <h1 className='blog'>Featured Posts Section</h1>
            {posts.length === 0 ? (  // Show message if no posts are available
                <p>No posts available. <Link to="/new-post">Create the first post</Link></p>
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/new-post">Create New Post</Link>
        </div>
    );
}

export default Home;
