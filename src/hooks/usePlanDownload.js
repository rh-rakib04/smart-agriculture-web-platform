'use client';

import { useState } from 'react';

const FERTILIZER_LABELS_EN = {
  urea:         'Urea',
  tsp:          'TSP',
  mop:          'MOP',
  gypsum:       'Gypsum',
  boron:        'Boron',
  zinc_sulfate: 'Zinc Sulfate',
};

const FERTILIZER_LABELS_BN = {
  urea:         'ইউরিয়া',
  tsp:          'টিএসপি',
  mop:          'এমওপি',
  gypsum:       'জিপসাম',
  boron:        'বোরন',
  zinc_sulfate: 'জিংক সালফেট',
};

const CATEGORY_LABELS = {
  land:       'Land Prep',
  sowing:     'Sowing',
  transplant: 'Transplant',
  fertilizer: 'Fertilizer',
  irrigation: 'Irrigation',
  weeding:    'Weeding',
  pest:       'Pest Control',
  harvest:    'Harvest',
  retting:    'Retting',
  thinning:   'Thinning',
  earthing:   'Earthing',
};

/** Returns true if string contains any Bengali Unicode characters */
function hasBengali(str) {
  return str && /[\u0980-\u09FF]/.test(str);
}

/**
 * Strip Bengali characters from a string, leaving only Latin/ASCII.
 * Used to extract the English portion of mixed strings like "খারিফ-২ (Kharif-2)".
 */
function stripBengali(str) {
  if (!str) return '';
  // Remove Bengali chars and clean up extra spaces/parens
  return str
    .replace(/[\u0980-\u09FF]+/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extract only the Bengali portion of a mixed string.
 * e.g. "খারিফ-২ (Kharif-2)" → "খারিফ-২"
 */
function extractBengali(str) {
  if (!str) return '';
  // Match sequences of Bengali chars (and digits/hyphens between them)
  const matches = str.match(/[\u0980-\u09FF][\u0980-\u09FF\u09E6-\u09EF\s\-]*/g);
  return matches ? matches.join(' ').trim() : '';
}

/**
 * Render text onto an offscreen canvas and embed as PNG into jsPDF.
 * Uses the browser's font stack which natively supports Bengali shaping.
 *
 * @param {object} doc       - jsPDF instance
 * @param {string} text      - text to render (Bengali or mixed)
 * @param {number} x         - left position in mm
 * @param {number} y         - baseline position in mm (jsPDF coords)
 * @param {number} fontSizePt - font size in points
 * @param {number[]} rgb     - [r, g, b] color
 * @param {number} maxMM     - max width in mm (clips canvas)
 */
function canvasDraw(doc, text, x, y, fontSizePt, rgb, maxMM) {
  if (!text) return;

  const DPI    = 96;
  const MM2PX  = DPI / 25.4;          // 3.7795 px per mm
  const SCALE  = 3;                   // supersampling

  const fontPx   = fontSizePt * (DPI / 72) * SCALE;
  const padV     = 4 * SCALE;
  const lineH    = fontPx + padV * 2;
  const maxPx    = maxMM * MM2PX * SCALE;
  const fontStack = `${fontPx}px 'Noto Sans Bengali','Hind Siliguri','Vrinda','SolaimanLipi',sans-serif`;

  // Measure first
  const tmp    = document.createElement('canvas');
  const tCtx   = tmp.getContext('2d');
  tCtx.font    = fontStack;
  const rawW   = tCtx.measureText(text).width + 6 * SCALE;
  const width  = Math.min(rawW, maxPx);

  const canvas = document.createElement('canvas');
  canvas.width  = width;
  canvas.height = lineH;
  const ctx     = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, lineH);
  ctx.fillStyle    = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  ctx.font         = fontStack;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, 2 * SCALE, fontPx + padV);

  const dataUrl = canvas.toDataURL('image/png');

  // Convert px → mm for jsPDF
  const wMM = width   / (MM2PX * SCALE);
  const hMM = lineH   / (MM2PX * SCALE);

  // y offset: shift up so image baseline aligns with jsPDF text baseline
  const offsetY = hMM * 0.82;
  doc.addImage(dataUrl, 'PNG', x, y - offsetY, wMM, hMM);
}

