# 🌾 Smart Crop Recommendation System / திறன்மிகு பயிர் பரிந்துரை அமைப்பு

A modern, responsive, farmer-friendly web application designed to recommend the most suitable, high-yielding crops based on location, soil type, growing season, water availability, and optional Soil Health Card test values.

Built with a nature-inspired green theme, supporting **two languages exclusively: English and Tamil (தமிழ்)**, with verified authentic crop photographs for every crop.

---

## 🌟 Key Features

1. **Two Languages Only: English & Tamil (தமிழ்)**:
   - Dedicated one-click language toggle (**English | தமிழ்**) on the navbar.
   - Complete translations for all crop names, soil types, seasons, water options, explanations, and advice.
   - All other languages completely removed.

2. **100% Authentic, Verified Crop Photographs**:
   - Every single crop displays its correct, verified photograph (e.g. fresh coconuts on palm tree for Coconut, golden paddy field for Rice, white cotton bolls for Cotton, banana bunch on tree for Banana, red coffee cherries for Coffee, etc.).
   - Locally served from `/crops/<crop_id>.jpg` for instant zero-latency loading.

2. **Dual-Engine Recommendation System**:
   - **Scenario A: Standard Farmer (No Soil Test Needed)**:
     - Recommends crops using verified Indian agro-climatic regional data, state seasonal weather profiles, soil textures, and water availability.
     - **Never invents missing lab values or weather numbers.**
   - **Scenario B: Advanced Farmer (With Soil Health Card)**:
     - Seamlessly incorporates Nitrogen (N), Phosphorus (P), Potassium (K), and soil pH.
     - Evaluated with a **Random Forest Classifier trained on 2,200 agricultural samples** achieving **99.32% test accuracy**.

3. **3-Step Intuitive Workflow**:
   - **Step 1: Enter Details**: Location (State/District), Soil Type, Current Season, Water Availability, and Previous Crop.
   - **Step 2: Analyze Information**: The system cross-references soil conditions, water requirements, and seasonal climate patterns.
   - **Step 3: Get Crop Recommendation**: Displays the prominent best crop match, high-resolution photo, suitability breakdown, and up to 3 viable alternative crops.

4. **Detailed Suitability Breakdown**:
   - 🌿 **Soil Suitability**: Explains why your selected soil texture matches this crop's root and drainage requirements.
   - ☀️ **Season Suitability**: Details temperature, sunlight, and seasonal timing.
   - 💧 **Water Requirement**: Specific water needs and irrigation scheduling advice.
   - 📋 **Assumptions & Soil Advice**: Transparent disclosure of regional baseline assumptions and soil health recommendations.
   - 🔄 **Crop Rotation Guidance**: Advises on nitrogen replenishment and breaking pest cycles.

5. **Integrated Farmer Helplines**:
   - Direct access to the National Kisan Call Centre toll-free helpline (`1800-180-1551`).
   - Links to the Government Soil Health Card Portal and ICAR KVK directory.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 (Vite) | Fast, responsive Single Page Application |
| **Icons** | Lucide React | Clean agricultural & navigation icons |
| **Styling** | Modern CSS | Curated Nature-inspired Green Design System with CSS variables |
| **Backend** | Python Flask | Lightweight REST API with CORS support |
| **Machine Learning** | Scikit-Learn | Random Forest Classifier (`crop_rf_model.joblib`) with 99.32% accuracy |
| **Data Processing** | Pandas, NumPy | Dataset processing & feature matrix construction |
| **Dataset Source** | ICAR & Kaggle Precision Agriculture | 2,200 records across 22 crops (N, P, K, temp, humidity, pH, rainfall) |

---

## 📁 Project Directory Structure

