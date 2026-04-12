import React from "react";
import { QACenterShape } from "../types/index";
export type ResolvedButtonColor = {
    dark: string;
    light: string;
};
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
export declare const QACenterConfigContext: React.Context<QACenterConfig>;
export declare function useQACenterConfig(): QACenterConfig;
export {};
