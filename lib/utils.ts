export function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export const thousandSeparator = (num: number): string => {
    return num.toLocaleString('en-US');
};
