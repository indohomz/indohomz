# 🏠 IndoHomz - Premium Co-Living Platform

<div align="center">

![IndoHomz Banner](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop)

**India's Premier Co-Living & Rental Platform for Modern Professionals**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com)

[Live Demo](https://indohomz.vercel.app) • [Documentation](#-documentation) • [Features](#-features) • [Installation](#-installation)

</div>

---

## ✨ Features

### 🎨 Premium UI/UX
- **Light Professional Theme** - Clean, modern design inspired by Airbnb & Stripe
- **Video-First Hero Section** - Engaging lifestyle videos showcasing properties
- **3D Hover Effects** - Interactive property cards with smooth animations
- **Responsive Design** - Optimized for all devices (Mobile, Tablet, Desktop)

### 🗺️ Google Maps Integration
- **Location Search** - Search properties by neighborhood
- **Property Maps** - Embedded Google Maps on property details
- **Neighborhood Explorer** - Browse properties by popular areas
- **Distance Indicators** - Metro, Mall, Hospital proximity info

### 🏡 Property Management
- **Verified Listings** - 100% verified properties with real photos
- **Advanced Filters** - Filter by type, price, bedrooms, amenities
- **Real-time Availability** - Live availability status updates
- **Property Ratings** - Verified resident reviews & ratings

### 💬 Instant Communication
- **WhatsApp Integration** - One-click WhatsApp chat
- **Booking Forms** - Schedule property visits online
- **24/7 Support** - Round-the-clock customer assistance

### 🤖 AI-Powered Features
- **Smart Search** - AI-powered property recommendations
- **Report Generation** - Automated analytics reports
- **Review Summarizer** - AI-generated review summaries

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Query | Data Fetching |
| React Router | Navigation |

### Backend
| Technology | Description |
|------------|-------------|
| FastAPI | API Framework |
| Python 3.10+ | Backend Language |
| SQLAlchemy | ORM |
| PostgreSQL | Database |
| Alembic | Migrations |
| Pydantic | Validation |

### Infrastructure
| Technology | Description |
|------------|-------------|
| Docker | Containerization |
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Supabase | Database Hosting |

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or Supabase account)

### 1. Clone the repository
```bash
git clone https://github.com/indohomz/indohomz.git
cd indohomz
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Run migrations
alembic upgrade head

# Seed the database (optional)
python seed_db.py

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📁 Project Structure

```
indohomz/
├── backend/
│   ├── app/
│   │   ├── api/routers/      # API endpoints
│   │   ├── core/             # Configuration
│   │   ├── database/         # Models & connection
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # Business logic
│   ├── alembic/              # Database migrations
│   ├── main.py               # FastAPI app entry
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── App.tsx           # Main app
│   ├── index.html
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/indohomz
OPENAI_API_KEY=your_openai_key
SECRET_KEY=your_secret_key
ALLOWED_ORIGINS=http://localhost:5173,https://indohomz.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📱 Screenshots

<div align="center">

| Landing Page | Properties |
|:---:|:---:|
| ![Landing](https://via.placeholder.com/400x300?text=Landing+Page) | ![Properties](https://via.placeholder.com/400x300?text=Properties) |

| Property Detail | Google Maps |
|:---:|:---:|
| ![Detail](https://via.placeholder.com/400x300?text=Property+Detail) | ![Maps](https://via.placeholder.com/400x300?text=Google+Maps) |

</div>

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**IndoHomz Team**

- 📧 Email: info@indohomz.com
- 💬 WhatsApp: +91 99999 99999
- 🌐 Website: [indohomz.com](https://indohomz.com)

---

<div align="center">

**Made with ❤️ in India**

© 2025 IndoHomz. All rights reserved.

</div>
