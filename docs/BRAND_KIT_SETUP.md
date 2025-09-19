# Brand Kit Setup Wizard

A 3-step wizard for creating brand kits with logo upload, product images, and AI-powered feature extraction. Built with React Hook Form and Zod validation for robust form management and type safety.

## Overview

The Brand Kit Setup Wizard guides users through creating a comprehensive brand kit in three steps:
1. **Logo & Product Details** - Upload logo and enter product information
2. **Product Images** - Upload multiple product images for AI processing
3. **Review & Edit** - Review and customize extracted features and colors

## Technology Stack

- **React Hook Form**: Modern form management with minimal re-renders
- **Zod**: Type-safe schema validation with TypeScript integration
- **@hookform/resolvers**: Seamless integration between React Hook Form and Zod
- **TypeScript**: End-to-end type safety

## Component Structure

```
src/app/(Image)/brandkit/
├── page.tsx                    # Main orchestrator
├── schemas.ts                  # Zod validation schemas
├── _components/
│   ├── stepper.tsx            # Progress indicator
│   ├── step-logo-form.tsx     # Step 1: Logo & Details (React Hook Form)
│   ├── step-product-images.tsx # Step 2: Product Images (React Hook Form)
│   └── step-review.tsx        # Step 3: Review & Edit (React Hook Form)
└── types/brand-kit.ts         # Type definitions
```

## Data Flow

### Main Page (`page.tsx`)
- **State Management**: Manages current step and brand kit data
- **Navigation**: Handles step transitions (next/previous)
- **Data Flow**: Passes data down to step components via props

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [brandKitData, setBrandKitData] = useState<BrandKitData>({
  productTitle: "",
  productDescription: "",
  productImages: [],
  productImagePreviews: [],
  extractedFeatures: [],
  brandColors: [],
});
```

### Step Components
All step components receive the same props structure and use React Hook Form:

```typescript
interface BrandKitStepProps {
  data: BrandKitData;           // Current brand kit data
  updateData: (updates: Partial<BrandKitData>) => void; // Update function
  onNext: () => void;          // Navigate to next step
  onPrevious: () => void;      // Navigate to previous step
}

// React Hook Form setup in each step component
const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StepData>({
  resolver: zodResolver(stepSchema),
  mode: "onChange",
  defaultValues: { /* initial values */ }
});
```

### Validation Schemas (`schemas.ts`)
Centralized Zod schemas for each step:

```typescript
// Step 1: Logo & Product Details
export const step1Schema = z.object({
  logo: imageFileSchema,
  productTitle: z.string().min(1).max(100),
  productDescription: z.string().min(1).max(500),
});

// Step 2: Product Images
export const step2Schema = z.object({
  productImages: z.array(imageFileSchema).min(1).max(10),
});

