


# DoSJE Drishthi

### Real-Time Monitoring & Surprise Inspection System

DoSJE Drishthi is a centralized digital monitoring and inspection platform designed to improve transparency, accountability, and compliance in welfare projects, institutes, and NGOs operating under DoSJE schemes.

The platform connects Government Officials, PMU/Inspection Teams, and NGOs/Institutes through role-based dashboards and a unified inspection workflow.

---

## 🚀 Overview

Government departments cannot physically inspect every supported project on a continuous basis. DoSJE Drishthi provides a centralized system to remotely monitor projects, conduct randomized surprise inspections, collect geo-tagged evidence, identify unusual data patterns, and track compliance actions.

### Core Workflow

```text
Project Monitoring
       ↓
Random Inspection Assignment
       ↓
Inspector Receives Assignment
       ↓
GPS Location Verification
       ↓
Digital Inspection Checklist
       ↓
Geo-Tagged Evidence Capture
       ↓
CCTV / VC Monitoring
       ↓
AI-Based Anomaly Detection
       ↓
Government Review
       ↓
Compliance Issue
       ↓
Corrective Action
       ↓
Verification
       ↓
Resolved
````

---

## 🎯 Problem

Government-funded welfare projects are implemented across multiple locations through NGOs and institutes. Monitoring every project physically and continuously is difficult.

Traditional monitoring can face challenges such as:

* Delayed inspections
* Manual reporting
* Incomplete evidence
* Proxy or inaccurate reporting
* Lack of real-time visibility
* Difficult inspection assignment
* Attendance irregularities
* Delayed compliance tracking

DoSJE Drishthi addresses these challenges through a centralized digital monitoring ecosystem.

---

## 💡 Solution

DoSJE Drishthi provides:

* Randomized surprise inspection assignment
* Inspector mobile-first inspection interface
* GPS-based location verification
* Geo-tagged photo/video evidence
* Digital inspection checklists
* CCTV monitoring integration layer
* Video conferencing support
* AI-assisted anomaly detection
* Digital inspection reports
* Inspector activity monitoring
* Compliance and corrective-action tracking
* Audit trails
* Offline inspection support

---

# 👥 Role-Based System

## 1. Government / DoSJE Dashboard

Government officials can monitor the overall system.

### Features

* Project monitoring
* Project registry
* Inspection assignment
* Randomized inspection selection
* Inspector monitoring
* CCTV monitoring
* AI anomaly alerts
* Inspection reports
* Evidence review
* Compliance tracking
* Analytics
* Audit logs
* Notifications
* Map-based monitoring

---

## 2. Inspector Mobile Dashboard

The inspector interface is designed with a mobile-first approach for field inspections.

### Features

* Assigned inspections
* Project details
* GPS verification
* Geofencing
* Digital checklist
* Photo/video evidence capture
* Geo-tagging
* Timestamping
* Inspector observations
* Video conference workflow
* Inspection report submission
* Offline inspection support

### Inspection Workflow

```text
Assignment
    ↓
Accept
    ↓
Travel
    ↓
GPS Verification
    ↓
Start Inspection
    ↓
Checklist
    ↓
Evidence Capture
    ↓
Observations
    ↓
Submit Report
```

---

## 3. NGO / Institute Dashboard

NGOs and institutes can manage project information and respond to compliance requirements.

### Features

* Project information
* Staff management
* Beneficiary information
* Attendance
* CCTV information
* Inspection history
* Inspection findings
* Compliance issues
* Corrective-action submission

---

# 🤖 AI Features

## Attendance Anomaly Detection

The system analyzes attendance patterns and identifies unusual deviations.

Example:

```text
Historical Attendance

47  49  46  48  45  47  49

Today's Attendance

18

             ↓

⚠ Unusual Attendance Pattern
Expected Range: 45–50
Observed: 18
Action: Human Review Required
```

AI is used as a decision-support mechanism.

The system does **not** automatically accuse an NGO, institute, inspector, or individual of fraud.

---

## AI Evidence Analysis

Captured inspection evidence can be analyzed using Gemini to assist officials and inspectors in understanding observations and identifying potential discrepancies.

The AI output can include:

* Observation
* Category
* Potential discrepancy
* Confidence
* Recommended review

All AI-generated findings remain subject to human verification.

---

## AI Inspection Summary

Inspection information such as:

* Checklist results
* Inspector observations
* Attendance information
* Evidence metadata
* Previous compliance issues

can be summarized using AI to assist government officials during report review.

---

# 📍 GPS & Geofencing

The inspector application uses device/browser geolocation to verify that an inspector is within the permitted area of the assigned project.

```text
Inspector Location
       ↓
Distance Calculation
       ↓
Project Location
       ↓
Geofence Check
       ↓
Location Verified / Not Verified
```

GPS is treated as supporting evidence and is not considered absolute proof that an inspection was genuinely performed.

---

# 📷 Geo-Tagged Evidence

Inspection evidence can contain:

* Inspection ID
* Project ID
* Inspector ID
* Timestamp
* Latitude
* Longitude
* GPS accuracy
* Evidence type

Evidence is associated with the relevant inspection for later review.

---

# 📹 CCTV Monitoring

The platform provides a CCTV monitoring interface for projects.

The current prototype uses simulated/demo streams to demonstrate the monitoring workflow.

### Production Architecture

```text
Existing Authorized CCTV
          ↓
