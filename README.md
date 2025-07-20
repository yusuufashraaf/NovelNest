# NovelNest: An Advanced Online Bookstore Application

## 🌟 Overview

**NovelNest** is a comprehensive, full-stack online bookstore application developed using Angular 20. It is designed to provide a seamless and intuitive experience for users across various devices, including desktops, tablets, and mobile phones. The application incorporates robust administrative controls, secure user authentication, and real-time data updates, making it a modern solution for online book management and browsing. NovelNest aims to enhance the digital book experience through its user-friendly interface and powerful features.

## 🚀 Core Features

NovelNest offers a wide range of functionalities, organized into key modules for clarity and ease of understanding:

| Module                          | Description                                                                                                                                                                                                                                                                                                                                             |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 👤 **User Portal**              | This module allows users to register and log in securely (with options for One-Time Password (OTP) or Google authentication or github authentication). Users can manage their personal profiles, write and view book reviews, create wishlists of desired books, and track their order history.                                                         |
| 📚 **Books**                    | Users can easily browse and search for books within the extensive catalog. The system includes advanced filtering options and smart sorting capabilities to help users find exactly what they are looking for efficiently.                                                                                                                              |
| 🛒 **Shopping Cart & Checkout** | This feature enables users to add, remove, and modify quantities of books in their shopping cart. The checkout process is designed to be straightforward, concluding with a clear order confirmation and a success message for a smooth transaction experience.                                                                                         |
| 🔐 **Security**                 | NovelNest employs robust security measures, including JSON Web Token (JWT) based authentication for secure user sessions. Route guards protect sensitive areas of the application, and OTP verification adds an extra layer of security for critical actions. All forms are designed with Cross-Site Scripting (XSS) prevention to safeguard user data. |
| 📊 **Admin Dashboard**          | The administrative dashboard provides real-time analytical insights and key performance indicators (KPIs) related to sales, user activity, and book inventory. It includes comprehensive tools for managing orders, users, and books, with real-time updates powered by Socket.IO technology.                                                           |

## 🧱 Technology Stack

NovelNest is built on a modern and scalable technology stack, ensuring high performance, reliability, and maintainability. The primary technologies used are:

| Category                          | Technology Used                           |
| :-------------------------------- | :---------------------------------------- |
| **Frontend Development**          | Angular 20, Bootstrap 5.3                 |
| **Programming Language**          | TypeScript 5.4                            |
| **User Interface Icons**          | Font Awesome                              |
| **Real-time Communication**       | Socket.IO (client-side implementation)    |
| **Reactive Programming Paradigm** | RxJS (Reactive Extensions for JavaScript) |

### 🧩 Key Libraries and Frameworks

Several essential libraries and frameworks contribute to NovelNest's functionality and user experience:

| Library             | Purpose                                                                                                |
| :------------------ | :----------------------------------------------------------------------------------------------------- |
| NGX Toastr          | Provides elegant and customizable toast notifications for user feedback.                               |
| NGX Infinite Scroll | Enables smooth and efficient infinite scrolling functionality for content loading.                     |
| SweetAlert2         | Offers beautiful, responsive, and customizable modals and alerts for interactive user prompts.         |
| Angular Forms       | Facilitates robust and efficient reactive form validation and management within the Angular framework. |

## 📁 Project Structure (Simplified)

The project's directory structure is organized in a clear and modular manner to facilitate easy navigation, development, and maintenance. This simplified overview highlights the main components:

```bash
src/
├── app/                  # Contains the core application logic and components
│   ├── components/       # Reusable UI components and feature-specific modules
│   │   ├── home/, browse-books/, cart/, wishlist/, book-details/  # Main application views
│   │   ├── user-profile/ # User-specific functionalities
│   │   │   ├── orders-history/, purchased-books/, reviews/, personal-info/ # Sub-sections of user profile
│   │   ├── dashboard/    # Administrative dashboard components
│   │   │   ├── users/, products/, orders/, brands/, categories/, analytics/ # Dashboard sub-sections
│   │   ├── auth/         # Authentication-related components (login, register, password reset, email verification)
│   │   ├── static/       # Static content pages (e.g., contact-us, about-us)
│   ├── services/         # Modules responsible for integrating with backend APIs
│   ├── directives/, guards/, interceptors/, interfaces/, models/ # Angular-specific architectural elements
│   ├── shared/components/ # Shared UI components (e.g., navigation bar, search functionality)
├── assets/Logo/          # Branding assets, such as application logos
└── environments/         # Configuration files for different environments (development, production)
```

