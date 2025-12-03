#!/bin/bash

# Script pour tester un seul endpoint Unusual Whales
# Usage: ./scripts/test-single-uw-endpoint.sh [METHOD] [PATH] [API_URL]

ACCESS_TOKEN="eyJraWQiOiIwekpSMTVhYjBqSk0xdnJmaFBSa0NveGJBaHhnXC9HblhkeU56Y09iRkRyND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTI5ODBiZS0wMGQxLTcwZmYtNTQ3Zi0zYTA3YzkyMzA3ODIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0zLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtM19GUURtaHhWMTQiLCJjbGllbnRfaWQiOiJwa3A0aTgyam50dHRoajJjYmlsdHVkZ3ZhIiwib3JpZ2luX2p0aSI6IjMzNTRmYmM2LTI4NWItNDE4OC04MTk5LWU3MmM5MTI4ZDAwOCIsImV2ZW50X2lkIjoiY2QwY2FhNTctZGQzNS00YmM3LWFjZjUtOGZkZTk2MjRlYjY0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDcwODkxNCwiZXhwIjoxNzY0NzEyNTE0LCJpYXQiOjE3NjQ3MDg5MTQsImp0aSI6ImVhOGVmZDE3LWVjOTItNGE5NS04NWQ2LTJmOGQ1ZDBjNWY5OSIsInVzZXJuYW1lIjoiNTEyOTgwYmUtMDBkMS03MGZmLTU0N2YtM2EwN2M5MjMwNzgyIn0.evrqLK43UX1nEeAg0W9L3oVhl7d-dXtHLXOM9l1l1_fqmXyYH_g-dXoa3ZRz9nNqtcvDDqi_vDHBD9A9ZcUgjXqsj995E8o4EHsJL4cfk8yW-aLV9EKpcliCEmrXD4rsm3ZxaIzKAGMUugZ-r-WCQGn1-R6AptGITGkLscYS-2x965nm_6a0pAKh26HO1h7ps9CI0iS3iGttmhbNtJ8NAvhqdXpzM2PoFpReLgupV7tbrSkOwxsBFCC631aov843o989sXIfw1df7lWvjtIifAxPihpoL99512I_ImYobSxSzZa5fH1lR6m4EzRnu_qJUFdRTk3AKb98wsVVAfUHJg"

METHOD="${1:-GET}"
PATH="${2:-/unusual-whales/shorts/AAPL/data}"
API_URL="${3:-https://tsdd1sibd1.execute-api.eu-west-3.amazonaws.com/prod}"

echo "Testing: ${METHOD} ${API_URL}${PATH}"
echo ""

curl -v -X "${METHOD}" \
  "${API_URL}${PATH}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  | jq '.' 2>/dev/null || cat

echo ""

