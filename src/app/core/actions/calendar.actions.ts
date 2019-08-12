import axios from 'axios';
import * as ActionConstants from 'app/utils/actions-constants';
import { Holiday } from '../reducers/calendar.reducer';

const baseUrl = 'https://getfestivo.com/v1/holidays?api_key=1698a67e-1d37-476b-90ba-8ffe938d0d81';

function WeekdayNumber(weekday: string): number {
  switch (weekday) {
    case 'Sun': return +1;
    case 'Mon': return +0;
    case 'Tue': return -1;
    case 'Wed': return -2;
    case 'Thu': return -3;
    case 'Fri': return -4;
    case 'Sat': return -5;
    default: throw new Error(`Invalid day of week`);
  }
}

export function InitDate(): { type: string, date: Date } {
  const currentDate = new Date();
  return SetDate(currentDate);
}

export function SetDate(date: Date): { type: string, date: Date } {
  return { type: ActionConstants.CalendarActions.SetDate, date: new Date(date) };
}

export function SetMonth(month: number): { type: string, month: number } {
  return { type: ActionConstants.CalendarActions.SetMonth, month };
}

export function SetYear(year: number): { type: string, year: number } {
  return { type: ActionConstants.CalendarActions.SetYear, year };
}

export function InitCalendar(): { type: string, calendar: Date[][] } {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return SetCalendar(currentMonth, currentYear);
}

export function SetCalendar(month: number, year: number): { type: string, calendar: Date[][] } {
  const date = new Date(year, month, 1);
  date.setDate(WeekdayNumber(date.toDateString().substr(0, 3)));

  const calendar: Date[][] = [];

  for (let r = 0; r < 6; r++) {
    calendar[r] = [];
    for (let c = 0; c < 7; c++) {
      calendar[r][c] = new Date(date);
      date.setDate(calendar[r][c].getDate() + 1);
    }
  }

  return { type: ActionConstants.CalendarActions.SetCalendar, calendar: [...calendar] };
}

export function GetHolidays(holidays: Holiday[][][], year: number) {
  return function (dispatch: any) {
    axios.get(baseUrl + `&country=BR&year=${year}`)
      .then((response: any) => {
        return dispatch(SetHolidays(holidays, response.data.holidays.holidays));
      })
      .catch((error: any) => {
        debugger;
        return dispatch(HandleError());
      });
  };
}

function SetHolidays(oldHolidays: Holiday[][][], newHolidays: any) {
  const holidays: Holiday[][][] = [...oldHolidays];
  newHolidays.forEach((holiday: any) => {
    const name = holiday.name;
    const date = new Date(
      Number(holiday.date.split('-')[0]),
      Number(holiday.date.split('-')[1]) - 1,
      Number(holiday.date.split('-')[2])
    );

    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    if (!holidays[y]) holidays[y] = [];
    if (!holidays[y][m]) holidays[y][m] = [];
    holidays[y][m][d] = { name, date };
  });
  return { type: ActionConstants.CalendarActions.SetHolidays, holidays: [...holidays] };
}

export function ResetSelection(date: Date) {
  const row = -1;
  const text = '';
  return { type: ActionConstants.CalendarActions.ShowHolidays, date, row, text };
}

export function ShowHolidays(holidays: Holiday[][][], row: number, date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  let text = 'No holidays'

  if (Boolean(y) && Boolean(m) && Boolean(d)
    && Boolean(holidays[y])
    && Boolean(holidays[y][m])
    && Boolean(holidays[y][m][d]))
    text = holidays[y][m][d].name;

  return { type: ActionConstants.CalendarActions.ShowHolidays, date, row, text };
}

function HandleError() {
  return { type: ActionConstants.CalendarActions.HandleError };
}