// Step 3: Review
export const step3Schema = z.object({
  extractedFeatures: z.array(z.string()),
  brandColors: z.array(hexColorSchema).min(1),
});
```

## Step-by-Step Flow

### Step 1: Logo & Product Details (`step-logo-form.tsx`)
**Purpose**: Collect logo and basic product information

**Features**:
- Drag & drop logo upload with file validation
- Product title and description input with real-time validation
- 1:2 column layout (logo:product info)
- React Hook Form integration with Zod validation

**Data Collected**:
- `logo`: File object (required, PNG/JPG/SVG)
- `logoPreview`: Base64 preview string
- `productTitle`: string (required, max 100 chars)
- `productDescription`: string (required, max 500 chars)

**Validation**:
- Logo: Required image file with type validation
- Product title: Required, non-empty, max 100 characters
- Product description: Required, non-empty, max 500 characters

**Navigation**: 
- Form submission only when validation passes
- Real-time validation feedback with error display

### Step 2: Product Images (`step-product-images.tsx`)
**Purpose**: Upload multiple product images for AI processing

**Features**:
- Multi-image drag & drop upload with validation
- Image preview grid with individual removal
- 6:4 column layout (upload:preview)
- React Hook Form integration with file array validation

**Data Collected**:
- `productImages`: File[] array (1-10 images, PNG/JPG only)
- `productImagePreviews`: string[] array (Base64)

**Validation**:
- Minimum 1 image required
- Maximum 10 images allowed
- Only PNG/JPG image files accepted
- Real-time validation feedback

**Navigation**:
- Form submission only when validation passes
- Back button calls `onPrevious()` to return to Step 1

### Step 3: Review & Edit (`step-review.tsx`)
**Purpose**: Review and customize the brand kit

**Features**:
- Inline editing for product title/description
- Editable feature list (add/edit/remove)
- Editable color palette (add/edit/remove) with hex validation
- 2:1 column layout (main content:sidebar)
- Read-only display for images and logo
- React Hook Form integration with dynamic arrays

**Data Management**:
- Local state for features and colors
- Inline editing with save/cancel
- Real-time updates with form validation
- Dynamic array management for features and colors

**Validation**:
- Brand colors: Required array of valid hex colors (minimum 1)
- Hex color format validation with regex
- Real-time validation feedback

**Navigation**:
- Back button returns to Step 2
- Complete button finishes the wizard (only when validation passes)

## Component Connections

### Stepper Component (`stepper.tsx`)
**Connection**: Receives current step from main page
**Purpose**: Visual progress indicator in sidebar
**Props**:
- `currentStep`: Current step number
- `totalSteps`: Total number of steps
- `steps`: Array of step names

### Data Flow Pattern
```
Main Page (page.tsx)
    ↓ (props)
Step Components (React Hook Form)
    ↓ (form submission)
Zod Validation
    ↓ (validated data)
Main Page State
    ↓ (updated data)
All Step Components (re-render with new data)
```

### Form Validation Flow
```
User Input
    ↓
React Hook Form (onChange mode)
    ↓
Zod Schema Validation
    ↓
Error Display (if invalid)
    ↓
Form Submission (if valid)
    ↓
Data Update & Navigation
```

## State Management

### Centralized State
All brand kit data is managed in the main page component and passed down to step components.

### React Hook Form Integration
Each step component uses React Hook Form for local form state management:

```typescript
// Form setup with Zod resolver
const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<StepData>({
  resolver: zodResolver(stepSchema),
  mode: "onChange",
  defaultValues: { /* initial values from props */ }
});

// Form submission with validation
const onSubmit = (formData: StepData) => {
  updateData(formData);
  onNext();
};
```

### Update Pattern
Step components call `updateData()` after form validation:

```typescript
// Example: Adding a product image
const onSubmit = (formData: Step2Data) => {
  updateData({
    productImages: formData.productImages,
  });
  onNext();
};
```

### Local State
Step components maintain local state for:
- UI interactions (drag states, editing modes)
- Temporary values during editing
- Component-specific features
- Form validation errors

## Layout System

### Responsive Design
- **Mobile**: Single column, stacked layout
- **Desktop**: Multi-column layouts with specific ratios

### Column Ratios
- **Step 1**: 1:2 (logo:product info)
- **Step 2**: 6:4 (upload:preview)
- **Step 3**: 2:1 (main:sidebar)

## File Handling

### Upload Process
1. User drops/selects files
2. Files validated (image type)
3. FileReader creates Base64 previews
4. Files and previews stored in state
5. UI updates with previews

### Preview Generation
```typescript
const reader = new FileReader();
reader.onload = (e) => {
  updateData({
    logo: file,
    logoPreview: e.target?.result as string,
  });
};
reader.readAsDataURL(file);
```

## Validation

### Zod Schema Validation
Each step has a dedicated Zod schema for type-safe validation:

```typescript
// File validation helper
const imageFileSchema = z.any()
  .refine((file) => file instanceof File, { message: "Please select a file" })
  .refine((file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    return allowedTypes.includes(file.type);
  }, { message: "File must be PNG, JPG, or SVG" });

