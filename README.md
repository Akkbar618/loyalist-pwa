# Loyalist PWA

Modern PWA loyalty application with Firebase authentication, QR codes, and multi-language support.


```

## 🔧 Configuration

### Firebase (Optional)

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

**Note:** The app works without Firebase in **Mock Mode** — just start the dev server!

### GitHub Actions deploy (Firebase Hosting)

To enable the deploy workflows, add a Firebase service account JSON to GitHub repository secrets:

- Preferred: `FIREBASE_SERVICE_ACCOUNT_TESTPLOYALIST`
- Alternative (generic): `FIREBASE_SERVICE_ACCOUNT`

The workflows will skip deploys if neither secret is configured.

## 📁 Project Structure

```
├── public/
│   ├── app.js              # Main entry point
│   ├── core/               # State, Router, EventBus
│   ├── components/         # UI components
│   ├── screens/            # App screens
│   ├── utils/              # Utilities
│   ├── styles/             # CSS modules
│   └── lib/                # Firebase wrapper
├── tests/                  # Unit tests
├── vite.config.js          # Vite configuration
└── vitest.config.js        # Test configuration
```

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run deploy` | Deploy to Firebase |

## 📦 Tech Stack

- **Build:** Vite + Terser
- **Styling:** CSS Modules
- **Testing:** Vitest
- **Backend:** Firebase (Auth, Firestore)
- **PWA:** Service Worker

## 📄 License

MIT
