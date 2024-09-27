import React from 'react';
import Header from './header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';


const hero = () => {
    return (
        <>
            <Header />
            <div className='background m-5'>
            </div>
            <div className="content">
                <h1 className='heading'>Vogue Vibes</h1>
                <p>Your go-to source for style inspiration, beauty tips, and the hottest trends. Explore expert advice, product reviews, and daily looks to elevate your wardrobe and skincare routine</p>
            </div>

        </>
    )
}

export default hero
