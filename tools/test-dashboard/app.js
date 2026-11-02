(() => {
  "use strict";

  const REPORT_URL = "../data/test-report.json";
  const elements = {
    download: document.getElementById("download-report"),
    liveStatus: document.getElementById("live-status"),
    reportError: document.getElementById("report-error"),
    total: document.getElementById("metric-total"),
    groups: document.getElementById("metric-groups"),
    passed: document.getElementById("metric-passed"),
    problems: document.getElementById("metric-problems"),
    duration: document.getElementById("metric-duration"),
    time: document.getElementById("metric-time"),
    progressLabel: document.getElementById("progress-label"),
    progressPercent: document.getElementById("progress-percent"),
    progressTrack: document.querySelector(".progress-track"),
    progressFill: document.getElementById("progress-fill"),
    search: document.getElementById("search-tests"),
    outcome: document.getElementById("outcome-filter"),
    group: document.getElementById("group-filter"),
    list: document.getElementById("test-list"),
    visibleCount: document.getElementById("visible-count"),
    empty: document.getElementById("empty-filter"),
    console: document.getElementById("console-output"),
  };

  const outcomeLabels = {
    passed: "Aprovado",
    failed: "Falha",
    error: "Erro",
    skipped: "Ignorado",
    expected_failure: "Falha esperada",
    unexpected_success: "Sucesso inesperado",
  };
  let currentReport = null;

  function formatDuration(seconds) {
    const value = Number(seconds) || 0;
    if (value < 1) return `${Math.round(value * 1000)} ms`;
    return `${value.toFixed(value < 10 ? 2 : 1)} s`;
  }

  function formatTimestamp(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Horário indisponível";
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);
  }

  function setStatus(message, state) {
    elements.liveStatus.textContent = message;
    elements.liveStatus.dataset.state = state || "";
  }

  function setReportError(message) {
    elements.reportError.textContent = message;
    elements.reportError.hidden = false;
  }

  function clearReportError() {
    elements.reportError.textContent = "";
    elements.reportError.hidden = true;
  }

  function makeTestCard(test) {
    const item = document.createElement("div");
    item.className = "test-case";
    const details = document.createElement("details");
    details.className = "test-details";

    const summary = document.createElement("summary");
    summary.className = "test-summary";
    const title = document.createElement("span");
    title.className = "case-title";
    const name = document.createElement("span");
    name.className = "case-name";
    name.textContent = test.name || "Caso sem nome";
    const group = document.createElement("span");
    group.className = "case-group";
    group.textContent = test.group || "Outros testes";
    title.append(name, group);

    const duration = document.createElement("span");
    duration.className = "case-duration";
    duration.textContent = formatDuration(test.duration_seconds);
    const status = document.createElement("span");
    const outcome = outcomeLabels[test.outcome] ? test.outcome : "error";
    status.className = `status-pill status-${outcome}`;
    status.textContent = outcomeLabels[test.outcome] || "Resultado desconhecido";
    summary.append(title, duration, status);

    const body = document.createElement("div");
    body.className = "case-details";
    const id = document.createElement("p");
    id.className = "case-id";
    id.textContent = test.id || "Identificador indisponível";
    body.append(id);
    if (test.details) {
      const label = document.createElement("p");
      label.className = "case-detail-label";
      label.textContent = test.outcome === "skipped" ? "Motivo" : "Detalhes completos";
      const text = document.createElement("pre");
      text.className = "case-traceback";
      text.textContent = test.details;
      body.append(label, text);
    } else {
      const description = document.createElement("p");
      description.className = "case-id";
      description.textContent = "Sem detalhes adicionais.";
      body.append(description);
    }
    details.append(summary, body);
    item.append(details);
    return item;
  }

  function applyFilters() {
    if (!currentReport) return;
    const query = elements.search.value.trim().toLocaleLowerCase("pt-BR");
    const outcome = elements.outcome.value;
    const group = elements.group.value;
    const visible = currentReport.tests.filter((test) => {
      const text = `${test.name || ""} ${test.id || ""} ${test.group || ""}`.toLocaleLowerCase("pt-BR");
      return (outcome === "all" || test.outcome === outcome)
        && (group === "all" || test.group === group)
        && (!query || text.includes(query));
    });
    elements.list.replaceChildren(...visible.map(makeTestCard));
    elements.visibleCount.textContent = `${visible.length} ${visible.length === 1 ? "caso" : "casos"}`;
    elements.empty.hidden = visible.length !== 0;
  }

  function renderReport(report) {
    currentReport = report;
    const counts = report.counts || {};
    const tests = Array.isArray(report.tests) ? report.tests : [];
    const groups = Array.isArray(report.groups) ? report.groups : [];
    const total = Number(counts.total) || 0;
    const passed = Number(counts.passed) || 0;
    const problems = (Number(counts.failed) || 0)
      + (Number(counts.errors) || 0)
      + (Number(counts.unexpected_successes) || 0);
    const percentage = total ? Math.min(100, Math.max(0, Math.round((passed / total) * 100))) : 0;

    elements.total.textContent = String(total);
    elements.groups.textContent = `${groups.length} ${groups.length === 1 ? "camada de validação" : "camadas de validação"}`;
    elements.passed.textContent = String(passed);
    elements.problems.textContent = String(problems);
    elements.duration.textContent = formatDuration(report.duration_seconds);
    elements.time.textContent = `Executado em ${formatTimestamp(report.generated_at)}`;
    elements.progressLabel.textContent = `${passed} de ${total} casos aprovados`;
    elements.progressPercent.textContent = `${percentage}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(percentage));
    elements.progressFill.style.width = `${percentage}%`;
    elements.console.textContent = report.console_output || "O runner não produziu saída textual.";
    elements.download.disabled = false;
    currentReport.tests = tests;

    const existingGroups = new Set(Array.from(elements.group.options, (option) => option.value));
    for (const item of groups) {
      if (!existingGroups.has(item)) {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        elements.group.append(option);
      }
    }

    if (report.success) {
      setStatus(`Execução concluída: ${total} testes, todos os resultados esperados.`, "success");
    } else {
      setStatus(`Execução concluída com ${problems} falhas/erros. Abra os casos para ver os detalhes.`, "error");
    }
    clearReportError();
    applyFilters();
  }

  function validateReport(report) {
    if (!report || typeof report !== "object" || !report.counts || !Array.isArray(report.tests)) {
      throw new Error("O arquivo não segue o contrato esperado do relatório.");
    }
  }

  async function loadReport() {
    setStatus("Carregando o relatório público…", "loading");
    try {
      const response = await fetch(REPORT_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`arquivo não encontrado (HTTP ${response.status})`);
      const report = await response.json();
      validateReport(report);
      renderReport(report);
    } catch (error) {
      currentReport = null;
      elements.download.disabled = true;
      elements.list.replaceChildren();
      elements.visibleCount.textContent = "0 casos";
      elements.empty.hidden = true;
      setStatus("Relatório público indisponível. Os testes rodam no CI; consulte o workflow no GitHub.", "error");
      setReportError(`Não foi possível carregar ${REPORT_URL}: ${error.message || "erro desconhecido"}. O relatório será exibido quando esse arquivo for publicado.`);
    }
  }

  elements.download.addEventListener("click", () => {
    if (!currentReport) return;
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `relatorio-testes-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });

  elements.search.addEventListener("input", applyFilters);
  elements.outcome.addEventListener("change", applyFilters);
  elements.group.addEventListener("change", applyFilters);

  loadReport();
})();
