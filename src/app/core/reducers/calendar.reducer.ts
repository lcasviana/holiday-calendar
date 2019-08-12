import * as ActionsConstants from 'app/utils/actions-constants';

export interface Holiday {
  name: string;
  date: Date;
}

export interface CalendarState {
  date: Date;
  month: number;
  year: number;
  calendar: Date[][];
  holidays: Holiday[][][];
  row: number;
  text: string;
  selected: Date;
}

function defaultCalendarState(): CalendarState {
  const currentDate = new Date();

  return {
    date: currentDate,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    calendar: [],
    holidays: [],
    row: -1,
    text: '',
    selected: new Date(1, 1, 1)
  };
}

export default function CalendarReducer(state: CalendarState = defaultCalendarState(), action: any): CalendarState {

  switch (action.type) {

    case ActionsConstants.CalendarActions.SetDate:
      return {
        ...state,
        date: new Date(action.date)
      };

    case ActionsConstants.CalendarActions.SetMonth:
      return {
        ...state,
        month: action.month
      }

    case ActionsConstants.CalendarActions.SetYear:
      return {
        ...state,
        year: action.year
      }

    case ActionsConstants.CalendarActions.SetCalendar:
      return {
        ...state,
        calendar: [...action.calendar]
      };

    case ActionsConstants.CalendarActions.SetHolidays:
      return {
        ...state,
        holidays: [...action.holidays]
      };

    case ActionsConstants.CalendarActions.ShowHolidays:
      return {
        ...state,
        selected: action.date,
        row: action.row,
        text: action.text
      }

    default:
      return state;
  }
}