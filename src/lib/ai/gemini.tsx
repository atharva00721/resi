import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const { text, sources, providerMetadata } = await generateText({
  model: google("gemini-2.5-flash"),
  tools: {
    google_search: google.tools.googleSearch({}),
  },
  providerOptions: {
    google: {
      thinkingConfig: {
        //  wifi pwd random cafe: Sebs2211@
        thinkingBudget: 8192,
        includeThoughts: true,
      },
    },
  },
  //   prompt:
  //     "find me the latest internship opportunities for SDE SWE paid remote or in bangalore at start up companies" +
  //     "You must include the date of each opportunity.",
  prompt:
    "find me YC Backed startup that hire remote in india and the mail id i can reach out to them" +
    "hope to find the newest YC companies",
});

console.log(text);
console.log(sources);

// access the grounding metadata.
const metadata = providerMetadata?.google;
const groundingMetadata = metadata?.groundingMetadata;
const safetyRatings = metadata?.safetyRatings;

// console.log(groundingMetadata);
// console.log(safetyRatings);
// console.log(providerMetadata);