## 🛠️ Setup and Installation

To set up and run NovelNest on your local development environment, please follow these instructions carefully:

### 📦 System Requirements

Before proceeding with the installation, ensure that your system meets the following software requirements:

| Tool        | Minimum Version Required |
| :---------- | :----------------------- |
| Node.js     | 18 or higher             |
| Angular CLI | Latest stable version    |

### 📥 Installation Steps

1.  **Clone the Repository:** Begin by cloning the project source code from its GitHub repository to your local machine using the `git clone` command:

    ```bash
    git clone https://github.com/yusuufashraaf/NovelNest.git
    ```

2.  **Navigate to the Project Directory:** Change your current directory to the newly cloned NovelNest project folder:

    ```bash
    cd NovelNest
    ```

3.  **Install Dependencies:** Install all required project dependencies by running the Node Package Manager (npm) install command:

    ```bash
    npm install
    ```

### 🔧 Environment Configuration

It is necessary to configure the application's environment variables, particularly for API endpoints and third-party service integrations like Google authentication. Open the `src/environments/environment.ts` file in your code editor and update the following variables:

```typescript
export const environment = {
  production: false,
  apiBase: "http://localhost:5000/api", // Base URL for the main API
  apiBaseUrl: "http://localhost:5000/api/v1", // Base URL for API version 1
};
```

### ▶️ Starting the Application

After completing the installation and configuration, you can start the development server. Execute the following command in your terminal:

```bash
ng serve
```

