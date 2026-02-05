# 🚀 WCCRM API Testing Guide

Complete guide for testing all backend endpoints with proper payloads and examples.

**Base URL**: `http://localhost:5000` (development) or your deployed backend URL

---

## 🎨 **1. BRANDING ENDPOINTS**

### **GET /api/branding**
Get current church branding settings.

```bash
curl -X GET http://localhost:5000/api/branding
```

**Expected Response:**
```json
{
  "id": 1,
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#f8fafc", 
    "accent": "#10b981"
  },
  "logoUrl": null,
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  }
}
```

### **POST /api/branding**
Update church branding settings.

```bash
curl -X POST http://localhost:5000/api/branding \
  -H "Content-Type: application/json" \
  -d '{
    "colors": {
      "primary": "#1e40af",
      "secondary": "#f1f5f9",
      "accent": "#059669"
    },
    "logoUrl": "https://example.com/logo.png",
    "fonts": {
      "heading": "Poppins",
      "body": "Open Sans"
    }
  }'
```

**Payload Schema:**
```json
{
  "colors": {
    "primary": "string (hex color)",
    "secondary": "string (hex color)", 
    "accent": "string (hex color)"
  },
  "logoUrl": "string (optional URL)",
  "fonts": {
    "heading": "string (font name)",
    "body": "string (font name)"
  }
}
```

---

## 📅 **2. EVENTS ENDPOINTS**

### **GET /api/events**
Get all events (sorted by date, newest first).

```bash
curl -X GET http://localhost:5000/api/events
```

### **GET /api/events/:id**
Get specific event by ID.

```bash
curl -X GET http://localhost:5000/api/events/1
```

### **POST /api/events**
Create a new event.

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Christmas Service",
    "description": "Join us for a special Christmas celebration with carols, message, and fellowship.",
    "date": "2026-12-25T10:00:00.000Z",
    "location": "Main Sanctuary",
    "imageUrl": "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800"
  }'
```

**Payload Schema:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "date": "string (ISO 8601 datetime, required)",
  "location": "string (required)",
  "imageUrl": "string (optional URL)"
}
```

### **POST /api/events/:id/rsvp**
RSVP to an event (currently returns mock response).

```bash
curl -X POST http://localhost:5000/api/events/1/rsvp \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "message": "RSVP successful"
}
```

---

## 🎤 **3. SERMON ENDPOINTS**

### **GET /api/sermons**
Get all sermons (sorted by date, newest first).

```bash
curl -X GET http://localhost:5000/api/sermons
```

### **GET /api/sermons/:id**
Get specific sermon by ID.

```bash
curl -X GET http://localhost:5000/api/sermons/1
```

### **POST /api/sermons**
Create a new sermon.

```bash
curl -X POST http://localhost:5000/api/sermons \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Walking in Faith",
    "speaker": "Pastor Michael Johnson",
    "date": "2026-02-09T11:00:00.000Z",
    "videoUrl": "https://www.youtube.com/watch?v=example123",
    "audioUrl": "https://example.com/audio/sermon.mp3",
    "series": "Faith Journey",
    "description": "Exploring what it means to walk by faith and not by sight in our daily lives.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800"
  }'
```

**Payload Schema:**
```json
{
  "title": "string (required)",
  "speaker": "string (required)",
  "date": "string (ISO 8601 datetime, required)",
  "videoUrl": "string (optional URL)",
  "audioUrl": "string (optional URL)",
  "series": "string (optional)",
  "description": "string (optional)",
  "thumbnailUrl": "string (optional URL)"
}
```

---

## 🙏 **4. PRAYER REQUEST ENDPOINTS**

### **GET /api/prayer-requests**
Get all prayer requests (sorted by newest first).

```bash
curl -X GET http://localhost:5000/api/prayer-requests
```

### **POST /api/prayer-requests**
Create a new prayer request.

```bash
curl -X POST http://localhost:5000/api/prayer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Please pray for my family during this difficult time. We need strength and guidance.",
    "authorName": "John Smith",
    "isAnonymous": false
  }'
```

**Anonymous Prayer Request:**
```bash
curl -X POST http://localhost:5000/api/prayer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Praying for healing and peace in my life.",
    "isAnonymous": true
  }'
```

**Payload Schema:**
```json
{
  "content": "string (required, min 1 character)",
  "authorName": "string (optional)",
  "isAnonymous": "boolean (optional, default: false)"
}
```

### **POST /api/prayer-requests/:id/pray**
Increment pray count for a prayer request.

```bash
curl -X POST http://localhost:5000/api/prayer-requests/1/pray \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "id": 1,
  "userId": null,
  "authorName": "John Smith",
  "content": "Please pray for my family...",
  "isAnonymous": false,
  "createdAt": "2026-02-05T20:30:00.000Z",
  "prayCount": 5
}
```

---

## 💰 **5. DONATIONS ENDPOINT**

### **POST /api/donations**
Record a new donation.

```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "usd",
    "status": "succeeded"
  }'
```

**Payload Schema:**
```json
{
  "amount": "number (required, in cents - e.g., 5000 = $50.00)",
  "currency": "string (optional, default: 'usd')",
  "status": "string (required: 'pending', 'succeeded', 'failed')"
}
```

---

## 🧪 **TESTING EXAMPLES**

### **Complete Test Sequence**

1. **Check Server Health:**
```bash
curl -X GET http://localhost:5000/api/events
```

2. **Create an Event:**
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bible Study",
    "description": "Weekly Bible study and discussion",
    "date": "2026-02-12T19:00:00.000Z",
    "location": "Fellowship Hall"
  }'
```

3. **Create a Sermon:**
```bash
curl -X POST http://localhost:5000/api/sermons \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Love Your Neighbor",
    "speaker": "Pastor Sarah Wilson",
    "date": "2026-02-09T11:00:00.000Z",
    "description": "Understanding what it means to love our neighbors as ourselves"
  }'
```

4. **Add Prayer Request:**
```bash
curl -X POST http://localhost:5000/api/prayer-requests \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Please pray for wisdom in making important life decisions",
    "authorName": "Community Member"
  }'
```

5. **Pray for Request:**
```bash
curl -X POST http://localhost:5000/api/prayer-requests/1/pray
```

6. **Record Donation:**
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "status": "succeeded"
  }'
```

---

## 🔧 **Using Postman**

### **Import Collection**
Create a Postman collection with these requests:

1. **Set Base URL Variable**: `{{baseUrl}}` = `http://localhost:5000`
2. **Add requests** for each endpoint above
3. **Set Content-Type header**: `application/json` for POST requests

### **Environment Variables**
```json
{
  "baseUrl": "http://localhost:5000",
  "eventId": "1",
  "sermonId": "1", 
  "prayerRequestId": "1"
}
```

---

## ⚠️ **Important Notes**

### **Date Format**
Always use ISO 8601 format for dates:
```
"2026-02-09T11:00:00.000Z"
```

### **Amount Format**
Donations amounts are in **cents**:
- $10.00 = `1000`
- $50.00 = `5000`
- $100.00 = `10000`

### **Authentication**
Currently using **mock authentication**. All requests are allowed for development.

### **Error Responses**
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

**🎉 Happy Testing! Your WCCRM API is ready for action!**