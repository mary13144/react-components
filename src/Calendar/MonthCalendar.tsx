import { Dayjs } from 'dayjs';
import { CalendarProps } from '.';
import { useContext } from 'react';
import LocalContext from './localeContext';
import allLocales from './locale';
import styled from 'styled-components';

const WeekList = styled.div`
	display: flex;
	padding: 0;
	width: 100%;
	box-sizing: border-box;
	border-bottom: 1px solid #ccc;
`;

const WeekListItem = styled.div`
	padding: 20px 16px;
	text-align: left;
	color: #7d7d7f;
	flex: 1;
`;

const MonthBodyRow = styled.div`
	height: 100px;
	display: flex;
`;

const MonthBodyCell = styled.div<{ $current?: boolean }>`
	flex: 1;
	border: 1px solid #eee;
	color: #ccc;
	overflow: hidden;
	user-select: none;

	${(props) => props.$current && `color: #000`}
`;

const CellDate = styled.div`
	padding: 10px;
`;

const CellDateValue = styled.div<{ $selected: boolean }>`
	${(props) =>
		props.$selected &&
		`
      background: blue;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
    `}
`;

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
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	];

	const { value, dateRander, dateInnerContent, handleSelect, curMonth } =
		props;

	function getAllDays(date: Dayjs) {
		const startOfDay = date.startOf('month');
		const day = startOfDay.day();

		const dayInfo: Array<dayDate> = new Array(6 * 7);
		for (let i = 0; i < day; i++) {
			dayInfo[i] = {
				date: startOfDay.subtract(day - i, 'day'),
				currentMonth: false,
			};
		}

		for (let i = day; i < dayInfo.length; i++) {
			const calcDate = startOfDay.add(i - day, 'day');
			dayInfo[i] = {
				date: calcDate,
				currentMonth: calcDate.month() == date.month(),
			};
		}

		return dayInfo;
	}

	function renderDays(days: Array<dayDate>) {
		const rows = [];
		for (let i = 0; i < 6; i++) {
			const row = [];
			for (let j = 0; j < 7; j++) {
				const item = days[i * 7 + j];
				row[j] = (
					<MonthBodyCell
						$current={item.currentMonth}
						onClick={() => handleSelect?.(item.date)}
					>
						{dateRander ? (
							dateRander(item.date)
						) : (
							<CellDate>
								<CellDateValue
									$selected={
										value.format('YYYY-MM-DD') ==
										item.date.format('YYYY-MM-DD')
									}
								>
									{item.date.date()}
								</CellDateValue>
								<div className="calendar-month-body-cell-date-content">
									{dateInnerContent?.(item.date)}
								</div>
							</CellDate>
						)}
					</MonthBodyCell>
				);
			}
			rows.push(row);
		}
		return rows.map((row) => {
			return <MonthBodyRow>{row}</MonthBodyRow>;
		});
	}

	return (
		<>
			<WeekList>
				{weekList.map((item) => {
					return (
						<WeekListItem key={item}>
							{calendarLocale.week[item]}
						</WeekListItem>
					);
				})}
			</WeekList>
			<div className="calendar-month-body">
				{renderDays(getAllDays(curMonth))}
			</div>
		</>
	);
}

export default MonthCalendar;
