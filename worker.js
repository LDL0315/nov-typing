// Web Worker for accelerated ranking with k-mer prefilter
let references = [];
const IUPAC = {
  A: "A", C: "C", G: "G", T: "T", U: "T",
  R: "AG", Y: "CT", S: "GC", W: "AT", K: "GT", M: "AC",
  B: "CGT", D: "AGT", H: "ACT", V: "ACG", N: "ACGT",
};
const COMPLEMENT = { A: "T", C: "G", G: "C", T: "A", U: "A", R: "Y", Y: "R", S: "S", W: "W", K: "M", M: "K", B: "V", D: "H", H: "D", V: "B", N: "N" };

let k = 13; // k-mer size (default)
let candidateLimit = 20; // default number of candidates to test
let index = new Map(); // kmer -> Map of refIdx -> count

self.addEventListener('message', (e) => {
  const msg = e.data;
  if (msg.type === 'init') {
    references = msg.references || [];
    if (msg.options && msg.options.k) k = msg.options.k;
    if (msg.options && msg.options.candidateLimit) candidateLimit = msg.options.candidateLimit;
    const start = Date.now();
    buildIndex();
    const duration = Date.now() - start;
    self.postMessage({ type: 'initDone', duration });
  }
  if (msg.type === 'rank') {
    const { requestId, sequence, segment, options } = msg;
    if (options && options.k && options.k !== k) {
      k = options.k;
      buildIndex();
    }
    if (options && options.candidateLimit) candidateLimit = options.candidateLimit;
    const start = Date.now();
    const matches = rankRefs(sequence, segment, options || {});
    const duration = Date.now() - start;
    self.postMessage({ type: 'rankResult', requestId, matches, duration });
  }
});

function buildIndex() {
  index = new Map();
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    const seq = (ref.sequence || '').toUpperCase();
    for (let j = 0; j + k <= seq.length; j++) {
      const mer = seq.slice(j, j + k);
      if (!/^[ACGT]+$/.test(mer)) continue;
      let entry = index.get(mer);
      if (!entry) { entry = new Map(); index.set(mer, entry); }
      entry.set(i, (entry.get(i) || 0) + 1);
    }
  }
}

function rankRefs(query, segment, options) {
  const q = (query || '').toUpperCase();
  const counts = new Map(); // refIndex -> shared kmer count
  countSharedKmers(q, segment, counts);
  countSharedKmers(reverseComplement(q), segment, counts);

  // choose top candidates by shared k-mers
  const candidates = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, candidateLimit).map((x) => x[0]);
  // fallback: if no candidates, try all refs of that segment so short or ambiguous queries still work.
  if (candidates.length === 0) {
    for (let i = 0; i < references.length; i++) {
      if (references[i].segment === segment) candidates.push(i);
    }
  }

  const results = [];
  const minOverlap = Number(options.minOverlap) || 100;
  for (const idx of candidates) {
    const ref = references[idx];
    const forward = bestUngappedOverlap(q, ref.sequence);
    const reverse = bestUngappedOverlap(reverseComplement(q), ref.sequence);
    const best = reverse.identity > forward.identity ? reverse : forward;
    const requiredOverlap = Math.min(minOverlap, q.length, ref.sequence.length);
    if (best.overlap >= requiredOverlap) {
      results.push({ ...best, ref: { ...ref }, direction: best === reverse ? 'reverse' : 'forward' });
    }
  }

  return results.sort((a, b) => b.identity - a.identity || b.matches - a.matches || b.overlap - a.overlap).slice(0, 5);
}

function countSharedKmers(sequence, segment, counts) {
  for (let j = 0; j + k <= sequence.length; j++) {
    const mer = sequence.slice(j, j + k);
    const entry = index.get(mer);
    if (!entry) continue;
    for (const [refIdx] of entry.entries()) {
      const ref = references[refIdx];
      if (ref.segment !== segment) continue;
      counts.set(refIdx, (counts.get(refIdx) || 0) + 1);
    }
  }
}

function bestUngappedOverlap(query, refSeq) {
  let best = { identity: 0, matches: 0, compared: 0, overlap: 0, offset: 0, signature: [] };
  const qlen = query.length;
  const rlen = refSeq.length;
  const minUseful = Math.min(60, qlen, rlen);
  for (let offset = -rlen + minUseful; offset <= qlen - minUseful; offset++) {
    const qStart = Math.max(0, offset);
    const rStart = Math.max(0, -offset);
    const overlap = Math.min(qlen - qStart, rlen - rStart);
    if (overlap < minUseful) continue;
    let matches = 0, compared = 0;
    const signature = [];
    for (let i = 0; i < overlap; i++) {
      const qBase = query[qStart + i];
      const rBase = refSeq[rStart + i];
      if (qBase === '-' || rBase === '-') { signature.push('gap'); continue; }
      compared += 1;
      if (basesCompatible(qBase, rBase)) { matches += 1; signature.push('match'); } else { signature.push('miss'); }
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
  const aSet = IUPAC[a] || '';
  const bSet = IUPAC[b] || '';
  if (!aSet || !bSet) return false;
  for (const base of aSet) if (bSet.includes(base)) return true;
  return false;
}

function reverseComplement(sequence) {
  return Array.from(sequence).reverse().map((base) => COMPLEMENT[base] || 'N').join('');
}
