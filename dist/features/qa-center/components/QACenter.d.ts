import React from "react";
import { QACenterButtonColor, QACenterShape } from "../types/index";
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
export declare function QACenter({ buttonColor, buttonSize, shape, logo, name, apiBaseUrl, port, ownTheme, neko, nekoSpriteUrl, }: QACenterProps): import("react/jsx-runtime").JSX.Element | null;
