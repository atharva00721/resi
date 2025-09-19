## Fal integration

This app uses the `@ai-sdk/fal` provider with `experimental_generateImage` to call Fal models. It also supports nano-banana edit when a reference image is present.

### Files

- Fal helper: `src/lib/ai/fal.ts`
- API route: `src/app/api/ai/generate-image/route.ts`
- Frontend usage: `src/app/(Image)/craft/page.tsx`

### Supported models

Defined in `src/lib/ai/fal.ts`:

```ts
export const FAL_MODELS = {
  "imagen4-fast": "fal-ai/imagen4/preview/fast",
  "nano-banana": "fal-ai/nano-banana",
} as const;
```

Aspect ratios (Imagen 4 preview): `"1:1" | "16:9" | "9:16" | "3:4" | "4:3"`

### Auto-switch to edit when reference image present

`generateFalImage` will use `fal-ai/nano-banana/edit` and send `image_urls` if an `imageUrl` is provided, regardless of the selected model.

```ts
const modelId = imageUrl ? "fal-ai/nano-banana/edit" : FAL_MODELS[model];

const providerOptions: any = {
  aspect_ratio: aspectRatio,
  guidance_scale: guidanceScale,
  num_inference_steps: numInferenceSteps,
  safety_checker: safetyChecker,
};

if (imageUrl) {
  providerOptions.image_urls = [imageUrl];
}

const result = await generateImage({
  model: fal.image(modelId),
  prompt,
  providerOptions: { fal: providerOptions },
});
```

### API contract

`POST /api/ai/generate-image`

Body:

```json
{
  "prompt": "text",
  "model": "imagen4-fast" | "nano-banana",
  "aspectRatio": "1:1" | "16:9" | "9:16" | "3:4" | "4:3",
  "guidanceScale": number,
  "numInferenceSteps": number,
  "safetyChecker": boolean,
  "imageUrl": "https://...", // optional; triggers edit flow
  "strength": number // used for non-edit img2img only
}
```

Response:

```json
{
  "success": true,
  "image": {
    "base64": "...",
    "mimeType": "image/png",
    "width": 0,
    "height": 0,
    "nsfw": false
  },
  "metadata": {}
}
```

### Frontend flow

- The craft page uploads the user’s selected data URL to UploadThing to obtain a hosted URL.
- That URL is passed to this API as `imageUrl`. The backend auto-switches to nano-banana edit.

### Environment

- `FAL_API_KEY` must be set.