This command will compile the Angular application and launch a local development server. Once the server is running, you can access NovelNest in your web browser by navigating to: [http://localhost:4200](http://localhost:4200)

## 🔐 Security Features

NovelNest is built with a strong emphasis on security, incorporating several key features to protect user data and maintain application integrity:

| Feature                     | Description                                                                                                                                                                                                     |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JWT Authentication**      | Utilizes JSON Web Tokens (JWT) for secure user authentication, ensuring that user sessions are protected and refresh tokens are handled securely.                                                               |
| **OTP Verification**        | Implements an email-based One-Time Password (OTP) system for critical actions such as password recovery, adding an extra layer of security against unauthorized access.                                         |
| **Route Guards**            | Employs Angular route guards to restrict access to specific parts of the application based on user roles and authentication status, preventing unauthorized navigation.                                         |
| **Input Sanitization**      | All user inputs are rigorously sanitized to prevent Cross-Site Scripting (XSS) attacks, safeguarding the application and its users from malicious code injection.                                               |
| **Token-Validated Sockets** | Real-time features within the administrative dashboard are secured using token validation, ensuring that only authenticated and authorized users can receive and interact with live data updates via Socket.IO. |

## 📊 Admin Dashboard Capabilities

The administrative dashboard in NovelNest provides a comprehensive suite of tools for managing the online bookstore efficiently. It offers insights and controls for various aspects of the platform:

| Feature               | Description                                                                                                                                                                                                                                               |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics**         | Provides key performance indicators (KPIs) and detailed analytics on various metrics, including revenue, total order count, and performance metrics for books and users. This helps administrators monitor the overall health and growth of the platform. |
| **Charts**            | Visualizes data through intuitive charts, such as monthly book sales represented by a bar chart and category shares displayed in a pie chart. These visualizations aid in quick data interpretation and decision-making.                                  |
| **Real-time Orders**  | Displays live updates of recent order activity, ensuring administrators are always informed about new transactions as they occur. This feature is powered by Socket.IO for instant data synchronization.                                                  |
| **User Management**   | Offers tools for managing user accounts, including the ability to moderate user profiles and review submitted book reviews. This ensures a healthy and respectful community environment.                                                                  |
| **Inventory Control** | Provides comprehensive features for managing the book inventory. Administrators can edit book details, approve stock levels, adjust pricing, and perform other essential inventory-related tasks to keep the catalog accurate and up-to-date.             |

## 🔧 Developer Commands

For developers working on NovelNest, the following commands are essential for development, testing, and maintenance tasks:

| Command                         | Description                                                                                                                                               |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ng serve`                      | Initiates the development server, compiling the application and serving it locally for testing and development purposes.                                  |
| `ng build --configuration prod` | Builds the application for production deployment. This command optimizes the code for performance and prepares it for a live environment.                 |
| `ng test`                       | Executes all unit tests defined within the project, ensuring that existing functionalities work as expected and new changes do not introduce regressions. |
| `ng lint`                       | Runs the linter to check the codebase for stylistic errors, potential bugs, and adherence to best practices and coding standards.                         |

## 🌍 Deployment

To deploy NovelNest to a production environment, follow these steps to configure the application and build it for optimal performance and security.

### Production Environment Configuration

Before building the application for production, you must configure the environment variables specific to your production setup. Open the `src/environments/environment.prod.ts` file in your code editor and update the following variables with your production API endpoints and Google Client ID:

```typescript
export const environment = {
  production: true,
  apiBase: "https://your-api.com/api", // Base URL for your production API
  apiBaseUrl: "https://your-api.com/api/v1", // Base URL for API version 1 in production
};
```

### Building for Production

After configuring the production environment, build the application using the Angular CLI command below. This command will compile the application, apply production optimizations (such as minification and tree-shaking), and prepare it for deployment to your web server or hosting service:

```bash
ng build --configuration production
```

This process generates a `dist/` folder (or similar, depending on your Angular configuration) containing the optimized static files ready for deployment.

## 🤝 Contributing to NovelNest

We welcome and appreciate contributions from the community to enhance NovelNest. To ensure a smooth collaboration process, please adhere to the following guidelines:

| Step                          | Command Example                                    |
| :---------------------------- | :------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create a Feature Branch**   | `git checkout -b feature/your-feature-name`        | This command creates a new branch for your specific feature or bug fix, isolating your changes from the main codebase.                                                                                      |
| **Make and Commit Changes**   | `git commit -m "feat: descriptive commit message"` | After making your changes, commit them with a clear and concise message that explains the purpose of your commit. Use conventional commit messages (e.g., `feat:`, `fix:`, `docs:`) for better readability. |
| **Push to Remote Repository** | `git push origin feature/your-feature-name`        | Push your local branch to the remote GitHub repository.                                                                                                                                                     |
| **Open a Pull Request**       | Via GitHub                                         | Once your changes are pushed, open a Pull Request (PR) on GitHub. This allows for code review and discussion before merging your changes into the main branch.                                              |

**Best Practices for Contributions:**

- **Adhere to the Angular Style Guide:** Ensure your code follows the established Angular coding conventions and best practices for consistency and readability.
- **Include Comprehensive Tests:** For any new features or bug fixes, please include relevant unit and/or integration tests to ensure code quality and prevent regressions.
- **Write Clear and Concise Commit Messages:** Your commit messages should accurately describe the changes made and why they were made, aiding in project history tracking and debugging.

## 🗺️ Project Roadmap

Our future development plans for NovelNest are outlined in the roadmap below, detailing upcoming features and their current status:

| Feature                                         | Status       | Description                                                                                                                                                                |
| :---------------------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📱 **Mobile Progressive Web App (PWA) Support** | Planned      | Enhancing the application to function as a Progressive Web App, providing an app-like experience on mobile devices, including offline capabilities and push notifications. |
| 🌐 **Multi-language Support**                   | Planned      | Implementing support for multiple languages to make NovelNest accessible to a wider global audience.                                                                       |
| 📦 **Dockerized Deployment**                    | Under Review | Exploring the option of containerizing the application using Docker for easier deployment, scalability, and environment consistency across different platforms.            |

## 📬 Support and Contact

For any inquiries, technical support, or general questions regarding NovelNest, please feel free to reach out through the following official channels:

| Method            | Link                                                             |
| :---------------- | :--------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Email**         | [yusuufashraaf@gmail.com](mailto:yusuufashraaf@gmail.com)        | For direct communication and detailed inquiries.                                                         |
| **GitHub Issues** | [issues page](https://github.com/your-username/NovelNest/issues) | For reporting bugs, suggesting features, or discussing specific technical issues related to the project. |

## 📄 License

This project is licensed under the **MIT License**. This open-source license permits reuse under certain conditions, providing flexibility for others to use, modify, and distribute the software.

---
