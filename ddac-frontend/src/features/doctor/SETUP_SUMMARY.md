# Doctor Role - Core Functionalities Setup

## Overview
This document summarizes the core functionalities that have been set up for the doctor role in the DDAC Healthcare application, connecting the React frontend to the ASP.NET Core backend API.

## Backend API Details
- **Base URL**: `https://localhost:7061/api` (Development)
- **Alternative**: `http://localhost:5203/api`
- **Framework**: ASP.NET Core with Entity Framework Core
- **Database**: SQL Server

## Files Created/Updated

### 1. API Configuration
**File**: `src/services/api.js`
- Updated base URL to match backend (`https://localhost:7061/api`)
- Added request interceptor to automatically include JWT token in headers
- Added response interceptor to handle 401 unauthorized errors
- Automatic token refresh and redirect to login on auth failure

### 2. Doctor Service
**File**: `src/features/doctor/services/doctorService.js`
- `getAllDoctors()` - Fetch all doctors
- `getDoctorById(id)` - Get doctor by ID
- `getCurrentDoctorProfile()` - Get logged-in doctor's profile
- `createDoctor(data)` - Create new doctor
- `updateDoctor(id, data)` - Update doctor by ID
- `updateCurrentDoctorProfile(data)` - Update current doctor's profile
- `deleteDoctor(id)` - Delete doctor

### 3. Appointment Service
**File**: `src/features/doctor/appointments/appointmentService.js`
- `getAllAppointments()` - Fetch all appointments
- `getDoctorAppointments()` - Get appointments for current doctor
- `getAppointmentById(id)` - Get appointment details
- `getAppointmentWithDoctor(patientId)` - Get appointments with doctor details
- `createAppointment(data)` - Create new appointment
- `updateAppointment(id, data)` - Update appointment
- `deleteAppointment(id)` - Delete appointment
- `approveAppointment(id)` - Approve pending appointment
- `rejectAppointment(id, reason)` - Reject appointment with reason
- `getAppointmentStats()` - Get statistics for dashboard

### 4. Patient Service
**File**: `src/features/doctor/patients/patientService.js`
- `getAllPatients()` - Fetch all patients
- `getPatientById(id)` - Get patient by ID
- `getDoctorPatients()` - Get patients for current doctor
- `createPatient(data)` - Create new patient
- `updatePatient(id, data)` - Update patient
- `deletePatient(id)` - Delete patient
- `searchPatients(term)` - Search patients by name, email, ID, or phone
- `getPatientStats()` - Get statistics for dashboard

### 5. Documentation
**File**: `src/features/doctor/API_DOCUMENTATION.md`
- Complete API documentation with all endpoints
- Request/response examples
- Data structures and field constraints
- Error handling guidelines
- Usage examples for common operations

### 6. Environment Configuration
**File**: `.env.example`
- Template for environment variables
- Backend API base URL configuration

## Core Functionalities Implemented

### 1. Authentication & Authorization
- JWT token management via axios interceptors
- Automatic token inclusion in all API requests
- Unauthorized access handling (401 redirect to login)
- User session management (userId, userRole, userName in localStorage)

### 2. Doctor Profile Management
- View doctor profile with all details (personal info, specialization, license)
- Update profile information
- Automatic current user detection from localStorage

### 3. Appointment Management
- View all appointments for the doctor
- Filter appointments by doctor ID
- Create new appointments
- Update appointment details
- Approve/reject pending appointments with reasons
- Delete appointments
- Get appointment statistics (total, scheduled, completed, cancelled, today)

### 4. Patient Management
- View all patients
- View patients associated with the doctor (through appointments)
- Search patients by multiple criteria
- View detailed patient information (medical history, allergies, conditions)
- Create new patient records
- Update patient information
- Get patient statistics (total, active, gender distribution)

### 5. Error Handling
- Comprehensive try-catch blocks in all service methods
- Console logging for debugging
- Graceful error handling with user-friendly messages
- Automatic logout on authentication failures

## Data Models

### Doctor Model
```javascript
{
  id: string (8 chars)
  firstName: string (50 chars)
  lastName: string (50 chars)
  email: string (50 chars)
  phone: string (15 chars)
  dateOfBirth: DateOnly (YYYY-MM-DD)
  gender: string (10 chars)
  address: string (250 chars)
  bloodGroup?: string (20 chars)
  emergencyContact?: string (15 chars)
  licenseNumber: string (20 chars)
  specialization: string (30 chars)
  department?: string (30 chars)
  joiningDate?: DateOnly
  yearsOfExperience?: number
  salary?: decimal(7,2)
  status: string (10 chars)
}
```

### Appointment Model
```javascript
{
  id: string (9 chars)
  date: DateOnly (YYYY-MM-DD)
  time: string (20 chars)
  status: string (20 chars) // Pending, Scheduled, Completed, Cancelled
  patientId: string (8 chars)
  doctorId: string (8 chars)
  staffId: string (8 chars)
  purpose: string (200 chars)
  cancellationReason?: string (200 chars)
}
```

