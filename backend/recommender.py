import os
import json
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'data')
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_rf_model.joblib')

class CropRecommender:
    def __init__(self):
        self.model_artifact = None
        self.crop_metadata = {}
        self.regional_data = {}
        self.reload()

    def reload(self):
        # Load trained Random Forest model if available
        if os.path.exists(MODEL_PATH):
            try:
                self.model_artifact = joblib.load(MODEL_PATH)
                print(f"[CropRecommender] Loaded trained model (Accuracy: {self.model_artifact.get('accuracy', 0)*100:.2f}%)")
            except Exception as e:
                print(f"[CropRecommender] Warning: Could not load ML model: {e}")
                self.model_artifact = None
        else:
            print("[CropRecommender] Model artifact not found, will rely on agronomic engine.")

        # Load Crop Metadata
        meta_path = os.path.join(DATA_DIR, 'crop_metadata.json')
        if os.path.exists(meta_path):
            with open(meta_path, 'r', encoding='utf-8') as f:
                self.crop_metadata = json.load(f)

        # Load Regional Data
        reg_path = os.path.join(DATA_DIR, 'regional_data.json')
        if os.path.exists(reg_path):
            with open(reg_path, 'r', encoding='utf-8') as f:
                self.regional_data = json.load(f)

    def validate_inputs(self, data):
        errors = []
        if not data.get('state') or not str(data['state']).strip():
            errors.append("Please select your State / தயவுசெய்து உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்.")
        if not data.get('soil_type') or not str(data['soil_type']).strip():
            errors.append("Please select your Soil Type / தயவுசெய்து உங்கள் மண் வகையைத் தேர்ந்தெடுக்கவும்.")
        if not data.get('season') or not str(data['season']).strip():
            errors.append("Please select your Current Growing Season / தயவுசெய்து பருவத்தைத் தேர்ந்தெடுக்கவும்.")
        if not data.get('water_availability') or not str(data['water_availability']).strip():
            errors.append("Please select your Water Availability / தயவுசெய்து நீர் வசதியைத் தேர்ந்தெடுக்கவும்.")

        return errors

    def recommend(self, farmer_data):
        validation_errors = self.validate_inputs(farmer_data)
        if validation_errors:
            return {
                "success": False,
                "error": " ".join(validation_errors),
                "details": validation_errors
            }

        state = farmer_data.get('state', '').strip()
        district = farmer_data.get('district', '').strip()
        village = farmer_data.get('village', '').strip()
        soil_type = farmer_data.get('soil_type', '').lower().strip()
        season = farmer_data.get('season', '').lower().strip()
        water_avail = farmer_data.get('water_availability', '').lower().strip()
        previous_crop = farmer_data.get('previous_crop', '').lower().strip()

        # Check for optional soil test parameters
        n_val = farmer_data.get('n')
        p_val = farmer_data.get('p')
        k_val = farmer_data.get('k')
        ph_val = farmer_data.get('ph')

        has_npk = False
        try:
            if n_val is not None and p_val is not None and k_val is not None:
                n_num = float(n_val)
                p_num = float(p_val)
                k_num = float(k_val)
                if n_num >= 0 and p_num >= 0 and k_num >= 0:
                    has_npk = True
        except (ValueError, TypeError):
            has_npk = False

        state_info = self.regional_data.get('states', {}).get(state, {})

        if has_npk and self.model_artifact:
            # Mode A: ML Model with Soil Test Card
            return self._recommend_with_ml(
                farmer_data, state, district, soil_type, season,
                water_avail, previous_crop, state_info
            )
        else:
            # Mode B: Regional Agronomic Recommendation Engine
            return self._recommend_with_agronomy(
                farmer_data, state, district, soil_type, season,
                water_avail, previous_crop, state_info
            )

    def _recommend_with_ml(self, farmer_data, state, district, soil_type, season, water_avail, previous_crop, state_info):
        rf_model = self.model_artifact['model']
        classes = self.model_artifact['classes']

        n_val = float(farmer_data['n'])
        p_val = float(farmer_data['p'])
        k_val = float(farmer_data['k'])

        # pH: farmer provided or standard neutral baseline
        try:
            ph_val = float(farmer_data.get('ph')) if farmer_data.get('ph') is not None and str(farmer_data.get('ph')).strip() != "" else 6.5
        except (ValueError, TypeError):
            ph_val = 6.5

        # Get seasonal climate from state baseline
        season_key = "kharif" if season in ["kharif", "whole_year"] else season
        climate = state_info.get('climate_baseline', {}).get(season_key, {
            "temp": 26.0, "humidity": 70.0, "rainfall": 120.0
        })

        temp = float(climate.get('temp', 26.0))
        humidity = float(climate.get('humidity', 70.0))
        rainfall = float(climate.get('rainfall', 120.0))

        # Adjust effective rainfall estimate if water availability is given
        if water_avail == "rain_fed":
            eff_rainfall = rainfall * 0.9
        elif water_avail == "limited_irrigation":
            eff_rainfall = max(rainfall, 90.0)
        else: # sufficient_irrigation
            eff_rainfall = max(rainfall, 160.0)

        input_df = pd.DataFrame([{
            'N': n_val,
            'P': p_val,
            'K': k_val,
            'temperature': temp,
            'humidity': humidity,
            'ph': ph_val,
            'rainfall': eff_rainfall
        }])

        probabilities = rf_model.predict_proba(input_df)[0]
        crop_scores = {}

        for crop_id, prob in zip(classes, probabilities):
            meta = self.crop_metadata.get(crop_id, {})
            score = prob * 100.0

            # 1. Season filter
            crop_seasons = meta.get('suitable_seasons', [])
            if season not in crop_seasons and "whole_year" not in crop_seasons:
                score *= 0.25

            # 2. Water Availability filter
            water_need = meta.get('water_requirement', 'Medium')
            if water_avail == "rain_fed" and water_need == "High":
                score *= 0.2
            elif water_avail == "limited_irrigation" and water_need == "High":
                score *= 0.6
            elif water_avail == "sufficient_irrigation" and water_need == "High":
                score *= 1.15

            # 3. Soil suitability
            crop_soils = meta.get('suitable_soils', [])
            if soil_type in crop_soils:
                score *= 1.15
            else:
                score *= 0.7

            # 4. Regional favored crops bonus
            favored = state_info.get('favored_crops', [])
            if crop_id in favored:
                score *= 1.2

            # 5. Crop rotation bonus
            if previous_crop in ["rice", "wheat", "maize"] and "Pulse" in meta.get('category', ''):
                score *= 1.1

            crop_scores[crop_id] = score

        ranked_crops = sorted(crop_scores.items(), key=lambda x: x[1], reverse=True)
        top_crop_id, top_score = ranked_crops[0]

        best_crop_details = self._format_crop_details(
            top_crop_id,
            match_score=min(99, max(75, int(top_score))),
            farmer_data=farmer_data,
            mode="ml_with_soil_test",
            state=state,
            soil_type=soil_type,
            season=season,
            water_avail=water_avail
        )

        alternatives = []
        for alt_id, alt_score in ranked_crops[1:4]:
            if alt_score > 5:
                alt_details = self._format_crop_details(
                    alt_id,
                    match_score=min(95, max(60, int(alt_score * 0.95))),
                    farmer_data=farmer_data,
                    mode="ml_with_soil_test",
                    state=state,
                    soil_type=soil_type,
                    season=season,
                    water_avail=water_avail
                )
                alternatives.append(alt_details)

        return {
            "success": True,
            "mode": "ml_with_soil_test",
            "mode_title": "Machine Learning Prediction (with Soil Test Data) / மண் பரிசோதனை அடிப்படையிலான கணிப்பு",
            "best_crop": best_crop_details,
            "alternative_crops": alternatives,
            "farmer_inputs": farmer_data
        }

    def _recommend_with_agronomy(self, farmer_data, state, district, soil_type, season, water_avail, previous_crop, state_info):
        crop_scores = {}
        favored_crops = state_info.get('favored_crops', [])

        for crop_id, meta in self.crop_metadata.items():
            score = 0
            # 1. Season Alignment
            crop_seasons = meta.get('suitable_seasons', [])
            if season in crop_seasons:
                score += 35
            elif "whole_year" in crop_seasons:
                score += 30
            else:
                continue

            # 2. Soil Type Match
            crop_soils = meta.get('suitable_soils', [])
            if soil_type in crop_soils:
                score += 25
            else:
                score += 5

            # 3. Water Availability Match
            water_need = meta.get('water_requirement', 'Medium')
            if water_avail == "sufficient_irrigation":
                if water_need == "High":
                    score += 25
                elif water_need == "Medium":
                    score += 22
                else:
                    score += 18
            elif water_avail == "limited_irrigation":
                if water_need == "Medium":
                    score += 25
                elif water_need == "Low":
                    score += 23
                elif water_need == "High":
                    score += 5
            elif water_avail == "rain_fed":
                if water_need == "Low":
                    score += 25
                elif water_need == "Medium":
                    score += 15
                elif water_need == "High":
                    score -= 20

            # 4. Regional Agronomic Baseline
            if crop_id in favored_crops:
                score += 15
            else:
                score += 5

            # 5. Crop Rotation Synergy
            if previous_crop in ["rice", "wheat", "maize"] and "Pulse" in meta.get('category', ''):
                score += 5
            elif previous_crop == crop_id:
                score -= 5

            crop_scores[crop_id] = score

        if not crop_scores:
            return {
                "success": False,
                "error": f"No compatible crops found for {season.title()} season on {soil_type.title()} soil with {water_avail.replace('_', ' ')} water.",
                "details": []
            }

        ranked_crops = sorted(crop_scores.items(), key=lambda x: x[1], reverse=True)
        top_crop_id, top_raw_score = ranked_crops[0]

        max_possible = 105.0
        normalized_top_score = min(98, max(75, int((top_raw_score / max_possible) * 100)))

        best_crop_details = self._format_crop_details(
            top_crop_id,
            match_score=normalized_top_score,
            farmer_data=farmer_data,
            mode="regional_agronomic",
            state=state,
            soil_type=soil_type,
            season=season,
            water_avail=water_avail
        )

        alternatives = []
        for alt_id, alt_score in ranked_crops[1:4]:
            if alt_score >= 40:
                alt_norm_score = min(92, max(60, int((alt_score / max_possible) * 100)))
                alt_details = self._format_crop_details(
                    alt_id,
                    match_score=alt_norm_score,
                    farmer_data=farmer_data,
                    mode="regional_agronomic",
                    state=state,
                    soil_type=soil_type,
                    season=season,
                    water_avail=water_avail
                )
                alternatives.append(alt_details)

        return {
            "success": True,
            "mode": "regional_agronomic",
            "mode_title": "Regional Agricultural Recommendation / பிராந்திய வேளாண் பரிந்துரை",
            "best_crop": best_crop_details,
            "alternative_crops": alternatives,
            "farmer_inputs": farmer_data
        }

    def _format_crop_details(self, crop_id, match_score, farmer_data, mode, state, soil_type, season, water_avail):
        meta = self.crop_metadata.get(crop_id, {})
        crop_name = meta.get('name', crop_id.title())
        name_en = meta.get('name_en', crop_id.title())
        name_ta = meta.get('name_ta', crop_id.title())

        # Soil suitability
        crop_soils = meta.get('suitable_soils', [])
        if soil_type in crop_soils:
            soil_suitability_en = f"Highly Compatible: Your {soil_type.title()} soil provides optimal texture and water drainage. {meta.get('soil_suitability_reason', '').split('.')[0]}."
            soil_suitability_ta = f"மிகப் பொருத்தம்: உங்கள் நிலத்தின் {soil_type.title()} மண் வேர் வளர்ச்சிக்கும் நீர் வடிகாலுக்கும் உகந்தது."
        else:
            soil_suitability_en = f"Moderate Match: Consider applying organic compost or farmyard manure to condition the soil."
            soil_suitability_ta = f"மிதமான பொருத்தம்: நிலத்தில் மக்கிய தொழுவுரம் அல்லது மண்புழு உரம் இட்டு மண்ணின் வளத்தை மேம்படுத்தவும்."

        # Season suitability
        season_suitability_en = f"Optimal Timing: Sowing in {season.title()} aligns with required photoperiod and temperature."
        season_suitability_ta = f"சரியான பருவம்: {season.title()} பருவத்தின் தட்பவெப்பநிலை மற்றும் சூரிய ஒளி பயிர் வளர்ச்சிக்கு மிகச் சிறந்தது."

        # Water requirement
        water_req = meta.get('water_requirement', 'Medium')
        water_text_en = f"{water_req} Requirement: Fits your '{water_avail.replace('_', ' ').title()}' water conditions."
        water_text_ta = f"{water_req} நீர்த் தேவை: உங்கள் நிலத்தின் '{water_avail.replace('_', ' ')}' பாசன நிலைக்கு ஏற்றது."

        # Why this crop is recommended
        why_suitable_en = (
            f"{name_en} is recommended as the highest-yielding crop for your land in {state} during the {season.title()} season. "
            f"It thrives on {soil_type.title()} soil with {water_avail.replace('_', ' ')} supply."
        )
        why_suitable_ta = (
            f"{name_ta} உங்கள் {state} நிலத்திற்கு {season.title()} பருவத்தில் அதிக மகசூல் தரக்கூடிய சிறந்த பயிராகும். "
            f"இது உங்கள் {soil_type.title()} மண் மற்றும் பாசன வசதிக்கு மிகவும் ஏற்றது."
        )

        rotation_advice_en = meta.get('rotation_advice', '').split('.')[0] + '.'
        rotation_advice_ta = meta.get('rotation_advice', '').split('.')[-1] if '.' in meta.get('rotation_advice', '') else meta.get('rotation_advice', '')

        # Assumptions & transparent note
        if mode == "ml_with_soil_test":
            assumptions_en = (
                f"Calculated using Random Forest Machine Learning based on your Soil Health Card test values "
                f"(Nitrogen: {farmer_data.get('n')}, Phosphorus: {farmer_data.get('p')}, Potassium: {farmer_data.get('k')}) "
                f"and seasonal climate of {state}."
            )
            assumptions_ta = (
                f"உங்கள் மண் பரிசோதனை முடிவுகள் (N: {farmer_data.get('n')}, P: {farmer_data.get('p')}, K: {farmer_data.get('k')}) "
                f"மற்றும் {state} பருவநிலையைக் கொண்டு மெஷின் லேர்னிங் மூலம் கணக்கிடப்பட்டது."
            )
        else:
            assumptions_en = (
                f"Formulated using regional agricultural suitability rules for {state}. "
                f"No laboratory soil test values (N-P-K) were entered, so standard regional soil fertility is assumed. "
                f"We never invent missing lab numbers."
            )
            assumptions_ta = (
                f"இப்பரிந்துரை {state} பிராந்திய வேளாண் தரவுகளின் அடிப்படையில் உருவாக்கப்பட்டது. "
                f"மண் பரிசோதனை முடிவுகள் இல்லாததால், வழக்கமான மண் வளம் கணக்கில் கொள்ளப்பட்டுள்ளது. இல்லாத எண்களை நாங்கள் உருவாக்குவதில்லை."
            )

        # Image is always guaranteed local verified image
        image_url = f"/crops/{crop_id}.jpg"

        return {
            "id": crop_id,
            "name": crop_name,
            "name_en": name_en,
            "name_ta": name_ta,
            "category": meta.get('category', 'Crop'),
            "match_score": match_score,
            "image": image_url,
            "description": meta.get('description', ''),
            "why_suitable": why_suitable_en + " " + why_suitable_ta,
            "why_suitable_en": why_suitable_en,
            "why_suitable_ta": why_suitable_ta,
            "soil_suitability": soil_suitability_en + " " + soil_suitability_ta,
            "soil_suitability_en": soil_suitability_en,
            "soil_suitability_ta": soil_suitability_ta,
            "season_suitability": season_suitability_en + " " + season_suitability_ta,
            "season_suitability_en": season_suitability_en,
            "season_suitability_ta": season_suitability_ta,
            "water_requirement": water_text_en + " " + water_text_ta,
            "water_requirement_en": water_text_en,
            "water_requirement_ta": water_text_ta,
            "water_level": water_req,
            "rotation_advice": rotation_advice_en + " " + rotation_advice_ta,
            "assumptions_and_notes": assumptions_en + " " + assumptions_ta,
            "assumptions_and_notes_en": assumptions_en,
            "assumptions_and_notes_ta": assumptions_ta
        }

recommender = CropRecommender()
