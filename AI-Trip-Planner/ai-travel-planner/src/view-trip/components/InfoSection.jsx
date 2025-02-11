import { useState, useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5"; 
import fetchPhoto from '../../service/GlobalApi';
import placeImage from '../place.png';

const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';

function InfoSection({ trip }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPlacePhotos = async () => {
      if (!trip?.userSelection?.location) return;

      const query = trip.userSelection.location.display_name;

      try {
        const images = await fetchPhoto(query);
        setPhotos(images.length > 0 ? images : [{ urls: { regular: PHOTO_REF_URL } }]); // Use fallback if no images
      } catch (error) {
        console.error('Error fetching photos:', error.message);
        setPhotos([{ urls: { regular: PHOTO_REF_URL } }]); // Use fallback
      }
    };

    fetchPlacePhotos();
  }, [trip]);

  if (!trip?.userSelection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      <div className="relative w-full">
        {/* Display all fetched images as a gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <img 
              key={index}
              src={photo.urls.regular}
              alt={trip.userSelection.location.display_name || 'Trip Image'}
              className="h-64 w-full object-cover rounded-xl"
            />
          ))}
        </div>

        {/* Send button */}
        <button className="absolute bottom-[-55px] right-8 p-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2">
          <IoIosSend />
          Send
        </button>
      </div>

      <div className="w-full flex flex-col items-start px-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IoLocationSharp className="text-xl text-gray-600" />
          <h2 className='font-bold text-2xl'>
            {trip.userSelection.location?.display_name || 'Location not available'}
          </h2>
        </div>
        <div className='flex gap-5 justify-start'>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            📆 {trip.userSelection.days || 'Days not specified'} Day
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            💰 {trip.userSelection.budget ? `${trip.userSelection.budget} Budget` : 'Budget not specified'}
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            🥂 No. Of Travelers: {trip.userSelection.traveler || 'Travelers not specified'}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
