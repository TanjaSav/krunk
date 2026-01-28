Welcome to our group project, created by students of Tækni Akademia in Iceland.
The name of our project is Krúnk, which is an Icelandic word that imitates the sound of a common raven.

We created this application mainly for learning purposes, with a strong focus on understanding backend development. In this project, you will find implementations of CRUD operations, API/fetch usage, CAPTCHA, and content validation.

## CRUD Operations

CRUD operations are the four basic operations for persistent storage:

- **Create**: Add new records to the database
- **Read**: Retrieve existing records from the database
- **Update**: Modify existing records in the database
- **Delete**: Remove records from the database

###  Authentication Routes (`/api/auth`)
- `POST /api/auth/signup`— Register a new user
- `POST /api/auth/login` — Authenticate and log in
- `POST /api/auth/logout` — Log out the current session
- `GET /api/auth/me` — Fetch the authenticated user's profile
- `POST /api/auth/update-profile-picture` — Upload or change profile image
###  Post Routes (`/api/posts`)
- `GET /api/posts` — Retrieve all posts
- `POST /api/posts` — Create a new post
- `GET /api/posts/:id` — Get a specific post by ID
- `PUT /api/posts/:id` — Edit a post (only by the author)
- `DELETE /api/posts/:id` — Delete a post (only by the author)
###  Like Route (`/api/posts/:id/like`)
- `POST` — Toggle like/unlike for a post
###  Notification Route (`/api/notifications`)
- `GET` — Fetch notifications for the logged-in user---
###  Route Features
- All endpoints return appropriate
   **HTTP status codes** (`200`, `400`, `401`, `404`, `500`, etc.)
  - Includes **error handling** for invalid input, unauthorized access, and server issues
    - Protected routes require **authentication**
    - Input is **validated** to prevent malformed or malicious requests
    - API routes are **modular**, scalable, and easy to maintain
  
### Base URL
```
http://localhost:3000/api
```

## TECHSTACK: 

### Frontend:

- HTML
- TypeScript
- Tailwind
- Tailwind CSS

Backend: 
- Nextjs API ROUTES
- MongoDB(Post storage)
- Cloudinary(Images storage)

Design: 
- Figma
- Figjam

Infrastruction & Deployment: 
- Vercel
- Github

## FEATURES: 

### **Authentication**
- User registration and login 
- Protected API routes
- Session‑based or token‑based access (depending on implementation)
  
### **Posts**
- Create a post
- Edit your own post
- Delete your own posts
- View posts in the feed
 
### **Likes**
- Like/unlike a post
- Real‑time like counter updates
    
### **Notifications**
- Receive notifications when someone interacts with your content
- Fetch notifications via API
  
## Installation

To access the project, simply scan the QR code provided in our group project presentation using your mobile device.  
A direct link to the deployed website :
https://krunk-eight.vercel.app/

## 5. Usage

After opening the website via the QR code or the provided link, you can create an account or log in. Users have the option to add their own avatar image and post a tweet (or Krúnk) containing text, an image, or both. Users can also edit or delete their posts, as well as like or repost tweets from other users.

## Project Status
This is an MVP (Minimum Viable Product) developed as part of a school project.
No license has been added yet.

