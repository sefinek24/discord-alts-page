const options = {
	hour: '2-digit',
	minute: '2-digit',
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
};

module.exports = snowflake => {
	const formatted = new Date(snowflake);

	const formattedDate = formatted.toLocaleString('pl-PL', options);
	const datePart = formattedDate.split(',')[0];
	const time = formattedDate.split(',')[1];
	return `${time}, ${datePart}`;
};