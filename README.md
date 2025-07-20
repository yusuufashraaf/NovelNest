# NovelNest: An Advanced Online Bookstore Application

## 🌟 Overview

**NovelNest** is a full-stack online bookstore built with Angular 20, offering a responsive experience across all devices. It integrates robust admin controls, secure authentication, and real-time updates, providing a powerful platform for managing and exploring books online.

## 🚀 Core Features

| Module             | Description                                                                                                        |
|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 👤 **User Portal**       | Secure registration (OTP, Google, GitHub), profile management, reviews, wishlists, and order tracking.      |
| 📚 **Books**             | Extensive catalog browsing, advanced filters, and smart sorting capabilities.                             |
| 🛒 **Shopping Cart**     | Cart management and a seamless checkout flow with confirmation messages.                                  |
| 🔐 **Security**          | JWT authentication, route guards, OTP, and XSS prevention for secure user sessions and data integrity.    |
| 📊 **Admin Dashboard**   | Real-time analytics, inventory, order, and user management powered by Socket.IO.                          |

## 🧱 Technology Stack

| Category                   | Technology                     |
|----------------------------|---------------------------------|
| Frontend Development       | Angular 20, Bootstrap 5.3       |
| Programming Language       | TypeScript 5.4                  |
| UI Icons                   | Font Awesome                    |
| Real-time Communication    | Socket.IO (Client-side)         |
| Reactive Programming       | RxJS                            |

### 🧰 Key Libraries

| Library            | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| NGX Toastr         | Toast notifications                                                     |
| NGX Infinite Scroll| Infinite scrolling                                                       |
| SweetAlert2        | Beautiful and responsive modals/alerts                                  |
| Angular Forms      | Reactive form handling and validation                                   |

## 📁 Project Structure (Simplified)

```bash
src/
├── app/
│   ├── components/
│   │   ├── home/, browse-books/, cart/, wishlist/, book-details/
│   │   ├── user-profile/
│   │   │   ├── orders-history/, purchased-books/, reviews/, personal-info/
│   │   ├── dashboard/
│   │   │   ├── users/, products/, orders/, brands/, categories/, analytics/
│   │   ├── auth/
│   │   ├── static/
│   ├── services/
│   ├── directives/, guards/, interceptors/, interfaces/, models/
│   ├── shared/components/
├── assets/Logo/
└── environments/
```

## 🛠️ Setup & Installation

### System Requirements

| Tool        | Version |
|-------------|---------|
| Node.js     | 18+     |
| Angular CLI | Latest  |

### Installation Steps

```bash
git clone https://github.com/yusuufashraaf/NovelNest.git
cd NovelNest
npm install
```

### Environment Configuration

Update `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBase: 'http://localhost:5000/api',
  apiBaseUrl: 'http://localhost:5000/api/v1',
};
```

### Run Locally

```bash
ng serve
```
Access via: [http://localhost:4200](http://localhost:4200)

## 🔐 Security Features

| Feature                 | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| JWT Authentication      | Secure user session with token validation                                  |
| OTP Verification        | Email OTP for critical actions                                              |
| Route Guards            | Role-based and authentication-based access control                         |
| Input Sanitization      | Prevents XSS attacks                                                        |
| Secure Socket.IO        | Token-validated real-time updates                                           |

## 📊 Admin Dashboard Capabilities

| Feature           | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| Analytics         | KPIs on revenue, orders, book/user performance                              |
| Charts            | Bar/pie charts for visual insights                                           |
| Real-time Orders  | Live order updates with Socket.IO                                            |
| User Management   | Admin moderation and review management                                       |
| Inventory Control | Full control over book catalog, stock, and pricing                           |

## 🛠️ Developer Commands

| Command                          | Description                          |
|----------------------------------|--------------------------------------|
| `ng serve`                       | Start local dev server               |
| `ng build --configuration prod`  | Build for production                 |
| `ng test`                        | Run tests                            |
| `ng lint`                        | Run code linter                      |

## 🌍 Deployment

### Production Environment

Update `environment.prod.ts`:

```ts
export const environment = {
  production: true,
  apiBase: 'https://your-api.com/api',
  apiBaseUrl: 'https://your-api.com/api/v1',
};
```

### Build

```bash
ng build --configuration production
```

## 🤝 Contributing

| Step                    | Example Command                           |
|-------------------------|-------------------------------------------|
| Create Feature Branch   | `git checkout -b feature/your-feature`    |
| Commit Changes          | `git commit -m "feat: add new feature"`  |
| Push to GitHub          | `git push origin feature/your-feature`    |
| Open Pull Request       | On GitHub                                 |

### Best Practices

- Follow Angular Style Guide
- Add unit/integration tests
- Use conventional commit messages

## 🗺️ Roadmap

| Feature                      | Status       | Description                                                                 |
|------------------------------|--------------|-----------------------------------------------------------------------------|
| Mobile PWA Support           | Planned      | Offline capabilities, mobile-first UX                                      |
| Multi-language Support       | Planned      | i18n support for global audiences                                           |
| Dockerized Deployment        | Under Review | Containerized setup for scalable deployment                                |

## 📩 Support & Contact

| Method         | Link                                                                 |
|----------------|----------------------------------------------------------------------|
| Email          | [yusuufashraaf@gmail.com](mailto:yusuufashraaf@gmail.com)            |
| GitHub Issues  | [GitHub Issues](https://github.com/your-username/NovelNest/issues)   |

## 📄 License

Licensed under the **MIT License**. Free to use, modify, and distribute under the license terms.

