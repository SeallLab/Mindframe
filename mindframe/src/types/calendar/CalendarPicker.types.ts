// src/components/calendar/CalendarPicker.types.ts
import { MarkedDatesMap } from "../../types/calendar/Calendar.types";

export interface CalendarPickerProps {
  markedDates: MarkedDatesMap;
  /** Used on web. Native's ExpandableCalendar reports changes via CalendarProvider. */
  onDayPress: (dateString: string) => void;
}
