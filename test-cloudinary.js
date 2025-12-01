require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary Connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

cloudinary.api.ping()
    .then(result => {
        console.log('✅ Connection Successful!');
        console.log('Ping result:', result);
    })
    .catch(error => {
        console.error('❌ Connection Failed!');
        console.error('Full Error Object:', JSON.stringify(error, null, 2));
        console.error('Error Message:', error.message);
        if (error.http_code === 401) {
            console.error('Reason: Authentication Failed. Please check your Cloud Name, API Key, and API Secret.');
        }
    });
