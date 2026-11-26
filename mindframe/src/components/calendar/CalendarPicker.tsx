// src/components/calendar/CalendarPicker.tsx  (native)
import React from "react";
import { ExpandableCalendar } from "react-native-calendars";
import { calendarTheme } from "../../styling/components/calendar/Calendar.styles";
import { CalendarPickerProps } from "./CalendarPicker.types";

export function CalendarPicker({ markedDates }: CalendarPickerProps) {
  return <ExpandableCalendar markingType="multi-dot" markedDates={markedDates} theme={calendarTheme} />;
}
