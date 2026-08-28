# IT Asset Management System

A simple IT Asset Management System developed using ReactJS, Ant Design, ExpressJS, Microsoft SQL Server, and RESTful API.

## Technical Requirements

* ReactJS
* Ant Design
* ExpressJS
* Microsoft SQL Server
* RESTful API
* Git & GitHub

## Features

* User Login
* Asset Management
* User Management
* Maintenance Management
* Asset Assignment
* Reports
* Password Change
* CRUD Operations
* RESTful API

## Project Structure

```text
ITAssetManagement/
├── frontend/
├── server/
├── database/
├── .gitignore
├── package.json
└── README.md
```

## Requirements

Before running the application, install:

1. Node.js
2. Microsoft SQL Server
3. SQL Server Management Studio (SSMS)
4. Git

## Database Setup

1. Open SQL Server Management Studio.
2. Connect to your SQL Server instance.
3. Create a database named:

```text
ITAssetManagement
```

4. Execute the SQL scripts provided in the `database` folder.
5. Make sure SQL Server is running and accepting connections on port `1433`.

## Backend Setup

Open a new PowerShell window and navigate to the project:

```powershell
cd D:\Projects\ITAssetManagement\server
```

Install the backend dependencies:

```powershell
npm install
```

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000

DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=ITAssetManagement
DB_USER=assetadmin
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=YOUR_JWT_SECRET
```

Replace `YOUR_DATABASE_PASSWORD` with the password configured for the SQL Server user.

Start the backend:

```powershell
npm start
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open another PowerShell window:

```powershell
cd D:\Projects\ITAssetManagement\frontend
```

Install the frontend dependencies:

```powershell
npm install
```

Start the React development server:

```powershell
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

Open the displayed Vite URL in your browser.

## Test Account

Use the following account to test the login functionality:

```text
Email: admin@gmail.com
Password: admin123
```

## Testing the Application

### 1. Login

1. Open the frontend application.
2. Enter the test account credentials.
3. Click **Sign In**.
4. Verify that the Dashboard is displayed.

### 2. Dashboard

Verify that the Dashboard displays:

* Total Assets
* Active Assets
* Maintenance
* Unavailable Assets
* Recent Assets
* Quick Actions

### 3. Assets

Test the asset management functions:

* View assets
* Add an asset
* Edit an asset
* Delete an asset
* Assign an asset
* Update asset status

### 4. Users

Test the user management functions:

* View users
* Add a user
* Edit a user
* Delete a user

### 5. Maintenance

Test the maintenance functions:

* View maintenance records
* Add maintenance record
* Update maintenance record
* Delete maintenance record

### 6. Reports

The system provides four report types:

* Asset Inventory Report
* Asset Assignment Report
* Maintenance Report
* User Report

Select a report type and click **Generate Report**.

The browser print dialog can be used to print the selected report in either Portrait or Landscape orientation.

### 7. Settings

Test the account settings:

* View account information
* Change password
* Confirm password change
* Sign out

## RESTful API

The backend provides RESTful API endpoints for the system's main resources.

Examples include:

```text
/api/auth
/api/assets
/api/users
/api/maintenance
```

The frontend communicates with the ExpressJS backend through HTTP requests.

## GitHub

The complete source code is available in the project's GitHub repository.

## Challenges Encountered During Development

### Database Integration

Connecting the ExpressJS backend to Microsoft SQL Server required proper database configuration, credentials, and connection settings.

### REST API Integration

The frontend and backend needed to communicate correctly through RESTful API endpoints while handling successful responses and errors.

### CRUD Operations

Implementing Create, Read, Update, and Delete operations required coordinating the frontend forms, API requests, database queries, and UI updates.

### Authentication

Login and password management required password hashing, authentication handling, and JWT-based session management.

### Report Generation

Creating multiple report types while keeping the tables readable and printable required handling different column structures and print layouts.


### Responsive UI
    
The system was designed primarily for desktop use, with a focus on maintaining a consistent layout across the main pages of the application.

### Git Version Control

Git was used throughout development to track changes and maintain the project's development history.
