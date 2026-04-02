import React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react" // Imported ChevronDown
// We need useNavigation and useDayPicker from react-day-picker to control the month/year selection
import { DayPicker, useNavigation, useDayPicker } from "react-day-picker"
// We need date-fns functions to format and set the month/year
import { format, getYear, getMonth, setMonth, setYear } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Helper component for the navigation buttons
const NavButton = ({ direction, ...props }) => {
    return (
        <button
            {...props}
            className={cn(
                buttonVariants({ variant: "outline" }),
                // Adjusted opacity for a more fluent hover effect
                "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100" 
            )}
        >
            {direction === 'prev' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
    );
};

// Custom Caption component to render month and year dropdowns using native HTML <select>
function MonthYearDropdowns(props) {
  // Hooks to interact with react-day-picker state
  const { displayMonth, goToMonth, previousMonth, nextMonth } = useNavigation();
  const { fromDate, toDate, captionLayout } = useDayPicker();
  
  // Guard clause for when the component is used without dropdown-nav layout
  if (captionLayout !== 'dropdown-nav' || !fromDate || !toDate) {
    return (
      <span className="text-sm font-medium">
        {format(displayMonth, props.format, { locale: props.locale })}
      </span>
    );
  }

  // Generate list of years based on fromYear and toYear props (passed via fromDate/toDate)
  const years = [];
  const startYear = getYear(fromDate);
  const endYear = getYear(toDate);

  // We loop backward to show newer years at the top of the dropdown, which is more intuitive for DOB
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const newDate = setMonth(displayMonth, newMonth);
    goToMonth(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    const newDate = setYear(displayMonth, newYear);
    goToMonth(newDate);
  };

  // Adjusted size to h-8 for better visual balance with buttons
  // IMPORTANT: appearance-none is kept, but we add padding-right to make space for the custom icon
  const selectStyle = "h-8 rounded-md border border-input bg-background pr-6 pl-2 py-0 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer";

  return (
    // Wrap the entire caption content in a flex container
    <div className="flex justify-between items-center w-full px-1 space-x-2">
        {/* Previous Month Button */}
        <NavButton
            direction="prev"
            disabled={!previousMonth}
            onClick={() => goToMonth(previousMonth)}
            // Added self-center to ensure vertical alignment with dropdowns
            className="self-center"
        />
        
        {/* Month and Year Selectors */}
        <div className="flex justify-center gap-2 flex-grow">
            
            {/* Month Selector Wrapper (to position the dropdown icon) */}
            <div className="relative w-1/2">
                <select
                    value={getMonth(displayMonth)}
                    onChange={handleMonthChange}
                    className={cn(selectStyle, "w-full")} 
                >
                    {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                        {format(setMonth(new Date(), i), 'MMM')}
                    </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"/>
            </div>

            {/* Year Selector Wrapper (to position the dropdown icon) */}
            <div className="relative w-1/2">
                <select
                    value={getYear(displayMonth)}
                    onChange={handleYearChange}
                    className={cn(selectStyle, "w-full")}
                >
                    {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"/>
            </div>
        </div>

        {/* Next Month Button */}
        <NavButton
            direction="next"
            disabled={!nextMonth}
            onClick={() => goToMonth(nextMonth)}
            // Added self-center to ensure vertical alignment with dropdowns
            className="self-center"
        />
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        // No change needed here, just ensuring flex is used
        caption: "flex justify-center pt-1 relative items-center", 
        caption_label: "text-sm font-medium", 
        caption_dropdowns: "flex justify-center gap-1",

        // CRITICAL FIX: The internal navigation buttons are now RENDERED BY MonthYearDropdowns, 
        // so we must hide the default navigation rendering done by DayPicker.
        nav: "hidden", 
        // No longer needed but keeping the definitions simple
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: MonthYearDropdowns,
      }}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }