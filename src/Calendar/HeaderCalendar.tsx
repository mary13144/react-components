import { Dayjs } from 'dayjs';
import { useContext } from 'react';
import LocalContext from './localeContext';
import allLocales from './locale';
import styled from 'styled-components';

const Header = styled.div`
	user-select: none;
`;

const Left = styled.div`
	display: flex;
	align-items: center;
	height: 28px;
	line-height: 28px;
`;

const Value = styled.div`
	font-size: 20px;
`;

const Icon = styled.div`
	width: 28px;
	height: 28px;
	line-height: 28px;
	border-radius: 50%;
	text-align: center;
	font-size: 12px;
	user-select: none;
	margin-right: 12px;
	cursor: pointer;

	&:not(:first-child) {
		margin: 0 12px;
	}

	&:hover {
		background: #ccc;
	}
`;

const Button = styled.div`
	background: #eee;
	cursor: pointer;
	border: 0;
	padding: 0 15px;
	line-height: 28px;

	&:hover {
		background: #ccc;
	}
`;

interface HeaderProps {
	curMonth: Dayjs;
	handlePrev: () => void;
	handleNext: () => void;
	handleToday: () => void;
}

function HeaderCalendar(props: HeaderProps) {
	const { curMonth, handleNext, handlePrev, handleToday } = props;

	const localeContext = useContext(LocalContext);
	const calendarLocale = allLocales[localeContext.locale];
	return (
		<Header>
			<Left>
				<Icon onClick={handlePrev}>&lt;</Icon>
				<Value>{curMonth.format(calendarLocale.formatMonth)}</Value>
				<Icon onClick={handleNext}>&gt;</Icon>
				<Button onClick={handleToday}>{calendarLocale.today}</Button>
			</Left>
		</Header>
	);
}

export default HeaderCalendar;
