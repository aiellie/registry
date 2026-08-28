"use client"

import { CalendarView, events } from "@/components/calendar"
import { Example, ExampleWrapper } from "@/components/example"

export default function EventCalendarExample() {
  return (
    <ExampleWrapper className="grid-cols-1">
      <Example
        title="Event Calendar"
        containerClassName="col-span-full"
        className="p-0"
      >
        <CalendarView events={events} className="h-[44rem] min-h-0" />
      </Example>
    </ExampleWrapper>
  )
}
