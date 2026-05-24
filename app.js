const REF_FILES = [
  { segment: "RdRp", genogroup: "GI", file: "reference/nov-rdrp-GI.fa" },
  { segment: "RdRp", genogroup: "GII", file: "reference/nov-rdrp-GII.fa" },
  { segment: "RdRp", genogroup: "GIV", file: "reference/nov-rdrp-GIV.fa" },
  { segment: "VP1", genogroup: "GI", file: "reference/nov-vp1-GI.fa" },
  { segment: "VP1", genogroup: "GII", file: "reference/nov-vp1-GII.fa" },
  { segment: "VP1", genogroup: "GIV", file: "reference/nov-vp1-GIV.fa" },
  { segment: "VP1", genogroup: "GVIII", file: "reference/nov-vp1-GVIII.fa" },
  { segment: "VP1", genogroup: "GIX", file: "reference/nov-vp1-GIX.fa" },
];

const APP_VERSION = "v1.0.0";
const DATABASE_VERSION = "NoV-Ref 2026.05.24";
const GII4_VARIANT_THRESHOLD = 97.5;

const I18N = {
  zh: {
    pageTitle: "诺如病毒分型工具",
    eyebrow: "Norovirus Genotyping Platform",
    appTitle: "诺如病毒分型分析系统",
    localLibrary: "本地参考库",
    loading: "加载中",
    sequenceUnit: "条",
    inputTitle: "序列提交",
    inputSubtitle: "FASTA / 多条序列 / 原始核酸序列",
    loadExample: "载入示例",
    chooseFile: "选择文件",
    runTyping: "开始分型",
    minOverlap: "最小重叠长度",
    vp1Threshold: "VP1 身份阈值",
    rdrpThreshold: "RdRp 身份阈值",
    kmerSize: "k-mer 大小",
    candidateLimit: "候选数上限",
    rebuildIndex: "重建索引",
    resultTitle: "分型结果",
    waiting: "等待序列提交",
    downloadCsv: "下载 CSV",
    sample: "样本",
    dualType: "双分型",
    gii4Variant: "GII.4 变异株",
    direction: "方向",
    decision: "判定",
    submitAfterLibrary: "参考库加载完成后提交序列",
    libraryReady: "参考库已就绪",
    libraryFailed: "参考库加载失败",
    serverHint: "请通过本地服务器访问页面。",
    noValidSequence: "未检测到有效核酸序列",
    database: "参考数据库",
    totalSequences: "总序列数",
    coveredSegments: "覆盖片段",
    softwareVersion: "软件版本",
    completed: (count) => `${count} 条序列完成分型`,
    typing: "正在分型...",
    undetermined: "未定型",
    notApplicable: "不适用",
    variantUnassigned: "变异株未定型",
    pass: "通过",
    singleSegmentPass: "单片段通过",
    insufficientOverlap: "重叠不足",
    lowSimilarity: "低相似度",
    forward: "正向",
    reverse: "反向互补",
    noHit: (segment) => `${segment} 未命中`,
    candidates: (segment) => `${segment} 候选`,
    variantCandidates: "GII.4 变异株候选",
    noCandidates: "无候选",
    signatureTitle: "最佳命中局部一致性概览",
    copyrightOwner: "软件版权归属：广东省科学院微生物研究所食源性病毒污染与防控研究团队",
  },
  en: {
    pageTitle: "Norovirus Genotyping Tool",
    eyebrow: "Norovirus Genotyping Platform",
    appTitle: "Norovirus Genotyping Analysis System",
    localLibrary: "Local reference library",
    loading: "Loading",
    sequenceUnit: "seqs",
    inputTitle: "Sequence Submission",
    inputSubtitle: "FASTA / multi-FASTA / raw nucleotide sequence",
    loadExample: "Load Example",
    chooseFile: "Choose File",
    runTyping: "Run Typing",
    minOverlap: "Minimum overlap",
    vp1Threshold: "VP1 identity threshold",
    rdrpThreshold: "RdRp identity threshold",
    kmerSize: "k-mer size",
    candidateLimit: "Candidate limit",
    rebuildIndex: "Rebuild index",
    resultTitle: "Typing Results",
    waiting: "Waiting for sequence input",
    downloadCsv: "Download CSV",
    sample: "Sample",
    dualType: "Dual Type",
    gii4Variant: "GII.4 Variant",
    direction: "Direction",
    decision: "Decision",
    submitAfterLibrary: "Submit sequences after the reference library is loaded",
    libraryReady: "Reference library ready",
    libraryFailed: "Reference library failed to load",
    serverHint: "Please access this page through a local server.",
    noValidSequence: "No valid nucleotide sequence detected",
    database: "Reference database",
    totalSequences: "Total sequences",
    coveredSegments: "Covered segments",
    softwareVersion: "Software version",
    completed: (count) => `${count} sequence${count === 1 ? "" : "s"} typed`,
    typing: "Typing...",
    undetermined: "Undetermined",
    notApplicable: "N/A",
    variantUnassigned: "Variant unassigned",
    pass: "Pass",
    singleSegmentPass: "Single segment pass",
    insufficientOverlap: "Insufficient overlap",
    lowSimilarity: "Low similarity",
    forward: "Forward",
    reverse: "Reverse complement",
    noHit: (segment) => `${segment} no hit`,
    candidates: (segment) => `${segment} candidates`,
    variantCandidates: "GII.4 variant candidates",
    noCandidates: "No candidates",
    signatureTitle: "Best-hit local identity overview",
    copyrightOwner:
      "Software copyright: Foodborne Virus Contamination and Control Research Team, Institute of Microbiology, Guangdong Academy of Sciences",
  },
};

