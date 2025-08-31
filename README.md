# Prompt Analyzer

A web application with frontend and backend components for analyzing prompts.

## Project Structure

```
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── backend/
    ├── server.js
    └── package.json
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd aiv2-prompt-analyzer
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

## Running the Application

You can run both frontend and backend simultaneously using:

```bash
cd backend
npm run dev
```

This will start:
- Backend server
- Frontend static server

## Environment Variables

Create a `.env` file in the backend directory with your required environment variables.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- API Integration: Google Generative AI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
