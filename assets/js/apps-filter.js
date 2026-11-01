(function () {
  var bar = document.querySelector("[data-tag-filter]");
  var list = document.querySelector("[data-project-list]");
  if (!bar || !list) return;

  var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-tag]"));
  var rows = Array.prototype.slice.call(list.querySelectorAll("li[data-tags]"));
  var empty = list.querySelector("[data-no-results]");
  var known = buttons.map(function (b) { return b.getAttribute("data-tag"); });

  function apply(tag, updateUrl) {
    if (known.indexOf(tag) === -1) tag = "all";
    var shown = 0;
    rows.forEach(function (row) {
      var match = tag === "all" || row.getAttribute("data-tags").split(",").indexOf(tag) !== -1;
      row.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach(function (b) {
      var on = b.getAttribute("data-tag") === tag;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (empty) empty.hidden = shown !== 0;
    if (updateUrl) {
      try {
        var url = tag === "all" ? location.pathname : location.pathname + "?tag=" + tag;
        history.replaceState(null, "", url);
      } catch (e) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-tag"), true); });
  });

  bar.hidden = false;
  var param = new URLSearchParams(location.search).get("tag");
  apply(param || "all", false);
})();
