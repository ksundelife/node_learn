const colors = require("colors/safe");
const EventEmitter = require('events');
const emitter = new EventEmitter();

let [hour, day, month, year] = process.argv.slice(2);

let timerId = null;

const errorNaN = () => {
	clearInterval(timerId);
	console.log(colors.red('Упс! Не переживайте! Введите числом через пробел входные параметры в формате - <час> <день> <месяц> <год>. Параметры <день> <месяц> <год> должны быть больше 0. Пример: 20 1 1 2022'));
}

const errorLessCurrentDate = () => {
	clearInterval(timerId);
	console.log(colors.red('Упс! Дата дедлайна не может быть меньше текущей. Не переживайте! Введите еще раз числом через пробел входные параметры в формате - <час> <день> <месяц> <год>. Параметры <день> <месяц> <год> должны быть больше 0. Пример: 20 1 1 2022'));
}

const finish = () => {
	clearInterval(timerId);
	console.log(colors.blue('Ура, таймер завершен!'));
}

function checkingInputParameters(hour, day, month, year, deadline) {
	if (((day && month && year) !== 0) && ((hour && day && month && year) instanceof Number || typeof (hour && day && month && year) === 'number') && !isNaN(hour && day && month && year)) {
		if ((deadline - new Date()) <= 0) {
			return emitter.emit('errorLessCurrentDate');
		} else if ((deadline - new Date()) === 0) {
			return emitter.emit('finish');
		} else {
			return emitter.emit('timer', () => timer());
		}
	} else {
		return emitter.emit('errorNaN');
	}
}
// склонение числительных
function declensionNum(num, words) {
	return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
}

function countdownTimer() {
	let deadline = new Date(`${month}.${day}.${year} ${hour}:00 `);
	let dataDeadline = `${deadline.getDate()}.${deadline.getMonth()+1}.${deadline.getFullYear()} ${deadline.getHours()}:00`;

	const now = new Date();
	const timeDiff = Math.abs(deadline.getTime() - now.getTime());
	const diff = new Date(timeDiff);

	if (diff <= 0) {
		clearInterval(timerId);
	}

	const diffYears = timeDiff > 0 ? (diff.getUTCFullYear() - 1970) : 0;
	const diffMonth = timeDiff > 0 ? diff.getUTCMonth() : 0;
	const diffDays = timeDiff > 0 ? (diff.getUTCDate() - 1) : 0;
	const diffHours = timeDiff > 0 ? diff.getUTCHours() : 0;
	const diffMinutes = timeDiff > 0 ? diff.getUTCMinutes() : 0;
	const diffSeconds = timeDiff > 0 ? diff.getUTCSeconds() : 0;

	// склонение числительных
	const diffYearsDeclensionNum = declensionNum(diffYears, ['год', 'года', 'лет']);
	const diffMonthDeclensionNum = declensionNum(diffMonth, ['месяц', 'месяца', 'месяцев']);
	const diffDaysDeclensionNum = declensionNum(diffDays, ['день', 'дня', 'дней']);
	const diffHoursDeclensionNum = declensionNum(diffHours, ['час', 'часа', 'часов']);
	const diffMinutesDeclensionNum = declensionNum(diffMinutes, ['минута', 'минуты', 'минут']);
	const diffSecondsDeclensionNum = declensionNum(diffSeconds, ['секунда', 'секунды', 'секунд']);

	//добавляем 0 в начало к значению , если число меньше 10 и само число не равно 0
	const diffMonthAddZero = (diffMonth < 10 && diffMonth !== 0) ? '0' + diffMonth : diffMonth;
	const diffDaysAddZero = (diffDays < 10 && diffDays !== 0) ? '0' + diffDays : diffDays;
	const diffHoursAddZero = (diffHours < 10 && diffHours !== 0) ? '0' + diffHours : diffHours;
	const diffMinutesAddZero = (diffMinutes < 10 && diffMinutes !== 0) ? '0' + diffMinutes : diffMinutes;
	const diffSecondsAddZero = (diffSeconds < 10 && diffSeconds !== 0) ? '0' + diffSeconds : diffSeconds;

	//проверяем значения на характер финиша, те === 0
	const diffYearsRes = diffYears === 0 ? `${colors.bgMagenta('Таймер в годах завершен!')}` : `${colors.bgGreen(diffYears)} ${diffYearsDeclensionNum}`;
	const diffMonthRes = (diffMonthAddZero === 0 && diffYears === 0) ? `${colors.bgMagenta('Таймер в месяцах завершен!')}` : `${colors.bgGreen(diffMonthAddZero)} ${diffMonthDeclensionNum}`;
	const diffDaysRes = (diffDaysAddZero === 0 && (diffYears && diffMonthRes) === 0) ? `${colors.bgMagenta('Таймер в днях завершен!')}` : `${colors.bgGreen(diffDaysAddZero)} ${diffDaysDeclensionNum}`;
	const diffHoursRes = (diffHoursAddZero === 0 && (diffYears && diffMonthRes && diffDaysRes) === 0) ? `${colors.bgMagenta('Таймер в часах завершен!')}` : `${colors.bgGreen(diffHoursAddZero)} ${diffHoursDeclensionNum}`;
	const diffMinutesRes = (diffMinutesAddZero === 0 && (diffYears && diffMonthRes && diffDaysRes && diffHoursRes) === 0) ? `${colors.bgMagenta('Таймер в минутах завершен!')}` : `${colors.bgGreen(diffMinutesAddZero)} ${diffMinutesDeclensionNum}`;
	const diffSecondsRes = (diffSecondsAddZero === 0 && (diffYears && diffMonthRes && diffDaysRes && diffHoursRes && diffMinutesRes) === 0) ? `${colors.bgMagenta('Таймер в секундах завершен!')}` : `${colors.bgGreen(diffSecondsAddZero)} ${diffSecondsDeclensionNum}`;

	let result = `До ${colors.blue(dataDeadline)} осталось: 
	 ${diffYearsRes} ${diffMonthRes} ${diffDaysRes} 
	 ${diffHoursRes} : ${diffMinutesRes} : ${diffSecondsRes}
	`;
	console.clear();
	console.log(result);
}

const timer = () => {
	timerId = setInterval(countdownTimer, 1000);
}
const run = (hour, day, month, year) => {
	let deadline = new Date(`${month}.${day}.${year} ${hour}:00 `);
	checkingInputParameters(hour, day, month, year, deadline);
};


emitter.on('timer', () => timer());
emitter.on('errorNaN', () => errorNaN());
emitter.on('errorLessCurrentDate', () => errorLessCurrentDate());
emitter.on('finish', () => finish());

run(Number(hour), Number(day), Number(month), Number(year));