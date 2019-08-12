import React from 'react';
import { connect } from 'react-redux';
import * as CalendarActions from 'app/core/actions/calendar.actions';
import { CalendarState, Holiday } from 'app/core/reducers/calendar.reducer';

import 'app/components/calendar.component.css';

interface CalendarProps extends CalendarState {
  initDate: () => void;
  setDate: (date: Date) => void;
  initCalendar: () => void;
  setMonth: (month: number) => void,
  setYear: (year: number) => void,
  setCalendar: (month: number, year: number) => void;
  getHolidays: (holidays: Holiday[][][], year: number) => void;
  resetSelection: (date: Date) => void;
  showHolidays: (holidays: Holiday[][][], row: number, date: Date) => void;
}

class Calendar extends React.Component<CalendarProps> {

  componentDidMount() {
    this.props.initDate();
    this.props.setMonth(this.props.date.getMonth());
    this.props.setYear(this.props.date.getFullYear());
    this.props.getHolidays(this.props.holidays, this.props.date.getFullYear());
    this.props.initCalendar();
    this.updateClock();
  }

  updateClock = () => {
    setInterval(() => {
      this.props.setDate(new Date());
    }, 1000);
  }

  prevMonth = () => {
    const newMonth = this.props.month !== 0 ? this.props.month - 1 : 11;
    const newYear = this.props.month !== 0 ? this.props.year : this.props.year - 1;
    this.updateAll(newMonth, newYear);
  }

  nextMonth = () => {
    const newMonth = this.props.month !== 11 ? this.props.month + 1 : 0;
    const newYear = this.props.month !== 11 ? this.props.year : this.props.year + 1;
    this.updateAll(newMonth, newYear);
  }

  updateAll = (month: number, year: number) => {
    if (this.props.year !== year) this.props.getHolidays(this.props.holidays, year);
    this.props.setCalendar(month, year);
    this.props.setMonth(month);
    this.props.setYear(year);
    this.props.resetSelection(new Date(1, 1, 1));
  }

  currentTimestamp = (): string => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const hours = ('00' + this.props.date.getHours()).slice(-2);
    const minutes = ('00' + this.props.date.getMinutes()).slice(-2);
    const seconds = ('00' + this.props.date.getSeconds()).slice(-2);

    const day = this.props.date.getDate();
    const month = months[this.props.date.getMonth()];
    const year = this.props.date.getFullYear();

    return [hours, minutes, seconds].join(':') + ' ' + [day, month, year].join('-');
  }

  selectedCalendar = (): string => {
    const months = [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ]

    return months[this.props.month] + ' ' + this.props.year;
  }

  dayColor = (date: Date): string => {
    const month = date.getMonth() !== this.props.month ? 'calendar-not-day' : 'calendar-day';
    const holiday = this.isHoliday(date) ? 'holiday' : '';
    const selected = this.props.selected.toDateString() === date.toDateString() ? 'selected-day' : '';
    const currentDay = date.toDateString() === this.props.date.toDateString() ? 'current-day' : '';
    return 'click center ' + month + ' ' + holiday + ' ' + selected + ' ' + currentDay;
  }

  isHoliday = (date: Date): boolean => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    return Boolean(y) && Boolean(m) && Boolean(d)
      && Boolean(this.props.holidays[y])
      && Boolean(this.props.holidays[y][m])
      && Boolean(this.props.holidays[y][m][d]);
  }

  render() {
    return (
      <div className="calendar-container center">
        <h1 className="clock center gray">
          {this.currentTimestamp()}
        </h1>
        <div className="second-row">
          <span className="center double-font">{this.selectedCalendar()}</span>
          <button className="calendar-arrow center double-font" onClick={this.prevMonth}>{'<'}</button>
          <button className="calendar-arrow center double-font" onClick={this.nextMonth}>{'>'}</button>
        </div>
        <div className="grid-column-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day: string) =>
            <span className="center gray" key={day}>{day}</span>
          )}
        </div>
        <div className="center w-100">
          <div className="grid-row-6">
            {this.props.calendar.map((row: Date[], rowIndex: number) =>
              <div key={rowIndex}>
                <div className="grid-column-7">
                  {row.map(
                    (element: Date, elementIndex: number) => {
                      return <span onClick={() => this.props.showHolidays(this.props.holidays, rowIndex, element)}
                        className={this.dayColor(element)} key={elementIndex}>{element.getDate()}</span>;
                    })}
                </div>
                <div className={this.props.row === rowIndex ? 'show-holidays' : 'hide-holidays'}>
                  <span className="center">{this.props.row === rowIndex && this.props.text}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function MapStateToProps(currentState: CalendarState) {
  return {
    date: currentState.date,
    month: currentState.month,
    year: currentState.year,
    calendar: currentState.calendar,
    holidays: currentState.holidays,
    row: currentState.row,
    text: currentState.text,
    selected: currentState.selected
  }
}

function MapDispatchToProps(dispatch: any) {
  return {
    initDate: () => dispatch(CalendarActions.InitDate()),
    setDate: (date: Date) => dispatch(CalendarActions.SetDate(date)),
    initCalendar: () => dispatch(CalendarActions.InitCalendar()),
    setMonth: (month: number) => dispatch(CalendarActions.SetMonth(month)),
    setYear: (year: number) => dispatch(CalendarActions.SetYear(year)),
    setCalendar: (month: number, year: number) => dispatch(CalendarActions.SetCalendar(month, year)),
    getHolidays: (holidays: Holiday[][][], year: number) => dispatch(CalendarActions.GetHolidays(holidays, year)),
    resetSelection: (date: Date) => dispatch(CalendarActions.ResetSelection(date)),
    showHolidays: (holidays: Holiday[][][], row: number, date: Date) => dispatch(CalendarActions.ShowHolidays(holidays, row, date))
  }
}

export default connect(MapStateToProps, MapDispatchToProps)(Calendar);