function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}

function renderCards(data){
  const container = document.getElementById("cards");
  if (!container) return;

  container.innerHTML = "";

  if (!data.length){
    container.innerHTML = "<p>No matching sites.</p>";
    return;
  }

  data.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${escapeHTML(d.name)}</h4>
      <p>${escapeHTML(d.desc)}</p>
      <small>Threat: ${escapeHTML(d.threat)}</small><br>
      ${d.protected ? "<small>Protected Area</small>" : ""}
      <br><br>
      <button onclick="saveFavorite(${d.id})">Save Favorite</button>
    `;
    container.appendChild(card);
  });
}

function applyFilters(){
  const search = document.getElementById("search").value.toLowerCase();
  const threat = document.getElementById("threat").value;
  const prot = document.getElementById("protected").checked;

  const out = window.DESTINATIONS.filter(d => {
    const matchText = (d.name + " " + d.tags.join(" ")).toLowerCase().includes(search);
    const matchThreat = !threat || d.threat === threat;
    const matchProt = !prot || d.protected;

    return matchText && matchThreat && matchProt;
  });

  renderCards(out);
}

function saveFavorite(id){
  const data = window.DESTINATIONS;
  const site = data.find(d => d.id === id);

  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  favs.push(site);
  localStorage.setItem("favorites", JSON.stringify(favs));

  alert("Saved!");
}

document.addEventListener("DOMContentLoaded", () => {
  const s = document.getElementById("search");
  const t = document.getElementById("threat");
  const p = document.getElementById("protected");

  if (s) s.addEventListener("input", applyFilters);
  if (t) t.addEventListener("change", applyFilters);
  if (p) p.addEventListener("change", applyFilters);

  if (window.DESTINATIONS) applyFilters();
});

// Contact page
function initContactPage(){
  const form = document.getElementById("reportForm");
  const list = document.getElementById("reportsList");

  function render(){
    const arr = JSON.parse(localStorage.getItem("reports") || "[]");
    list.innerHTML = arr.length
      ? arr.map(r =>
        `<div class="card">
          <strong>${escapeHTML(r.name)}</strong><br>
          <small>${escapeHTML(r.email)}</small>
          <p>${escapeHTML(r.message)}</p>
         </div>`
       ).join("")
      : "<p>No reports yet.</p>";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const r = {
      name: rname.value,
      email: remail.value,
      message: rmessage.value
    };

    const arr = JSON.parse(localStorage.getItem("reports") || "[]");
    arr.push(r);

    localStorage.setItem("reports", JSON.stringify(arr));
    form.reset();
    render();
  });

  render();
}
