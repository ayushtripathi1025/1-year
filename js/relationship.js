// js/relationship.js

// ------------------------------------------------------------
// RELATIONSHIP TIMER
// Counts the relationship from:
// January 10, 2025 at 12:00 PM
//
// The timer uses calendar-based Years / Months / Days,
// followed by Hours / Minutes / Seconds.
// ------------------------------------------------------------

const relationshipYears = document.getElementById("relationship-years");
const relationshipMonths = document.getElementById("relationship-months");
const relationshipDays = document.getElementById("relationship-days");
const relationshipHours = document.getElementById("relationship-hours");
const relationshipMinutes = document.getElementById("relationship-minutes");
const relationshipSeconds = document.getElementById("relationship-seconds");

let relationshipTimerInterval = null;


// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function cloneDate(date) {
  return new Date(date.getTime());
}


// Add years while safely handling dates such as February 29.
function addYearsClamped(date, amount) {
  const result = cloneDate(date);
  const originalMonth = result.getMonth();
  const originalDay = result.getDate();

  result.setDate(1);
  result.setFullYear(result.getFullYear() + amount);
  result.setMonth(originalMonth);

  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDayOfMonth));

  return result;
}


// Add months while safely handling different month lengths.
function addMonthsClamped(date, amount) {
  const result = cloneDate(date);
  const originalDay = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + amount);

  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  result.setDate(Math.min(originalDay, lastDayOfMonth));

  return result;
}


// ------------------------------------------------------------
// CALCULATE CALENDAR DIFFERENCE
// ------------------------------------------------------------

function calculateRelationshipDuration(start, end) {
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  if (!(end instanceof Date) || Number.isNaN(end.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  // The relationship has not started yet.
  if (end < start) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

  let cursor = cloneDate(start);

  let years = 0;
  let months = 0;

  // Count complete calendar years.
  while (true) {
    const next = addYearsClamped(cursor, 1);

    if (next <= end) {
      cursor = next;
      years++;
    } else {
      break;
    }
  }

  // Count complete calendar months.
  while (true) {
    const next = addMonthsClamped(cursor, 1);

    if (next <= end) {
      cursor = next;
      months++;
    } else {
      break;
    }
  }

  // The remaining portion can safely be calculated
  // using milliseconds because years and months are already removed.
  let remainingMilliseconds = end.getTime() - cursor.getTime();

  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = millisecondsPerSecond * 60;
  const millisecondsPerHour = millisecondsPerMinute * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;

  const days = Math.floor(
    remainingMilliseconds / millisecondsPerDay
  );

  remainingMilliseconds -= days * millisecondsPerDay;

  const hours = Math.floor(
    remainingMilliseconds / millisecondsPerHour
  );

  remainingMilliseconds -= hours * millisecondsPerHour;

  const minutes = Math.floor(
    remainingMilliseconds / millisecondsPerMinute
  );

  remainingMilliseconds -= minutes * millisecondsPerMinute;

  const seconds = Math.floor(
    remainingMilliseconds / millisecondsPerSecond
  );

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds
  };
}


// ------------------------------------------------------------
// UPDATE DISPLAY
// ------------------------------------------------------------

function updateRelationshipDisplay(duration) {
  if (relationshipYears) {
    relationshipYears.textContent = duration.years;
  }

  if (relationshipMonths) {
    relationshipMonths.textContent = duration.months;
  }

  if (relationshipDays) {
    relationshipDays.textContent = duration.days;
  }

  if (relationshipHours) {
    relationshipHours.textContent = String(
      duration.hours
    ).padStart(2, "0");
  }

  if (relationshipMinutes) {
    relationshipMinutes.textContent = String(
      duration.minutes
    ).padStart(2, "0");
  }

  if (relationshipSeconds) {
    relationshipSeconds.textContent = String(
      duration.seconds
    ).padStart(2, "0");
  }
}


// ------------------------------------------------------------
// MAIN TIMER UPDATE
// ------------------------------------------------------------

function updateRelationshipTimer() {
  if (!APP_DATES || !APP_DATES.relationshipStart) {
    debugLog("Relationship start date is unavailable.");
    return;
  }

  const now = new Date();

  const duration = calculateRelationshipDuration(
    APP_DATES.relationshipStart,
    now
  );

  updateRelationshipDisplay(duration);

  debugLog("Relationship duration:", duration);
}


// ------------------------------------------------------------
// START TIMER
// ------------------------------------------------------------

function startRelationshipTimer() {
  if (relationshipTimerInterval) {
    clearInterval(relationshipTimerInterval);
    relationshipTimerInterval = null;
  }

  // Show the correct value immediately.
  updateRelationshipTimer();

  // Then update once every second.
  relationshipTimerInterval = setInterval(
    updateRelationshipTimer,
    1000
  );

  debugLog("Relationship timer started.");
}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

startRelationshipTimer();