const IUPAC = {
  A: "A",
  C: "C",
  G: "G",
  T: "T",
  U: "T",
  R: "AG",
  Y: "CT",
  S: "GC",
  W: "AT",
  K: "GT",
  M: "AC",
  B: "CGT",
  D: "AGT",
  H: "ACT",
  V: "ACG",
  N: "ACGT",
};

const COMPLEMENT = {
  A: "T",
  C: "G",
  G: "C",
  T: "A",
  U: "A",
  R: "Y",
  Y: "R",
  S: "S",
  W: "W",
  K: "M",
  M: "K",
  B: "V",
  D: "H",
  H: "D",
  V: "B",
  N: "N",
};

const state = {
  references: [],
  results: [],
  selected: 0,
  lang: localStorage.getItem("novTypingLang") || "zh",
  emptyKey: "submitAfterLibrary",
  emptyMessage: "",
};

const els = {
  libraryStatus: document.querySelector("#libraryStatus"),
  libraryStrip: document.querySelector("#libraryStrip"),
  sequenceInput: document.querySelector("#sequenceInput"),
  fileInput: document.querySelector("#fileInput"),
  runButton: document.querySelector("#runButton"),
  loadExample: document.querySelector("#loadExample"),
  downloadButton: document.querySelector("#downloadButton"),
  resultBody: document.querySelector("#resultBody"),
  summaryLine: document.querySelector("#summaryLine"),
  detailArea: document.querySelector("#detailArea"),
  minOverlap: document.querySelector("#minOverlap"),
  vp1Threshold: document.querySelector("#vp1Threshold"),
  rdrpThreshold: document.querySelector("#rdrpThreshold"),
  languageButtons: document.querySelectorAll("[data-lang]"),
  kSize: document.querySelector('#kSize'),
  candidateLimit: document.querySelector('#candidateLimit'),
  rebuildIndex: document.querySelector('#rebuildIndex'),

};

const workerAvailable = typeof Worker !== 'undefined';
let worker = null;
let workerReady = false;
const pendingResponses = new Map();
function initWorker() {
  if (!workerAvailable) return;
  worker = new Worker(`worker.js?v=${encodeURIComponent(DATABASE_VERSION)}`);
  worker.onmessage = (e) => {
    const msg = e.data;
    if (msg.type === 'initDone') { workerReady = true; }
    if (msg.type === 'rankResult') {
      const { requestId, matches } = msg;
      const resolve = pendingResponses.get(requestId);
      if (resolve) {
        pendingResponses.delete(requestId);
        resolve(matches);
      }
    }
  };
}
function workerRankReferences(sequence, segment, options) {
  if (!worker || !workerReady) return Promise.resolve(rankReferences(sequence, segment, options));
  const requestId = `${Date.now()}-${Math.random()}`;
  const promise = new Promise((resolve) => { pendingResponses.set(requestId, resolve); });
  worker.postMessage({ type: 'rank', requestId, sequence, segment, options });
  return promise;
}
initWorker();
init();

