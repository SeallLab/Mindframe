// src/components/calendar/CalendarPicker.web.tsx
import React from "react";
import { WeekCalendar } from "react-native-calendars";
import { calendarTheme } from "../../styling/components/calendar/Calendar.styles";
import { CalendarPickerProps } from "./CalendarPicker.types";

// The month grid doesn't size correctly in the browser, so web gets the
// week strip only.
export function CalendarPicker({ markedDates, onDayPress }: CalendarPickerProps) {
  return (
    <WeekCalendar
      markingType="multi-dot"
      markedDates={markedDates}
      theme={calendarTheme}
      onDayPress={(day) => onDayPress(day.dateString)}
    />
  );
}
