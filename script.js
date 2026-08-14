const cover = document.getElementById("cover");
const openButton = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const graduateGroups = Array.from(document.querySelectorAll(".graduate-group"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentGraduateGroup = 0;
let slideshowTimer;

function showNextGraduateGroup() {
  graduateGroups[currentGraduateGroup].classList.remove("is-active");
  currentGraduateGroup = (currentGraduateGroup + 1) % graduateGroups.length;
  graduateGroups[currentGraduateGroup].classList.add("is-active");
}

function startSlideshow() {
  if (!reduceMotion && graduateGroups.length > 1 && !slideshowTimer) {
    slideshowTimer = window.setInterval(showNextGraduateGroup, 7000);
  }
}

function stopSlideshow() {
  window.clearInterval(slideshowTimer);
  slideshowTimer = undefined;
}

window.addEventListener("load", startSlideshow);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopSlideshow();
  else if (!cover.classList.contains("is-closed")) startSlideshow();
});

function openInvitation() {
  stopSlideshow();
  cover.classList.add("is-closed");
  document.body.classList.remove("cover-is-open");
  window.setTimeout(() => invitation.focus({ preventScroll: true }), 850);
}

openButton.addEventListener("click", (event) => {
  event.stopPropagation();
  openInvitation();
});
cover.addEventListener("click", openInvitation);
cover.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") openInvitation();
});

const eventDate = new Date("2026-09-08T00:00:00+07:00");
const countdown = document.getElementById("countdown");
const units = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function updateCountdown() {
  const remaining = eventDate.getTime() - Date.now();
  if (remaining <= 0) {
    countdown.innerHTML = "<p class=\"event-day\">Hari perayaan telah tiba. Selamat!</p>";
    return;
  }
  units.days.textContent = String(Math.floor(remaining / 86400000)).padStart(2, "0");
  units.hours.textContent = String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");
  units.minutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
  units.seconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.13 });
document.querySelectorAll(".section-reveal").forEach((section) => observer.observe(section));

document.getElementById("saveCalendar").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wisuda KFR 2026//ID",
    "BEGIN:VEVENT",
    "UID:wisuda-kfr-2026@fk.unair",
    "DTSTAMP:20260814T000000Z",
    "DTSTART;VALUE=DATE:20260908",
    "DTEND;VALUE=DATE:20260909",
    "SUMMARY:Wisuda Dokter Spesialis KFR 2026",
    "LOCATION:Ruang Pertemuan Departemen Kedokteran Fisik dan Rehabilitasi\\, FK UNAIR/RSUD Dr. Soetomo",
    "DESCRIPTION:Perayaan kelulusan Dokter Spesialis Kedokteran Fisik dan Rehabilitasi.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wisuda-kfr-2026.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});
