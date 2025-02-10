import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import placeImage from '../place.png'; // Ensure this path is correct

// Remove Unsplash API URL and key
// const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
// const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Remove Unsplash key

const LOCATIONIQ_API_KEY = 'pk.c51ba700c7aa3288f19b95fbaddbaeff'; // Replace with your LocationIQ API key
const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';

function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState(PHOTO_REF_URL); // Default to placeholder
    const [userLocation, setUserLocation] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Function to get user location
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    error => {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {
                console.warn('Geolocation is not supported by this browser.');
            }
        };

        getUserLocation();
    }, []);

    useEffect(() => {
        // Fallback: If no photo is found, we just use the placeholder
        const fetchHotelPhoto = async () => {
            if (!hotel || !hotel.hotelName || !hotel.hotelAddress) {
                console.warn('Missing hotel data:', hotel);
                return;
            }

            const query = `${hotel.hotelName} ${hotel.hotelAddress}`;
            console.log('Fetching photo for:', query);

            // Instead of fetching from Unsplash, use a fallback image (or any public image source)
            // Here, we simply use the default placeholder image, but you can replace this with any API call or static image.
            setPhotoUrl(PHOTO_REF_URL); // Use a placeholder image as fallback
        };

        fetchHotelPhoto();
    }, [hotel]);

    useEffect(() => {
        // Function to search for hotels or addresses using LocationIQ API
        const searchLocation = async (latitude, longitude) => {
            try {
                const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${latitude},${longitude}&format=json`);
                const data = await response.json();

                if (data && data.length > 0) {
                    setSearchResults(data);
                    console.log('Search Results:', data);
                } else {
                    console.warn('No results found for location:', latitude, longitude);
                }
            } catch (error) {
                console.error('Error searching location:', error.message);
            }
        };

        if (userLocation) {
            searchLocation(userLocation.latitude, userLocation.longitude);
        }
    }, [userLocation]);

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.hotelName}, ${hotel.hotelAddress}`)}${hotel.latitude ? `&ll=${hotel.latitude},${hotel.longitude}` : ''}`;

    return (
        <Link
            to={googleMapsUrl}
            className="hover:scale-105 transition-transform cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="rounded-lg bg-white shadow-lg p-4">
                <img 
                    src={photoUrl || placeImage} 
                    alt={`${hotel.hotelName || 'Hotel'}`} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex flex-col gap-2">
                    <h2 className="font-medium text-lg">{hotel?.hotelName || 'Unknown Hotel'}</h2>
                    <h2 className="text-sm text-gray-500">📍 {hotel?.hotelAddress || 'Address not available'}</h2>
                    <h2 className="text-sm text-gray-700">💰 {hotel?.price || 'Price not available'}</h2>
                    <h2 className="text-sm text-yellow-500">⭐ {hotel?.rating || 'Rating not available'}</h2>
                    {hotel?.latitude && hotel?.longitude && (
                        <p className="text-sm text-gray-600">🌍 Latitude: {hotel.latitude}, Longitude: {hotel.longitude}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default HotelCardItem;
