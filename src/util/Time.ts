export const getFormattedDateAndTime = (date?: number | Date) => {
	// creating new date with -3 hours to use GMT -3;
	const threeHours = 1000 * 60 * 3;
	const now = date ? new Date(date) : new Date(new Date().getTime() - threeHours);

	return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
		.toString()
		.padStart(2, '0')}/${now.getFullYear()} às ${now
			.getHours()
			.toString()
			.padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export const timedDelay=(timeJson:{hours?:number,minutes?:number,seconds?:number,miliseconds?:number})=>{

	const factor= {
        hour:3600000,
        minute:60000,
        second:1000,
        milisecond:1
    }
	const delayMilisec = factor.hour*(timeJson.hours ? timeJson.hours:0)
                        + factor.minute*(timeJson.minutes ? timeJson.minutes:0)
                        + factor.second*(timeJson.seconds ? timeJson.seconds:0)
                        + factor.milisecond*(timeJson.miliseconds ? timeJson.miliseconds:0);

	setTimeout(()=>{process.exit(0);}, delayMilisec)
}