async function init() {
  bindEvents();
  await loadReferences();
}

function bindEvents() {
  els.runButton.addEventListener("click", runTyping);
  els.loadExample.addEventListener("click", loadExampleSequence);
  els.fileInput.addEventListener("change", readFile);
  els.downloadButton.addEventListener("click", downloadCsv);
  els.languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
  if (els.kSize) {
    els.kSize.addEventListener('change', () => {
      const v = Number(els.kSize.value);
      localStorage.setItem('nov_k', v);
    });
  }
  if (els.candidateLimit) {
    els.candidateLimit.addEventListener('change', () => {
      const v = Number(els.candidateLimit.value);
      localStorage.setItem('nov_candidateLimit', v);
    });
  }
  if (els.rebuildIndex) {
    els.rebuildIndex.addEventListener('click', () => {
      const k = Number(els.kSize.value) || 13;
      const candidateLimit = Number(els.candidateLimit.value) || 20;
      if (worker && typeof worker.postMessage === 'function') {
        // re-init index in worker
        worker.postMessage({ type: 'init', references: state.references, options: { k, candidateLimit } });
      }
    });
  }
}

async function loadReferences() {
  try {
    applyLanguage();
    const groups = await Promise.all(
      REF_FILES.map(async (meta) => {
        const res = await fetch(`${meta.file}?v=${encodeURIComponent(DATABASE_VERSION)}`);
        if (!res.ok) throw new Error(`${meta.file} 加载失败`);
        const records = parseFasta(await res.text()).map((record) => ({
          ...record,
          ...meta,
          genotype: parseGenotype(record.name, meta.segment),
        })).map((record) => ({
          ...record,
          variant: parseGii4Variant(record.name, record.genotype, record.segment),
        }));
        return records;
      }),
    );

    state.references = groups.flat();
    renderLibraryStatus();
    renderLibraryStrip();
    const kFromStorage = Number(localStorage.getItem('nov_k')) || 13;
    const candFromStorage = Number(localStorage.getItem('nov_candidateLimit')) || 20;
    if (els.kSize) els.kSize.value = kFromStorage;
    if (els.candidateLimit) els.candidateLimit.value = candFromStorage;
    if (worker && typeof worker.postMessage === 'function') {
      worker.postMessage({ type: 'init', references: state.references, options: { k: kFromStorage, candidateLimit: candFromStorage } });
    }
    setEmptyMessage("libraryReady");
  } catch (err) {
    els.libraryStatus.textContent = t("libraryFailed");
    setEmptyMessage("", `${err.message}; ${t("serverHint")}`);
  }
}

function parseFasta(text) {
  const records = [];
  let current = null;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith(">")) {
      if (current) records.push(current);
      const name = line.slice(1).trim();
      current = { name, sequence: "" };
    } else if (current) {
      current.sequence += cleanSequence(line);
    } else {
      current = { name: "sequence-1", sequence: cleanSequence(line) };
    }
  }

  if (current) records.push(current);
  return records.filter((record) => record.sequence.length);
}

function cleanSequence(value) {
  return value.toUpperCase().replace(/[^ACGTURYSWKMBDHVN-]/g, "").replace(/U/g, "T");
}

function parseGenotype(name, segment) {
  const first = name.split(/\s+/)[0] || "";
  if (segment === "RdRp") return first.match(/^G[IVX]+\.P[\w.-]+/i)?.[0] || first;
  return first.match(/^G[IVX]+\.[\w.-]+/i)?.[0] || first;
}

