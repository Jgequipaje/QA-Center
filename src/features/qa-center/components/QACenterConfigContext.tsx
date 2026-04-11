import React, { useContext } from "react";
import { QACenterShape } from "../types/index";

export type ResolvedButtonColor = { dark: string; light: string };

type QACenterConfig = {
  baseUrl: string;
  buttonColor: ResolvedButtonColor;
  buttonSize: number;
  shape: QACenterShape;
  logo: React.ReactNode;
  name: string;
  neko: boolean;
  nekoSpriteUrl?: string;
};

export const QACenterConfigContext = React.createContext<QACenterConfig>({
  baseUrl: "http://localhost:3333",
  buttonColor: { dark: "#7c3aed", light: "#7c3aed" },
  buttonSize: 52,
  shape: "circle",
  logo: undefined,
  name: "QA Center",
  neko: false,
  nekoSpriteUrl: undefined,
});

export function useQACenterConfig(): QACenterConfig {
  return useContext(QACenterConfigContext);
}
