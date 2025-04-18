# 📕 **Expenses Tracker - Admin**

A web application built for **administrators** of the Expenses Tracker platform.  
It allows admin users to manage other users securely and efficiently.  

✅ Built with **ReactJS** (Frontend) and **ASP.NET Core Web API** (Backend)  
✅ Implements **JWT with Refresh Token** for authentication  

### ✅ **Features:**

- 🔑 **Authentication**: Secure login using ASP.NET Core Identity and JWT.
- 👥 **User Management**: Add, update, and delete users and admin accounts.
- 🌐 **Responsive UI**: Mobile-friendly UI using Bootstrap 5.
- 📄 **Logging**: Structured logging with Serilog.

---

## ⚙️ **Tech Stack:**

- **Frontend:** ReactJS, Bootstrap
- **Backend:** C#, ASP.NET Core WebAPI
- **Database:** MS SQL Server (with EntityFramework Core)
- **Authentication:** ASP.NET Core Identity, JWT
- **Logging:** Serilog
- **Packages:** axios, react-router
- **Version Control:** Git
- **Tools:** Visual Studio Community 2022, Visual Studio Code

---

## 💻 **Installation and Setup:**

### 1. Clone the Repository

```bash
git clone https://github.com/glenvillethedev/net-react-app.git
```

### 2. Frontend Setup

Proceed to frontend root folder
```bash
cd frontend/expenses-tracker-admin-ui/
```

Create a `.env` file 
```bash
VITE_API_BASE_URL=your_backend_base_url
```

Port number for frontend can be updated in `vite.config.js`
(Default port number is 3000)
```bash
export default defineConfig({
  plugins: [react()],
  server: {
    port: "3000"
  }
})
```

Install dependencies & run front end
```bash
npm install
npm run dev
```

Open your browser and navigate to\
`http://localhost:3000/login` (Default) 


### 3. Backend Setup

Make sure you have the latest .NET SDK installed.\
Install the necessary NuGet packages:

```bash
dotnet restore
```

Update the following settings in  `appsettings.json`.
- Database Connection\
(note: Database should already exist since this application serves as an admin dashboard for the ExpensesTracker App.\
If database is not yet created, follow the ExpensesTracker app database setup instruction:\
https://github.com/glenvillethedev/asp-net-core-app#:~:text=3.%20Configure%20the%20Database)
```json
  "ConnectionStrings": {
    "DefaultConnection": "your_db_connection_string_here"
  }
```
- CORS Policy
```json
  "AllowedOrigins": [ 
    "your_frontend_url"
  ],
```
- JWT Settings
```json
  "JWT": {
    "Issuer": "your_backend_url",
    "Audience": "your_frontend_url",
    "SecretKey": "your_secret_key",
    "Expiration": expiration_number_minutes, // minutes
    "RefreshTokenExpiration": expiration_number_days // days
  }
```
- Serilog Settings
```json
  "Serilog": {
    ...
  }
```

Run the Application

```bash
dotnet run
```

Open your browser and navigate to\
`https://localhost:4000/swagger` (Default) 

---

## 🌐 **Usage:**

### 2. Login

- Go to the "Login" page. (/login)
- Enter registered email and password.
- If success, user will be logged in.
- User's without "Admin" role are not allowed to login.

### 3. User Management

[Create]
- Click on the "Add Entry" button on the navigation.
- Fill in the required details.
- Click on the "Add" button.
- If success, New User should be added on the table.

[Retrieve]
- List of users are displayed on the table.
- Update/Delete existing users by clicking on the Action buttons.

[Update]
- Click on the "Update" button on the table.
- Update the fields you want to change.
- Click on the "Update" button.
- If success, Updated User should be reflected on the table.

[Delete]
- Click on the "Delete" button on the table.
- Click on the "Delete" button to delete the entry.
- If success, Deleted Entry should be removed on the table.

---

## 📂 **Folder Structure:**

```
📁 net-react-app
 ├── 📁 backend/ExpensesTrackerAdmin → api
     ├── 📁 ExpensesTrackerAdmin (WebAPI)
         ├── 📁 Properties -> contains launchSettings.json file
         ├── 📁 Controllers → Controller Endpoints
         ├── 📁 logs → Serilog file logs
         ├── 📁 Middlewares → custom middlewares here
         ├── 📝 appsettings.json → Configuration settings
         ├── 🛠️ Program.cs → App Entry Point.
     ├── 📁 ExpensesTrackerAdmin.Models (Models/DTOs)
         ├── 📁 DTOs → Data Transfer Objects used in the App
         ├── 📁 Enums → Enums used in the Application
     ├── 📁 ExpensesTrackerAdmin.Repository (Repository Layer)
         ├── 📁 Entities → Database Models, DBContext
     ├── 📁 ExpensesTrackerAdmin.Services (Service Layer)
         ├── 📁 Interfaces
             ├── 📝 IService.cs -> Service Interface
         ├── 📝 Service.cs → Service Implementation
 ├── 📁 frontend/expenses-tracker-admin-ui → ui
     ├── 📁 public → static files
         ├── 📁 css → css styles
         ├── 📁 img → static images/logo
     ├── 📁 src → api endpoints
         ├── 📁 components → react components
         ├── 📁 context → global states
         ├── 📁 custom → custom files (axios)
         ├── 📁 pages → react pages
         ├── 📝 App.jsx
         ├── 📝 main.jsx
```

---

## 📃 **Future Updates:**

- 🎯 Search Functionality
- 🎯 Pagination
- 🎯 Admin Settings

---

## 📌 **Contact:**

- 🌐 GitHub: https://github.com/glenvillethedev
- 📧 Email: glenville.work@gmail.com
- 🛠️ LinkedIn: https://www.linkedin.com/in/glenville-maturan

