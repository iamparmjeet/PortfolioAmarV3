"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        opts: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: (code: string | number) => boolean | void;
          "timeout-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
          retry?: "auto" | "never";
          "retry-interval"?: number;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileCallback?: (token: string) => void;
  }
}

type Props = {
  siteKey: string;
  action?: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (code?: string | number) => void;
  theme?: "light" | "dark" | "auto";
  widgetIdRef?: React.MutableRefObject<string | null>;
};

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export function TurnstileWidget({
  siteKey,
  action = "contact",
  onVerify,
  onExpire,
  onError,
  theme = "auto",
  widgetIdRef: externalRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalIdRef = useRef<string | null>(null);
  const widgetIdRef = externalRef ?? internalIdRef;
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  // Keep callbacks fresh without re-rendering widget
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  }, [onVerify, onExpire, onError]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !siteKey) return;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !container || !window.turnstile) return;
      // Avoid double-render
      if (widgetIdRef.current) return;
      // Clear any previous content
      container.innerHTML = "";
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        action,
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": (code: string | number) => {
          // Report once, then suppress Turnstile's default console warning (return true)
          // 110200 = Domain not authorized — add localhost/127.0.0.1 in Cloudflare dashboard
          if (String(code) === "110200") {
            console.warn(
              "[Turnstile] 110200 Domain not authorized for",
              window.location.hostname,
              "— add this hostname in dash.cloudflare.com > Turnstile > widget > Hostname Management",
            );
          }
          onErrorRef.current?.(code);
          return true;
        },
        "timeout-callback": () => onExpireRef.current?.(),
        theme,
        size: "normal",
        retry: "auto",
        "retry-interval": 8000,
      });
    };

    // If script already loaded
    if (window.turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }
      };
    }

    // Inject script once (explicit render)
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    // Also check legacy URL without query param for backwards compat
    const legacy = document.querySelector<HTMLScriptElement>(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
    );
    const found = existing ?? legacy;
    if (!found) {
      const script = document.createElement("script");
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (found.dataset.loaded === "true") {
      renderWidget();
    } else {
      found.addEventListener("load", renderWidget, { once: true });
    }

    // Mark loaded for future mounts
    const markLoaded = () => {
      const s =
        document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`) ??
        document.querySelector<HTMLScriptElement>(
          'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]',
        );
      if (s) s.dataset.loaded = "true";
    };
    window.addEventListener("load", markLoaded, { once: true });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, action, widgetIdRef]);

  if (!siteKey) return null;

  return <div ref={containerRef} className="turnstile-widget min-h-[65px]" />;
}