function parseGii4Variant(name, genotype, segment) {
  if (segment !== "VP1" || genotype !== "GII.4") return "";
  const tokens = name.split(/\s+/).filter(Boolean);
  const firstAccession = tokens.findIndex((token, index) => index > 0 && isAccessionToken(token));
  const variantTokens = firstAccession > 1 ? tokens.slice(1, firstAccession) : [];
  if (variantTokens.length) return variantTokens.join(" ");

  const embedded = name.match(/GII\.4[_\s-]+([A-Za-z][A-Za-z0-9-]*(?:\s+[A-Za-z][A-Za-z0-9-]*)?)(?:\[|\/|_|,|\s)/);
  if (!embedded) return "";
  const value = embedded[1].replace(/_/g, " ").trim();
  return value && value !== "strain" ? value : "";
}

function isAccessionToken(token) {
  return /^(?:[A-Z]{1,3}_?\d{4,}|[A-Z]\d{5,}|X\d{5,})/.test(token);
}

function renderLibraryStrip() {
  if (!state.references.length) return;
  const vp1Count = state.references.filter((ref) => ref.segment === "VP1").length;
  const rdrpCount = state.references.filter((ref) => ref.segment === "RdRp").length;

  els.libraryStrip.innerHTML = `
    <div class="database-card">
      <div>
        <span class="metric-label">${t("database")}</span>
        <strong>${DATABASE_VERSION}</strong>
      </div>
      <div>
        <span class="metric-label">${t("totalSequences")}</span>
        <strong>${state.references.length}</strong>
      </div>
      <div>
        <span class="metric-label">${t("coveredSegments")}</span>
        <strong>VP1 ${vp1Count} / RdRp ${rdrpCount}</strong>
      </div>
      <div>
        <span class="metric-label">${t("softwareVersion")}</span>
        <strong>${APP_VERSION}</strong>
      </div>
    </div>
  `;
}

async function runTyping() {
  const queries = parseFasta(els.sequenceInput.value);
  if (!queries.length) {
    setEmptyMessage("noValidSequence");
    return;
  }

  const k = Number(els.kSize?.value) || Number(localStorage.getItem('nov_k')) || 13;
  const candidateLimit = Number(els.candidateLimit?.value) || Number(localStorage.getItem('nov_candidateLimit')) || 20;

  const options = {
    minOverlap: Number(els.minOverlap.value) || 100,
    thresholds: {
      VP1: Number(els.vp1Threshold.value) || 80,
      RdRp: Number(els.rdrpThreshold.value) || 85,
    },
    k,
    candidateLimit,
  };

  // UI: show progress and prevent double submit
  els.runButton.disabled = true;
  let processed = 0;
  els.summaryLine.textContent = `${t('typing')} (0/${queries.length})`;

  try {
    const results = [];
    for (let i = 0; i < queries.length; i += 1) {
      // process each sequence (typeQuery parallelizes segment ranks internally)
      const res = await typeQuery(queries[i], i, options);
      results.push(res);
      processed += 1;
      els.summaryLine.textContent = `${t('typing')} (${processed}/${queries.length})`;
    }

    state.results = results;
    state.selected = 0;
    renderResults();
    renderDetails(state.results[0]);
    els.downloadButton.disabled = false;
    els.summaryLine.textContent = t('completed', state.results.length);
  } catch (err) {
    setEmptyMessage('', String(err.message || err));
  } finally {
    els.runButton.disabled = false;
  }
}

async function typeQuery(query, index, options) {
  // parallelize per-segment ranking to save time per sequence
  const vpPromise = workerRankReferences(query.sequence, "VP1", options);
  const rdrpPromise = workerRankReferences(query.sequence, "RdRp", options);
  const [vpMatches, rdrpMatches] = await Promise.all([vpPromise, rdrpPromise]);
  const matches = { VP1: vpMatches, RdRp: rdrpMatches };

  const topVp1 = matches.VP1[0] || null;
  const topRdrp = matches.RdRp[0] || null;
  const vp1Pass = passes(topVp1, options.thresholds.VP1, options.minOverlap);
  const rdrpPass = passes(topRdrp, options.thresholds.RdRp, options.minOverlap);
  const variantCall = buildGii4VariantCall(topVp1, vp1Pass, options.minOverlap);

  return {
    id: query.name || `sequence-${index + 1}`,
    length: query.sequence.length,
    matches,
    topVp1,
    topRdrp,
    vp1Call: vp1Pass ? topVp1.ref.genotype : "undetermined",
    rdrpCall: rdrpPass ? topRdrp.ref.genotype : "undetermined",
    variantCall,
    combinedCall: buildCombinedCall(vp1Pass ? topVp1.ref.genotype : "", rdrpPass ? topRdrp.ref.genotype : ""),
    status: buildStatus(vp1Pass, rdrpPass, topVp1, topRdrp),
  };
}

function buildGii4VariantCall(match, vp1Pass, minOverlap) {
  if (!vp1Pass || !match || match.ref.genotype !== "GII.4") return "notApplicable";
  if (match.ref.variant && match.identity >= GII4_VARIANT_THRESHOLD && match.overlap >= minOverlap) {
    return match.ref.variant;
  }
  return "variantUnassigned";
}

function rankReferences(sequence, segment, options) {
  return state.references
    .filter((ref) => ref.segment === segment)
    .map((ref) => bestOrientation(sequence, ref))
    .filter((match) => match.overlap >= Math.min(options.minOverlap, sequence.length, match.ref.sequence.length))
    .sort((a, b) => b.identity - a.identity || b.matches - a.matches || b.overlap - a.overlap)
    .slice(0, 5);
}

function bestOrientation(sequence, ref) {
  const forward = bestUngappedOverlap(sequence, ref.sequence);
  const reverse = bestUngappedOverlap(reverseComplement(sequence), ref.sequence);
  const best = reverse.identity > forward.identity ? reverse : forward;
  return {
    ...best,
    ref,
    direction: best === reverse ? "reverse" : "forward",
  };
}

function bestUngappedOverlap(query, ref) {
  let best = {
    identity: 0,
    matches: 0,
    compared: 0,
    overlap: 0,
    offset: 0,
    signature: [],
  };
  const minUseful = Math.min(60, query.length, ref.length);

  for (let offset = -ref.length + minUseful; offset <= query.length - minUseful; offset += 1) {
    const qStart = Math.max(0, offset);
    const rStart = Math.max(0, -offset);
    const overlap = Math.min(query.length - qStart, ref.length - rStart);
    if (overlap < minUseful) continue;

    let matches = 0;
    let compared = 0;
    const signature = [];

    for (let i = 0; i < overlap; i += 1) {
      const qBase = query[qStart + i];
      const rBase = ref[rStart + i];
      if (qBase === "-" || rBase === "-") {
        signature.push("gap");
        continue;
      }
      compared += 1;
      if (basesCompatible(qBase, rBase)) {
        matches += 1;
        signature.push("match");
      } else {
        signature.push("miss");
      }
    }

    const identity = compared ? (matches / compared) * 100 : 0;
    if (
      identity > best.identity ||
      (identity === best.identity && compared > best.compared) ||
      (identity === best.identity && compared === best.compared && overlap > best.overlap)
    ) {
      best = { identity, matches, compared, overlap, offset, signature };
    }
  }

  return best;
}

function basesCompatible(a, b) {
  const aSet = IUPAC[a] || "";
  const bSet = IUPAC[b] || "";
  if (!aSet || !bSet) return false;
  return [...aSet].some((base) => bSet.includes(base));
}

function reverseComplement(sequence) {
  return [...sequence]
    .reverse()
    .map((base) => COMPLEMENT[base] || "N")
    .join("");
}

function passes(match, threshold, minOverlap) {
  return Boolean(match && match.identity >= threshold && match.overlap >= minOverlap);
}

function buildCombinedCall(vp1, rdrp) {
  if (vp1 && rdrp) return `${rdrp}_${vp1}`;
  return vp1 || rdrp || "undetermined";
}

function buildStatus(vp1Pass, rdrpPass, topVp1, topRdrp) {
  if (vp1Pass && rdrpPass) return { key: "pass", tone: "good" };
  if (vp1Pass || rdrpPass) return { key: "singleSegmentPass", tone: "warn" };
  if ((topVp1?.overlap || 0) < 100 && (topRdrp?.overlap || 0) < 100) {
    return { key: "insufficientOverlap", tone: "bad" };
  }
  return { key: "lowSimilarity", tone: "bad" };
}

function renderResults() {
  els.summaryLine.textContent = t("completed", state.results.length);
  els.resultBody.innerHTML = state.results
    .map(
      (result, index) => `
        <tr data-index="${index}">
          <td><strong>${escapeHtml(result.id)}</strong><br><span class="muted">${result.length} nt</span></td>
          <td><span class="tag ${result.status.tone}">${escapeHtml(formatCall(result.combinedCall))}</span></td>
          <td>${formatVariant(result.variantCall)}</td>
          <td>${formatMatch(result.topVp1, "VP1")}</td>
          <td>${formatMatch(result.topRdrp, "RdRp")}</td>
          <td>${escapeHtml(formatDirection(result.topVp1 || result.topRdrp))}</td>
          <td><span class="tag ${result.status.tone}">${t(result.status.key)}</span></td>
        </tr>
      `,
    )
    .join("");

  els.resultBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      state.selected = Number(row.dataset.index);
      renderDetails(state.results[state.selected]);
    });
  });
}

