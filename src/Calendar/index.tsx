import { CSSProperties, ReactNode } from "react";
import HeaderCalendar from "./HeaderCalendar";
import MonthCalendar from "./MonthCalendar";
import "./index.scss";
import dayjs, { Dayjs } from "dayjs";
import cs from "classnames";
import LocalContext from "./localeContext";
import { useImmer } from "use-immer";
export interface CalendarProps {
	value: Dayjs;
	style?: CSSProperties;
	className?: string | string[];
	//定制日期显示，会完全覆盖日期单元格
	dateRander?: (currentDate: Dayjs) => ReactNode;
	//定制日期单元格，内容会被添加到单元格内，只在全屏日历下生效
	dateInnerContent?: (currentDate: Dayjs) => ReactNode;
	//国际化相关
	locale?: string;
	onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {
	const {
		value,
		style,
		className,
		locale,
		onChange,
	} = props;
	const [curDate, setCurDate] = useImmer<Dayjs>(value);
	const [curMonth, setCurMonth] = useImmer<Dayjs>(value);

	const changeDate = (date: Dayjs) => {
		setCurDate(date);
		setCurMonth(date);
		onChange?.(date);
	};

	const handleSelect = (date: Dayjs) => {
		changeDate(date)
	};

	const handlePrev = () => {
		setCurMonth(curMonth.subtract(1, "month"));
	};

	const handleNext = () => {
		setCurMonth(curMonth.add(1, "month"));
	};

	const handleToday = () => {
		const date = dayjs();
		changeDate(date)
	};

	const classNames = cs(className, "calendar");
	return (
		<LocalContext.Provider
			value={{
				locale: locale || navigator.language,
			}}
		>
			<div className={classNames} style={style}>
				<HeaderCalendar
					curMonth={curMonth}
					handlePrev={handlePrev}
					handleNext={handleNext}
					handleToday={handleToday}
				></HeaderCalendar>
				<MonthCalendar
					{...props}
					value={curDate}
					curMonth={curMonth}
					handleSelect={handleSelect}
				></MonthCalendar>
			</div>
		</LocalContext.Provider>
	);
}

export default Calendar;