import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/hero';
import './pages.css';
import skincare from '../images/skincare.jpg';
import beauty from '../images/beauty.jpg';
import fashion from '../images/fashion.jpg';

function Home() {
    // State to store blog posts fetched from the server
    const [posts, setPosts] = useState([]);

    // State to handle loading state while fetching posts
    const [loading, setLoading] = useState(true);

    // State to handle any errors that occur during fetching
    const [error, setError] = useState(null);

    // to get the image dynamically
    // If the image starts with 'data:image', it's considered as a base64 string
    // Otherwise, it is loaded from the /images directory in the public folder
    const getImage = (imageName) => {
        return imageName?.startsWith('data:image') ? imageName : `/images/${imageName}`;
    };

    // useEffect hook to fetch blog posts 
    useEffect(() => {
        // Fetch posts from the backend API
        fetch('http://localhost:5001/api/posts')
            .then((res) => {
                // Check if the response is OK 
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json(); // Parse the response as JSON
            })
            .then((data) => {
                setPosts(data);      // Set the fetched posts to state
                setLoading(false);   // Set loading to false when done
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setError(error.message);  // Set the error state if an error occurs
                setLoading(false);        // Set loading to false even if there's an error
            });
    }, []); // Empty array means this effect runs once when the component mounts


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
                                                    src={getImage(post.image)}  // Use helper function to get the image
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
