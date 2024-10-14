import React from 'react';
import Header from './header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


const hero = () => {
    return (
        <div className='hero'>
            <Header />
            <div className='background'>
                <div className="content">
                    <h1 className='heading'>Vogue Vibes</h1>
                    <p>Your go-to source for style inspiration, beauty tips, and the hottest trends. Explore expert advice, product reviews, and daily looks to elevate your wardrobe and skincare routine</p>
                </div>
            </div>

        </div>
    )
}

export default hero