### Patient Model
```javascript
{
  id: string (8 chars)
  firstName: string (50 chars)
  lastName: string (50 chars)
  email: string (50 chars)
  phone: string (15 chars)
  dateOfBirth: DateOnly (YYYY-MM-DD)
  gender: string (10 chars)
  address: string (250 chars)
  bloodGroup?: string (20 chars)
  emergencyContact?: string (15 chars)
  emergencyName?: string (50 chars)
  emergencyRelationship?: string (15 chars)
  allergies?: string (256 chars)
  conditions?: string (256 chars)
  medications?: string (256 chars)
}
```

## Backend API Endpoints

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Appointment Endpoints
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `GET /api/appointments/patient/{patientId}/appointments` - Get patient appointments with doctor
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment
- `PATCH /api/appointments/{id}/approve` - Approve appointment
- `PATCH /api/appointments/{id}/reject` - Reject appointment

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

## Usage Examples

### Fetch Doctor Appointments
```javascript
import appointmentService from './appointments/appointmentService';

const fetchAppointments = async () => {
  try {
    const appointments = await appointmentService.getDoctorAppointments();
    console.log('Appointments:', appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};
```

### Update Doctor Profile
```javascript
import doctorService from './services/doctorService';

const updateProfile = async (formData) => {
  try {
    const updated = await doctorService.updateCurrentDoctorProfile(formData);
    console.log('Profile updated:', updated);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};
```

### Approve Appointment
```javascript
import appointmentService from './appointments/appointmentService';

const approveAppointment = async (appointmentId) => {
  try {
    const result = await appointmentService.approveAppointment(appointmentId);
    console.log('Appointment approved:', result);
  } catch (error) {
    console.error('Error approving appointment:', error);
  }
};
```

### Search Patients
```javascript
import patientService from './patients/patientService';

const searchPatients = async (searchTerm) => {
  try {
    const results = await patientService.searchPatients(searchTerm);
    console.log('Search results:', results);
  } catch (error) {
    console.error('Error searching patients:', error);
  }
};
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd ddac-frontend
npm install axios
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and verify the API URL:
```env
VITE_API_BASE_URL=https://localhost:7061/api
```

### 3. Start Backend API
```bash
cd ../WellSpring-HealthCare-API
dotnet run
```

The API should start at `https://localhost:7061`

### 4. Start Frontend
```bash
cd ../DDAC---FrontEnd/ddac-frontend
npm run dev
```

### 5. Test the Integration
1. Login as a doctor (email: `doctor@gmail.com`, password: `123456`)
2. Navigate to Doctor Dashboard
3. Check browser console for any API errors
4. Verify data is being fetched from the backend

## Security Considerations

### Authentication
- All API requests include JWT token in Authorization header
- Token stored securely in localStorage
- Automatic token validation on each request
- 401 errors trigger automatic logout and redirect

### Data Validation
- Client-side validation before API calls
- Backend validates all incoming data
- Field length constraints enforced
- Required fields validated

### Error Handling
- Never expose sensitive error details to users
- Log errors to console for debugging
- Graceful fallbacks for failed requests
- User-friendly error messages

## Next Steps

### Integration with UI Components
1. **DoctorDashboard.jsx**
   - Replace mock data with `appointmentService.getDoctorAppointments()`
   - Use `appointmentService.getAppointmentStats()` for stat cards
   - Add loading states and error handling

2. **DoctorAppointments.jsx**
   - Use `appointmentService.getDoctorAppointments()` to load appointments
   - Implement approve/reject functionality
   - Add real-time updates after actions

3. **DoctorProfile.jsx**
   - Load profile data with `doctorService.getCurrentDoctorProfile()`
   - Update profile with `doctorService.updateCurrentDoctorProfile()`
   - Add form validation

4. **DoctorPatients.jsx**
   - Load patients with `patientService.getDoctorPatients()`
   - Implement search with `patientService.searchPatients()`
   - Add patient details modal

5. **DoctorAnalytics.jsx**
   - Use appointment and patient stats for analytics
   - Generate real charts from API data
   - Add date range filtering

### Additional Features to Implement
- Real-time notifications for new appointments
- Appointment scheduling with calendar view
- Patient medical history viewer
- Prescription management
- Video consultation integration
- Report generation and export

## Testing Checklist

- [ ] Backend API is running on `https://localhost:7061`
- [ ] Frontend can connect to backend API
- [ ] Authentication token is properly stored and sent
- [ ] Doctor can login successfully
- [ ] Doctor profile loads correctly
- [ ] Appointments list displays real data
- [ ] Appointment approval/rejection works
- [ ] Patient list loads correctly
- [ ] Patient search functionality works
- [ ] Error handling triggers appropriate responses
- [ ] 401 errors redirect to login page
- [ ] Network errors show user-friendly messages

## Troubleshooting

### API Connection Issues
1. Verify backend is running: `https://localhost:7061/swagger`
2. Check CORS configuration in backend
3. Verify API base URL in `.env` file
4. Check browser console for network errors

### Authentication Issues
1. Verify token exists in localStorage
2. Check token format (should start with "Bearer ")
3. Verify token hasn't expired
4. Check backend authentication middleware

### Data Not Loading
1. Check browser network tab for failed requests
2. Verify API endpoints match backend routes
3. Check data format matches expected DTOs
4. Verify userId exists in localStorage

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md for detailed endpoint information
2. Review browser console for error messages
3. Check backend API logs
4. Verify all environment variables are set correctly

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0
**Author**: DDAC Healthcare Development Team
