# React Native Sign-Up Form (Validation + Form State)

## Table of Contents
- About the Application
  - React Native
  - Features
- Getting Started
  - Dependencies
  - Installation
  - API Used
- How to Use the Application
- Assumptions / Limitations

---

## About the Application

### Made with React Native
This project is a **React Native (Expo)** sign-up form that validates user input, shows field-level error messages, tracks overall form status, and gives feedback on submit and on field change.

### Features
- **Required fields** First Name, Last Name, Gender (radio buttons), Country (picker), Age, Phone, Email, Password
- **Validation + field errors** for every input (required + format checks)
- **Form status tracking:** `Empty`, `Changing`, `Incomplete`, `Ready`
- **Submit behavior**
  - Invalid: shows error alert, keeps inputs so user can fix them
  - Valid: shows success alert, resets all fields (including radio + country)
- Country list loads dynamically and is sorted alphabetically

---

## Getting Started

### Dependencies
Make sure you have these installed first:
- **Node.js** (LTS recommended)
- **Expo CLI** (optional, you can also use `npx`)
- Expo Go app (optional) if testing on a physical phone

### Installation

1) Install project dependencies:
```bash
npm install
```
2) Install external libraries used in this application:
  ```
npx expo install expo-linear-gradient
npx expo install react-native-safe-area-context
npm install react-native-radio-buttons-group
npm install @react-native-picker/picker
```
3) Run the app:
```bash
npx start
```
### API Used
Countries are fecthed from the REST Countries API:
- Endpoint used:
  -  https://restcountries.com/v3.1/all?fields=name
### How to Use the Application

1) Fill out all fields in the form.
2) Select a gender
3) Choose a country
4) Press **Submit**

**If everything is valid:**
  - A success alert is shown
  - The form resets.

**If invalid:**
  - An error alert is shown
  - The form stays filled so the user can fix the incorrect fields
  - Field-level error messages show what needs to be corrected

### Assumptions/Limitations
- Internet conection is required to load the country list
- Phone validation uses an international number regex
