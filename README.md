# MentorMate

MentorMate is a comprehensive platform designed to facilitate seamless course enrollment, tracking, and completion. It includes user authentication, dynamic content display, and progress tracking functionalities.

## Features

- **User Authentication:** Secure user registration and login using `passport-local-mongoose`.
- **Course Enrollment:** Users can enroll in various courses, which are tracked in their profile.
- **Dynamic Content Display:** Course content updates dynamically based on user interactions without page reloads.
- **Progress Tracking:** Users can mark course content as complete, with progress stored and displayed dynamically.
- **Password Reset:** Secure password reset functionality with user verification.
- **Custom Notifications:** Real-time custom notifications using `react-toastify`.

## Installation

### Prerequisites

- Node.js
- MongoDB Atlas

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/mentormate.git
   cd mentormate
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT = 8080
   SESSION_SECRET = mentormate
   ATLAS_URL = mongodb_connection_string
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

### User Authentication

- **Register:** Create a new account.
- **Login:** Access your account with your credentials.
- **Password Reset:** Securely reset your password if forgotten.

### Course Enrollment and Tracking

- **Enroll in Courses:** Browse and enroll in available courses.
- **Dynamic Content:** View course content that updates dynamically based on your selections.
- **Progress Tracking:** Mark content as complete to track your progress.

---

Enjoy using MentorMate and happy learning!
