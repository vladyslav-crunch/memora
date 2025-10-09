export const getSeparator = (sep: string) => {
    switch (sep) {
        case "tab":
            return "\t";
        case "comma":
            return ",";
        case "semicolon":
            return ";";
        case "newline":
            return "\n";
        default:
            return ",";
    }
};