/**
 * Safe value printer: if value contains Bengali, split into
 * English part (drawn via jsPDF) + Bengali part (drawn via canvas).
 * If purely English, just use jsPDF text.
 *
 * @returns next y position
 */
function safeText(doc, margin, y, label, value, extraBn, colValueX) {
  const vx = colValueX ?? margin + 55;

  // Label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(label, margin, y);

  const valStr = String(value ?? '');

  if (hasBengali(valStr)) {
    // Split: draw English part via jsPDF, Bengali via canvas
    const enPart = stripBengali(valStr);
    const bnPart = extractBengali(valStr);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 30, 32);
    if (enPart) {
      doc.text(enPart, vx, y);
      const enW = doc.getStringUnitWidth(enPart) * 9 / doc.internal.scaleFactor;
      if (bnPart) canvasDraw(doc, ` ${bnPart}`, vx + enW, y, 9, [27, 30, 32], 80);
    } else if (bnPart) {
      canvasDraw(doc, bnPart, vx, y, 9, [27, 30, 32], 100);
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(27, 30, 32);
    doc.text(valStr, vx, y);
  }

  // Optional extra Bengali suffix (e.g. "(বিঘা)" after a number)
  if (extraBn) {
    const enW = doc.getStringUnitWidth(hasBengali(valStr) ? stripBengali(valStr) : valStr) * 9 / doc.internal.scaleFactor;
    canvasDraw(doc, ` (${extraBn})`, vx + enW, y, 9, [90, 90, 90], 60);
  }

  return y + 6.5;
}

// ─────────────────────────────────────────────────────────────────────────────

