# HR System Dashboard

A full-featured HR System Dashboard built with Angular v20 and Bootstrap 5.

## Features

- **Fixed Sidebar Navigation** with company logo and menu items
- **Top Navbar** with page title, check-in/check-out button, and user profile dropdown
- **Dynamic Breadcrumbs** that update based on current route
- **Responsive Design** with mobile-friendly sidebar collapse
- **8 Main Pages**:
  - Dashboard
  - Company Data
  - Contracts
  - Leaves & Holidays
  - Employees Data
  - Payroll
  - Attendance
  - Vacancies

## Color Palette

- Primary: #E67E22 (Orange)
- Secondary: #628141 (Green)
- Accent: #8BAE66 (Light Green)
- Light: #EBD5AB (Beige)
- White: #FFFFFF

## Project Structure

```
src/app/
├── components/
│   ├── layout/          # Main layout component
│   ├── sidebar/         # Sidebar navigation
│   ├── navbar/          # Top navigation bar
│   ├── breadcrumb/      # Breadcrumb component
│   └── pages/           # Page components
│       ├── dashboard/
│       ├── company-data/
│       ├── contracts/
│       ├── leaves-holidays/
│       ├── employees-data/
│       ├── payroll/
│       ├── attendance/
│       └── vacancies/
└── services/
    ├── navigation.service.ts    # Page title & breadcrumb management
    ├── attendance.service.ts     # Check-in/check-out functionality
    └── user.service.ts          # User profile management
```

## Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