function formatMatch(match, segment) {
  if (!match) return `<span class="tag bad">${t("noHit", segment)}</span>`;
  return `
    <strong>${escapeHtml(match.ref.genotype)}</strong><br>
    <span class="muted">${match.identity.toFixed(2)}% / ${match.overlap} nt</span>
  `;
}

function formatCall(call) {
  return call === "undetermined" ? t("undetermined") : call;
}

function formatVariant(variant) {
  if (variant === "notApplicable") return `<span class="muted">${t("notApplicable")}</span>`;
  if (variant === "variantUnassigned") return `<span class="tag warn">${t("variantUnassigned")}</span>`;
  return `<span class="tag good">${escapeHtml(variant)}</span>`;
}

function formatDirection(match) {
  if (!match) return "-";
  return match.direction === "reverse" ? t("reverse") : t("forward");
}

function renderDetails(result) {
  if (!result) {
    els.detailArea.innerHTML = "";
    return;
  }

  els.detailArea.innerHTML = `
    <div class="detail-grid">
      ${renderMatchBox(t("candidates", "VP1"), result.matches.VP1)}
      ${renderMatchBox(t("candidates", "RdRp"), result.matches.RdRp)}
    </div>
    ${renderVariantBox(result.matches.VP1)}
    ${renderSignature(result.topVp1 || result.topRdrp)}
  `;
}

