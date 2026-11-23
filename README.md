# 💰 Kharcha Book (React + Vite)

A modern, dynamic, and private personal finance & expense tracking application built with **React**, **Vite**, and **Tailored Design System**.

---

## ✨ Features

### 🌐 1. Dynamic Multi-Language Support (i18n)
Switch languages on-the-fly from the header or directly on the login screen:
- **English**
- **हिंदी (Hindi)** — Pure, authentic Hindi translation
- **Hinglish** — Conversational Roman Hindi/English mix commonly used across India
- **मराठी (Marathi)** — Regional Devanagari translation

### 🔐 2. Specific Login & Password for Every Person (Multi-User)
- Every user gets their own private account with an individual **username** and **password**.
- **User Registration**: Anyone can create a new account with custom name, username, password, and avatar.
- **Account Isolation**: Kunal's expenses and savings are completely private from Riya's, and vice versa.
- **Pre-configured Demo Accounts** (for immediate testing):
  - **Username**: `kunal` | **Password**: `kunal123` (Preloaded with sample salary, rent, chai, grocery expenses & Goa trip savings goal)
  - **Username**: `riya` | **Password**: `riya123`

### 🔄 3. Persistent Login ("Logged In Always")
- The user is remembered across page refreshes, browser restarts, and tab closures via `localStorage` session management.
- Once logged in, the user stays logged in until they choose to explicitly log out from their profile menu.

### 📊 4. Dynamic Dashboard & Overview
- **Real-Time Available Balance**: Dynamic formula calculation (`Income − Spent − Moved to Savings`).
- **Interactive 6-Month Trend Chart**: Monthly comparison of Income vs. Spent with clickable month bars.
- **Payment Mode Breakdown**: Tracks UPI, Cash, Card, and Bank with separate In, Out, and Net balances.
- **Spending Donut Chart**: Dynamic animated SVG chart breaking down spending by category with percentages.

### 📝 5. Entries & Transactions Management
- Add expenses or income with quick presets (☕ Chai ₹20, 🛺 Auto ₹50, 🛒 Grocery ₹500, 📱 Recharge ₹299, etc.).
- Quick date selectors (**Today**, **Yesterday**).
- Filter by payment mode (**UPI**, **Cash**, **Card**, **Bank**).
- Real-time search across notes and categories.
- Safe two-step delete confirmation.

### 🎯 6. Savings & Financial Goals
- Create custom savings targets (e.g. Goa trip, new phone, emergency fund).
- Animated circular progress meters showing percentage towards target.
- Confetti celebration 🎉 automatically triggered when a goal is reached (100%).
- Track deposits and withdrawals with notes and timestamps.

### 🎨 7. Personalization & Data Portability
- **Accent Theme Swatches**: Lagoon Teal, Blossom Pink, Dusk Indigo, Amber Gold, Emerald Green.
- **Dark Mode / Light Mode**: Smooth transition with system dark mode support.
- **Data Export & Import**: Download a full JSON backup of your records and restore it anytime.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 👤 Author
Created by **Kunal Patle**
