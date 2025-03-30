import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export async function getExerciseImage(exerciseName: string): Promise<string> {
    try {
        if (!PEXELS_API_KEY) {
            throw new Error('Pexels API key not configured');
        }

        // Search for exercise-related images
        const response = await axios.get(`${PEXELS_API_URL}/search`, {
            headers: {
                Authorization: PEXELS_API_KEY
            },
            params: {
                query: `${exerciseName} exercise workout`,
                per_page: 1,
                orientation: 'portrait'
            }
        });

        if (response.data.photos && response.data.photos.length > 0) {
            // Return the medium-sized image URL
            return response.data.photos[0].src.medium;
        }

        // Fallback to a default exercise image if no results found
        return 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg';
    } catch (error) {
        console.error('Error fetching image from Pexels:', error);
        // Return a default exercise image in case of error
        return 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg';
    }
}

export default getExerciseImage; 