import React from 'react';
import { Link } from 'react-router-dom';

const header = () => {
    return (
        <>
            <header className="p-3 text-bg-dark">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">


                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                            <li>
                                <a href="#categories" className="nav-link px-2 text-white" onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
                                }}>Home</a>
                            </li>
                            <li>
                                <a href="#posts" className="nav-link px-2 text-white" onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
                                }}>Posts</a>
                            </li>
                            <li><Link to="/new-post" className="nav-link px-2 text-white">Create new blog</Link></li>
                        </ul>

                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                            <input type="search" className="form-control form-control-dark text-bg-dark" placeholder="Search..." aria-label="Search" />
                        </form>
                    </div>
                </div>
            </header>
        </>
    )
}

export default header