```
d:\Farmer\
├── backend\
│   ├── app.py                     # Flask REST API server (Endpoints: /api/recommend, /api/metadata, /api/health, /api/crops)
│   ├── recommender.py             # Dual recommendation engine (Random Forest ML + Regional Agronomic Rules)
│   ├── train_model.py             # Script to train Random Forest model & evaluate accuracy
│   ├── generate_crop_metadata.py  # Agronomic metadata generator for 22 crops
│   ├── generate_regional_data.py  # Regional climate and state/district database generator
│   ├── requirements.txt           # Python dependencies (flask, flask-cors, scikit-learn, pandas, numpy, joblib)
│   ├── models\
│   │   └── crop_rf_model.joblib   # Trained Random Forest model (99.32% accuracy)
│   └── data\
│       ├── crop_recommendation.csv # 2,200-sample crop dataset
│       ├── crop_metadata.json     # Agronomic profiles for all 22 crops
│       └── regional_data.json     # 19 Indian states, districts, soils, and seasonal climates
├── frontend\
│   ├── index.html                 # HTML shell with Google Fonts and responsive meta tags
│   ├── package.json               # Frontend dependencies & scripts
│   ├── vite.config.js             # Vite configuration with proxy to Flask backend (port 5000)
│   ├── src\
│   │   ├── main.jsx               # React entry point
│   │   ├── App.jsx                # Application state, view router, and modal handler
│   │   ├── index.css              # Nature green design system & utility classes
│   │   └── components\
│   │       ├── Navbar.jsx         # Header with branding and Kisan helpline
│   │       ├── Hero.jsx           # Green field background with "Find Suitable Crop" button
│   │       ├── HowItWorks.jsx     # 3-step visual workflow explanation
│   │       ├── FarmerForm.jsx     # Farmer-friendly input form with dropdowns & optional NPK
│   │       ├── ResultCard.jsx     # Prominent Best Crop display with 4 suitability factors
│   │       ├── AlternativeCrops.jsx # Up to 3 alternative viable crops
│   │       └── Footer.jsx         # Helpline numbers, ICAR dataset credit, and agricultural notes
└── README.md                      # Documentation & instructions
```

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 2. Backend Setup
```bash
# Navigate to project directory
cd d:\Farmer

# Install Python requirements
python -m pip install -r backend/requirements.txt

# (Optional) Retrain machine learning model
python backend/train_model.py

# Start Flask backend server (runs on port 5000)
python backend/app.py
```
The API server will start at: `http://localhost:5000`

### 3. Frontend Setup
Open a second terminal window:
```bash
# Navigate to frontend folder
cd d:\Farmer\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser and visit: **`http://localhost:5173`**

---

## 📡 REST API Documentation

### 1. `GET /api/health`
Checks backend status and model readiness.
- **Response**:
```json
{
  "status": "online",
  "service": "Smart Crop Recommendation API",
  "model_loaded": true,
  "model_accuracy": "99.32%",
  "crops_count": 22,
  "states_count": 19
}
```

### 2. `GET /api/metadata`
Returns options for dropdowns (States, Districts, Soil Types, Seasons, Water Options, Previous Crops).

### 3. `POST /api/recommend`
Generates personalized crop recommendations.
- **Request Body (Without Soil Test)**:
```json
{
  "state": "Maharashtra",
  "district": "Nagpur",
  "soil_type": "black",
  "season": "kharif",
  "water_availability": "limited_irrigation",
  "previous_crop": "wheat"
}
```
- **Request Body (With Optional Soil Test)**:
```json
{
  "state": "Punjab",
  "district": "Ludhiana",
  "soil_type": "alluvial",
  "season": "kharif",
  "water_availability": "sufficient_irrigation",
  "n": 90,
  "p": 42,
  "k": 43,
  "ph": 6.5
}
```
- **Response**:
```json
{
  "success": true,
  "mode": "regional_agronomic",
  "mode_title": "Regional Agricultural Recommendation",
  "best_crop": {
    "id": "cotton",
    "name": "Cotton (Kapas / कपास)",
    "category": "Fiber / Cash Crop",
    "match_score": 96,
    "image": "https://...",
    "why_suitable": "Cotton is the best match for your land...",
    "soil_suitability": "Highly Compatible: Your Black soil provides optimal texture...",
    "season_suitability": "Perfect Timing: Sowing in Kharif aligns with temperature...",
    "water_requirement": "Medium Requirement: Needs 50-75 cm water...",
    "water_level": "Medium",
    "rotation_advice": "...",
    "assumptions_and_notes": "..."
  },
  "alternative_crops": [
    { "id": "pigeonpeas", "name": "Pigeonpeas (Arhar / Tur / अरहर)", "match_score": 91, ... },
    { "id": "blackgram", "name": "Blackgram (Urad / उड़द)", "match_score": 87, ... },
    { "id": "maize", "name": "Maize (Corn / मक्का)", "match_score": 84, ... }
  ],
  "farmer_inputs": { ... }
}
```

---

## 🌾 Supported Crops (22 Crops)
- **Cereals & Coarse Grains**: Rice (Paddy), Maize (Corn)
- **Pulses & Legumes**: Chickpea (Chana), Pigeonpeas (Tur / Arhar), Kidney Beans (Rajma), Moth Beans (Matki), Mungbean (Green Gram / Moong), Blackgram (Urad), Lentil (Masoor)
- **Commercial & Fiber**: Cotton (Kapas), Jute (Patson), Coffee
- **Horticulture Fruits & Plantation**: Banana, Mango, Grapes, Apple, Orange / Citrus, Papaya, Pomegranate, Coconut, Watermelon, Muskmelon
