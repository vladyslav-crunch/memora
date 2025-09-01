export function getFontSize(text: string, baseSize = 32, minSize = 14): number {
    if (!text) return baseSize;

    const length = text.length;

    // shrink progressively based on length
    if (length < 20) return baseSize;
    if (length < 50) return baseSize - 6;
    if (length < 100) return baseSize - 12;

    // for very long text, clamp to min size
    return minSize;
}
