import { Experimental_Agent as Agent } from "ai";

const agent = new Agent({
  model: "openai/gpt-5-nano",
  system: "You are a creative storyteller.",
});

const stream = agent.stream({
  prompt: "Tell me a short story about a time traveler.",
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