Secure CCTV Gateway
          ↓
CCTV Integration Layer
          ↓
DoSJE Monitoring Dashboard
```

No new CCTV hardware is required for the prototype.

---

# 🎥 Video Conferencing

The platform includes a video-conferencing workflow for connecting officials/inspectors with:

* Project Incharge
* Staff
* Beneficiaries

The current prototype provides a VC demonstration interface. Production deployment can integrate an approved real-time communication service.

---

# 👮 Inspector Accountability

The system also monitors the inspection lifecycle.

Examples of measurable events:

* Assignment acceptance
* Arrival
* GPS verification
* Inspection start
* Evidence capture
* Checklist completion
* Report submission
* Overdue assignments
* Missing evidence

Potential alerts include:

```text
⚠ Inspection overdue
⚠ No location verification
⚠ Required evidence missing
⚠ Unusually short inspection
⚠ Incomplete inspection report
```

These alerts are intended for supervisory review and do not automatically establish misconduct.

---

# 📋 Compliance Tracking

Issues discovered during inspection can be tracked through:

```text
OPEN
  ↓
ACTION REQUIRED
  ↓
CORRECTIVE ACTION SUBMITTED
  ↓
UNDER VERIFICATION
  ↓
RESOLVED
```

This creates a closed-loop monitoring process rather than stopping at inspection reporting.

---

# 🏗️ System Architecture

```text
                    DO SJE DRISHTHI
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    Government        Inspector           NGO /
    Dashboard         Mobile UI          Institute
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                    REST API / Backend
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      Firebase          Gemini AI       Integrations
      Auth/DB                              │
          │                           CCTV / VC
          ▼
       Firestore
```

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide React
* Recharts

### Backend

* Node.js
* Express.js
* TypeScript

### Database & Authentication

* Firebase Authentication
* Cloud Firestore

### AI

* Google Gemini API
* AI-assisted evidence analysis
* Attendance anomaly detection

### Maps & Location

* Browser Geolocation API
* Geofencing
* Map integration

### Storage / Evidence

* Secure object storage architecture
* Geo-tagged inspection evidence

---

# 🔐 Security

The production architecture is designed around:

* Firebase Authentication
* Role-based access control
* Protected REST APIs
* Server-side authorization
* Input validation
* API rate limiting
* Secure environment variables
* Firestore security rules
* Audit logging
* Evidence integrity checks
* Restricted project access

Sensitive API keys and credentials must never be committed to the repository.

---

# 🧪 Demo Mode

The hackathon prototype supports simulated functionality where real infrastructure is unavailable.

Examples:

* Simulated GPS
* Demo CCTV streams
* VC simulation
* Demo inspection data

These features are clearly separated from production integrations.

---

# 📊 Example Dashboard

```text
DO SJE MONITORING DASHBOARD

Projects             1,248
Inspections Today       32
Pending Inspections     18
AI Alerts                7
Open Issues             14

--------------------------------------

PROJECT STATUS

🟢 ABC Welfare Centre
🟢 XYZ Institute
🟡 PQR NGO
🔴 DEF Centre

--------------------------------------

AI ALERTS

⚠ 3 Attendance anomalies
⚠ 2 CCTV unavailable
⚠ 2 Inspection issues
```

---

# 🔄 Complete End-to-End Workflow

```text
Government monitors projects
          ↓
Random inspection generated
          ↓
Inspector receives assignment
          ↓
Inspector accepts assignment
          ↓
Inspector travels to project
          ↓
GPS location verified
          ↓
Inspection begins
          ↓
Checklist completed
          ↓
Evidence captured
          ↓
CCTV / VC monitoring
          ↓
Attendance analyzed
          ↓
Inspection report submitted
          ↓
Government reviews report
          ↓
AI alerts reviewed
          ↓
Compliance issue created
          ↓
NGO submits corrective action
          ↓
Government verifies
          ↓
Issue resolved
```

---

# 📁 Project Structure

```text
dosje-drishthi/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── repositories/
│       └── integrations/
│
├── public/
├── firestore.rules
├── firestore.indexes.json
├── package.json
├── .env.example
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js 20+
* npm
* Firebase project
* Gemini API access

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/dosje-drishthi.git

cd dosje-drishthi

npm install
```

## Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
FIREBASE_PROJECT_ID=
FIRESTORE_DATABASE_ID=
GEMINI_API_KEY=
ALLOWED_ORIGINS=
```

Never commit `.env` to GitHub.

## Run Development Server

```bash
npm run dev
```

---

# 🧪 Testing

Run:

```bash
npm run lint
npm run build
```

Backend tests can be run using the configured test command.

---

# 🔒 Production Considerations

Before production deployment:

* Configure strict Firestore security rules
* Configure HTTPS
* Restrict CORS origins
* Configure secure object storage
* Protect API credentials
* Enable monitoring and logging
* Configure rate limiting
* Configure backup and recovery
* Integrate authorized CCTV infrastructure
* Integrate an approved VC provider
* Perform security and privacy assessment

---

# 🎯 Expected Impact

DoSJE Drishthi aims to improve:

* Transparency
* Accountability
* Inspection efficiency
* Evidence-based monitoring
* Compliance management
* Project visibility
* Supervisory oversight
* Citizen-centric welfare delivery

---

