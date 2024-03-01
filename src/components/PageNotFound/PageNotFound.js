import React from 'react'
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <>
        <div>PageNotFound</div>
        <Link to="/">Back to homepage</Link>
    </>
  )
}

export default PageNotFound;