function renderMatchBox(title, matches) {
  const body = matches.length
    ? matches
        .map(
          (match) => `
          <li>
            <div class="score">${match.identity.toFixed(2)}%</div>
            <div class="ref-title">
              <strong>${escapeHtml(match.ref.genotype)}</strong>
              ${match.ref.variant ? `<br><span class="muted">${escapeHtml(match.ref.variant)}</span>` : ""}
              <br>${escapeHtml(match.ref.name)}
              <br>${match.overlap} nt, ${match.matches}/${match.compared}, ${formatDirection(match)}
            </div>
          </li>
        `,
        )
        .join("")
    : `<li><div class="score">-</div><div class="ref-title">${t("noCandidates")}</div></li>`;

  return `
    <article class="match-box">
      <h3>${title}</h3>
      <ul class="match-list">${body}</ul>
    </article>
  `;
}

function renderVariantBox(matches) {
  const gii4Matches = matches.filter((match) => match.ref.genotype === "GII.4" && match.ref.variant).slice(0, 5);
  if (!gii4Matches.length) return "";
  const body = gii4Matches
    .map(
      (match) => `
        <li>
          <div class="score">${match.identity.toFixed(2)}%</div>
          <div class="ref-title">
            <strong>${escapeHtml(match.ref.variant)}</strong>
            <br>${escapeHtml(match.ref.name)}
            <br>${match.overlap} nt, ${match.matches}/${match.compared}, ${formatDirection(match)}
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <article class="match-box variant-box">
      <h3>${t("variantCandidates")}</h3>
      <ul class="match-list">${body}</ul>
    </article>
  `;
}

function renderSignature(match) {
  if (!match) return "";
  const sampled = sampleSignature(match.signature, 80);
  return `
    <div class="mini-bars" title="${t("signatureTitle")}">
      ${sampled.map((value) => `<span class="${value}"></span>`).join("")}
    </div>
  `;
}

function sampleSignature(signature, size) {
  if (!signature.length) return Array(size).fill("gap");
  return Array.from({ length: size }, (_, index) => {
    const start = Math.floor((index / size) * signature.length);
    const end = Math.max(start + 1, Math.floor(((index + 1) / size) * signature.length));
    const slice = signature.slice(start, end);
    const matches = slice.filter((item) => item === "match").length;
    const misses = slice.filter((item) => item === "miss").length;
    if (matches >= misses && matches > 0) return "match";
    if (misses > 0) return "miss";
    return "gap";
  });
}

function setEmptyMessage(key, fallback = "") {
  state.emptyKey = key;
  state.emptyMessage = fallback;
  const message = key ? t(key) : fallback;
  els.summaryLine.textContent = message;
  els.resultBody.innerHTML = `<tr><td colspan="7" class="empty-state">${escapeHtml(message)}</td></tr>`;
  els.detailArea.innerHTML = "";
}

function loadExampleSequence() {
  const example = state.references.find((ref) => ref.segment === "VP1" && ref.genotype === "GII.4") ||
    state.references.find((ref) => ref.segment === "VP1") ||
    state.references[0];
  if (example) {
    els.sequenceInput.value = `>example-${example.genotype}\n${example.sequence}`;
  }
}

async function readFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  els.sequenceInput.value = await file.text();
}

