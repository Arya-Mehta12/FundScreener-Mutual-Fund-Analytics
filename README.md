# FundScreener – Mutual Fund Analytics & Screening Platform

FundScreener is a full-stack mutual fund analytics and screening platform developed during my internship at FundsIndia (WestBridge Capital) in June–July 2025. The project leverages a Django backend and a React frontend to provide a modern, interactive experience for both end-users and administrators.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)
- [Learnings & Highlights](#learnings--highlights)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Project Overview

FundScreener enables users to analyze, compare, and simulate mutual fund investments with real-time and historical data. The platform is designed for extensibility, robust data handling, and a clean, user-friendly interface.

---

## Features

- **Full Stack Architecture**
  - **Backend:** Django REST Framework for robust API design, business logic, and admin interface.
  - **Frontend:** React.js with Chart.js for dynamic, interactive data visualization and Bootstrap for responsive UI.

- **Fund Analytics Dashboard**
  - View detailed fund metrics: NAV, AUM, Sharpe/Sortino ratios, risk, etc.
  - Visualize fund performance with interactive charts and a custom riskometer gauge.
  - SIP and Lumpsum investment simulators using real historical NAV data.

- **Bulk Data Import/Export**
  - Admins can upload Excel files to bulk import fund data and historical NAVs.
  - Utilizes django-import-export and pandas for efficient data handling.
  - Handles extra, missing, or blank columns gracefully—only updates fields present in the file.

- **Historical Data Tracking**
  - Uses django-simple-history to maintain a complete change log for each fund.
  - Enables accurate time-series analysis and investment simulations.

- **Article Management**
  - Admins can create and manage articles/updates for each fund.
  - Users can read recent articles in a dashboard card, with modal popups for full details.

- **Admin Interface**
  - User-friendly Django admin for managing funds, articles, and bulk data operations.
  - Import/Export buttons for Excel/CSV data management.

---

## Screenshots

> *Add screenshots or GIFs of the dashboard, analytics, and admin interface here to visually demonstrate the platform's capabilities.*

---

## Architecture

graph TD
A[React Frontend] -->|REST API| B[Django Backend]
B --> C[Database (SQLite/PostgreSQL)]
B --> D[Admin Interface]
B --> E[Bulk Data Import/Export]


---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Django, Django REST Framework, django-simple-history, django-import-export, pandas, openpyxl |
| Frontend   | React.js, Chart.js (react-chartjs-2), Bootstrap |
| Database   | SQLite (default), PostgreSQL (optional)         |
| Other      | Custom management commands for data import      |

---

## Setup & Installation

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- pipenv or virtualenv (recommended)

### Backend Setup

git clone https://github.com/Arya-Mehta12/FundScreener-Mutual-Fund-Analytics.git
cd FundScreener-Mutual-Fund-Analytics/backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


### Frontend Setup

cd ../frontend
npm install
npm start


### Configuration

- **Database:** By default, uses SQLite. To use PostgreSQL, update `settings.py` in the backend.
- **Environment Variables:** Configure API endpoints and secrets in `.env` files as needed.

---

## Usage Guide

- Access the frontend at `http://localhost:3000`
- Admin interface at `http://localhost:8000/admin`
- Import/Export fund data using the admin panel
- Simulate SIP/Lumpsum investments and analyze fund performance

---

## API Endpoints

The backend exposes RESTful APIs for all major resources:

- `/api/funds/` – List, create, update, and delete funds
- `/api/navs/` – Historical NAV data
- `/api/articles/` – Fund-related articles and updates
- `/api/simulate/` – SIP and Lumpsum investment simulations

*For detailed API documentation, see the [Swagger/OpenAPI docs](http://localhost:8000/swagger/) when the backend is running.*

---

## Learnings & Highlights

- Built a scalable, modular full-stack application from scratch
- Integrated complex data import/export workflows and automated historical tracking
- Developed advanced data visualizations and investment simulators
- Gained experience in REST API design, backend-frontend integration, and robust admin tooling
- Practiced best practices in code organization, documentation, and version control

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- FundsIndia (WestBridge Capital) for the internship opportunity
- Mentors and team members for guidance and feedback
- Open-source community for libraries and tools

---

*For any questions or walkthrough requests, please contact Me at Arya.Mehta12@gmail.com.*




