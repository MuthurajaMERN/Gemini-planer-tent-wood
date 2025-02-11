import { useState, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import fetchPhoto from "../../service/GlobalApi";
import axios from "axios";

const LOCATIONIQ_API_KEY = "pk.c51ba700c7aa3288f19b95fbaddbaeff"; // Replace with your API key

function InfoSection({ trip }) {
  const [photos, setPhotos] = useState([]); // ✅ Ensure `photos` is initialized as an array
  const [locationDetails, setLocationDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!trip?.userSelection?.location) return;

      const query = trip.userSelection.location.display_name;

      try {
        // Fetch Unsplash Images
        const images = await fetchPhoto(query);
        console.log("Fetched Photos:", images); // ✅ Debug API response
        setPhotos(Array.isArray(images) ? images : []); // ✅ Ensure it's an array

        // Fetch Location Details
        const locationResponse = await axios.get(
          `https://us1.locationiq.com/v1/search.php`,
          {
            params: {
              key: LOCATIONIQ_API_KEY,
              q: query,
              format: "json",
            },
          }
        );

        if (Array.isArray(locationResponse.data) && locationResponse.data.length > 0) {
          setLocationDetails(locationResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    fetchData();
  }, [trip]);

  if (!trip?.userSelection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-start items-center h-screen">
      {/* Debugging: Ensure photos is an array */}
      {console.log("Photos State:", photos)}

      {/* Display Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {Array.isArray(photos) && photos.length > 0 ? (
          photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo.urls?.regular || "https://via.placeholder.com/1000"}
                alt={photo.alt_description || "Trip Image"}
                className="h-64 w-full object-cover rounded-xl"
              />
              <p className="absolute bottom-2 left-2 bg-black text-white text-xs p-1 rounded">
                {photo.user?.name || "Unknown"} (Unsplash)
              </p>
            </div>
          ))
        ) : (
          <p>No images found</p>
        )}
      </div>

      {/* Send Button */}
      <button className="absolute bottom-[-55px] right-8 p-2 px-4 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2">
        <IoIosSend />
        Send
      </button>

      {/* Location Details */}
      <div className="w-full flex flex-col items-start px-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IoLocationSharp className="text-xl text-gray-600" />
          <h2 className="font-bold text-2xl">
            {trip.userSelection.location?.display_name || "Location not available"}
          </h2>
        </div>

        {locationDetails && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
            <p>
              📍 <strong>Address:</strong> {locationDetails.display_name}
            </p>
            <p>
              🌍 <strong>Coordinates:</strong> {locationDetails.lat}, {locationDetails.lon}
            </p>
          </div>
        )}

        {/* Trip Info */}
        <div className="flex gap-5 justify-start mt-4">
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            📆 {trip.userSelection.days || "Days not specified"} Day
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            💰 {trip.userSelection.budget ? `${trip.userSelection.budget} Budget` : "Budget not specified"}
          </h2>
          <h2 className="p-2 px-4 bg-gray-200 rounded-full text-gray-600 text-xs md:text-md">
            🥂 No. Of Travelers: {trip.userSelection.traveler || "Travelers not specified"}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
