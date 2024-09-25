import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/posts')
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error('Error fetching posts:', error));
    }, []);

    return (
        <div>
            <h1>Blog Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
            <Link to="/new-post">Create New Post</Link>
        </div>
    );
}

export default Home;
