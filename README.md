# 🚀 IFPC Website (Indian Farmer Producer Company Platform)

<p align="center">
  <img src="https://ik.imagekit.io/ofm1vl6gr/IFPC-LOGO/IFPC%20White%20Update.png?updatedAt=1775233821675" alt="IFPC Logo" width="200"/>
</p>

---

## 📌 Project Overview
IFPC (Indian Farmer Producer Company) is a web-based platform designed to manage members, roles, and internal communication within a farmer organization. It provides secure authentication, role-based access control, and a structured interface for managing different departments like Core Team, Head, and President.

---

## 🏠 Home Page Preview

<p align="center">
  <img src="https://ik.imagekit.io/ofm1vl6gr/IFPC-PICTURES/DSC_8026.JPG?updatedAt=1775757693967" alt="IFPC Homepage" width="80%"/>
</p>

---

## ✨ Features

- 🔐 Authentication System  
  - User Registration  
  - Secure Login (JWT-based)  
  - Password Encryption using bcrypt  

- 👥 Role-Based Access Control  
  - Admin  
  - President  
  - Head  
  - Core Member  

- 📋 Member Management  
  - Add / Update / Delete Members  
  - Categorize members by roles  
  - Section-wise display (Core, Head, President)  

- 💬 Chat System  
  - Internal communication between members  

- 🔍 Filter & UI Enhancements  
  - Filter members by roles  
  - Clean and responsive UI  

- 🔄 Forgot Password (Optional)  
  - Reset password without OTP (secure flow)  

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
*(Optional: React.js if used)*  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Mongoose)  

### Authentication
- JSON Web Tokens (JWT)  
- Bcrypt  

---

## 📁 Project Structure

```bash
IFPC/
│
├── backend/
│   ├── models/
│   │   ├── member.model.js
│   │   └── chat.model.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── member.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── member.routes.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   └── server.js
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── css/
│   └── js/
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/ifpc-project.git
cd ifpc-project
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Server
```bash
npm start
```

### 5️⃣ Open in Browser
```
http://localhost:5000
```

---

## 🔐 Authentication Flow

1. User registers with email and password  
2. Password is hashed using bcrypt  
3. JWT token is generated on login  
4. Protected routes require token verification  

---

## 👨‍💻 Roles & Permissions

| Role        | Permissions |
|------------|------------|
| Admin      | Full Access |
| President  | Manage Heads & Core Members |
| Head       | Manage Core Members |
| Core       | Limited Access |

---

## 🚧 Future Improvements

- 📱 Mobile Responsive UI  
- 🔔 Notification System  
- 📊 Dashboard Analytics  
- 🌐 Deployment (AWS / Vercel / Render)  
- 📧 Email-based Password Reset  

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repository  
2. Create your feature branch  
```bash
git checkout -b feature/YourFeature
```
3. Commit your changes  
```bash
git commit -m "Add your feature"
```
4. Push to the branch  
```bash
git push origin feature/YourFeature
```
5. Open a Pull Request  

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgement

This project was developed as part of a department-level competition to create a real-world solution for managing Farmer Producer Companies.

---

## 📣 Author

**Kunal Patel**  
- 💻 Full Stack Developer  
- 🚀 Passionate about building scalable web applications  

---

⭐ If you like this project, give it a star on GitHub!