import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import placeImage from '../place.png'; // Ensure this path is correct

const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const LOCATIONIQ_API_KEY = 'pk.c51ba700c7aa3288f19b95fbaddbaeff';

const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';

function HotelCardItem({ hotel }) {
    const [photoUrl, setPhotoUrl] = useState(PHOTO_REF_URL);
    const [userLocation, setUserLocation] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    /** ✅ Use Cached Image Results to Reduce API Calls */
    const photoCache = new Map();

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
        /** ✅ Fetch Hotel Photo with Optimized API Calls */
        const fetchHotelPhoto = async () => {
            if (!hotel?.hotelName || !hotel?.hotelAddress) {
                console.warn('Missing hotel data:', hotel);
                return;
            }

            const query = `${hotel.hotelName} ${hotel.hotelAddress}`;
            
            /** ✅ Check if Image Already Cached */
            if (photoCache.has(query)) {
                setPhotoUrl(photoCache.get(query));
                return;
            }

            console.log('Fetching photo for:', query);
            try {
                const response = await axios.get(UNSPLASH_API_URL, {
                    params: { query, per_page: 1 },
                    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
                });

                const photo = response.data.results[0];
                const imageUrl = photo?.urls?.small || PHOTO_REF_URL;

                photoCache.set(query, imageUrl); // Cache the image
                setPhotoUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching hotel photo:', error.message);
                setPhotoUrl(PHOTO_REF_URL);
            }
        };

        fetchHotelPhoto();
    }, [hotel]);

    useEffect(() => {
        /** ✅ Reverse Geocode to Find Nearby Hotels */
        const searchLocation = async (latitude, longitude) => {
            try {
                const response = await axios.get(`https://us1.locationiq.com/v1/reverse.php`, {
                    params: {
                        key: LOCATIONIQ_API_KEY,
                        lat: latitude,
                        lon: longitude,
                        format: "json",
                    },
                });

                if (response.data?.display_name) {
                    setSearchResults(response.data);
                    console.log('LocationIQ Search Results:', response.data);
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

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hotel.hotelName}, ${hotel.hotelAddress}`
    )}${hotel.latitude ? `&ll=${hotel.latitude},${hotel.longitude}` : ''}`;

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
                    alt={`${hotel?.hotelName || 'Hotel'}`} 
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
