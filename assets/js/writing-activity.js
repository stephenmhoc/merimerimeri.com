(function () {
  var root = document.querySelector("[data-writing-activity]");

  if (!root) {
    return;
  }

  var archiveUrl = root.dataset.archiveUrl;
  var feedUrl = root.dataset.feedUrl;
  var summary = root.querySelector("[data-activity-summary]");
  var range = root.querySelector("[data-activity-range]");
  var status = root.querySelector("[data-activity-status]");
  var canvas = root.querySelector("[data-activity-canvas]");
  var months = root.querySelector("[data-activity-months]");
  var grid = root.querySelector("[data-activity-grid]");
  var scrollArea = root.querySelector("[data-activity-scroll]");

  function fetchDocument(url) {
    return fetch(url, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) {
        throw new Error("Archive request returned " + response.status);
      }

      return response.text();
    }).then(function (html) {
      return new DOMParser().parseFromString(html, "text/html");
    });
  }

  function fetchArchiveEntries() {
    return fetchDocument(archiveUrl).then(function (document) {
      var entries = Array.from(document.querySelectorAll("time.dt-published")).map(function (time) {
        var entry = time.closest(".h-entry");
        var link = entry ? entry.querySelector("a.u-url") : null;

        return {
          date: (time.getAttribute("datetime") || "").slice(0, 10),
          url: link ? link.href : "",
        };
      }).filter(function (entry) {
        return /^\d{4}-\d{2}-\d{2}$/.test(entry.date);
      });

      if (!entries.length) {
        throw new Error("The archive contained no dated posts");
      }

      return entries;
    });
  }

  function fetchFeedEntries() {
    return fetch(feedUrl, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) {
        throw new Error("Feed request returned " + response.status);
      }

      return response.json();
    }).then(function (feed) {
      var entries = (feed.items || []).map(function (item) {
        return {
          date: (item.date_published || "").slice(0, 10),
          url: item.url || "",
        };
      }).filter(function (entry) {
        return /^\d{4}-\d{2}-\d{2}$/.test(entry.date);
      });

      if (!entries.length) {
        throw new Error("The feed contained no dated posts");
      }

      return entries;
    });
  }

  function cloneDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  }

  function addDays(date, numberOfDays) {
    var nextDate = cloneDate(date);
    nextDate.setDate(nextDate.getDate() + numberOfDays);
    return nextDate;
  }

  function toDateKey(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function formatMonth(date) {
    return new Intl.DateTimeFormat(undefined, { month: "short" }).format(date);
  }

  function buildDayMap(entries, firstDateKey, lastDateKey) {
    return entries.reduce(function (days, entry) {
      if (entry.date < firstDateKey || entry.date > lastDateKey) {
        return days;
      }

      var day = days.get(entry.date) || { count: 0, url: "" };
      day.count += 1;
      day.url = day.url || entry.url;
      days.set(entry.date, day);
      return days;
    }, new Map());
  }

  function addMonthLabels(gridStart, weekCount, firstDate, today) {
    months.replaceChildren();

    for (var week = 0; week < weekCount; week += 1) {
      var weekStart = addDays(gridStart, week * 7);
      var visibleDates = [];

      for (var weekday = 0; weekday < 7; weekday += 1) {
        var candidate = addDays(weekStart, weekday);

        if (candidate >= firstDate && candidate <= today) {
          visibleDates.push(candidate);
        }
      }

      var labelDate = week === 0
        ? visibleDates[0]
        : visibleDates.find(function (date) { return date.getDate() === 1; });

      if (labelDate) {
        var monthLabel = document.createElement("span");
        monthLabel.textContent = formatMonth(labelDate);
        monthLabel.style.gridColumn = String(week + 1);
        months.appendChild(monthLabel);
      }
    }
  }

  function addDayLabels() {
    [
      { label: "Mon", row: 2 },
      { label: "Wed", row: 4 },
      { label: "Fri", row: 6 },
    ].forEach(function (day) {
      var label = document.createElement("span");
      label.className = "writing-activity-day-label";
      label.textContent = day.label;
      label.style.gridColumn = "1";
      label.style.gridRow = String(day.row);
      label.setAttribute("aria-hidden", "true");
      grid.appendChild(label);
    });
  }

  function addDayCells(gridStart, weekCount, firstDate, today, days) {
    for (var week = 0; week < weekCount; week += 1) {
      for (var weekday = 0; weekday < 7; weekday += 1) {
        var date = addDays(gridStart, (week * 7) + weekday);
        var dateKey = toDateKey(date);
        var day = days.get(dateKey) || { count: 0, url: "" };
        var outsideRange = date < firstDate || date > today;
        var cell = day.count && day.url
          ? document.createElement("a")
          : document.createElement("span");
        var postLabel = day.count === 1 ? "1 post" : day.count + " posts";

        cell.className = "writing-activity-cell";
        cell.style.gridColumn = String(week + 2);
        cell.style.gridRow = String(weekday + 1);

        if (outsideRange) {
          cell.classList.add("is-outside-range");
          cell.setAttribute("aria-hidden", "true");
        } else {
          cell.dataset.level = String(Math.min(day.count, 4));
          cell.title = postLabel + " on " + formatDate(date);

          if (cell.tagName === "A") {
            cell.href = day.url;
            cell.setAttribute("aria-label", postLabel + " on " + formatDate(date));
          } else {
            cell.setAttribute("aria-hidden", "true");
          }
        }

        grid.appendChild(cell);
      }
    }
  }

  function render(entries, isPartial) {
    var today = cloneDate(new Date());
    var firstDate = addDays(today, -364);
    var currentWeekStart = addDays(today, -today.getDay());
    var gridStart = addDays(currentWeekStart, -(52 * 7));
    var weekCount = 53;
    var firstDateKey = toDateKey(firstDate);
    var todayKey = toDateKey(today);
    var days = buildDayMap(entries, firstDateKey, todayKey);
    var total = Array.from(days.values()).reduce(function (sum, day) {
      return sum + day.count;
    }, 0);
    var noun = total === 1 ? "post" : "posts";
    var monthColumns = "repeat(" + weekCount + ", var(--activity-cell-size))";
    var gridColumns = "var(--activity-label-width) " + monthColumns;

    summary.textContent = total + " " + noun + " in the last year";
    range.textContent = formatDate(firstDate) + " – " + formatDate(today);
    months.style.gridTemplateColumns = monthColumns;
    grid.style.gridTemplateColumns = gridColumns;
    grid.replaceChildren();

    addMonthLabels(gridStart, weekCount, firstDate, today);
    addDayLabels();
    addDayCells(gridStart, weekCount, firstDate, today, days);

    canvas.hidden = false;
    scrollArea.scrollLeft = scrollArea.scrollWidth - scrollArea.clientWidth > 32
      ? scrollArea.scrollWidth
      : 0;

    if (isPartial) {
      status.textContent = "Full archive unavailable — showing the recent feed only.";
      status.classList.add("is-degraded");
      return;
    }

    status.textContent = "Live from the blog archive.";
  }

  fetchArchiveEntries().then(function (entries) {
    render(entries, false);
  }).catch(function () {
    fetchFeedEntries().then(function (entries) {
      render(entries, true);
    }).catch(function () {
      summary.textContent = "Writing activity";
      range.textContent = "";
      status.textContent = "Activity unavailable — open the archive instead.";
      status.classList.add("is-error");
    });
  });
}());
