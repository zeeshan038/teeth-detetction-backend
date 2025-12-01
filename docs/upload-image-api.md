# Upload Profile Picture API - Testing Guide

## Endpoint
**POST** `/api/user/upload-image`

## Authentication
This endpoint requires authentication. Include the JWT token in the Authorization header.

## Request Details

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

### Body (Form Data)
- **Field Name**: `image`
- **Type**: File
- **Accepted Formats**: JPEG, JPG, PNG
- **Max Size**: 5MB

## Environment Variables Required

Make sure your `.env` file contains:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Success Response

**Status Code**: `200 OK`

```json
{
  "status": true,
  "msg": "Profile picture uploaded successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profileImage": "https://res.cloudinary.com/...",
      "cloudinaryId": "profile_pictures/user_123_1234567890",
      // ... other user fields
    },
    "imageUrl": "https://res.cloudinary.com/...",
    "cloudinaryId": "profile_pictures/user_123_1234567890"
  }
}
```

## Error Responses

### No File Uploaded
**Status Code**: `400 Bad Request`
```json
{
  "status": false,
  "msg": "No image file uploaded. Please select an image."
}
```

### File Too Large
**Status Code**: `400 Bad Request`
```json
{
  "status": false,
  "msg": "File size too large. Maximum size is 5MB."
}
```

### Invalid File Type
**Status Code**: `400 Bad Request`
```json
{
  "status": false,
  "msg": "Only image files are allowed!"
}
```

### Cloudinary Not Configured
**Status Code**: `500 Internal Server Error`
```json
{
  "status": false,
  "msg": "Image upload service is not configured properly"
}
```

### User Not Found
**Status Code**: `404 Not Found`
```json
{
  "status": false,
  "msg": "User not found"
}
```

### Authentication Failed
**Status Code**: `401 Unauthorized`
```json
{
  "status": false,
  "msg": "Image upload authentication failed. Please contact support."
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:5000/api/user/upload-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

## Testing with Postman

1. Set request type to **POST**
2. Enter URL: `http://localhost:5000/api/user/upload-image`
3. Go to **Headers** tab:
   - Add `Authorization: Bearer <your_token>`
4. Go to **Body** tab:
   - Select **form-data**
   - Add key: `image` (change type to **File**)
   - Select your image file
5. Click **Send**

## Features

✅ **Automatic Image Optimization**
- Resized to 400x400 pixels
- Smart cropping with face detection
- Automatic format conversion (WebP when supported)
- Quality optimization

✅ **Old Image Cleanup**
- Automatically deletes previous profile picture from Cloudinary
- Prevents storage waste

✅ **Comprehensive Error Handling**
- File validation (type, size)
- Cloudinary configuration check
- Specific error messages for different failure scenarios

✅ **Security**
- JWT authentication required
- File type validation
- File size limits

## Notes

- The image is stored in the `profile_pictures` folder in your Cloudinary account
- The public ID format is: `user_{userId}_{timestamp}`
- Old images are automatically deleted when uploading a new one
- The transformation includes face detection for smart cropping
