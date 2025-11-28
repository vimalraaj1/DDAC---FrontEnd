# Doctor API Services Documentation

This document describes the API services available for the Doctor role in the DDAC Healthcare application.

## Backend API Base URL

- **Development (HTTPS)**: `https://localhost:7061/api`
- **Development (HTTP)**: `http://localhost:5203/api`

Configure the base URL in `.env` file:
```
VITE_API_BASE_URL=https://localhost:7061/api
```

## Authentication

All API requests require authentication. The token is automatically included in request headers via axios interceptors.

### Token Storage
- Token stored in `localStorage` with key: `token`
- User role: `userRole`
- User name: `userName`
- User ID: `userId`

### Authorization Header
```
Authorization: Bearer {token}
```

## Available Services

### 1. Doctor Service (`doctorService.js`)

Located at: `src/features/doctor/services/doctorService.js`

#### Methods

##### `getAllDoctors()`
- **Endpoint**: `GET /api/doctors`
- **Returns**: Array of all doctors
- **Usage**: 
  ```javascript
  const doctors = await doctorService.getAllDoctors();
  ```

##### `getDoctorById(id)`
- **Endpoint**: `GET /api/doctors/{id}`
- **Parameters**: 
  - `id` (string): Doctor ID (8 chars max)
- **Returns**: Doctor object
- **Usage**: 
  ```javascript
  const doctor = await doctorService.getDoctorById('DOC00001');
  ```

##### `getCurrentDoctorProfile()`
- **Endpoint**: `GET /api/doctors/{userId}`
- **Returns**: Current logged-in doctor's profile
- **Note**: Automatically uses `userId` from localStorage
- **Usage**: 
  ```javascript
  const profile = await doctorService.getCurrentDoctorProfile();
  ```

##### `createDoctor(doctorData)`
- **Endpoint**: `POST /api/doctors`
- **Parameters**: Doctor creation data object
- **Returns**: Created doctor object
- **Usage**: 
  ```javascript
  const newDoctor = await doctorService.createDoctor({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@hospital.com",
    phone: "1234567890",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    address: "123 Medical St",
    licenseNumber: "LIC123456",
    specialization: "Cardiology",
    department: "Cardiology",
    status: "Active"
  });
  ```

##### `updateDoctor(id, doctorData)`
- **Endpoint**: `PUT /api/doctors/{id}`
- **Parameters**: 
  - `id` (string): Doctor ID
  - `doctorData` (object): Updated doctor data
- **Returns**: Updated doctor object

##### `updateCurrentDoctorProfile(doctorData)`
- **Endpoint**: `PUT /api/doctors/{userId}`
- **Parameters**: Updated doctor data object
- **Returns**: Updated doctor profile
- **Note**: Automatically uses current doctor's ID from localStorage

##### `deleteDoctor(id)`
- **Endpoint**: `DELETE /api/doctors/{id}`
- **Parameters**: 
  - `id` (string): Doctor ID
- **Returns**: Boolean (true on success)

#### Doctor Data Structure

```javascript
{
  id: "DOC00001",              // string (8 chars)
  firstName: "John",           // string (50 chars max)
  lastName: "Doe",             // string (50 chars max)
  email: "john@hospital.com",  // string (50 chars max)
  phone: "1234567890",         // string (15 chars max)
  dateOfBirth: "1985-05-15",   // DateOnly (YYYY-MM-DD)
  gender: "Male",              // string (10 chars max)
  address: "123 Medical St",   // string (250 chars max)
  bloodGroup: "O+",            // string (20 chars max, optional)
  emergencyContact: "0987654321", // string (15 chars max, optional)
  licenseNumber: "LIC123456",  // string (20 chars max)
  specialization: "Cardiology", // string (30 chars max)
  department: "Cardiology",    // string (30 chars max, optional)
  joiningDate: "2020-01-15",   // DateOnly (YYYY-MM-DD, optional)
  yearsOfExperience: 10,       // integer (optional)
  salary: 120000.00,           // decimal (7,2) (optional)
  status: "Active"             // string (10 chars max)
}
```

---

### 2. Appointment Service (`appointmentService.js`)

Located at: `src/features/doctor/appointments/appointmentService.js`

#### Methods

##### `getAllAppointments()`
- **Endpoint**: `GET /api/appointments`
- **Returns**: Array of all appointments

##### `getDoctorAppointments()`
- **Endpoint**: `GET /api/appointments` (filtered client-side)
- **Returns**: Array of appointments for current doctor
- **Note**: Automatically filters by current doctor's ID from localStorage

##### `getAppointmentById(id)`
- **Endpoint**: `GET /api/appointments/{id}`
- **Parameters**: 
  - `id` (string): Appointment ID (9 chars max)
