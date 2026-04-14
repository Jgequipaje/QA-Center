type Theme = "light" | "dark";
export declare function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): {
  theme: Theme;
  toggle: () => void;
};
export declare const tokens: {
  readonly light: {
    readonly bg: "#ffffff";
    readonly bgSubtle: "#fafafa";
    readonly bgMuted: "#f4f4f5";
    readonly border: "#e4e4e7";
    readonly text: "#09090b";
    readonly textMuted: "#71717a";
    readonly textFaint: "#a1a1aa";
    readonly link: "#7c3aed";
    readonly passText: "#16a34a";
    readonly passBg: "#dcfce7";
    readonly failText: "#dc2626";
    readonly failBg: "#fee2e2";
    readonly warnBg: "#fffbeb";
    readonly warnText: "#92400e";
    readonly warnBorder: "#fcd34d";
    readonly successBg: "#f0fdf4";
    readonly successText: "#16a34a";
    readonly rowFail: "#fffbeb";
    readonly rowFailBorder: "#f59e0b";
    readonly rowOk: "#ffffff";
    readonly headerBg: "#fafafa";
    readonly toolbarPassBg: "#f0fdf4";
    readonly toolbarFailBg: "#fffbeb";
    readonly btnActive: "#7c3aed";
    readonly btnActiveTxt: "#ffffff";
    readonly btnIdle: "#f4f4f5";
    readonly btnIdleTxt: "#3f3f46";
    readonly infoBg: "#ede9fe";
    readonly infoBorder: "#c4b5fd";
    readonly infoText: "#6d28d9";
    readonly accent: "#7c3aed";
    readonly accentText: "#ffffff";
  };
  readonly dark: {
    readonly bg: "#09090b";
    readonly bgSubtle: "#111113";
    readonly bgMuted: "#18181b";
    readonly border: "#27272a";
    readonly text: "#fafafa";
    readonly textMuted: "#a1a1aa";
    readonly textFaint: "#52525b";
    readonly link: "#a78bfa";
    readonly passText: "#4ade80";
    readonly passBg: "#052e16";
    readonly failText: "#f87171";
    readonly failBg: "#450a0a";
    readonly warnBg: "#1c1400";
    readonly warnText: "#fbbf24";
    readonly warnBorder: "#92400e";
    readonly successBg: "#052e16";
    readonly successText: "#4ade80";
    readonly rowFail: "#1c1400";
    readonly rowFailBorder: "#d97706";
    readonly rowOk: "#09090b";
    readonly headerBg: "#111113";
    readonly toolbarPassBg: "#052e16";
    readonly toolbarFailBg: "#1c1400";
    readonly btnActive: "#7c3aed";
    readonly btnActiveTxt: "#ffffff";
    readonly btnIdle: "#18181b";
    readonly btnIdleTxt: "#d4d4d8";
    readonly infoBg: "#1e1030";
    readonly infoBorder: "#4c1d95";
    readonly infoText: "#a78bfa";
    readonly accent: "#7c3aed";
    readonly accentText: "#ffffff";
  };
};
export type Tokens = {
  [K in keyof typeof tokens.light]: string;
};
export {};
