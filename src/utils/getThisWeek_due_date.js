// Get the current date
const currentDate = new Date();

// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const dayOfWeek = currentDate.getDay();

// Calculate the start of the week (Monday)
const startOfWeek = new Date(currentDate);
startOfWeek.setDate(currentDate.getDate() - dayOfWeek + 1); // Set to Monday
startOfWeek.setHours(0, 0, 0, 0); // Set to midnight

// Calculate the end of the week (Sunday)
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday
endOfWeek.setHours(23, 59, 59, 999); // Set to last moment of the day

// Get the Unix timestamps (in milliseconds)
const startOfWeekTimestamp = startOfWeek.getTime();
const endOfWeekTimestamp = endOfWeek.getTime();

// Now you can use these timestamps in your query
const due_dates = {
    due_date_gt: startOfWeekTimestamp,
    due_date_lt: endOfWeekTimestamp
};

// Export the properties directly
export const { due_date_gt, due_date_lt } = due_dates;