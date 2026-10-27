# AegisBank AI — Enterprise Multi-Agent Banking Chatbot UI

A high-performance enterprise banking user interface built with **React 19**, **Vite**, and **Vanilla CSS** design system, connected to the **Microsoft Agent Framework** multi-agent backend.

---

## 🌟 Key Features

1. **Intelligent Domain Triage & Routing Visualization**:
   - Displays real-time validation badges: `✅ Verify Banking.... (Confidence: 98%)` or `🚫 Non-Banking Query (Domain Refusal)`.
   - Visualizes downstream routing: `⚡ Routed to: Account & Transaction Agent`, `🛡️ Cards & Security Agent`, or `💡 Advisory & Support Agent`.

2. **Entity Parameter Extraction Rack**:
   - Structured visual display of extracted parameters: Category, Intent, Amount, Currency, Recipient, Card Identifier, Source Account, and missing fields.

3. **Interactive Action Cards**:
   - **Funds Transfer**: Verification card with instant "Authorize & Send" action, celebration micro-animations, and live balance updates.
   - **Emergency Card Lock**: Immediate 0-second security freeze card for lost/stolen cards with critical priority badge.
   - **Account Portfolio Snapshot**: Real-time checking and high-yield savings balance overview with statement download.

4. **Deep Intelligence Inspector Drawer**:
   - Visualizes the 5-step hierarchical agent pipeline.
   - Synthesized and enriched gateway query preview.
   - Interactive formatted JSON payload with 1-click clipboard copy.

5. **Multi-Agent Ecosystem Topology Modal**:
   - Comprehensive interactive roadmap of all 4 agents in the planned banking architecture.

6. **Customer Profile Switcher**:
   - Instant toggle between test customer profiles (`Alex Morgan`, `Sarah Connor`, `David Kim`) with dynamic balances and card information.

7. **Flexible UI Modes**:
   - **Simple Chat Mode**: Clean, consumer-friendly conversational interface.
   - **Advanced Workbench Mode**: Full triage badges, pipeline inspector drawer, and system diagnostics.

8. **Dynamic Backend Configuration**:
   - Live endpoint tester and instant switcher between Cloud Azure backend (`https://webappbackend.azurewebsites.net`) and local FastAPI server (`http://127.0.0.1:8000`).

---

## ⚙️ Environment Configuration

| Variable | Description | Default (Local Dev) | Default (Production) |
| :--- | :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend FastAPI service endpoint | `""` (Uses Vite proxy to `8000`) | `https://webappbackend.azurewebsites.net` |

To override locally:
```bash
cp .env.example .env.local
# Edit VITE_API_BASE_URL in .env.local if needed
```

---

## 🚀 Running Locally

### 1. Development Mode (with hot-reload)
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). Vite's dev server automatically proxies `/api` and `/health` requests to `http://127.0.0.1:8000`.

### 2. Production Build & Local Test
```bash
npm run build
npm start
```
Starts the production static server (`server.js`) on port 8080. Open [http://localhost:8080](http://localhost:8080).

---

## ☁️ Deployment Guide

### Option 1: Azure Web App (App Service - Linux Node.js)
1. In the Azure Portal, create a **Web App** with:
   - **Publish**: Code
   - **Runtime stack**: Node 20 LTS (or 22 LTS)
   - **Operating System**: Linux
2. Deploy via GitHub Actions:
   - A ready-to-run workflow is in [`.github/workflows/main_webappfrontend.yml`](.github/workflows/main_webappfrontend.yml).
   - In GitHub repository Settings -> Secrets and variables -> Actions, add:
     - `AZUREAPPSERVICE_PUBLISHPROFILE` (from Azure Portal -> Download publish profile)
     - OR configure Azure OIDC credentials matching your backend app.
3. The included [`server.js`](server.js) serves the production build on `process.env.PORT` (defaults to 8080).

### Option 2: Azure Static Web Apps
- The repository includes [`staticwebapp.config.json`](staticwebapp.config.json) which handles single-page application (SPA) client fallback routing.
- Set **App location**: `/`
- Set **Output location**: `dist`

### Option 3: Docker Container
```bash
docker build -t aegisbank-frontend .
docker run -p 8080:80 aegisbank-frontend
```

---

## 📤 Pushing to GitHub

```bash
# Add your GitHub repository remote
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/banking_chatbot_frontend.git

# Push to main branch
git branch -M main
git push -u origin main
```
