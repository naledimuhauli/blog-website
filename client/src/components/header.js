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
                                <Link
                                    to="#categories"
                                    className="nav-link px-2 text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#posts"
                                    className="nav-link px-2 text-white"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
                                    }}>
                                    Posts
                                </Link>
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
