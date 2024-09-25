import React, { useState, useEffect } from 'react';

function HomePage() {
    const [posts, setPosts] = useState([]);

    // Fetch blog posts from the backend using the fetch API
    useEffect(() => {
        fetch('http://localhost:5000/posts')
            .then(response => response.json())  // Convert the response to JSON
            .then(data => setPosts(data))       // Set the posts state with the fetched data
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    return (
        <div>
            <h1>Blog Posts</h1>
            {posts.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body.substring(0, 100)}...</p>
                    <a href={`/post/${post.id}`}>Read more</a>
                </div>
            ))}
        </div>
    );
}

export default HomePage;
