export function convertTimezone(UTCDate: string | undefined, monthDisplay?: string){
    // console.log("to convert " + UTCDate);
    const jakartaTime = new Date(UTCDate as string).toLocaleString('en-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: monthDisplay ? 'short' : '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return jakartaTime;
}