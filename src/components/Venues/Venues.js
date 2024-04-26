import { useEffect } from 'react'
import { useParams } from 'react-router-dom';

function Venues() {

	const { cityid } = useParams();

	useEffect(() => {
		console.log(cityid);
	}, [cityid]);

  	return (
    	<div>Venue city: {cityid}</div>
  	)
}

export default Venues;