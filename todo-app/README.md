# 📱 **Tick It**
> **To-Do List App** is a simple and modern application to manage your daily tasks efficiently. Built with React Native and Expo, it features user authentication, task management, and a sleek UI.

---

## 🚀 **Features**
- User Authentication (Register/Login/Logout)
- Manage tasks (Add, Edit, Complete, Delete)
- Responsive design across devices
<!-- - Modern UI with Dark Mode support -->
<!-- - Splash Screen for a professional app launch experience -->

---

## 🛠️ **Project Setup**

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (recommended version >= 16).
- **Expo CLI**: optional, Install the Expo CLI globally:
  ```bash
  npm install -g expo-cli
  ```
- **Git**: Optional, for version control.

---

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Run on a Device or Emulator**
   - **For Web**: Press `w` to open in a web browser.
   - **For iOS**: Scan the QR code with the Expo Go app on your iOS device.
   - **For Android**: Scan the QR code with the Expo Go app on your Android device or launch on an emulator.

---

## 📂 **File Structure**

```
project-root/
├── app/               # Screens and navigation structure
│   ├── _layout.tsx    # Main navigation layout
│   ├── login.tsx      # Login screen
│   ├── register.tsx   # Register screen
│   ├── todos.tsx      # To-do list screen
├── assets/            # Images and other assets
│   ├── splash.png     # Splash screen image
│   ├── icon.png       # App icon
├── src/               # Core application logic
│   ├── components/    # Reusable components (e.g., PasswordInput)
│   ├── context/       # Context providers (e.g., AuthContext)
│   ├── services/      # API calls (e.g., apiClient.ts)
│   ├── utils/         # Utility functions
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
```

---

## 🌟 **Features Overview**

### 1. **Authentication**
- **Register**: Create an account with your name, email, and password.
- **Login**: Securely log in to access your tasks.
- **Logout**: Easily log out from any screen.

### 2. **Task Management**
- **Add Tasks**: Quickly create new tasks with a responsive input field.
- **Complete Tasks**: Mark tasks as completed with a single tap.
- **Delete Tasks**: Remove unnecessary tasks.

<!-- ### 3. **Splash Screen**
- A sleek splash screen displays the app logo upon startup, offering a professional look. -->

### 3. **Responsive Design**
- Optimized for both small and large screen sizes, including phones, tablets, and the web.

---

## ⚙️ **Environment Variables**
For security, sensitive information like API keys is stored in environment variables.

1. Create a `.env` file in the project root:
   ```env
   EXPO_PUBILC_API_URL=https://your-api-url.com
   EXPO_PUBLIC_JWT_KEY=your-jwt-key
   ```

---

## 🔧 **Available Scripts**

- **Start the Development Server**:
  ```bash
  npm start
  ```
- **Run the App on Web**:
  ```bash
  npm run web
  ```
- **Build Optimized Assets**:
  ```bash
  expo-optimize
  ```

---

## 🐞 **Debugging**

### Common Issues
1. **Assets Not Loading**:
   - Run `expo start --clear` to clear the Expo cache.

2. **API Calls Failing**:
   - Verify the `API_URL` in your `.env` file.
   - Ensure your server is running and accessible.

---

## 📦 **Building the App**

1. **Install `eas-cli`**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Build for Android**:
   ```bash
   eas build --platform android
   ```

4. **Build for iOS**:
   ```bash
   eas build --platform ios
   ```

5. **Access Build Files**:
   - Download the `.apk` or `.ipa` file from the Expo dashboard.

---

## 🚀 **Deployment**

### Publish to Expo
To share the app via Expo Go:
```bash
npx expo publish
```

### Upload to App Stores
1. **Google Play Console** (Android):
   - Upload the `.aab` file to the Google Play Console.
2. **App Store Connect** (iOS):
   - Upload the `.ipa` file via App Store Connect.

---

## 📄 **Contributing**

We welcome contributions to improve this project! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## 🛡️ **License**
This project is licensed under the [MIT License](LICENSE).