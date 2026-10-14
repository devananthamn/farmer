import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import recommender

app = Flask(__name__)
# Enable CORS for local Vite development server
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "service": "Smart Crop Recommendation API",
        "model_loaded": recommender.model_artifact is not None,
        "model_accuracy": f"{recommender.model_artifact.get('accuracy', 0)*100:.2f}%" if recommender.model_artifact else "N/A",
        "crops_count": len(recommender.crop_metadata),
        "states_count": len(recommender.regional_data.get('states', {}))
    })

@app.route('/api/metadata', methods=['GET'])
def get_metadata():
    """
    Returns dropdown options, states, districts, soil types, seasons, water options.
    """
    reg = recommender.regional_data
    states_dict = reg.get('states', {})
    
    # Format states and districts
    formatted_states = []
    for state_name, info in sorted(states_dict.items()):
        formatted_states.append({
            "name": state_name,
            "districts": sorted(info.get('districts', [])),
            "primary_soils": info.get('primary_soils', []),
            "rainfall_profile": info.get('rainfall_profile', 'Medium')
        })

    return jsonify({
        "states": formatted_states,
        "soil_types": reg.get('soil_types', []),
        "seasons": reg.get('seasons', []),
        "water_options": reg.get('water_options', []),
        "previous_crops": reg.get('previous_crops', [])
    })

@app.route('/api/crops', methods=['GET'])
def get_crops():
    """
    Returns catalog of all supported crops with photos and agronomic metadata.
    """
    return jsonify({
        "crops": recommender.crop_metadata
    })

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """
    Receives farmer data, validates, and returns best recommended crop + alternatives.
    """
    try:
        farmer_data = request.get_json()
        if not farmer_data:
            return jsonify({
                "success": False,
                "error": "Missing request payload. Please submit farmer information."
            }), 400

        result = recommender.recommend(farmer_data)
        if not result.get("success"):
            return jsonify(result), 400

        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error during crop recommendation: {e}", exc_info=True)
        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while processing your recommendation. Please verify your inputs and try again.",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Smart Crop Recommendation API server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
