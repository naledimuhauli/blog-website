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

    const getImage = (imageName) => {
        console.log('Image Name:', imageName); // Log the image name to diagnose issues
        console.log('Type of imageName:', typeof imageName); // Log the type of imageName

        // Check if imageName is a string before proceeding
        if (typeof imageName === 'string' && imageName.trim() !== '') {
            // Use regex to check if it's a Base64 image
            const isBase64 = /^data:image/.test(imageName);
            return isBase64 ? imageName : `${process.env.PUBLIC_URL}/images/${imageName}`; // Correctly reference public images for blog posts
        }

        console.warn('Invalid image name:', imageName); // Log warning for invalid image name
        return '/path/to/default/image.jpg'; // Fallback image path if imageName is not valid
    };

    useEffect(() => {
        fetch('http://localhost:5001/api/posts')
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='homepage'>
            <Hero />

            <h1 className='blog' id="categories">Vogue Vibes <strong>Blog</strong></h1>

            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-md-3 col-lg-2 sidebar'>
                        <h2 className='categories-h1'>Categories</h2>
                        <div className='categories'>
                            <h3 className='category'>Fashion</h3>
                            <img src={fashion} style={{ width: '150px', height: '150px' }} alt="Fashion category" />
                        </div>
                        <div className='categories'>
                            <h3 className='category'>Beauty</h3>
                            <img src={beauty} style={{ width: '150px', height: '150px' }} alt="Beauty category" />
                        </div>
                        <div className='categories'>
                            <h3 className='category'>Lifestyle</h3>
                            <img src={skincare} style={{ width: '150px', height: '150px' }} alt="Lifestyle category" />
                        </div>
                    </div>

                    <div className='col-12 col-md-1'></div>

                    <div id="posts" className='col-12 col-md-8 col-lg-9'>
                        {posts.length === 0 ? (
                            <p>No posts available. <Link to="/new-post">Create the first post</Link></p>
                        ) : (
                            <div className='row'>
                                {posts.map((post) => (
                                    <div className='col-12 col-md-6 col-lg-4 mb-4' key={post.id}>
                                        <div className='post-card'>
                                            {post.image && (
                                                <img
                                                    src={getImage(post.image)}  // Use helper function to get the blog image
                                                    alt={post.title}
                                                    className='blog-img'
                                                />
                                            )}
                                            <h3 className='blog-h1'>{post.title}</h3>
                                            <p className='blog-p'>
                                                {post.description}
                                                <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: "black" }}>
                                                    Read More..
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link to="/new-post">
                            <button className='new-post'>Create New Post</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
