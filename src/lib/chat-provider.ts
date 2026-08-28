// "Ask Amar" runs through an OpenAI-compatible provider. Both OpenRouter and
// Fireworks speak the OpenAI API, so the route only needs the right baseURL,
// key, and model. No Anthropic provider/models by design.
export type ChatProvider = "openrouter" | "fireworks";

type ProviderDefaults = {
  baseURL: string;
  model: string;
  keyVar: string;
  modelVar: string;
};

// Defaults are non-Anthropic open models that are cheap and capable enough for
// a public Q&A bot. Override per provider via the *_MODEL env vars.
const PROVIDER_DEFAULTS: Record<ChatProvider, ProviderDefaults> = {
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    // Default aligned to previous Amar setup — override via OPENROUTER_MODEL
    model: "google/gemini-2.5-flash",
    keyVar: "OPENROUTER_API_KEY",
    modelVar: "OPENROUTER_MODEL",
  },
  fireworks: {
    baseURL: "https://api.fireworks.ai/inference/v1",
    model: "accounts/fireworks/models/kimi-k2p6",
    keyVar: "FIREWORKS_API_KEY",
    modelVar: "FIREWORKS_MODEL",
  },
};

export type ResolvedChatProvider = {
  provider: ChatProvider;
  apiKey: string;
  baseURL: string;
  model: string;
};

function isChatProvider(value: string | undefined): value is ChatProvider {
  return value === "openrouter" || value === "fireworks";
}

// Resolve which provider to use:
//   - CHAT_PROVIDER, when set to a known value, is honoured exactly — if its key
//     is missing we return null rather than silently switching providers.
//   - Otherwise we auto-detect: whichever provider has a key set wins, OpenRouter
//     first. Returns null when nothing is configured so the route can degrade.
// Takes env as a parameter so it's pure and unit-testable.
export function resolveChatProvider(
  env: Record<string, string | undefined> = process.env,
): ResolvedChatProvider | null {
  const requested = env.CHAT_PROVIDER?.trim().toLowerCase();
  const order: ChatProvider[] = isChatProvider(requested)
    ? [requested]
    : ["openrouter", "fireworks"];

  for (const provider of order) {
    const defaults = PROVIDER_DEFAULTS[provider];
    const apiKey = env[defaults.keyVar];
    if (apiKey) {
      return {
        provider,
        apiKey,
        baseURL: defaults.baseURL,
        model: env[defaults.modelVar]?.trim() || defaults.model,
      };
    }
  }

  return null;
}
