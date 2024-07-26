import { Dayjs, extend } from "dayjs";
import "./index.scss";
import { CalendarProps } from ".";
import { useContext } from "react";
import LocalContext from "./localeContext";
import allLocales from "./locale";
import cs from "classnames";

interface MonthCalendarProps extends CalendarProps {
	handleSelect?: (date: Dayjs) => void;
	curMonth: Dayjs;
}

interface dayDate {
	date: Dayjs;
	currentMonth: boolean;
}

function MonthCalendar(props: MonthCalendarProps) {
	const localeContext = useContext(LocalContext);
	const calendarLocale = allLocales[localeContext.locale];
	const weekList = [
		"sunday",
		"monday",
		"tuesday",
		"wednesday",
		"thursday",
		"friday",
		"saturday",
	];

	const { value, dateRander, dateInnerContent, handleSelect, curMonth } = props;
	function getAllDays(date: Dayjs) {
		const dayInMonth = date.daysInMonth();
		const startOfDay = date.startOf("month");
		const day = startOfDay.day();

		const dayInfo: Array<dayDate> = new Array(6 * 7);
		for (let i = 0; i < day; i++) {
			dayInfo[i] = {
				date: startOfDay.subtract(day - i, "day"),
				currentMonth: false,
			};
		}

		for (let i = day; i < dayInfo.length; i++) {
			const calcDate = startOfDay.add(i - day, "day");
			dayInfo[i] = {
				date: calcDate,
				currentMonth: calcDate.month() == date.month(),
			};
		}

		return dayInfo;
	}

	function renderDays(
		days: Array<dayDate>,
	) {
		const rows = [];
		for (let i = 0; i < 6; i++) {
			const row = [];
			for (let j = 0; j < 7; j++) {
				const item = days[i * 7 + j];
				row[j] = (
					<div
						className={cs(
							"calendar-month-body-cell",
							item.currentMonth ? "calendar-month-body-cell-current" : ""
						)}
						onClick={() => handleSelect?.(item.date)}
					>
						{dateRander ? (
							dateRander(item.date)
						) : (
							<div className="calendar-month-body-cell-date">
								<div
									className={cs(
										"calendar-month-body-cell-date-value",
										value.format("YYYY-MM-DD") == item.date.format("YYYY-MM-DD")
											? "calendar-month-body-cell-date-select"
											: ""
									)}
								>
									{item.date.date()}
								</div>
								<div className="calendar-month-body-cell-date-content">
									{dateInnerContent?.(item.date)}
								</div>
							</div>
						)}
					</div>
				);
			}

			rows.push(row);
		}
		return rows.map((row) => {
			return <div className="calendar-month-body-row">{row}</div>;
		});
	}
	const allDays = getAllDays(curMonth);
	return (
		<div className="calendar-month">
			<div className="calendar-month-week-list">
				{weekList.map((item) => {
					return (
						<div className="calendar-month-week-list-item">
							{calendarLocale.week[item]}
						</div>
					);
				})}
			</div>
			<div className="calendar-month-body">
				{renderDays(allDays)}
			</div>
		</div>
	);
}

export default MonthCalendar;
