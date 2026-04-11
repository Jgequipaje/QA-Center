import React from "react";
import { ThemeProvider } from "@/lib/theme";
import { QACenterButtonColor, QACenterShape } from "../types/index";
import { QACenterConfigContext } from "./QACenterConfigContext";
import QAFloatingButton from "./QAFloatingButton";
import QADrawer from "./QADrawer";

export interface QACenterProps {
  buttonColor?: QACenterButtonColor;
  buttonSize?: number;
  shape?: QACenterShape;
  logo?: React.ReactNode;
  name?: string;
  apiBaseUrl?: string;
  port?: number;
  /** Set to false when a ThemeProvider already exists in the tree (avoids duplicate providers). Default: true */
  ownTheme?: boolean;
  /** Show an animated oneko cat sitting on the button. Default: false */
  neko?: boolean;
  /** Custom URL for the oneko sprite sheet. Defaults to the GitHub CDN. */
  nekoSpriteUrl?: string;
}

function resolveBaseUrl(apiBaseUrl?: string, port?: number): string {
  if (apiBaseUrl) return apiBaseUrl;
  if (port !== undefined) return `http://localhost:${port}`;
  return "http://localhost:3333";
}

function resolveButtonColor(color: QACenterButtonColor): { dark: string; light: string } {
  if (typeof color === "string") return { dark: color, light: color };
  return color;
}

export function QACenter({
  buttonColor = { dark: "#7c3aed", light: "#7c3aed" },
  buttonSize = 52,
  shape = "circle",
  logo,
  name = "QA Center",
  apiBaseUrl,
  port,
  ownTheme = true,
  neko = false,
  nekoSpriteUrl,
}: QACenterProps) {
  const baseUrl = resolveBaseUrl(apiBaseUrl, port);
  const resolvedColor = resolveButtonColor(buttonColor);

  const content = (
    <QACenterConfigContext.Provider
      value={{ baseUrl, buttonColor: resolvedColor, buttonSize, shape, logo, name, neko, nekoSpriteUrl }}
    >
      <QAFloatingButton />
      <QADrawer />
    </QACenterConfigContext.Provider>
  );

  return ownTheme ? <ThemeProvider>{content}</ThemeProvider> : content;
}
