# Common Services

## File Upload Service

### usage:  uploadFile(MultipartFile file, String category)

> The file will uploaded as a public file public files can only delete by admins.

### usage:  uploadFile(MultipartFile file, String category ,String ownerEmail , boolean isPublic)

> The file can be uploaded with file ownership. uploaded file can only be deleted by admins or the owner

### usage:  uploadFile(MultipartFile file, String category, UUID ownerUserId, boolean isPublic)

> The file can be uploaded with file ownership. uploaded file can only be deleted by admins or the owner

### usage:  getFile(UUID id, String requestedUserEmail)

> Both private and public files can be access if the file is private it can be accessed only by the it's owner. 

### usage:  getFile(UUID id)

> Only the public files can read using this method

### usage:  getFile(UUID id, UUID requestedUserId )

> Both private and public files can be access if the file is private it can be accessed only by the it's owner. 

### usage:  deleteFile(UUID fileId, UUID deleteRequestedUserId)

> file will be delete if the delete requested user is an admin or file owner.

### usage:  deleteFile(UUID fileId,String deleteRequestedUserEmail)

> file will be delete if the delete requested user is an admin or file owner.

### usage:  deleteFile(Upload fileToDelete, User deleteRequestedUser)

> file will be delete if the delete requested user is an admin or file owner.

## File Uploads Delete Service
> files will be marked as deleted once they are deleted using deleteFile and those files can't be access. Those files are deleted by a sheduled job which runs at given time.


# Notification Service

## Adding a new NotificationCategory to the system

Example for notification category would be like BID_WON, AUCTION_STARTED, AUCTION_ENDED, etc.

Each of these will have a NotifcationCategoryGroup such as AUCTION, PROMO, etc

### Steps
1. Create a new enum `NotificationCategory` for the desired category.
2. Configure the metadata for it in the yaml file located at `backend/src/main/resources/notification-categories.yml`.

    ```yml
    notificationCategories:
    AUCTION_COMPLETED:
        allowedRoles: [BIDDER, SELLER]
        alwaysHiddenRoles: []
        cannotEditRoles: []
        categoryGroup: AUCTION
        description: "Get notified when auction ends"
        title: "Auction Completed"

    AUCTION_END_SOON:
        allowedRoles: [BIDDER, SELLER]
        alwaysHiddenRoles: []
        cannotEditRoles: [BIDDER, SELLER]
        categoryGroup: AUCTION
        description: "Get notified 10 minutes before auction ends"
        title: "Auction Ends soon"

    ```

3. Configure notification channel type defaults if you want in the application.properties ( can be overridden by user preferences later )

    ```

    # Global notification defaults
    notification.defaults.global.EMAIL=true
    notification.defaults.global.PUSH=true

    # Event-specific defaults
    notification.defaults.events.PROMO.EMAIL=true
    notification.defaults.events.PROMO.PUSH=false

    notification.defaults.events.BID_WIN.EMAIL=true
    notification.defaults.events.BID_WIN.PUSH=false

    ```
```



# User API Documentation

## Usable Methods

### usage: getAuthenticatedUser(Authentication authentication)

To retrieve detailed information about the user making the request, you can use the following code:

```java

    try {
        Authentication authentication = SecurityContextHolder
                                            .getContext()
                                            .getAuthentication();

        currentUser = userDetailsService
                        .getAuthenticatedUser(authentication);
    }
    catch (AuthenticationException e){
        // handle AuthenticationException gives when user is not authenticated
    }
    catch (Exception e){
        // handle Exception for internal server Errors
    }

```

### usage: isUserExistsOnUsername(String username)

To check if a user exists based on a username, you can use the following code:

```java
boolean exists = userService.isUserExistsOnUsername("exampleUsername");
if (exists) {
    // User exists
} else {
    // User does not exist
}
```

### usage: isUserExistsOnEmail(String email)

To check if a user exists based on an email address, you can use the following code:

```java
boolean exists = userService.isUserExistsOnEmail("example@email.com");
if (exists) {
    // User exists
} else {
    // User does not exist
}
```

### usage: isUserExistsOnId(UUID Id)

To check if a user exists based on their UUID, you can use the following code:

```java
UUID userId = UUID.fromString("12345678-1234-1234-1234-123456789012");
boolean exists = userService.isUserExistsOnId(userId);
if (exists) {
    // User exists
} else {
    // User does not exist
}
```

### usage: registerUser(String username, String email, String rawPassword, String firstname, String lastname, Role role)

To register a new user in the system, you can use the following code:

```java
UserServiceResponse response = userService.registerUser(
    "newUsername", 
    "user@example.com", 
    "securePassword123", 
    "John", 
    "Doe", 
    Role.BIDDER
);

if (response.isSuccess()) {
    User createdUser = response.getUser();
    // Registration successful
} else {
    String errorMessage = response.getMessage();
    // Handle registration failure
}
```

This method checks if the user already exists, hashes the password, and creates appropriate role-specific entities based on the provided role (SELLER, BIDDER, or ADMIN).

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