import axios from 'axios';

const fetchPhoto = async (query) => {
  try {
    // Example using a free image placeholder or public image URL (no API required)
    const response = await axios.get(`https://source.unsplash.com/1600x900/?${query}`);  // Source from Unsplash without the API key
    return response.request.responseURL || 'https://via.placeholder.com/1000?text=No+Photo+Found';
  } catch (error) {
    console.error('Error fetching photo:', error.message);
    return 'https://via.placeholder.com/1000?text=Error+Fetching+Photo';
  }
};

export default fetchPhoto;

export const PHOTO_REF_URL = 'https://via.placeholder.com/1000?text=Photo+Not+Available';
