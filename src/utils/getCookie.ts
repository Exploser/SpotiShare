// src/utils/getCookie.ts
export function getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2] ?? null;
        }
        return null;
}