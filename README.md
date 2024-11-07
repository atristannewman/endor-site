# Endor Site

A React-based web application for managing user interactions, payments, and authentication, integrated with Stripe and Stytch.

## Table of Contents

- [Features](#features)
- [Initial Requirements](#initial-requirements)
- [Setup Procedure](#setup-procedure)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Start the Development Server](#4-start-the-development-server)
- [Revisions](#revisions)
- [To-Dos](#to-dos)
  - [1. Security](#1-security)
  - [2. Code Quality](#2-code-quality)
  - [3. Testing](#3-testing)
  - [4. Documentation](#4-documentation)
  - [5. Features](#5-features)
  - [6. DevOps](#6-devops)
- [Contributing](#contributing)

## Features

- **User Authentication:** Secure login and registration using Stytch's magic links.
- **Payment Processing:** Manage payments and subscriptions with Stripe integration.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Dashboard:** User-friendly interface for managing account details and payment methods.
- **API Integration:** Seamless communication with the Endor API for data management.

## Initial Requirements

Before setting up the project, ensure you have the following:

1. **Node.js (v14 or Higher):** Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
2. **Stripe Account:** For handling payments and managing payment methods.
3. **Stytch Account:** For implementing authentication via magic links.
4. **Endor API Setup:** Ensure the Endor API is set up and running.

## Setup Procedure

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd endor-site
```

### 2. Install Dependencies

Use npm to install all necessary dependencies.

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory of the site with the following variables:

```env
# Environment
REACT_APP_ENV=development

# Server Configuration
REACT_APP_SERVER_URL=http://localhost:4321

# Stripe Configuration
REACT_APP_STRIPE_KEY=your_stripe_public_key

# Stytch Configuration
REACT_APP_STYTCH_PUBLIC_TOKEN=your_stytch_public_token
```

**Notes:**

- Replace placeholders like `your_stripe_public_key`, `your_stytch_public_token`, etc., with your actual credentials.
- Ensure that `.env` is added to `.gitignore` to prevent sensitive information from being pushed to version control.

### 4. Start the Development Server

Launch the site in development mode.

```bash
npm start
```

The application should be running on `http://localhost:3000`.

##

## Revisions

### v0.1.0

- Initial release with core functionality
- User authentication with Stytch
- Stripe payment integration
- Basic dashboard for account management

## To-Dos

### 1. Security

- **Implement Rate Limiting:** Protect the application from excessive requests.
- **Enhance Error Handling:** Provide more descriptive and consistent error responses.
- **Add Input Validation:** Ensure all user inputs are validated and sanitized.

### 2. Code Quality

- **Split Dashboard Component:** Break down the Dashboard component into smaller, manageable components.
- **Implement Consistent Error Handling Across Components:** Standardize how errors are managed and displayed.
- **Add TypeScript Support:** Introduce TypeScript for type safety and better maintainability.
- **Add JSDoc Comments to All Functions:** Provide clear documentation for all functions and modules.

### 3. Testing

- **Add Unit Tests:** Test individual components for expected functionality.
- **Add Integration Tests:** Ensure different components work together seamlessly.
- **Set Up CI Pipeline with Test Automation:** Automate testing workflows using Continuous Integration tools.

### 4. Documentation

- **Add User Guide:** Provide a comprehensive guide for end-users.
- **Add Developer Documentation:** Include setup instructions and codebase overview for developers.

### 5. Features

- **Implement User Roles and Permissions:** Enhance security by defining user access levels.
- **Add Batch Processing Capabilities:** Improve efficiency by handling multiple operations simultaneously.
- **Enhance Payment Error Handling:** Provide more robust mechanisms for managing payment-related errors.

### 6. DevOps

- **Add Docker Support:** Containerize the application for consistent deployment environments.
- **Set Up Automated Deployments:** Streamline the deployment process with automation tools.
- **Add Monitoring and Alerting:** Implement systems to monitor application health and alert on issues.
- **Implement Proper Logging System:** Ensure detailed and structured logging for easier debugging and monitoring.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

1. Fork the Repository
2. Create a Feature Branch: `git checkout -b feature/YourFeature`
3. Commit Your Changes: `git commit -m 'Add some feature'`
4. Push to the Branch: `git push origin feature/YourFeature`
5. Open a Pull Request