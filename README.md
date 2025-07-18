# Next.js Mobile Phone Auth Dashboard

A polished Next.js (App Router) demo featuring phone‑number login/signup, OTP fallback for returning users, and a protected dashboard—built with TypeScript, SCSS modules, and React Context/localStorage.

---

## 🚀 Features

- **Iranian Phone Validation**  
  - Live client‑side validation on each keystroke  
  - Supports Persian (۰–۹) and Latin (0–9) digits  
  - Accepts both `09XXXXXXXXX` and `+98XXXXXXXXXX` formats  
  - Contextual error messages (“فقط اعداد و علامت + مجاز است”, length and prefix hints)

- **Signup / New‑User Flow**  
  - Fetches a random user from [RandomUser API](https://randomuser.me/api)  
  - Persists multiple user records in `localStorage.users` array  
  - Attaches your entered phone as `IRN_NUMBER` and `status: "logged_in"`

- **Login / Returning‑User Flow (OTP)**  
  - On matching `IRN_NUMBER`, skips API call  
  - Generates a 6‑digit OTP, shows it in a toast (via **react-hot-toast**)  
  - Verifies OTP in a custom `OTPInput` component  
  - Marks user’s `status` back to `"logged_in"`

- **Protected Dashboard**  
  - Uses a `currentIRN` marker in localStorage to identify the active user  
  - Middleware or client‑side guard ensures only `status === "logged_in"` can access  
  - Clean, responsive UI: avatar, full name, email, phone, IRN_NUMBER cards  
  - Logout clears session state and redirects to login

- **UI & Styling**  
  - **SCSS Modules** with nesting and CSS‑module scoping  
  - Reusable components: `TextInput`, `Button`, `Spinner`, `OTPInput`  
  - **react-icons** for inline success/error indicators and form embellishments  
  - Gradient backgrounds, spacious cards, smooth transitions, toast alerts

---

## 🛠️ Tech Stack

- **Next.js** (v13+ App Router)  
- **TypeScript**  
- **SCSS Modules**  
- **React Hooks** (`useState`, `useEffect`)  
- **localStorage** & **React Context** for multi‑user state  
- **react-hot-toast** for non‑blocking OTP toasts  
- **react-icons** for inline icons (FiCheckCircle, FiXCircle, FiUser, FiPhone, FiArrowRight)

---

## 📦 Installation & Startup

1. **Clone & Install**  
   
   - git clone git@github.com:hessam72/nextjs-mini-panel.git
   - cd nextjs-mini-panel
   - npm install
   - npm run dev