export function usePlanDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async (plan) => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');

      const doc    = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageW  = doc.internal.pageSize.getWidth();
      const pageH  = doc.internal.pageSize.getHeight();
      const margin = 14;
      const colW   = pageW - margin * 2;
      let y        = margin;

      const checkPage = (needed = 10) => {
        if (y + needed > pageH - margin) { doc.addPage(); y = margin; }
      };

      const sectionTitle = (text) => {
        checkPage(14);
        doc.setFillColor(46, 125, 50);
        doc.roundedRect(margin, y, colW, 8, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(text, margin + 3, y + 5.5);
        y += 11;
      };

      const divider = () => {
        checkPage(4);
        doc.setDrawColor(200, 230, 201);
        doc.setLineWidth(0.2);
        doc.line(margin, y, margin + colW, y);
        y += 3;
      };

      // ── Header ───────────────────────────────────────────────────────────
      doc.setFillColor(46, 125, 50);
      doc.rect(0, 0, pageW, 30, 'F');
      doc.setFillColor(102, 187, 106);
      doc.rect(0, 26, pageW, 4, 'F');

      // "Smart Farm Plan" title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Smart Farm Plan', margin, 13);

      // Bengali crop name next to title via canvas
      canvasDraw(doc, plan.crop.nameBn, margin + 82, 13, 14, [255, 255, 255], 55);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(200, 230, 201);
      doc.text(
        `${plan.crop.name}  ·  ${plan.location.district}${plan.location.upazila ? ', ' + plan.location.upazila : ''}  ·  Generated ${new Date().toLocaleDateString('en-GB')}`,
        margin, 21
      );

      y = 38;

      // ── Crop & Season ────────────────────────────────────────────────────
      sectionTitle('Crop & Season');
      // Crop: English name + Bengali name side by side
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
      doc.text('Crop', margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(27, 30, 32);
      doc.text(plan.crop.name, margin + 55, y);
      const cropEnW = doc.getStringUnitWidth(plan.crop.name) * 9 / doc.internal.scaleFactor;
      canvasDraw(doc, ` (${plan.crop.nameBn})`, margin + 55 + cropEnW, y, 9, [80, 80, 80], 55);
      y += 6.5;

      // Season: strip Bengali from the season string, show English in brackets
      // plan.crop.season might be "খারিফ-২ (Kharif-2)" — render Bengali via canvas, English via jsPDF
      y = safeText(doc, margin, y, 'Season',       plan.crop.season);
      y = safeText(doc, margin, y, 'Variety',       plan.crop.variety);
      y = safeText(doc, margin, y, 'Planting Date', new Date(plan.dates.planting).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
      y = safeText(doc, margin, y, 'Harvest Date',  new Date(plan.dates.harvest).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
      y = safeText(doc, margin, y, 'Duration',      `${plan.dates.duration} days`);
      y += 3;

      // ── Location & Land ──────────────────────────────────────────────────
      sectionTitle('Location & Land');
      y = safeText(doc, margin, y, 'District',  plan.location.district);
      if (plan.location.upazila) y = safeText(doc, margin, y, 'Upazila', plan.location.upazila);
      // Land size: may contain Bengali unit — split it
      y = safeText(doc, margin, y, 'Land Size', plan.land.displaySize);
      // Bigha: plain number + Bengali suffix
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
      doc.text('In Bigha', margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(27, 30, 32);
      doc.text(`${plan.land.sizeInBigha}`, margin + 55, y);
      const bighaW = doc.getStringUnitWidth(`${plan.land.sizeInBigha}`) * 9 / doc.internal.scaleFactor;
      canvasDraw(doc, ' (বিঘা)', margin + 55 + bighaW, y, 9, [90, 90, 90], 25);
      y += 6.5;
      // Condition: strip Bengali if mixed, show clean English
      y = safeText(doc, margin, y, 'Condition', plan.land.condition);
      y += 3;

      // ── Estimated Yield ──────────────────────────────────────────────────
      sectionTitle('Estimated Yield');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
      doc.text('Yield', margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(27, 30, 32);
      doc.text(`${plan.yield.maund}`, margin + 55, y);
      const maundW = doc.getStringUnitWidth(`${plan.yield.maund}`) * 9 / doc.internal.scaleFactor;
      canvasDraw(doc, ' (মণ)', margin + 55 + maundW, y, 9, [90, 90, 90], 20);
      y += 6.5;
      y = safeText(doc, margin, y, 'Yield (kg)', `${plan.yield.kg} kg`);
      y += 3;

      // ── Input Requirements ───────────────────────────────────────────────
      sectionTitle('Input Requirements');
      y = safeText(doc, margin, y, 'Seed Required', `${plan.requirements.seed.amount} kg`);
      const seedNoteLines = doc.splitTextToSize(plan.requirements.seed.note, colW - 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
      seedNoteLines.forEach(line => { checkPage(5); doc.text(line, margin + 2, y); y += 4.5; });
      y += 1;
      divider();

      // Fertilizers — English name + Bengali in parens via canvas
      Object.entries(plan.requirements.fertilizer).forEach(([type, amt]) => {
        const enLabel = FERTILIZER_LABELS_EN[type] || type;
        const bnLabel = FERTILIZER_LABELS_BN[type] || '';
        const valStr  = `${amt} kg`;

        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(100, 100, 100);
        doc.text(enLabel, margin, y);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(27, 30, 32);
        doc.text(valStr, margin + 55, y);
        if (bnLabel) {
          const vW = doc.getStringUnitWidth(valStr) * 9 / doc.internal.scaleFactor;
          canvasDraw(doc, ` (${bnLabel})`, margin + 55 + vW, y, 9, [90, 90, 90], 40);
        }
        y += 6.5;
      });
      divider();

      y = safeText(doc, margin, y, 'Irrigation', `${plan.requirements.irrigation.count} times`);
      const irrLines = doc.splitTextToSize(plan.requirements.irrigation.note, colW - 4);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
      irrLines.forEach(line => { checkPage(5); doc.text(line, margin + 2, y); y += 4.5; });
      y += 1;
      divider();

      y = safeText(doc, margin, y, 'Pesticide Budget', `BDT ${plan.requirements.pesticideCost.amount}`);
      y += 3;

      // ── Fertilizer Schedule ──────────────────────────────────────────────
      sectionTitle('Fertilizer Schedule');
      plan.requirements.fertilizerSchedule.forEach((item) => {
        checkPage(18);
        const dateStr = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        const fertEn  = FERTILIZER_LABELS_EN[item.fertilizer] || item.fertilizer;
        const fertBn  = FERTILIZER_LABELS_BN[item.fertilizer] || '';

        // Date badge
        doc.setFillColor(232, 245, 233);
        doc.roundedRect(margin, y, 26, 6.5, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(46, 125, 50);
        doc.text(dateStr, margin + 1.5, y + 4.5);

        // Fertilizer line: "TSP — 99 kg (টিএসপি)"
        const fertLine = `${fertEn} — ${item.amount} ${item.unit}`;
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(27, 30, 32);
        doc.text(fertLine, margin + 29, y + 4.5);
        if (fertBn) {
          const fW = doc.getStringUnitWidth(fertLine) * 9 / doc.internal.scaleFactor;
          canvasDraw(doc, ` (${fertBn})`, margin + 29 + fW, y + 4.5, 8.5, [90, 90, 90], 40);
        }
        y += 9;

        const descLines = doc.splitTextToSize(item.description, colW - 6);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        descLines.forEach(line => { checkPage(5); doc.text(line, margin + 3, y); y += 4.5; });
        y += 4;
      });

      // ── Weekly Timeline ──────────────────────────────────────────────────
      sectionTitle('Weekly Task Timeline');
      const tasksByWeek = plan.timeline.reduce((acc, task) => {
        if (!acc[task.week]) acc[task.week] = [];
        acc[task.week].push(task);
        return acc;
      }, {});
      Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b).forEach(week => {
        const tasks = tasksByWeek[week];
        checkPage(14);

        doc.setFillColor(232, 245, 233);
        doc.roundedRect(margin, y, colW, 7, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(46, 125, 50);
        doc.text(`Week ${week}${week === 0 ? ' — Start' : ''}  ·  ${tasks.length} task${tasks.length > 1 ? 's' : ''}`, margin + 3, y + 5);
        y += 10;

        tasks.forEach(task => {
          checkPage(9);
          const dateStr  = new Date(task.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
          const catLabel = CATEGORY_LABELS[task.category] || task.category;

          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
          doc.text(`${dateStr}  [${catLabel}]`, margin + 4, y);

          doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(27, 30, 32);
          const taskLines = doc.splitTextToSize(task.task, colW - 52);
          taskLines.forEach((line, li) => {
            checkPage(5);
            if (li === 0) doc.text(line, margin + 52, y);
            else { y += 4.5; doc.text(line, margin + 52, y); }
          });
          y += 6;
        });
        y += 2;
      });

      // ── Advisory ────────────────────────────────────────────────────────
      sectionTitle('Expert Advisory');
      plan.advisory.forEach((tip, i) => {
        checkPage(14);
        const lines = doc.splitTextToSize(`${i + 1}. ${tip}`, colW - 4);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(27, 30, 32);
        lines.forEach(line => { checkPage(5); doc.text(line, margin + 2, y); y += 5; });
        y += 2;
      });

      // ── Footer every page ────────────────────────────────────────────────
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(46, 125, 50);
        doc.rect(0, pageH - 10, pageW, 10, 'F');
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(200, 230, 201);
        doc.text('Smart Farm Planner · Bangladesh DAE Agricultural Guidelines', margin, pageH - 4);
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 4, { align: 'right' });
      }

      const filename = `farm-plan-${plan.crop.name.toLowerCase().replace(/\s+/g, '-')}-${plan.location.district.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      doc.save(filename);

    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPDF, isDownloading };
}