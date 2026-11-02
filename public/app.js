import { filterRules, validateGuideBundle } from "./guide-core.js";

const state = { bundle: null, category: "", query: "" };
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const filtersRoot = document.querySelector("#category-filters");
const rulesRoot = document.querySelector("#rules-list");
const countRoot = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const errorRoot = document.querySelector("#error-message");
const lawStatus = document.querySelector("#law-status");
const lawLink = document.querySelector("#law-link");
const relatedLawLinks = document.querySelector("#related-law-links");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(isoDate) {
  const parts = String(isoDate || "").split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : "data não informada";
}

function showLaw(law) {
  lawStatus.textContent = `Marcado como ${law.status} no catálogo · verificado em ${formatDate(law.verification_date)}`;
  lawLink.hidden = true;
  if (law.official_source_url && new URL(law.official_source_url).protocol === "https:") {
    lawLink.href = law.official_source_url;
    lawLink.hidden = false;
  }
  relatedLawLinks.replaceChildren();
  const relatedSources = Array.isArray(law.related_source_urls) ? law.related_source_urls : [];
  relatedSources.forEach((sourceUrl, index) => {
    try {
      if (new URL(sourceUrl).protocol !== "https:") return;
      const link = element("a", "related-law-link", `Fonte oficial complementar ${index + 1} ↗`);
      link.href = sourceUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      relatedLawLinks.append(link);
    } catch {
      // Ignorar somente a URL malformada; a fonte principal segue disponível.
    }
  });
  relatedLawLinks.hidden = relatedLawLinks.childElementCount === 0;
}

function makeFilterButton(label, value) {
  const button = element("button", "filter-button", label);
  button.type = "button";
  button.dataset.category = value;
  button.setAttribute("aria-pressed", String(state.category === value));
  button.addEventListener("click", () => {
    state.category = value;
    updateFilterButtons();
    renderRules();
  });
  return button;
}

function renderFilters(categories) {
  filtersRoot.replaceChildren();
  filtersRoot.append(makeFilterButton("Todos os temas", ""));
  categories.forEach((category) => filtersRoot.append(makeFilterButton(category, category)));
}

function updateFilterButtons() {
  filtersRoot.querySelectorAll(".filter-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  });
}

function makeRuleCard(rule, index) {
  const card = element("article", "rule-card");
  const header = element("div", "rule-header");
  const headingGroup = document.createElement("div");
  headingGroup.append(element("span", "category-label", rule.category));
  headingGroup.append(element("h3", "", rule.title));
  header.append(headingGroup, element("span", "rule-number", String(index + 1).padStart(2, "0")));
  card.append(header);

  const articleTags = element("ul", "article-tags");
  rule.articles.forEach((article) => articleTags.append(element("li", "", article)));
  card.append(articleTags);
  card.append(element("p", "rule-summary", rule.summary));

  const applicability = element("div", "applicable-box");
  applicability.append(element("h4", "", "Quando conferir"));
  applicability.append(element("p", "", rule.when_applicable));
  card.append(applicability);

  const checklist = element("section", "checklist");
  checklist.append(element("h4", "", "Verificações operacionais"));
  const list = document.createElement("ul");
  rule.checklist.forEach((step) => list.append(element("li", "", step)));
  checklist.append(list);
  card.append(checklist);

  const response = element("div", "response-box");
  response.append(element("h4", "", "Sugestão de fala neutra"));
  response.append(element("p", "", `“${rule.safe_response}”`));
  card.append(response);

  const caution = element("div", "caution-box");
  caution.setAttribute("role", "note");
  caution.append(element("span", "caution-mark", "Atenção"));
  caution.append(element("span", "", rule.caution));
  card.append(caution);
  return card;
}

function renderRules() {
  if (!state.bundle) return;
  const matches = filterRules(state.bundle.rules, state.query, state.category);
  rulesRoot.replaceChildren();
  matches.forEach((rule, index) => rulesRoot.append(makeRuleCard(rule, index)));
  const total = state.bundle.total_rules;
  countRoot.textContent = matches.length === total
    ? `${total} referências temáticas`
    : `${matches.length} de ${total} referências encontradas`;
  emptyState.hidden = matches.length !== 0;
  rulesRoot.hidden = matches.length === 0;
}

async function initialize() {
  try {
    const bundleUrl = new URL("./data/cdc-guide.json", document.baseURI);
    const response = await fetch(bundleUrl, {
      headers: { Accept: "application/json" },
      cache: "no-cache",
    });
    if (!response.ok) throw new Error(`Não foi possível carregar o bundle do CDC (HTTP ${response.status}).`);
    state.bundle = validateGuideBundle(await response.json());
    showLaw(state.bundle.law);
    renderFilters(state.bundle.categories);
    renderRules();
  } catch (error) {
    lawStatus.textContent = "Fonte do catálogo indisponível";
    errorRoot.textContent = `${error.message} Confirme o texto no portal oficial antes de aplicar qualquer orientação.`;
    errorRoot.hidden = false;
    countRoot.textContent = "A consulta não foi carregada";
  } finally {
    rulesRoot.setAttribute("aria-busy", "false");
  }
}

searchForm.addEventListener("submit", (event) => event.preventDefault());
searchInput.addEventListener("input", () => {
  state.query = searchInput.value.slice(0, 120);
  renderRules();
});

initialize();
