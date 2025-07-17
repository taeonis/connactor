const startDate = new Date('2025-07-17');

export function getDate(numDays) {
    const newGameDate = new Date(startDate);
    newGameDate.setDate(newGameDate.getDate() + numDays);
    
    const yyyy = newGameDate.getFullYear();
    const mm = String(newGameDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(newGameDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}