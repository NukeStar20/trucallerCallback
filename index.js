import express from 'express';
import fetch from 'node-fetch'; // Assuming you're using node-fetch for making API calls

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.post('/api/truecaller/callback', async (req, res) => {
    try {
        // Extract request data from the incoming callback
        const data = req.body;
        const { requestId, accessToken, endpoint } = data;

        // If the user rejects the verification, handle the error
        if (!accessToken) {
            console.log(`User rejected verification for requestId: ${requestId}`);
            return res.status(400).json({ message: 'User rejected verification', requestId });
        }

        // Fetch user profile using the access token
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Cache-Control': 'no-cache',
            },
        });

        // Handle unauthorized or server errors
        if (!response.ok) {
            console.error('Error fetching Truecaller profile:', response.statusText);
            return res.status(response.status).json({ error: 'Failed to fetch user profile' });
        }

        // Get the user profile from the response
        const userProfile = await response.json();

        // You can now use this user profile in your application
        // For example, you might save it to your database or session
        console.log('User profile fetched:', userProfile);

        // Respond back with the user profile
        return res.status(200).json({ message: 'User profile fetched successfully', userProfile });

    } catch (error) {
        console.error('Error handling Truecaller callback:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
