// Dark mode toggle (shared with index.html)
const darkToggle = document.getElementById("darkToggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", 
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  });

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}

// Elements
const notesContainer = document.getElementById("notesContainer");
const subjectFilter = document.getElementById("subjectFilter");
const searchInput = document.getElementById("searchInput");

// Load notes.json
async function loadNotes() {
  const res = await fetch("notes.json");
  const data = await res.json();
  renderFilters(data);
  renderNotes(data);
}

// Render subject filter options
function renderFilters(data) {
  Object.keys(data).forEach(subject => {
    const opt = document.createElement("option");
    opt.value = subject;
    opt.textContent = subject;
    subjectFilter.appendChild(opt);
  });
}

// Render notes dynamically
function renderNotes(data) {
  notesContainer.innerHTML = "";
  const selectedSubject = subjectFilter.value;
  const searchTerm = searchInput.value.toLowerCase();

  Object.keys(data).forEach(subject => {
    if (selectedSubject !== "all" && subject !== selectedSubject) return;

    Object.keys(data[subject]).forEach(chapter => {
      data[subject][chapter].forEach(note => {
        if (!note.title.toLowerCase().includes(searchTerm)) return;

        const card = document.createElement("div");
        card.className =
          "p-4 rounded-xl border dark:border-gray-700 shadow hover:shadow-lg transition";

        card.innerHTML = `
          <h3 class="font-bold text-lg mb-2">${note.title}</h3>
          <p class="text-sm mb-3 text-gray-600 dark:text-gray-400">
            ${subject} • ${chapter}
          </p>
          <a href="${note.url}" target="_blank" class="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            View Note
          </a>
        `;

        notesContainer.appendChild(card);
      });
    });
  });
}

// Event listeners
subjectFilter.addEventListener("change", () => loadNotes());
searchInput.addEventListener("input", () => loadNotes());

// Initial load
loadNotes();
