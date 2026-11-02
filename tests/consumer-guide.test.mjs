import assert from "node:assert/strict";
import { buildGuideBundle } from "../scripts/catalog-data.mjs";
import { filterRules, validateGuideBundle } from "../public/guide-core.js";

const baseBundle = await buildGuideBundle();

export const cases = [
  {
    name: "compõe o registro federal oficial do CDC com seis guias editoriais",
    group: "Integração · Catálogo estático",
    run: async () => {
      const bundle = await buildGuideBundle();
      assert.equal(bundle.law.identifier, "Lei nº 8.078, de 11 de setembro de 1990");
      assert.equal(bundle.law.status, "vigente");
      assert.equal(bundle.law.jurisdiction, "federal");
      assert.equal(bundle.total_rules, 6);
      assert.equal(bundle.rules.length, bundle.total_rules);
      assert.ok(bundle.law.official_source_url.startsWith("https://"));
      assert.equal(validateGuideBundle(bundle), bundle);
    },
  },
  {
    name: "pesquisa no navegador ignora acentos sem descartar as fontes",
    group: "Unitário · Pesquisa client-side",
    run: () => {
      const results = filterRules(baseBundle.rules, "preco");
      assert.ok(results.some((rule) => rule.id === "preco-e-oferta"));
    },
  },
  {
    name: "filtro temático local devolve somente cobrança e pagamentos",
    group: "Unitário · Pesquisa client-side",
    run: () => {
      const results = filterRules(baseBundle.rules, "", "Cobrança e pagamentos");
      assert.deepEqual(results.map((rule) => rule.id), ["cobranca-sem-constrangimento"]);
    },
  },
  {
    name: "pesquisa por substituição de produtos encontra o guia de troca e vício",
    group: "Unitário · Pesquisa client-side",
    run: () => {
      const results = filterRules(baseBundle.rules, "substituição de produtos");
      assert.deepEqual(results.map((rule) => rule.id), ["troca-desistencia"]);
    },
  },
  {
    name: "falha de forma fechada se o registro do CDC não estiver vigente",
    group: "Unitário · Segurança do bundle",
    run: () => {
      const altered = structuredClone(baseBundle);
      altered.law.status = "nao_verificada";
      assert.throws(() => validateGuideBundle(altered), /não marca.*vigente/i);
    },
  },
  {
    name: "recusa URLs de fonte não HTTPS e datas de verificação inválidas",
    group: "Unitário · Segurança do bundle",
    run: () => {
      const insecure = structuredClone(baseBundle);
      insecure.law.official_source_url = "http://example.org/lei";
      assert.throws(() => validateGuideBundle(insecure), /HTTPS/i);
      const invalidDate = structuredClone(baseBundle);
      invalidDate.law.verification_date = "2026-02-31";
      assert.throws(() => validateGuideBundle(invalidDate), /data de verificação/i);
    },
  },
  {
    name: "rejeita categorias desconhecidas e consultas fora do limite",
    group: "Unitário · Pesquisa client-side",
    run: () => {
      assert.throws(() => filterRules(baseBundle.rules, "", "tema-inventado"), /não existe/i);
      assert.throws(() => filterRules(baseBundle.rules, "x".repeat(121)), /120 caracteres/i);
    },
  },
];
