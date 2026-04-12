type Props = {
    /** x of button left edge */
    buttonX: number;
    /** y of button top edge */
    buttonY: number;
    /** button width/height in px */
    buttonSize: number;
    /** true = has open issues → active animation */
    hasIssues: boolean;
    /** URL to oneko.gif */
    spriteUrl?: string;
};
export default function NekoButton({ buttonX, buttonY, buttonSize, hasIssues, spriteUrl }: Props): import("react/jsx-runtime").JSX.Element;
export {};