- **Returns**: Appointment object

##### `getAppointmentWithDoctor(patientId)`
- **Endpoint**: `GET /api/appointments/patient/{patientId}/appointments`
- **Parameters**: 
  - `patientId` (string): Patient ID
- **Returns**: Appointments with doctor details for specific patient

##### `createAppointment(appointmentData)`
- **Endpoint**: `POST /api/appointments`
- **Parameters**: Appointment creation data object
- **Returns**: Created appointment object
- **Usage**: 
  ```javascript
  const appointment = await appointmentService.createAppointment({
    date: "2025-11-27",
    time: "10:00 AM",
    status: "Scheduled",
    patientId: "PAT00001",
    doctorId: "DOC00001",
    staffId: "STF00001",
    purpose: "Regular checkup",
    cancellationReason: null // optional
  });
  ```

##### `updateAppointment(id, appointmentData)`
- **Endpoint**: `PUT /api/appointments/{id}`
- **Parameters**: 
  - `id` (string): Appointment ID
  - `appointmentData` (object): Updated appointment data
- **Returns**: Updated appointment object

##### `deleteAppointment(id)`
- **Endpoint**: `DELETE /api/appointments/{id}`
- **Parameters**: 
  - `id` (string): Appointment ID
- **Returns**: Boolean (true on success)

##### `approveAppointment(id)`
- **Endpoint**: `PATCH /api/appointments/{id}/approve`
- **Parameters**: 
  - `id` (string): Appointment ID
- **Returns**: Updated appointment object
- **Usage**: 
  ```javascript
  const approved = await appointmentService.approveAppointment('APT000001');
  ```

##### `rejectAppointment(id, reason)`
- **Endpoint**: `PATCH /api/appointments/{id}/reject`
- **Parameters**: 
  - `id` (string): Appointment ID
  - `reason` (string): Rejection reason
- **Returns**: Updated appointment object
- **Usage**: 
  ```javascript
  const rejected = await appointmentService.rejectAppointment(
    'APT000001', 
    'Doctor unavailable on this date'
  );
  ```

##### `getAppointmentStats()`
- **Returns**: Appointment statistics object
- **Usage**: Client-side calculation of stats
  ```javascript
  const stats = await appointmentService.getAppointmentStats();
  // Returns: { total, scheduled, completed, cancelled, today }
  ```

#### Appointment Data Structure

```javascript
{
  id: "APT000001",              // string (9 chars)
  date: "2025-11-27",           // DateOnly (YYYY-MM-DD)
  time: "10:00 AM",             // string (20 chars max)
  status: "Scheduled",          // string (20 chars max)
  patientId: "PAT00001",        // string (8 chars)
  doctorId: "DOC00001",         // string (8 chars)
  staffId: "STF00001",          // string (8 chars)
  purpose: "Regular checkup",   // string (200 chars max)
  cancellationReason: null,     // string (200 chars max, optional)
  patientName: "John Smith",    // string (optional, from DTO)
  doctorName: "Dr. Sarah",      // string (optional, from DTO)
  staffName: "Mary Johnson"     // string (optional, from DTO)
}
```

#### Appointment Status Values
- `"Pending"` - Waiting for approval
- `"Scheduled"` - Approved and scheduled
- `"Completed"` - Appointment finished
- `"Cancelled"` - Cancelled by patient or doctor

---

### 3. Patient Service (`patientService.js`)

Located at: `src/features/doctor/patients/patientService.js`

#### Methods

##### `getAllPatients()`
- **Endpoint**: `GET /api/patients`
- **Returns**: Array of all patients

##### `getPatientById(id)`
- **Endpoint**: `GET /api/patients/{id}`
- **Parameters**: 
  - `id` (string): Patient ID (8 chars max)
- **Returns**: Patient object

##### `getDoctorPatients()`
- **Endpoint**: `GET /api/appointments` + `GET /api/patients` (combined)
- **Returns**: Array of patients who have appointments with current doctor
- **Note**: Filters patients based on appointments with current doctor

##### `createPatient(patientData)`
- **Endpoint**: `POST /api/patients`
- **Parameters**: Patient creation data object
- **Returns**: Created patient object
- **Usage**: 
  ```javascript
  const patient = await patientService.createPatient({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "1234567890",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    address: "456 Patient Ave",
    bloodGroup: "A+",
    emergencyContact: "0987654321",
    emergencyName: "Jane Smith",
    emergencyRelationship: "Spouse",
    allergies: "Penicillin",
    conditions: "Hypertension",
    medications: "Lisinopril"
  });
  ```

