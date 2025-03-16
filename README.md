#  Booklets - Book Notes Tracking Web Application

## Features

**User Authentication**  
**CRUD Methods For Data Manipulation**  
**Search Functionality**  

## Used Technologies

- **Frontend:** React.js + Vite, React Router, Axios 
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** Bcrypt 
- **Book Covers API:** Open Library API (https://openlibrary.org/dev/docs/api/covers)

## Installation & Setup

### 1. Clone the repository
```sh
git clone https://github.com/cicekl/Booklets.git
cd booklets
```

### 2. Install backend dependencies
```sh
cd server
npm install
```

### 3. Set up environment variables
DB_USERNAME=your_database_username  
DB_HOST=localhost  
DB_NAME=booklets  
DB_PASSWORD=your_database_password  
DB_PORT=5432  

### 4. Set up database  
Create necessary database tables from schema file.

### 5. Install frontend dependencies
```sh
cd ../client
npm install
```
### 6. Start the project (Backend&Frontend)
```sh
npm run dev
```



