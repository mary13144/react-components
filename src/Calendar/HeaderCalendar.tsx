import { Dayjs } from "dayjs";
import "./index.scss";
import { useContext } from "react";
import LocalContext from "./localeContext";
import allLocales from "./locale";

interface HeaderProps {
	curMonth: Dayjs;
	handlePrev: () => void;
	handleNext: () => void;
	handleToday: () => void;
}

function HeaderCalendar(props: HeaderProps) {
	const { curMonth, handleNext, handlePrev, handleToday } = props;
	
	const localeContext = useContext(LocalContext)
	const calendarLocale = allLocales[localeContext.locale]
	return (
		<div className="calendar-header">
			<div className="calendar-header-left">
				<div className="calendar-header-icon" onClick={handlePrev}>
					&lt;
				</div>
				<div className="calendar-header-value">
					{curMonth.format(calendarLocale.formatMonth)}
				</div>
				<div className="calendar-header-icon" onClick={handleNext}>
					&gt;
				</div>
				<button className="calendar-header-btn" onClick={handleToday}>{calendarLocale.today}</button>
			</div>
		</div>
	);
}

export default HeaderCalendar;
