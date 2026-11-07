# Expense Tracker — React + Vite (original design preserved)

This package wraps your supplied HTML/CSS/JavaScript Expense Tracker in a React + Vite application. The original pages, stylesheet, JavaScript, charts, labels, and Local Storage keys are preserved under `public/` and the exact original uploads are backed up under `public/source/`.

## Run locally
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install`
3. Run `npm run dev`
4. Open the localhost URL printed by Vite.

## Modules
- **User:** choose User Login / Signup. The original `login.html` handles the existing user experience and stores its data using your original Local Storage implementation. Once login is detected, the React shell shows the original dashboard.
- **Admin:** choose Admin Login. Demo credentials: `admin@expensetracker.local` / `Admin@123`. The admin panel displays browser-local registered-user and transaction counts.

## Important
This is a college/demo implementation. Local Storage authentication is not secure, and browser-local accounts are not shared between devices. Do not use it for real financial data. Vercel configuration is included, but this package has not been deployed to your Vercel account.

## Original source
All 13 original files are preserved in `public/source/`. Two navigation aliases (`dashboard.html` and `transactions.html`) are included so existing links to those spellings resolve while retaining your originals.
