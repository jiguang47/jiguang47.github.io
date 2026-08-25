(function () {
    "use strict";

    var storageKey = "gobyexample-cn-learning-progress-v1";
    var lessonIDs = [
        "hello-world", "values", "variables", "constants", "for", "if-else",
        "switch", "arrays", "slices", "maps", "range", "functions",
        "multiple-return-values", "variadic-functions", "closures", "recursion",
        "pointers", "strings-and-runes", "structs", "methods", "interfaces",
        "embedding", "generics", "range-over-iterators", "errors", "goroutines",
        "channels", "channel-buffering", "channel-synchronization", "channel-directions",
        "select", "timeouts", "non-blocking-channel-operations", "closing-channels",
        "range-over-channels", "timers", "tickers", "worker-pools", "waitgroups",
        "rate-limiting", "atomic-counters", "mutexes", "stateful-goroutines", "sorting",
        "sorting-by-functions", "panic", "defer", "recover", "string-functions",
        "string-formatting", "text-templates", "regular-expressions", "json", "xml",
        "time", "epoch", "time-formatting-parsing", "random-numbers", "number-parsing",
        "url-parsing", "sha256-hashes", "base64-encoding", "reading-files", "writing-files",
        "line-filters", "file-paths", "directories", "temporary-files-and-directories",
        "testing-and-benchmarking", "command-line-arguments", "command-line-flags",
        "command-line-subcommands", "environment-variables", "http-clients", "http-servers",
        "context", "spawning-processes", "execing-processes", "signals", "exit", "modern-go"
    ];

    function readProgress() {
        try {
            var saved = JSON.parse(window.localStorage.getItem(storageKey));
            return saved && typeof saved === "object" ? saved : {};
        } catch (error) {
            return {};
        }
    }

    function writeProgress(progress) {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(progress));
        } catch (error) {
            // The controls remain usable for the current page session.
        }
    }

    function completedCount(progress) {
        return lessonIDs.filter(function (lessonID) {
            return progress[lessonID];
        }).length;
    }

    function percent(progress) {
        return Math.round(completedCount(progress) / lessonIDs.length * 100);
    }

    function lessonIDFromLink(link) {
        var href = link.getAttribute("href") || "";
        return href.replace(/^\.\//, "").replace(/\.html$/, "").replace(/\/$/, "");
    }

    function createButton(label, className, action) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.addEventListener("click", action);
        return button;
    }

    function buildSummary(progress, withReset) {
        var section = document.createElement("section");
        section.className = "study-progress";
        section.setAttribute("aria-label", "学习进度");

        var heading = document.createElement("p");
        heading.className = "study-progress-title";
        heading.textContent = "学习进度";

        var value = document.createElement("strong");
        value.className = "study-progress-value";

        var detail = document.createElement("span");
        detail.className = "study-progress-detail";

        var meter = document.createElement("progress");
        meter.className = "study-progress-meter";
        meter.max = lessonIDs.length;

        var copy = document.createElement("div");
        copy.className = "study-progress-copy";
        copy.appendChild(heading);
        copy.appendChild(value);
        copy.appendChild(detail);
        copy.appendChild(meter);
        section.appendChild(copy);

        function update() {
            var count = completedCount(progress);
            value.textContent = percent(progress) + "%";
            detail.textContent = "已完成 " + count + " / " + lessonIDs.length + " 课";
            meter.value = count;
        }

        if (withReset) {
            var actions = document.createElement("div");
            actions.className = "study-progress-actions";
            actions.appendChild(createButton("全部完成", "progress-button", function () {
                lessonIDs.forEach(function (lessonID) {
                    progress[lessonID] = true;
                });
                writeProgress(progress);
                document.dispatchEvent(new CustomEvent("progresschange"));
            }));
            actions.appendChild(createButton("清除进度", "progress-button progress-button-secondary", function () {
                lessonIDs.forEach(function (lessonID) {
                    delete progress[lessonID];
                });
                writeProgress(progress);
                document.dispatchEvent(new CustomEvent("progresschange"));
            }));
            section.appendChild(actions);
        }

        section.updateProgress = update;
        update();
        return section;
    }

    function setupIndex(progress) {
        var intro = document.getElementById("intro");
        var list = intro && intro.querySelector("ul");
        if (!list) {
            return;
        }

        var summary = buildSummary(progress, true);
        list.parentNode.insertBefore(summary, list);

        Array.prototype.forEach.call(list.querySelectorAll("li"), function (item) {
            var link = item.querySelector("a");
            if (!link) {
                return;
            }
            var lessonID = lessonIDFromLink(link);
            if (lessonIDs.indexOf(lessonID) === -1) {
                return;
            }

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "lesson-checkbox";
            checkbox.setAttribute("aria-label", "标记“" + link.textContent + "”已完成");
            checkbox.addEventListener("click", function (event) {
                event.stopPropagation();
            });
            checkbox.addEventListener("change", function () {
                progress[lessonID] = checkbox.checked;
                writeProgress(progress);
                document.dispatchEvent(new CustomEvent("progresschange"));
            });
            item.insertBefore(checkbox, link);

            function updateItem() {
                checkbox.checked = Boolean(progress[lessonID]);
                item.classList.toggle("is-complete", checkbox.checked);
            }
            document.addEventListener("progresschange", updateItem);
            updateItem();
        });

        document.addEventListener("progresschange", function () {
            summary.updateProgress();
        });
    }

    function setupLesson(progress) {
        var lesson = document.querySelector(".example[id]");
        if (!lesson || lessonIDs.indexOf(lesson.id) === -1) {
            return;
        }

        var position = lessonIDs.indexOf(lesson.id);
        var panel = document.createElement("section");
        panel.className = "lesson-progress";
        panel.setAttribute("aria-label", "本课学习进度");

        var status = document.createElement("span");
        status.className = "lesson-progress-status";
        var actions = document.createElement("div");
        actions.className = "lesson-progress-actions";

        var toggle = createButton("", "progress-button", function () {
            if (progress[lesson.id]) {
                delete progress[lesson.id];
            } else {
                progress[lesson.id] = true;
            }
            writeProgress(progress);
            document.dispatchEvent(new CustomEvent("progresschange"));
        });
        var through = createButton("我学到这里", "progress-button progress-button-secondary", function () {
            lessonIDs.slice(0, position + 1).forEach(function (lessonID) {
                progress[lessonID] = true;
            });
            writeProgress(progress);
            document.dispatchEvent(new CustomEvent("progresschange"));
        });
        actions.appendChild(toggle);
        actions.appendChild(through);
        panel.appendChild(status);
        panel.appendChild(actions);
        lesson.querySelector("h2").insertAdjacentElement("afterend", panel);

        function update() {
            var done = Boolean(progress[lesson.id]);
            status.textContent = "第 " + (position + 1) + " / " + lessonIDs.length + " 课 · 总进度 " + percent(progress) + "%";
            toggle.textContent = done ? "取消完成" : "标记完成";
            panel.classList.toggle("is-complete", done);
        }
        document.addEventListener("progresschange", update);
        update();
    }

    document.addEventListener("DOMContentLoaded", function () {
        var progress = readProgress();
        setupIndex(progress);
        setupLesson(progress);
    });
}());
