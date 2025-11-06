# Vending Frontend

This project is a static frontend application that connects to an existing Node/Express backend for managing vending machine operations. It is structured as a single-page application (SPA) and utilizes JavaScript for dynamic interactions.

## Project Structure

```
vending-frontend
├── public
│   ├── index.html          # Main HTML structure of the application
│   └── favicon.ico         # Favicon for the application
├── src
│   ├── js
│   │   ├── app.js          # UI logic and screen switching
│   │   ├── ui.js           # User interface components and interactions
│   │   ├── api
│   │   │   ├── machines.api.js  # API calls related to machines
│   │   │   ├── slots.api.js     # API calls for managing slots
│   │   │   ├── skus.api.js      # API calls for handling SKUs
│   │   │   ├── refill.api.js    # API calls for managing refills
│   │   │   ├── sales.api.js     # API calls for handling sales
│   │   │   └── stock.api.js     # API calls for managing stock
│   │   └── utils
│   │       └── fetchWrapper.js  # Utility for making fetch requests
│   └── css
│       └── styles.css         # CSS styles for the application
├── assets                      # Static assets like fonts and icons
├── package.json               # npm configuration file
├── .gitignore                 # Files and directories to ignore by Git
└── README.md                  # Documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd vending-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Open `public/index.html` in your browser to view the application.

## Usage Guidelines

- The application allows users to interact with vending machine data, manage slots, SKUs, refills, sales, and stock.
- Each functionality is encapsulated in its respective API module, making it easy to manage and extend.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.