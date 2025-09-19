## UploadThing integration

This app uses UploadThing to persist user-selected reference images before sending them to the Fal API for image generation/editing.

### Files

- Backend route definition: `src/app/api/uploadthing/core.ts`
- React helpers: `src/lib/uploadthing/index.ts`
- Usage in UI: `src/app/(Image)/craft/page.tsx`

### Backend router

`src/app/api/uploadthing/core.ts` defines the file route `imageUploader` and basic auth middleware.

```ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => ({ userId: "fakeId" }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### React helpers

`src/lib/uploadthing/index.ts` provides typed React helpers per the official docs.

```ts
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
```

### Frontend usage (craft page)

On submit, if a reference image is selected, we:

1. Convert the data URL to a `File`
2. Upload via `uploadFiles("imageUploader", { files: [file] })`
3. Prefer `ufsUrl` (fallback to `url`) and forward it to the Fal API

Snippet from `src/app/(Image)/craft/page.tsx`:

```ts
import { uploadFiles } from "@/lib/uploadthing";

// ... inside handleSubmit
if (uploadedImage) {
  const res = await fetch(uploadedImage);
  const blob = await res.blob();
  const file = new File([blob], `reference-${Date.now()}.png`, {
    type: blob.type || "image/png",
  });
  const uploaded = await uploadFiles("imageUploader", { files: [file] });
  imageUrl = uploaded[0]?.ufsUrl || uploaded[0]?.url;
}
```

### Local development

- Run dev server with Bun: `bun dev`
- Ensure `FAL_API_KEY` and UploadThing server token are set.

### Auto-save of Fal outputs

- The Fal API route (`src/app/api/ai/generate-image/route.ts`) uploads the generated image to UploadThing using `UTApi` and returns `image.storageUrl`.
- The UI prefers rendering `storageUrl` (plain `<img src>`), falling back to base64.

### Recommendations / Next steps

- Enforce access control (UploadThing ACLs) for private images.
- Persist generated image metadata (UploadThing URL, prompt, model, dimensions) in a database for history/analytics.
- Generate thumbnails or use CDN transformations for faster grids.
- Add retry/backoff around UTApi uploads; surface failures to the client.
- Enable multi-image edits/uploads and show as a gallery message.
- Add a flag to disable auto-save in local dev if desired.

### Reference

- UploadThing React helpers: `https://docs.uploadthing.com/api-reference/react#generate-react-helpers`
