# Hotel Explorer

Hotel Explorer is a full-stack hotel listing application built using React, Redux, Node.js, Express and PostgreSQL.

The application allows users to add, view, edit and delete hotel listings. It also supports image upload with preview, search, price filtering, pagination and a hotel detail page with a map based on the hotel's latitude and longitude.

## Live Demo

**Live Website:**  
https://hotel-list-production-2782.up.railway.app

**Backend API:**  
https://hotel-list-production.up.railway.app

## Features

### Add and Edit Hotel

The application uses a reusable form for both adding and editing hotel details.

The form includes:

- Hotel image upload
- Image preview
- Hotel title
- Description
- Latitude
- Longitude
- Price per night
- Form validation

Image validation supports:

- JPEG
- PNG
- WebP
- Maximum file size of 5 MB

### Hotel List

Hotels are displayed using a responsive card layout instead of a table.

Each hotel card displays:

- Hotel image
- Hotel name
- Short description
- Price per night
- Edit option
- Delete option
- View details option

### Search and Filters

The hotel list supports:

- Search by hotel title
- Minimum price filter
- Maximum price filter
- Clear filters option

### Pagination

The hotel list uses pagination with `offset` and `limit` parameters.

Only a limited number of hotels are displayed on each page.

### Hotel Details

Each hotel has a separate detail page.

The detail page displays:

- Full hotel name
- Full description
- Hotel image
- Price per night
- Latitude
- Longitude
- Location on a map
- Edit hotel option

The map location is generated using the latitude and longitude stored for the hotel.

### Edit Hotel

Existing hotel information can be updated using the same form used for creating a hotel.

The image can also be replaced while editing.

### Delete Hotel

Hotels can be deleted from the list.

A confirmation is shown before deleting a hotel, and a success or error toast message is displayed after the operation.

### Image Upload and Storage

Hotel images are uploaded through the Node.js backend.

Images are stored in the server's `uploads` directory, and the image path is saved in the PostgreSQL database.

### SEO

React Helmet is used for SEO-related page information.

The application includes:

- Dynamic page titles
- Meta descriptions
- Page-specific titles for hotel details
- Image `alt` attributes for accessibility

### Single Page Application

The frontend is implemented as a React Single Page Application.

React Router is used for navigation between:

- Hotel List
- Add Hotel
- Edit Hotel
- Hotel Details

## Technology Stack

### Frontend

- ReactJS
- Redux Toolkit
- React Router
- React Helmet
- HTML
- CSS
- Vite

### Backend

- Node.js
- Express.js
- Multer
- REST API
- CORS

### Database

- PostgreSQL
- `pg` PostgreSQL client

Native SQL queries are used for database operations instead of an ORM.

### Deployment

- GitHub
- Railway
- Neon PostgreSQL

## Project Structure

```text
Hotel-list/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── HotelCard.jsx
│       │
│       ├── pages/
│       │   ├── HotelDetail.jsx
│       │   ├── HotelForm.jsx
│       │   └── HotelList.jsx
│       │
│       ├── services/
│       │   └── hotelApi.js
│       │
│       ├── store/
│       │   ├── hotelSlice.js
│       │   └── store.js
│       │
│       ├── App.jsx
│       ├── App.css
│       └── index.css
│
└── server/
    ├── controllers/
    │   └── hotelController.js
    │
    ├── db/
    │   └── database.js
    │
    ├── middleware/
    │   └── upload.js
    │
    ├── routes/
    │   └── hotelRoutes.js
    │
    ├── uploads/
    ├── server.js
    ├── package.json
    └── .gitignore
