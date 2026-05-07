from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import string
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

load_dotenv()

BOLNA_API_KEY = os.getenv("BOLNA_API_KEY")
BOLNA_AGENT_ID = os.getenv("BOLNA_AGENT_ID")

app = Flask(__name__)
CORS(app)



with open("customers.json", "r") as file:
    customers = json.load(file)

try:
    with open("bookings.json", "r") as file:
        bookings = json.load(file)
except:
    bookings = []

try:
    with open("complaints.json", "r") as file:
        complaints = json.load(file)
except:
    complaints = []




def save_bookings():
    with open("bookings.json", "w") as file:
        json.dump(bookings, file, indent=2)

def save_complaints():
    with open("complaints.json", "w") as file:
        json.dump(complaints, file, indent=2)

def generate_booking_id():
    return "BK" + ''.join(random.choices(string.digits, k=6))

def generate_complaint_id():
    return "CMP" + ''.join(random.choices(string.digits, k=6))




@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "LPG Support Workflow Engine"
    })



@app.route("/lookup-customer", methods=["POST"])
def lookup_customer():

    data = request.get_json()

    phone = data.get("phone")
    name = data.get("name")

    if not phone or not name:
        return jsonify({
            "success": False,
            "message": "Name and phone are required"
        }), 400

    customer = next(
        (
            c for c in customers
            if c["phone"] == phone and c["name"].lower() == name.lower()
        ),
        None
    )

    if not customer:
        return jsonify({
            "success": False,
            "message": "Customer verification failed"
        }), 404

    return jsonify({
        "success": True,
        "message": "Customer verified successfully",
        "customer": {
            "name": customer["name"],
            "phone": customer["phone"],
            "consumer_id": customer["consumer_id"],
            "location": customer["location"]
        }
    })



@app.route("/book-cylinder", methods=["POST"])
def book_cylinder():

    data = request.get_json()

    consumer_id = data.get("consumer_id")

    if not consumer_id:
        return jsonify({
            "success": False,
            "message": "Consumer ID is required"
        }), 400

    booking_id = generate_booking_id()

    booking = {
        "booking_id": booking_id,
        "consumer_id": consumer_id,
        "status": "Confirmed",
        "delivery_eta": "2-3 days",
        "created_at": datetime.now().isoformat()
    }

    bookings.append(booking)

    save_bookings()

    return jsonify({
        "success": True,
        "message": "Cylinder booked successfully",
        "booking": booking
    })



@app.route("/check-status", methods=["POST"])
def check_status():

    data = request.get_json()

    consumer_id = data.get("consumer_id")

    if not consumer_id:
        return jsonify({
            "success": False,
            "message": "Consumer ID is required"
        }), 400

    customer_bookings = [
        b for b in bookings
        if b["consumer_id"] == consumer_id
    ]

    if not customer_bookings:
        return jsonify({
            "success": False,
            "message": "No bookings found"
        }), 404

    latest_booking = customer_bookings[-1]

    return jsonify({
        "success": True,
        "booking": latest_booking
    })




@app.route("/raise-complaint", methods=["POST"])
def raise_complaint():

    data = request.get_json()

    consumer_id = data.get("consumer_id")
    issue = data.get("issue")

    if not consumer_id or not issue:
        return jsonify({
            "success": False,
            "message": "Consumer ID and issue are required"
        }), 400

    complaint_id = generate_complaint_id()

    complaint = {
        "complaint_id": complaint_id,
        "consumer_id": consumer_id,
        "issue": issue,
        "status": "Under Review",
        "created_at": datetime.now().isoformat()
    }

    complaints.append(complaint)

    save_complaints()

    return jsonify({
        "success": True,
        "message": "Complaint registered successfully",
        "complaint": complaint
    })




@app.route("/bookings", methods=["GET"])
def get_bookings():
    return jsonify({
        "success": True,
        "bookings": bookings
    })



@app.route("/complaints", methods=["GET"])
def get_complaints():
    return jsonify({
        "success": True,
        "complaints": complaints
    })


@app.route("/start-call", methods=["POST"])
def start_call():

    data = request.get_json()

    phone_number = data.get("phone_number")

    if not phone_number:
        return jsonify({
            "success": False,
            "message": "Phone number is required"
        }), 400

    url = "https://api.bolna.ai/call"

    payload = {
        "agent_id": BOLNA_AGENT_ID,
        "recipient_phone_number": phone_number,
        "bypass_call_guardrails": True
    }

    headers = {
        "Authorization": f"Bearer {BOLNA_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers
    )

    return jsonify(response.json())


if __name__ == "__main__":
    print(" Gas Agent Backend Running on http://127.0.0.1:5000")
    app.run(debug=True)