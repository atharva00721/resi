# Brand Kit Database Schema

This document explains the database schema for the Brand Kit feature and how it integrates with the existing NextAuth setup.

## Database Models

### BrandKit Model
```prisma
model BrandKit {
  id                  String   @id @default(cuid())
  userId              String
  productTitle        String
  productDescription  String
  logoUrl             String?
  logoPreviewUrl      String?
  extractedFeatures   String[] // Array of features
  brandColors         String[] // Array of hex colors
  audience            String?
  productVibes        String?
  brandPersonality    String?
  status              BrandKitStatus @default(DRAFT)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  user                User @relation(fields: [userId], references: [id], onDelete: Cascade)
  productImages       ProductImage[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

### ProductImage Model
```prisma
model ProductImage {
  id          String   @id @default(cuid())
  brandKitId  String
  imageUrl    String
  previewUrl  String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())

  brandKit    BrandKit @relation(fields: [brandKitId], references: [id], onDelete: Cascade)

  @@index([brandKitId])
  @@index([order])
}
```

### BrandKitStatus Enum
```prisma
enum BrandKitStatus {
  DRAFT
  PROCESSING
  COMPLETED
  ARCHIVED
}
```

## How It Works with Your Brand Kit Flow

### 1. **Step 1: Logo & Details**
- User uploads logo and enters product details
- Data is stored in `BrandKit` model:
  - `productTitle` → `productTitle`
  - `productDescription` → `productDescription`
  - Logo file → uploaded to storage, URL stored in `logoUrl`

### 2. **Step 2: Product Images**
- User uploads multiple product images
- Each image creates a `ProductImage` record:
  - `imageUrl` → uploaded image URL
  - `previewUrl` → thumbnail/preview URL
  - `order` → display order

### 3. **Step 3: AI Processing**
- AI analyzes images and generates insights
- Results stored in `BrandKit`:
  - `extractedFeatures` → array of feature strings
  - `brandColors` → array of hex color codes
  - `audience` → target audience description
  - `productVibes` → product mood/vibe
  - `brandPersonality` → brand personality traits
  - `status` → updated to "PROCESSING" then "COMPLETED"

### 4. **Step 4: Review & Edit**
- User can review and edit the generated content
- Updates are saved back to the database

## API Endpoints

### GET /api/brandkit
- Get all brand kits for the current user
- Returns array of brand kits with product images

### POST /api/brandkit
- Create a new brand kit
- Requires: `productTitle`, `productDescription`, `productImageUrls`
- Optional: `logoUrl`, `logoPreviewUrl`, `productImagePreviewUrls`

### GET /api/brandkit/[id]
- Get a specific brand kit by ID
- Includes product images and user info

### PUT /api/brandkit/[id]
- Update brand kit with AI results
- Can update: `extractedFeatures`, `brandColors`, `audience`, `productVibes`, `brandPersonality`, `status`

### DELETE /api/brandkit/[id]
- Delete a brand kit and all associated product images

## Usage in Components

### Using the Hook
```typescript
import { useBrandKit } from "@/hooks/use-brandkit";

function BrandKitComponent() {
  const { 
    brandKits, 
    loading, 
    createBrandKit, 
    updateBrandKitWithAI 
  } = useBrandKit();

  // Create new brand kit
  const handleCreate = async () => {
    await createBrandKit({
      productTitle: "My Product",
      productDescription: "Product description",
      productImageUrls: ["url1", "url2"],
    });
  };

  // Update with AI results
  const handleAIComplete = async (brandKitId: string) => {
    await updateBrandKitWithAI(brandKitId, {
      extractedFeatures: ["feature1", "feature2"],
      brandColors: ["#FF0000", "#00FF00"],
      audience: "Young professionals",
    });
  };
}
```

### Using the Service Directly
```typescript
import { BrandKitService } from "@/lib/brandkit-service";

// Create brand kit
const brandKit = await BrandKitService.create({
  userId: "user123",
  productTitle: "My Product",
  productDescription: "Description",
  productImageUrls: ["url1", "url2"],
});

// Update with AI results
await BrandKitService.updateWithAIResults(brandKit.id, {
  extractedFeatures: ["feature1"],
  brandColors: ["#FF0000"],
  status: "COMPLETED",
});
```

## Database Migration

To apply the schema changes:

1. **Generate Prisma client** (may need to restart VS Code/terminal):
   ```bash
   bun run db:generate
   ```

2. **Create and apply migration**:
   ```bash
   bun run db:migrate
   ```

3. **View in Prisma Studio**:
   ```bash
   bun run db:studio
   ```

## Integration with Existing Flow

The schema is designed to work seamlessly with your existing brand kit components:

- **StepLogoForm** → Creates initial `BrandKit` record
- **StepProductImages** → Adds `ProductImage` records
- **StepProcessing** → Updates with AI results
- **StepReview** → Allows editing and finalizing

All data is automatically associated with the authenticated user through the `userId` field, ensuring proper data isolation and security.
