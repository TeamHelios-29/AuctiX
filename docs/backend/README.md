# User API Documentation

## Endpoints

### GET /api/user/user-exists
Checks if a user exists based on one of the following parameters: `username`, `id`, or `email`.

**Query Parameters:**
- `username` (optional): The username to check.
- `id` (optional): The UUID of the user to check.
- `email` (optional): The email to check.

**Response:**
- Returns `true` if the user exists, otherwise `false`.
- Returns an error message if more than one parameter is provided or nothing provided.

---

### POST /api/user/uploadVerificationDocs
Uploads verification documents for the authenticated user.

**Request Parameters:**
- `file` (required): The file to upload.

**Response:**
- Returns a success message if the upload is successful.
- Returns an error message if the upload fails.

---

### GET /api/user/getAuthUser
Retrieves the authenticated user's details (available in `dev` profile).

**Response:**
- Returns the authenticated user's details.
- Returns an error message if the user is not authenticated or an internal error occurs.

---

### GET /api/user/getUsers
Retrieves a paginated list of users.

**Query Parameters:**
- `limit` (optional, default: 10): The number of users to retrieve.
- `offset` (optional, default: 0): The starting point for retrieval.
- `sortby` (optional, default: `id`): The field to sort by.
- `order` (optional, default: `asc`): The sort order (`asc` or `desc`).
- `search` (optional): A search term to filter users.

**Response:**
- Returns a paginated list of users.
- Returns an error message if the request is invalid.

---

### GET /api/user/getCurrentUser
Retrieves the currently authenticated user's details.

**Response:**
- Returns the authenticated user's details.
- Returns an error message if the user is not authenticated or an internal error occurs.

---

### POST /api/user/uploadUserProfilePhoto
Uploads a profile photo for the authenticated user.

**Request Parameters:**
- `file` (required): The file to upload.

**Response:**
- Returns a success message if the upload is successful.
- Returns an error message if the upload fails.

---

### GET /api/user/getUserProfilePhoto
Retrieves a user's profile photo.

**Query Parameters:**
- `file_uuid` (required): The UUID of the file to retrieve.

**Response:**
- Returns the file as a binary stream.
- Returns an error message if the retrieval fails.

---

### DELETE /api/user/deleteUserProfilePhoto
Deletes the authenticated user's profile photo / given user profile 

**Request Parameters:**
- `username` (required): The username of the user to delete profile photo.

**Response:**
- Returns a success message if the deletion is successful.
- Returns an error message if the deletion fails.