export function formatMonthYear(dateStr, year) {
    if (dateStr && typeof dateStr === "string") {
        const iso = dateStr.length === 7 ? `${dateStr}-01` : dateStr;
        const date = new Date(iso);

        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
        }
    }

    return year ? String(year) : "";
}

export function extractYoutubeId(value) {
    if (!value) {
        return "";
    }

    const match = String(value).match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    return match?.[1] ?? String(value);
}
