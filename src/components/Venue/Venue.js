import React from 'react';
import { useParams } from 'react-router-dom';

function Venue() {

	const { cityid, venueid } = useParams();
	
  	return (
    	<div>Venue: { venueid } {cityid}</div>
  	)
}

export default Venue;