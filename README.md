# FundScreener

FundScreener is a full-stack mutual fund analytics and screening platform developed during my internship at FundsIndia (WestBridge Capital) in June–July 2025. The project leverages a Django backend and a React frontend to provide a modern, interactive experience for both end-users and administrators.

---

## Project Overview

FundScreener enables users to analyze, compare, and simulate mutual fund investments with real-time and historical data. The platform is designed for extensibility, robust data handling, and a clean, user-friendly interface.

---

## Key Features

### Full Stack Architecture
- **Backend:** Django REST Framework for robust API design, admin interface, and business logic.
- **Frontend:** React.js with Chart.js for dynamic, interactive data visualization and Bootstrap for responsive UI.

### Fund Analytics Dashboard
- View detailed fund metrics (NAV, AUM, Sharpe/Sortino ratios, risk, etc.).
- Visualize fund performance with interactive charts and a custom riskometer gauge.
- SIP and Lumpsum investment simulators using real historical NAV data.

### Bulk Data Import/Export
- Admins can upload Excel files to bulk import fund data and historical NAVs, using django-import-export and pandas.
- Handles extra, missing, or blank columns gracefully—only updates fields present in the file, keeping the rest unchanged.

### Historical Data Tracking
- Uses django-simple-history to maintain a complete change log for each fund, enabling accurate time-series analysis and simulations.

### Article Management
- Admins can create and manage articles/updates for each fund.
- Users can read recent articles in a dashboard card, with modal popups for full details.

### Admin Interface
- User-friendly Django admin for managing funds, articles, and bulk data operations.
- Import/Export buttons for Excel/CSV data management.

---

## Tech Stack

- **Backend:** Django, Django REST Framework, django-simple-history, django-import-export, pandas, openpyxl
- **Frontend:** React.js, Chart.js (react-chartjs-2), Bootstrap
- **Database:** SQLite (or PostgreSQL, as configured)
- **Other:** Custom management commands for advanced data import

---

## Learnings & Highlights

- Built a scalable, modular full-stack application from scratch.
- Integrated complex data import/export workflows and automated historical tracking.
- Developed advanced data visualizations and investment simulators.
- Gained experience in REST API design, backend-frontend integration, and robust admin tooling.
- Practiced best practices in code organization, documentation, and version control.

---

