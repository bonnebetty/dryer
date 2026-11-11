// Dryer state variables: this is the simple model used by every event listener.
const INITIAL_SECONDS = 30 * 60; // 30 minutes, as requested.
let dryerState = "idle";
let isPaid = false;
let selectedTemperature = null;
let remainingSeconds = INITIAL_SECONDS;
let isDoorOpen = false;
let timerInterval = null;
let demoSpeed = false;

const el = {
  timer: document.querySelector("#timer"), stateBadge: document.querySelector("#stateBadge"),
  status: document.querySelector(".status-card"), statusMessage: document.querySelector("#statusMessage"),
  door: document.querySelector("#dryerDoor"), doorLabel: document.querySelector("#doorLabel"),
  pay: document.querySelector("#payButton"), start: document.querySelector("#startButton"),
  pause: document.querySelector("#pauseButton"), doorButton: document.querySelector("#doorButton"),
  resume: document.querySelector("#resumeButton"), reset: document.querySelector("#newCycleButton"),
  demo: document.querySelector("#demoSpeed"), speedLabel: document.querySelector("#speedLabel"),
  tempButtons: [...document.querySelectorAll("[data-temp]")], stateReadout: document.querySelector("#stateReadout"),
  tempReadout: document.querySelector("#tempReadout"), paymentReadout: document.querySelector("#paymentReadout")
};

function formatTime(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
function setStatus(message, alert = false) { el.statusMessage.textContent = message; el.status.className = `status-card ${alert ? "alert" : dryerState === "running" ? "running" : ""}`; }

function render() {
  el.timer.textContent = formatTime(remainingSeconds);
  el.stateBadge.textContent = dryerState;
  el.stateBadge.className = `state-badge ${dryerState}`;
  el.door.classList.toggle("open", isDoorOpen); el.door.classList.toggle("closed", !isDoorOpen);
  document.querySelector(".dryer-body").classList.toggle("running", dryerState === "running");
  el.doorLabel.textContent = isDoorOpen ? "DOOR OPEN" : "DOOR CLOSED";
  el.doorButton.textContent = isDoorOpen ? "Close door" : "Open door";
  el.pay.hidden = isPaid || dryerState === "finished";
  el.start.disabled = !(dryerState === "ready" && selectedTemperature && !isDoorOpen);
  el.pause.disabled = dryerState !== "running";
  el.doorButton.disabled = !(dryerState === "paused" || dryerState === "running");
  el.resume.disabled = !(dryerState === "paused" && !isDoorOpen);
  el.reset.hidden = dryerState !== "finished";
  el.tempButtons.forEach(button => { button.classList.toggle("active", button.dataset.temp === selectedTemperature); button.disabled = !(dryerState === "ready"); });
  el.speedLabel.textContent = demoSpeed ? "Demo: 1 sec = 1 min" : "Normal speed";
  el.stateReadout.textContent = dryerState;
  el.tempReadout.textContent = selectedTemperature ? selectedTemperature[0].toUpperCase() + selectedTemperature.slice(1) : "Not selected";
  el.paymentReadout.textContent = isPaid ? "Paid — saved" : "Not paid";
}

function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function startTimer() {
  stopTimer(); // Prevent multiple clicks from creating multiple countdown intervals.
  const tick = () => {
    if (dryerState !== "running") return;
    remainingSeconds -= demoSpeed ? 60 : 1;
    if (remainingSeconds <= 0) { remainingSeconds = 0; stopTimer(); dryerState = "finished"; setStatus("Drying complete!"); }
    render();
  };
  timerInterval = setInterval(tick, 1000);
}

function payForCycle() { isPaid = true; dryerState = "ready"; setStatus("Payment successful — choose a temperature."); render(); }
function chooseTemperature(event) { if (dryerState === "ready") { selectedTemperature = event.currentTarget.dataset.temp; setStatus(`${selectedTemperature[0].toUpperCase() + selectedTemperature.slice(1)} temperature selected.`); render(); } }
function startCycle() {
  if (!selectedTemperature) return setStatus("Choose a temperature before starting.", true);
  if (isDoorOpen) return setStatus("Close the door before starting.", true);
  dryerState = "running"; setStatus(`Running on ${selectedTemperature} heat.`); startTimer(); render();
}
function pauseCycle() { dryerState = "paused"; stopTimer(); setStatus("Paused — time saved. You may open the door."); render(); }
function toggleDoor() {
  if (dryerState === "running") return setStatus("Please pause the dryer before opening the door.", true);
  if (dryerState === "paused") { isDoorOpen = !isDoorOpen; setStatus(isDoorOpen ? "Door open — timer remains paused." : "Door closed — click Resume when ready."); render(); }
}
function resumeCycle() {
  if (isDoorOpen) return setStatus("Close the door before resuming the dryer.", true);
  dryerState = "running"; setStatus("Running — continuing saved time."); startTimer(); render();
}
function newCycle() { stopTimer(); dryerState = "idle"; isPaid = false; selectedTemperature = null; remainingSeconds = INITIAL_SECONDS; isDoorOpen = false; setStatus("Payment required to begin."); render(); }

el.pay.addEventListener("click", payForCycle);
el.tempButtons.forEach(button => button.addEventListener("click", chooseTemperature));
el.start.addEventListener("click", startCycle); el.pause.addEventListener("click", pauseCycle);
el.doorButton.addEventListener("click", toggleDoor); el.resume.addEventListener("click", resumeCycle);
el.reset.addEventListener("click", newCycle);
el.demo.addEventListener("change", event => { demoSpeed = event.target.checked; if (dryerState === "running") startTimer(); render(); });
render();
