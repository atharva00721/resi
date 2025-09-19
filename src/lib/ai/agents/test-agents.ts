import { gateway } from '@ai-sdk/gateway';
import { generateText } from 'ai';
 
const availableModels = await gateway.getAvailableModels();
 
availableModels.models.forEach((model) => {
  console.log(`${model.id}: ${model.name}`);
  if (model.description) {
    console.log(`  Description: ${model.description}`);
  }
  if (model.pricing) {
    console.log(`  Input: $${model.pricing.input}/token`);
    console.log(`  Output: $${model.pricing.output}/token`);
    if (model.pricing.cachedInputTokens) {
      console.log(
        `  Cached input (read): $${model.pricing.cachedInputTokens}/token`,
      );
    }
    if (model.pricing.cacheCreationInputTokens) {
      console.log(
        `  Cache creation (write): $${model.pricing.cacheCreationInputTokens}/token`,
      );
    }
  }
});
 
const { text } = await generateText({
  model: availableModels.models[0].id, // e.g., 'openai/gpt-5'
  prompt: 'Hello world',
});
console.log(text);