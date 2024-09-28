import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/hero';
import './pages.css';
import skincare from '../images/skincare.jpg';
import beauty from '../images/beauty.jpg';
import fashion from '../images/fashion.jpg';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to dynamically import images
    const getImage = (imageName) => {
        return `/images/${imageName}`;  // Assuming images are stored in 'public/images'
    };

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
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='homepage'>
            <Hero />

            <h1 className='blog'>Vogue Vibes <strong>Blog</strong></h1>

            <div className='container'>
                <div className='row'>
                    {/* Left Sidebar with reduced width */}
                    <div className='col-12 col-md-3 col-lg-2 sidebar'>
                        <h2 className='categories-h1'>Categories</h2>
                        <div className='categories'>
                            <h3 className='category'> Fashion</h3>
                            <img src={fashion} style={{ width: '150px', height: '150px' }} />
                        </div>
                        <div className='categories'>
                            <h3 className='category'> Beauty</h3>
                            <img src={beauty} style={{ width: '150px', height: '150px' }} />
                        </div>
                        <div className='categories'>
                            <h3 className='category'>Lifestyle</h3>
                            <img src={skincare} style={{ width: '150px', height: '150px' }} />
                        </div>
                    </div>

                    {/* Main Content (Posts) with increased width */}
                    <div className='col-12 col-md-9 col-lg-10'>
                        {posts.length === 0 ? (
                            <p>No posts available. <Link to="/new-post">Create the first post</Link></p>
                        ) : (
                            <div className='row'>
                                {posts.map((post) => (
                                    <div className='col-12 col-md-6 col-lg-4' key={post.id}>
                                        <div className='post-card'>
                                            <img src={getImage(post.image)} alt={post.title} className='blog-img' />
                                            <h3 className='blog-h1'>{post.title}</h3>
                                            <p className='blog-p'>{post.content}
                                                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: "black" }}>
                                                    Read More..
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link to="/new-post" >
                            <button className='new-post'>Create New Post</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
