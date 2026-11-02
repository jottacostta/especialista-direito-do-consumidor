const CDC_IDENTIFIER = "Lei nº 8.078, de 11 de setembro de 1990";
const RULE_FIELDS = [
  "id", "title", "category", "articles", "summary", "when_applicable",
  "checklist", "safe_response", "caution",
].sort();

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isHttpsUrl(value, allowEmpty = false) {
  if (allowEmpty && value === "") return true;
  if (typeof value !== "string" || /\s/.test(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function validateRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error("A lista de regras informativas está vazia ou inválida.");
  }
  const seen = new Set();
  rules.forEach((rule, index) => {
    const position = index + 1;
    if (!rule || typeof rule !== "object" || Array.isArray(rule)) {
      throw new Error(`Regra ${position} não é um objeto.`);
    }
    const keys = Object.keys(rule).sort();
    if (keys.length !== RULE_FIELDS.length || keys.some((key, i) => key !== RULE_FIELDS[i])) {
      throw new Error(`Regra ${position} possui campos ausentes ou inesperados.`);
    }
    for (const field of ["id", "title", "category", "summary", "when_applicable", "safe_response", "caution"]) {
      if (typeof rule[field] !== "string" || !rule[field].trim()) {
        throw new Error(`Regra ${position} contém texto obrigatório vazio.`);
      }
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rule.id)) {
      throw new Error(`Identificador inválido na regra ${position}.`);
    }
    if (seen.has(rule.id)) throw new Error(`Identificador repetido na regra ${position}.`);
    seen.add(rule.id);
    if (!Array.isArray(rule.articles) || rule.articles.length === 0
      || !rule.articles.every((article) => typeof article === "string" && article.trim())) {
      throw new Error(`Referência de artigo inválida na regra ${position}.`);
    }
    if (!Array.isArray(rule.checklist) || rule.checklist.length === 0
      || !rule.checklist.every((step) => typeof step === "string" && step.trim())) {
      throw new Error(`Checklist inválido na regra ${position}.`);
    }
  });
  return rules;
}

export function validateGuideBundle(bundle) {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
    throw new Error("O bundle estático do CDC é inválido.");
  }
  const law = bundle.law;
  if (!law || law.identifier !== CDC_IDENTIFIER || law.jurisdiction !== "federal" || law.territory !== "BR") {
    throw new Error("A fonte não corresponde ao registro federal esperado do CDC.");
  }
  if (law.status !== "vigente") {
    throw new Error("O catálogo não marca o registro do CDC como vigente; confirme a fonte antes de usar o guia.");
  }
  if (typeof law.title !== "string" || !law.title.trim()) {
    throw new Error("O registro do CDC não contém título legível.");
  }
  if (!isIsoDate(law.verification_date)) {
    throw new Error("A data de verificação do registro do CDC está ausente ou inválida.");
  }
  if (!isHttpsUrl(law.official_source_url)) {
    throw new Error("O registro do CDC não contém uma fonte oficial HTTPS válida.");
  }
  if (!isHttpsUrl(law.status_basis_url || "", true)) {
    throw new Error("A fonte que fundamenta o status do CDC não é HTTPS válida.");
  }
  if (!Array.isArray(law.related_source_urls)
    || !law.related_source_urls.every((url) => isHttpsUrl(url))) {
    throw new Error("Há uma fonte complementar inválida no registro do CDC.");
  }
  validateRules(bundle.rules);
  if (bundle.total_rules !== bundle.rules.length) {
    throw new Error("A contagem do bundle não corresponde às regras disponibilizadas.");
  }
  const categories = [...new Set(bundle.rules.map((rule) => rule.category))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  if (!Array.isArray(bundle.categories)
    || categories.length !== bundle.categories.length
    || categories.some((category, index) => category !== bundle.categories[index])) {
    throw new Error("Os temas do bundle não correspondem às regras.");
  }
  return bundle;
}

export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

export function filterRules(rules, query = "", category = "") {
  validateRules(rules);
  if (typeof query !== "string" || query.length > 120) {
    throw new Error("A busca deve ter no máximo 120 caracteres.");
  }
  if (typeof category !== "string" || category.length > 80) {
    throw new Error("O filtro de tema é inválido.");
  }
  const categories = new Set(rules.map((rule) => rule.category));
  if (category && !categories.has(category)) throw new Error("O tema solicitado não existe.");
  const term = normalizeSearchText(query.trim());
  return rules.filter((rule) => {
    if (category && rule.category !== category) return false;
    if (!term) return true;
    const content = [
      rule.title, rule.category, rule.summary, rule.when_applicable,
      ...rule.articles, ...rule.checklist, rule.safe_response, rule.caution,
    ].join(" ");
    return normalizeSearchText(content).includes(term);
  });
}
