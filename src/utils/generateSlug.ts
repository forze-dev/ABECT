export function generateSlug(text: string): string {
    if (!text) return "";

    const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh",
        з: "z", и: "y", і: "i", ї: "yi", й: "i", к: "k", л: "l", м: "m", н: "n",
        о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
        ч: "ch", ш: "sh", щ: "shch", ю: "yu", я: "ya",
        ь: "", ъ: "", "’": "", "'": ""
    };

    // Транслітерація
    const transliterated = text
        .toLowerCase()
        .split("")
        .map(char => map[char] ?? char)
        .join("");

    return transliterated
        .replace(/[^a-z0-9\s-]/g, "") // прибрати все зайве
        .trim()
        .replace(/\s+/g, "-")        // пробіли → дефіси
        .replace(/-+/g, "-");         // зменшити декілька дефісів
}