// Hex color validation
const hexColorSchema = z.string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color");
```

### Step 1 Validation
- **Logo**: Required image file (PNG/JPG/SVG)
- **Product title**: Required, non-empty, max 100 characters
- **Product description**: Required, non-empty, max 500 characters

### Step 2 Validation
- **Product images**: Array of 1-10 image files (PNG/JPG only)
- Real-time validation on file upload/removal

### Step 3 Validation
- **Brand colors**: Required array of valid hex colors (minimum 1)
- **Features**: Optional array of strings
- Real-time validation for color format

## Navigation Logic

### Form-Based Step Transitions
Each step uses React Hook Form's `handleSubmit` for navigation:

```typescript
// Step component form submission
const onSubmit = (formData: StepData) => {
  updateData(formData);
  onNext(); // Only called after successful validation
};

// Form JSX
<form onSubmit={handleSubmit(onSubmit)}>
  {/* form fields */}
  <Button type="submit">Continue</Button>
</form>
```

### Step Transitions
```typescript
const nextStep = () => {
  if (currentStep < steps.length) {
    setCurrentStep(currentStep + 1);
  } else {
    // Handle completion
    console.log("Brand kit setup completed!", brandKitData);
  }
};

const previousStep = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};
```

### Conditional Rendering
```typescript
const renderCurrentStep = () => {
  switch (currentStep) {
    case 1: return <StepLogoForm {...stepProps} />;
    case 2: return <StepProductImages {...stepProps} />;
    case 3: return <StepReview {...stepProps} />;
    default: return <StepLogoForm {...stepProps} />;
  }
};
```

## Type Safety

### Core Types
```typescript
interface BrandKitData {
  logo?: File;
  logoPreview?: string;
  productTitle: string;
  productDescription: string;
  productImages: File[];
  productImagePreviews: string[];
  extractedFeatures: string[];
  brandColors: string[];
}
```

### Zod-Inferred Types
```typescript
// Automatically inferred from Zod schemas
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type BrandKitData = z.infer<typeof brandKitSchema>;
```

### Component Props
All step components use the same props interface for consistency and type safety:

```typescript
interface BrandKitStepProps {
  data: BrandKitData;
  updateData: (updates: Partial<BrandKitData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

## Performance Benefits

### React Hook Form Advantages
- **Minimal Re-renders**: Only re-renders when necessary
- **Uncontrolled Components**: Better performance with file inputs
- **Optimized Validation**: Validation runs only when needed
- **Built-in Debouncing**: Automatic input debouncing

### Form Management
- **Real-time Validation**: Immediate feedback without performance impact
- **Type Safety**: End-to-end TypeScript support
- **Error Handling**: Centralized error management
- **Accessibility**: Built-in form accessibility features

## Future Backend Integration

### Data Structure
The current data structure is designed to easily integrate with backend APIs:

- **Files**: Ready for multipart/form-data upload
- **Strings**: Ready for JSON API calls
- **Arrays**: Structured for batch processing
- **Validated Data**: All data is pre-validated by Zod schemas

### Integration Points
1. **Step 1**: Upload logo and save product details
2. **Step 2**: Upload product images
3. **Step 3**: Trigger AI processing and save final brand kit

### API Integration Example
```typescript
// Form submission with API call
const onSubmit = async (formData: Step1Data) => {
  try {
    // Upload logo file
    const logoResponse = await uploadFile(formData.logo);
    
    // Save product details
    await saveProductDetails({
      title: formData.productTitle,
      description: formData.productDescription,
      logoUrl: logoResponse.url
    });
    
    updateData(formData);
    onNext();
  } catch (error) {
    // Handle API errors
    setError('api', { message: 'Failed to save data' });
  }
};
```

The component structure allows for easy addition of API calls at each step transition point with proper error handling and loading states.
