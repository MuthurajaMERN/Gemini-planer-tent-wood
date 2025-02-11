import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const fetchPhoto = async (query) => {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query: query,
        per_page: 6, // Fetch multiple images
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    console.log("Unsplash API Response:", response.data); // ✅ Debug API response
    return Array.isArray(response.data.results) ? response.data.results : [];
  } catch (error) {
    console.error("Error fetching Unsplash photos:", error);
    return [];
  }
};

export default fetchPhoto;
