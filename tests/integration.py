import requests

BASE_URL = "http://localhost:3006"


def test_health():
    response = requests.get(f"{BASE_URL}/notifications/health")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}
