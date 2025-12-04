# Receipt Management System Documentation

## Overview
This document describes the receipt management system implemented for staff to create flexible, itemized receipts for patient appointments and process payments through Stripe.

## System Architecture

### Backend Integration
- **Endpoint**: `/api/transactions`
- **Receipt Field**: JSON object stored in `transaction.receipt` field
- **Format**: Key-value pairs (e.g., `{"consultation": 100.00, "xray": 200.00, "paracetamol": 23.00}`)
- **Status Flow**: Pending → Paid (receipt only visible for "Paid" transactions)

### Frontend Components

#### 1. ReceiptForm.jsx (`/staff/payments/receipt`)
**Purpose**: Create flexible receipt items before payment

**Features**:
- Add services (consultation, X-ray, surgery, lab test, physiotherapy, other)
- Add medicines with custom names
- Manual price entry for all items
- Real-time total calculation
- Preview panel showing all items
- Remove items functionality

**Workflow**:
1. Staff selects service type from dropdown or enters medicine name
2. Enters price for each item (in MYR)
3. Clicks "Add Service" or "Add Medicine" to add to receipt
4. Preview panel shows running total
5. "Create Receipt & Proceed to Payment" button saves receipt to transaction table
6. Redirects to PaymentForm for Stripe checkout

**Route Parameters**:
- `?appointmentId=APT000001` - Required appointment ID

**Receipt Format Sent to Backend**:
```javascript
{
  appointmentId: "APT000001",
  amount: 323.00,
  status: "Pending",
  currency: "MYR",
  receipt: {
    "consultation": 100.00,
    "xray": 200.00,
    "paracetamol": 23.00
  },
  notes: "Receipt created by staff"
}
```

#### 2. ReceiptDisplay.jsx (`/staff/payments/receipt/view`)
**Purpose**: View and print receipts for paid transactions

**Features**:
- Only accessible for transactions with status="Paid"
- Displays itemized charges from receipt JSON
- Shows transaction details (date, time, payment method, card last 4 digits)
- Shows appointment information
- Print functionality (browser print dialog)
- Professional receipt layout

**Route Parameters**:
- `?transactionId=TXN000001` - Required transaction ID

**Display Sections**:
1. Transaction Information (date, time, status, payment method)
2. Appointment Information (ID, date, purpose, doctor)
3. Itemized Charges (table with description and amount)
4. Total Amount (with currency)
5. Notes (if any)

### Service Layer Updates

#### paymentService.js
**Updated Function**: `mapTransactionPayload()`
- Added `receipt: payload.receipt || null` to transaction mapping
- Allows JSON receipt object to be sent to backend

**Existing Functions Used**:
- `createPayment(transactionData)` - Creates transaction with receipt
- `getPaymentById(id)` - Retrieves transaction with receipt data

#### appointmentService.js
**Existing Function Used**:
- `getAppointmentById(id)` - Retrieves appointment details for receipt context

## Usage Flow

### Staff Workflow
1. **Navigate to Receipt Creation**
   - Click "Create Receipt" from appointment details or payment list
   - URL: `/staff/payments/receipt?appointmentId=APT000001`

2. **Build Receipt**
   - Add services (consultation, X-ray, etc.) with prices
   - Add medicines with custom names and prices
   - Preview shows real-time total

3. **Save and Proceed**
   - Click "Create Receipt & Proceed to Payment"
   - Receipt saved to transaction table with status="Pending"
   - Redirects to existing PaymentForm for Stripe checkout

4. **Payment Processing**
   - Staff completes Stripe payment
   - Transaction status updates to "Paid"

5. **View Receipt**
   - Navigate to `/staff/payments/receipt/view?transactionId=TXN000001`
   - Only works for "Paid" transactions
   - Print or download receipt

### Integration with Existing Payment Flow

The receipt system integrates seamlessly with the existing payment infrastructure:

1. **ReceiptForm** → Creates transaction with receipt JSON
2. **PaymentForm** → Processes Stripe payment (existing component)
3. **ReceiptDisplay** → Shows receipt after payment complete

## Service Types Available

Predefined appointment types (with icons):
- Consultation (FaStethoscope)
- X-Ray (FaXRay)
- Surgery (FaSyringe)
- Lab Test (FaStethoscope)
- Physiotherapy (FaStethoscope)
- Other Service (FaStethoscope)

Medicine items are freeform text input.

## Technical Details

### State Management
```javascript
// ReceiptForm state
const [receiptItems, setReceiptItems] = useState([]);  // Services
const [medicineItems, setMedicineItems] = useState([]); // Medicines
const [selectedService, setSelectedService] = useState('');
const [servicePrice, setServicePrice] = useState('');
const [medicineName, setMedicineName] = useState('');
const [medicinePrice, setMedicinePrice] = useState('');
```

### Item Structure
```javascript
// Service item
{
  id: Date.now(),
  type: 'service',
  name: 'Consultation',
  key: 'consultation',
  price: '100.00'
}

// Medicine item
{
  id: Date.now(),
  type: 'medicine',
  name: 'Paracetamol',
  price: '23.00'
}
```

