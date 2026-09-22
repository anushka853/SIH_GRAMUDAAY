# GramUday AI

**National Rural Enterprise Feasibility & Credit Advisory System**

A multilingual web application for rural entrepreneurs, bank officers, and administrators to evaluate business feasibility, calculate concessional loans, and manage micro-enterprise funding.

---

## Features

- **Entrepreneur Portal** — AI-powered feasibility report generation with hyper-local market analysis, SWOT breakdown, competitor density radar, and optimal pricing strategy
- **Loan Calculator** — Automatic routing to Micro Finance Scheme (6.5% interest) or Term Loan Scheme (8.0% interest) based on project cost
- **Peer Micro-Investment Pool** — Crowdfund margin capital directly from community, bypassing brokers
- **Bank Portal** — Review loan applications with AI counter-proposal engine for saturated markets
- **Admin Dashboard** — National regional enterprise metrics and fund distribution tracking
- **Multilingual Support** — 8 Indian languages (English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada)
- **Voice Assistant** — Text-to-speech for accessibility

---

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Linting**: Oxlint

---

## Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm 9+ or yarn/pnpm

---

## Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 3. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint for code quality |

---

## Running with Docker

### Option 1: Using Dockerfile

#### Build the Docker Image

```bash
docker build -t gramuday-ai .
```

#### Run the Container

```bash
docker run -p 5173:80 gramuday-ai
```

The app will be available at **http://localhost:5173**

### Option 2: Using Docker Compose

```bash
docker-compose up -d
```

The app will be available at **http://localhost:5173`

To stop:

```bash
docker-compose down
```

---

## Project Structure

```
SIH_GRAMUDAAY/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AirtableWorkflowNav.jsx
│   │   ├── LoginModal.jsx
│   │   ├── Navbar.jsx
│   │   ├── SchemeBadge.jsx
│   │   └── VoiceButton.jsx
│   ├── context/            # React context providers
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── pages/              # Main application pages
│   │   ├── AdminPortal.jsx
│   │   ├── BankPortal.jsx
│   │   ├── EntrepreneurPortal.jsx
│   │   └── PeerPooling.jsx
│   ├── utils/              # Utility modules
│   │   ├── aiFeasibilityEngine.js
│   │   ├── financialEngine.js
│   │   ├── mockData.js
│   │   ├── speechUtils.js
│   │   └── translations.js
│   ├── App.jsx             # Main application component
│   ├── App.css             # App-specific styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── Dockerfile              # Docker configuration
└── docker-compose.yml      # Docker Compose configuration
```

---

## Usage Guide

### Selecting a Role

On launch, you'll see a login modal to select your role:

1. **Rural Entrepreneur** — Access feasibility reports, loan calculator, and peer investment pools
2. **Bank Officer** — Review loan applications and approve/reject with AI assistance
3. **System Admin** — View national dashboard and regional metrics

### Entrepreneur Workflow

1. Enter your available margin capital (10% of project cost)
2. Select your geographic location (village/block/district)
3. Describe your proposed business idea
4. Click "Generate AI Feasibility Report" to get:
   - Market reach analysis (5-10 km radius)
   - Underserved opportunity detection
   - Dynamic SWOT breakdown
   - Local threat matrix with mitigation strategies
   - Competitor density radar
   - Optimal pricing recommendations
   - Auto-routed loan scheme selection

### Bank Officer Workflow

1. View pending loan applications in the queue
2. Review AI-generated feasibility reports
3. Check for saturation warnings and counter-proposals
4. Approve, reject, or request modifications

---

## Environment Variables

No environment variables are required for local development. The app uses mock data for demonstration.

For production deployment, you may want to configure:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API endpoint (if applicable) |
| `VITE_ENV` | Environment (development/production) |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is developed for Smart India Hackathon (SIH).

---

## Acknowledgments

- Built for National Rural Enterprise Development
- Supports Government of India's Micro Finance & Term Loan Schemes
- Designed for State Channelizing Agencies (SCAs) and Channelizing Agencies (CAs)