##### `updatePatient(id, patientData)`
- **Endpoint**: `PUT /api/patients/{id}`
- **Parameters**: 
  - `id` (string): Patient ID
  - `patientData` (object): Updated patient data
- **Returns**: Updated patient object

##### `deletePatient(id)`
- **Endpoint**: `DELETE /api/patients/{id}`
- **Parameters**: 
  - `id` (string): Patient ID
- **Returns**: Boolean (true on success)

##### `searchPatients(searchTerm)`
- **Endpoint**: `GET /api/patients` (filtered client-side)
- **Parameters**: 
  - `searchTerm` (string): Search query
- **Returns**: Array of filtered patients
- **Note**: Searches by firstName, lastName, email, id, and phone

##### `getPatientStats()`
- **Returns**: Patient statistics object
- **Usage**: Client-side calculation of stats
  ```javascript
  const stats = await patientService.getPatientStats();
  // Returns: { total, active, male, female }
  ```

#### Patient Data Structure

```javascript
{
  id: "PAT00001",                    // string (8 chars)
  firstName: "John",                 // string (50 chars max)
  lastName: "Smith",                 // string (50 chars max)
  email: "john.smith@email.com",     // string (50 chars max)
  phone: "1234567890",               // string (15 chars max)
  dateOfBirth: "1990-05-15",         // DateOnly (YYYY-MM-DD)
  gender: "Male",                    // string (10 chars max)
  address: "456 Patient Ave",        // string (250 chars max)
  bloodGroup: "A+",                  // string (20 chars max, optional)
  emergencyContact: "0987654321",    // string (15 chars max, optional)
  emergencyName: "Jane Smith",       // string (50 chars max, optional)
  emergencyRelationship: "Spouse",   // string (15 chars max, optional)
  allergies: "Penicillin",           // string (256 chars max, optional)
  conditions: "Hypertension",        // string (256 chars max, optional)
  medications: "Lisinopril"          // string (256 chars max, optional)
}
```

---

## Error Handling

All services include try-catch blocks and console error logging. Errors are re-thrown for component-level handling.

### Common Error Responses

#### 401 Unauthorized
- Token expired or invalid
- Automatically redirects to `/login`
- Clears localStorage

#### 404 Not Found
```javascript
{
  message: "Doctor with ID DOC00001 not found."
}
```

#### 400 Bad Request
```javascript
{
  message: "Validation error message"
}
```

### Example Error Handling in Components

```javascript
try {
  const profile = await doctorService.getCurrentDoctorProfile();
  setProfile(profile);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Profile not found');
  } else if (error.response?.status === 401) {
    // Automatically handled by interceptor
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Usage Examples

### Getting Doctor's Appointments

```javascript
import appointmentService from './appointments/appointmentService';

// In your component
useEffect(() => {
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getDoctorAppointments();
      setAppointments(appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, []);
```

### Updating Doctor Profile

```javascript
import doctorService from './services/doctorService';

const handleUpdateProfile = async (formData) => {
  try {
    const updated = await doctorService.updateCurrentDoctorProfile(formData);
    console.log('Profile updated successfully:', updated);
    // Update UI state
  } catch (error) {
    console.error('Failed to update profile:', error);
    // Show error message to user
  }
};
```

### Approving an Appointment

```javascript
import appointmentService from './appointments/appointmentService';

const handleApprove = async (appointmentId) => {
  try {
    const approved = await appointmentService.approveAppointment(appointmentId);
    console.log('Appointment approved:', approved);
    // Refresh appointments list
  } catch (error) {
    console.error('Failed to approve appointment:', error);
  }
};
```

### Searching Patients

```javascript
import patientService from './patients/patientService';

const handleSearch = async (searchTerm) => {
  try {
    const results = await patientService.searchPatients(searchTerm);
    setPatients(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

## Testing the API

### Prerequisites
1. Backend API running on `https://localhost:7061`
2. Valid authentication token in localStorage
3. User ID stored in localStorage

### Test Endpoints with curl

```bash
# Get all doctors
curl -X GET https://localhost:7061/api/doctors \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get doctor by ID
curl -X GET https://localhost:7061/api/doctors/DOC00001 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all appointments
curl -X GET https://localhost:7061/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"

# Approve appointment
curl -X PATCH https://localhost:7061/api/appointments/APT000001/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Environment Configuration

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://localhost:7061/api
```

For production:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Notes

- All date fields use ISO 8601 format: `YYYY-MM-DD`
- String ID fields have specific length limits (8 chars for entities, 9 for appointments)
- Optional fields can be `null` or omitted
- The API uses Entity Framework Core with SQL Server backend
- All services automatically handle authentication tokens via axios interceptors