### Total Calculation
```javascript
const calculateTotal = () => {
  const servicesTotal = receiptItems.reduce((sum, item) => 
    sum + parseFloat(item.price || 0), 0);
  const medicinesTotal = medicineItems.reduce((sum, item) => 
    sum + parseFloat(item.price || 0), 0);
  return (servicesTotal + medicinesTotal).toFixed(2);
};
```

## Router Configuration

Added routes in `AppRouter.jsx`:
```jsx
import ReceiptForm from "../features/staff/payments/ReceiptForm";
import ReceiptDisplay from "../features/staff/payments/ReceiptDisplay";

// Routes
<Route path="/staff/payments/receipt" 
  element={<ProtectedRoute allowedRoles={['staff']}><ReceiptForm/></ProtectedRoute>}/>
<Route path="/staff/payments/receipt/view" 
  element={<ProtectedRoute allowedRoles={['staff']}><ReceiptDisplay/></ProtectedRoute>}/>
```

## Styling

### ReceiptForm
- Two-column layout (large screens): Add items | Preview panel
- Service section: Blue theme (#06923E for icons)
- Medicine section: Green theme
- Preview panel: Sticky positioning, scrolls independently
- Items: Color-coded backgrounds (blue for services, green for medicines)

### ReceiptDisplay
- Professional receipt layout
- Print-optimized styles
- Hidden action buttons in print view
- Itemized table with borders
- Footer with thank you message

## Error Handling

### ReceiptForm
- Validates at least one item before submission
- Checks for valid prices (> 0)
- Alerts on API errors
- Loading state during submission

### ReceiptDisplay
- Only shows receipts for "Paid" transactions
- Redirects if transaction not paid
- Handles missing transaction gracefully
- Loading state during data fetch

## Future Enhancements

Possible improvements:
1. Add tax calculation
2. Discount codes support
3. Multiple currency support
4. Email receipt to patient
5. Receipt templates (different formats)
6. Bulk receipt generation
7. Receipt history/archive
8. Export to PDF (instead of browser print)

## Dependencies

Required packages (already installed):
- `react-icons` - Icons (FaPlus, FaTrash, FaPills, etc.)
- `react-router-dom` - Routing and navigation
- `axios` - API calls (via staffApi)

## Testing

### Manual Testing Steps
1. Login as staff (ST000001)
2. Navigate to `/staff/payments/receipt?appointmentId=APT000001`
3. Add 2-3 services with prices
4. Add 2-3 medicines with names and prices
5. Verify total updates correctly
6. Remove items and verify total recalculates
7. Click "Create Receipt & Proceed to Payment"
8. Complete Stripe payment
9. Navigate to `/staff/payments/receipt/view?transactionId=<new-id>`
10. Verify receipt displays correctly
11. Click "Print Receipt" and verify print layout

### Edge Cases to Test
- Empty receipt (should block submission)
- Zero or negative prices (should validate)
- Very long medicine names (should wrap)
- Large number of items (should scroll)
- Transaction with status != "Paid" (should block view)

## API Endpoints Used

### POST /api/transactions
Creates new transaction with receipt
```json
{
  "appointmentId": "APT000001",
  "amount": 323.00,
  "status": "Pending",
  "currency": "MYR",
  "receipt": {
    "consultation": 100.00,
    "xray": 200.00
  }
}
```

### GET /api/transactions/{id}
Retrieves transaction with receipt data
```json
{
  "id": "TXN000001",
  "amount": 323.00,
  "status": "Paid",
  "receipt": {
    "consultation": 100.00,
    "xray": 200.00
  },
  "paymentTime": "2024-01-15T10:30:00Z"
}
```

### GET /api/appointments/{id}
Retrieves appointment details for context
```json
{
  "id": "APT000001",
  "date": "2024-01-15",
  "purpose": "General Consultation",
  "doctorId": "DR000001"
}
```

## File Locations

```
ddac-frontend/src/features/staff/
├── payments/
│   ├── ReceiptForm.jsx          # Create receipts
│   ├── ReceiptDisplay.jsx       # View/print receipts
│   ├── PaymentForm.jsx          # Existing payment processing
│   └── PaymentList.jsx          # Existing payment list
├── services/
│   ├── paymentService.js        # Updated with receipt field
│   └── appointmentService.js    # Appointment data
└── ...
```

## Notes

1. **Backend Ready**: The backend already supports receipt as JSON in transaction table
2. **Flexible Structure**: Receipt can contain any key-value pairs
3. **No Template Restriction**: Staff can add any service or medicine name
4. **Currency**: Currently hardcoded to MYR (Malaysian Ringgit)
5. **Print Functionality**: Uses browser's native print dialog
6. **Status Check**: Only "Paid" transactions can view/print receipts
7. **Navigation**: Back buttons navigate to previous page using `navigate(-1)`

## Summary

The receipt system provides staff with a flexible, user-friendly interface to:
- Create itemized receipts with custom services and medicines
- Calculate totals in real-time
- Save receipts to the transaction table
- Process payments through existing Stripe integration
- View and print professional receipts for completed transactions

This system integrates seamlessly with the existing payment infrastructure while providing the flexibility needed for diverse medical services and medications.
