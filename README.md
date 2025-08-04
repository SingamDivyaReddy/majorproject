# 🧭 ViaVista – Travel Destination Platform

A dynamic platform where users can explore exciting travel destinations, leave reviews, and property owners can list their accommodations.

## 🚀 Features

- 👤 User registration, login, and session management
- 🌍 Explore various travel destinations
- 📝 Post and view reviews for each destination
- 🏠 Property owners can list, update, and manage their accommodations
- 🔒 Secure authentication using **Passport.js**
- 🌐 RESTful routing and robust middleware via **Express.js**
- 💾 Efficient storage with **MongoDB**
- 🎨 Responsive UI using **EJS**, **HTML**, **CSS**, and **JavaScript**

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, EJS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Passport.js
- **APIs:** REST APIs

## 📦 Installation & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshitSuru/TripNest.git
   cd TripNest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**  
   Create a `.env` file in the root directory and add the following:
   ```env
   CLOUD_NAME=cloud name for uploading photos (Cloudinary)
   CLOUD_API_KEY=API key
   CLOUD_API_SECRET=API key secret

   MAP_TOKEN=map token for Mapbox
   ATLASDB_URL=your Atlas MongoDB connection URL

   SECRET=your session secret

   EMAIL_USER=your email to send reset password links
   EMAIL_PASS=password from Google (App password)
   ```

4. **Start the server**
   ```bash
   node app.js
   ```

  Access your app at:  `http://localhost:3000/`  


> ⚠️ **Important:** Do not commit your actual `.env` file to GitHub. Add `.env` to `.gitignore` to keep credentials safe.



## 🔍 Real-World Applications

- Useful for travel startups and listing platforms
- Enhances user engagement with reviews and listings
- Scalable model for travel accommodation marketplaces

---

## 📄 License

This project is open-source under the **MIT License**. See the [LICENSE](./LICENSE) file for more info.

---

## 👤 Author

**Divya Reddy Singam**  
GitHub: [@SingamDivyaReddy](https://github.com/SingamDivyaReddy)

---
⭐ **Star this repository if you found it helpful!** 
