const API_URL = "https://script.google.com/macros/s/AKfycbz3l1DjUDYLjCF1UMRqBVt21dySNf7Opb6575g_oKsBoD5RBdEO3x_A0HX6IkxSONya/exec";

const cardsContainer = document.getElementById("cardsContainer");
const searchInput = document.getElementById("searchInput");
const btnSearch = document.getElementById("btnSearch");
const btnRefresh = document.getElementById("btnRefresh");

// ---------------------- FETCH FUNCTIONS ----------------------

async function fetchComunicados() {
  const res = await fetch(`${API_URL}?action=getAll`);
  return res.json();
}

async function searchComunicados(query) {
  const res = await fetch(`${API_URL}?action=search&q=` + encodeURIComponent(query));
  return res.json();
}

async function refreshComunicados() {
  const res = await fetch(`${API_URL}?action=refresh`);
  return res.json();
}

// ---------------------- RENDER UI ----------------------

function renderCards(data) {
  cardsContainer.innerHTML = "";

  if (!data || data.length === 0) {
    cardsContainer.innerHTML = "<p>Nenhum comunicado encontrado.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${item.imageUrl || ''}" alt="Imagem do comunicado">

      ${item.tag ? `<span class="tag">${item.tag}</span>` : ""}

      <h3>${item.title || "Sem título"}</h3>
      <p>${item.description || ""}</p>

      ${item.docUrl ? `<a href="${item.docUrl}" target="_blank">Ver documento</a>` : ""}
    `;

    cardsContainer.appendChild(card);
  });
}

function preencherMarquee(data) {
  const marquee = document.getElementById("marquee");
  marquee.innerHTML = "";

  if (!data || data.length === 0) {
    marquee.textContent = "Nenhum comunicado disponível";
    return;
  }

  const primeirosTres = data.slice(0, 3);

  primeirosTres.forEach(item => {
    const link = document.createElement("a");
    link.href = item.docUrl || "#";
    link.target = "_blank";
    link.textContent = item.title;
    link.style.marginRight = "40px";

    marquee.appendChild(link);
  });
}

// ---------------------- EVENTS ----------------------

btnSearch.addEventListener("click", async () => {
  const q = searchInput.value.trim();
  const results = await searchComunicados(q);
  renderCards(results);

  // Atualiza o marquee com o resultado da busca
  preencherMarquee(results);
});

btnRefresh.addEventListener("click", async () => {
  const data = await refreshComunicados();
  renderCards(data);

  // Atualiza o marquee com os dados recarregados
  preencherMarquee(data);
});

// carregar ao abrir
window.onload = async () => {
  const data = await fetchComunicados();
  renderCards(data);

  // Preenche o marquee ao iniciar
  preencherMarquee(data);
};
