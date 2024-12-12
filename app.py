from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime
import os


app = Flask(__name__)

api_key = os.getenv("API_KEY")


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/<code>",  methods=['GET'])
def getBusArrivals(code):
    url = f"https://api.tfl.gov.uk/StopPoint/{code}/Arrivals"
    response = requests.get(url, params={'api_key':api_key})

    if response.status_code == 200:
        return jsonify({"message": "Arrivals Found", "data": response.json()})
    else:
        return (f"Error fetching data: {response.status_code}, {response.text}")

@app.route("/location/<postcode>", methods=['GET'])
def getPostcodeInfo(postcode):
    
    url = f"https://api.postcodes.io/postcodes/{postcode}"
    response = requests.get(url)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": f"Error fetching data: {response.status_code}, {response.text}"}), response.status_code

@app.route("/stoppoints", methods=['GET'])
def getStopPoints():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    url = "https://api.tfl.gov.uk/StopPoint/"
    params = {
        'lat': lat,
        'lon': lon,
        'stopTypes': "NaptanPublicBusCoachTram",
        'radius': 500
    }
    full_url = requests.Request('GET', url, params=params).prepare().url
    print(f"Request URL: {full_url}")

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": f"Error fetching data: {response.status_code}, {response.text}"}), response.status_code


if __name__ == "__main__":
    app.run(debug=True)
