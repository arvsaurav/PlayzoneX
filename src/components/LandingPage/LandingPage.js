import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

function LandingPage() {

    const selector = useSelector((state) => state.authentication);

    useEffect(() => {
        console.log(selector);
    }, [selector]);

    return (
        <div>LandingPage
            {selector !== '' && selector.isUserAuthenticated && <p>Hello</p> }
         </div>
    )
}

export default LandingPage;