function downloadCsv() {
  const rows = [
    [
      "sample",
      "combined",
      "gii4_variant",
      "vp1",
      "vp1_identity",
      "vp1_overlap",
      "rdrp",
      "rdrp_identity",
      "rdrp_overlap",
      "status",
    ],
    ...state.results.map((result) => [
      result.id,
      formatCall(result.combinedCall),
      formatVariantText(result.variantCall),
      formatCall(result.vp1Call),
      result.topVp1?.identity.toFixed(2) || "",
      result.topVp1?.overlap || "",
      formatCall(result.rdrpCall),
      result.topRdrp?.identity.toFixed(2) || "",
      result.topRdrp?.overlap || "",
      t(result.status.key),
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `norovirus-typing-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatVariantText(variant) {
  if (variant === "notApplicable") return t("notApplicable");
  if (variant === "variantUnassigned") return t("variantUnassigned");
  return variant;
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function setLanguage(lang) {
  state.lang = I18N[lang] ? lang : "zh";
  localStorage.setItem("novTypingLang", state.lang);
  applyLanguage();
  renderLibraryStatus();
  renderLibraryStrip();
  if (state.results.length) {
    renderResults();
    renderDetails(state.results[state.selected]);
  } else if (state.emptyKey || state.emptyMessage) {
    setEmptyMessage(state.emptyKey, state.emptyMessage);
  }
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  els.languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  if (!state.references.length) {
    els.libraryStatus.textContent = t("loading");
    els.summaryLine.textContent = t("waiting");
  }
}

// attach worker timing display (optional)
worker?.addEventListener?.('message', (e) => {
  const msg = e.data;
  if (msg.type === 'initDone') {
    console.info('Worker index built in', msg.duration, 'ms');
  }
  if (msg.type === 'rankResult') {
    // can log durations for profiling
    // console.debug('Ranked in', msg.duration, 'ms');
  }
});

function renderLibraryStatus() {
  if (!state.references.length) {
    els.libraryStatus.textContent = t("loading");
    return;
  }
  els.libraryStatus.textContent = `${state.references.length} ${t("sequenceUnit")} · ${DATABASE_VERSION}`;
}

function t(key, ...args) {
  const value = I18N[state.lang]?.[key] ?? I18N.zh[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
