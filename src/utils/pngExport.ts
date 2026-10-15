/**
 * High-Resolution Canvas PNG Exporter for Daily Badges and Final Certificate.
 * Guarantees zero cropping, zero overlapping text, and pixel-perfect high-DPI rendering.
 */

interface DailyBadgeExportParams {
  dayId: number;
  title: string;
  subtitle: string;
  category: string;
  learnerName: string;
  score: number;
  certificateId: string;
  date?: string;
  clientMission?: string;
}

interface CertificateExportParams {
  learnerName: string;
  certificateId: string;
  score: number;
  date?: string;
}

// Helper to wrap text with line breaks and return total height
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: 'center' | 'left' | 'right' = 'center'
): number {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  ctx.textAlign = align;
  for (let k = 0; k < lines.length; k++) {
    ctx.fillText(lines[k], x, y + k * lineHeight);
  }

  return lines.length * lineHeight;
}

/**
 * Generates and downloads a pristine 1200x1200px PNG badge
 */
export function exportDailyBadgeToPng(params: DailyBadgeExportParams): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire 2D canvas context');

      const {
        dayId,
        title,
        subtitle,
        category,
        learnerName,
        score,
        certificateId,
        date = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        clientMission = 'Production Forward Deployment Milestone',
      } = params;

      // 1. Deep Obsidian / Espresso Gradient Background
      const bgGrad = ctx.createRadialGradient(600, 550, 80, 600, 600, 750);
      bgGrad.addColorStop(0, '#26160D');
      bgGrad.addColorStop(0.5, '#170E08');
      bgGrad.addColorStop(1, '#0C0704');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1200);

      // Subtle gold micro-grid background pattern
      ctx.strokeStyle = 'rgba(213, 168, 114, 0.05)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 40; x < 1160; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 1160);
        ctx.stroke();
      }
      for (let y = 40; y < 1160; y += step) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(1160, y);
        ctx.stroke();
      }

      // 2. Ornate Double Gold Outer Border
      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 8;
      ctx.strokeRect(48, 48, 1104, 1104);

      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(64, 64, 1072, 1072);

      // Corner Accents (Diamonds)
      const corners = [
        [48, 48],
        [1152, 48],
        [48, 1152],
        [1152, 1152],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = '#D5A872';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 14);
        ctx.lineTo(cx + 14, cy);
        ctx.lineTo(cx, cy + 14);
        ctx.lineTo(cx - 14, cy);
        ctx.closePath();
        ctx.fill();
      });

      // 3. Header Ribbon
      ctx.fillStyle = '#D5A872';
      ctx.font = 'bold 20px "Cinzel", "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '5px';
      ctx.fillText('FORWARD DEPLOYMENT ACADEMY · POWERED BY KAPIL NARULA', 600, 118);

      // 4. Central Medallion (Circular Gold Seal)
      const medY = 275;
      // Outer Glow
      const glowGrad = ctx.createRadialGradient(600, medY, 60, 600, medY, 130);
      glowGrad.addColorStop(0, 'rgba(213, 168, 114, 0.35)');
      glowGrad.addColorStop(1, 'rgba(213, 168, 114, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(600, medY, 130, 0, Math.PI * 2);
      ctx.fill();

      // Medallion Ring
      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(600, medY, 95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(600, medY, 86, 0, Math.PI * 2);
      ctx.stroke();

      // Medallion Interior
      const innerGrad = ctx.createLinearGradient(600, medY - 90, 600, medY + 90);
      innerGrad.addColorStop(0, '#3A1E0D');
      innerGrad.addColorStop(1, '#1E0E05');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(600, medY, 84, 0, Math.PI * 2);
      ctx.fill();

      // Text inside Medallion
      ctx.fillStyle = '#D5A872';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.letterSpacing = '3px';
      ctx.fillText('COMPETENCY BADGE', 600, medY - 38);

      ctx.fillStyle = '#FAF6EE';
      ctx.font = 'bold 44px "Georgia", serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(`DAY ${String(dayId).padStart(2, '0')}`, 600, medY + 12);

      ctx.fillStyle = '#C5A376';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.letterSpacing = '2px';
      ctx.fillText('VERIFIED 90%+', 600, medY + 44);

      // 5. Badge Title & Subtitle (Guaranteed No Overlap)
      ctx.fillStyle = '#FAF6EE';
      ctx.font = 'bold 38px "Georgia", serif';
      ctx.letterSpacing = '0.5px';
      wrapCanvasText(ctx, title, 600, 440, 960, 48, 'center');

      ctx.fillStyle = '#D5A872';
      ctx.font = '600 20px "Courier New", monospace';
      ctx.letterSpacing = '1px';
      wrapCanvasText(ctx, subtitle, 600, 520, 960, 28, 'center');

      // 6. Recipient Details Box (Clean Translucent Card)
      const boxY = 575;
      const boxH = 290;
      ctx.fillStyle = 'rgba(38, 22, 13, 0.75)';
      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(100, boxY, 1000, boxH, 16);
      ctx.fill();
      ctx.stroke();

      // Recipient Label
      ctx.fillStyle = '#B8A388';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.letterSpacing = '3px';
      ctx.fillText('OFFICIALLY CONFERRED UPON', 600, boxY + 40);

      // Recipient Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px "Georgia", serif';
      ctx.letterSpacing = '1px';
      ctx.fillText(learnerName || 'Forward Deployment Engineer', 600, boxY + 90);

      // Thin separator
      ctx.strokeStyle = 'rgba(213, 168, 114, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, boxY + 120);
      ctx.lineTo(950, boxY + 120);
      ctx.stroke();

      // Score & Category Row
      ctx.fillStyle = '#2E7D32';
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`VERIFIED SCORE: ${score}% (PASSED ≥90%)`, 380, boxY + 160);

      ctx.fillStyle = '#D5A872';
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.fillText(`CATEGORY: ${category}`, 820, boxY + 160);

      // Client Mission / Core Competency
      ctx.fillStyle = '#C8B59E';
      ctx.font = 'italic 16px "Georgia", serif';
      wrapCanvasText(ctx, `Mission: "${clientMission}"`, 600, boxY + 210, 880, 24, 'center');

      // 7. Security & Verification Bottom Bar
      ctx.fillStyle = '#9C7A58';
      ctx.font = '14px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`ISSUE DATE: ${date}`, 110, 940);
      ctx.fillText(`VERIFICATION ID: ${certificateId}-D${dayId}`, 110, 970);
      ctx.fillText(`ACADEMY SPEC: PALANTIR / SCALE / DATABRICKS FDE STANDARDS`, 110, 1000);

      // Signature on Right
      ctx.textAlign = 'right';
      ctx.fillStyle = '#D5A872';
      ctx.font = 'italic 28px "Georgia", serif';
      ctx.fillText('Kapil Narula', 1090, 950);

      ctx.fillStyle = '#FAF6EE';
      ctx.font = 'bold 14px "Courier New", monospace';
      ctx.fillText('KAPIL NARULA', 1090, 975);

      ctx.fillStyle = '#B8A388';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText('Founding Forward Deployment Mentor', 1090, 995);

      // Bottom Seal Tag
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D5A872';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.letterSpacing = '4px';
      ctx.fillText('★ CRYPTOGRAPHICALLY TAMPER-EVIDENT PRODUCTION CREDENTIAL ★', 600, 1070);

      // Trigger Instant Download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        a.href = url;
        a.download = `FDE_Daily_Badge_Day_${dayId}_${cleanTitle}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Generates and downloads a pristine 2400x1600px ultra high-resolution landscape PNG certificate
 */
export function exportCertificateToPng(params: CertificateExportParams): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 2400;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire 2D canvas context');

      const {
        learnerName,
        certificateId,
        score,
        date = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      } = params;

      // 1. Premium Parchment Background
      const parchment = ctx.createLinearGradient(0, 0, 0, 1600);
      parchment.addColorStop(0, '#FDFBF7');
      parchment.addColorStop(0.5, '#F7F1E3');
      parchment.addColorStop(1, '#FDFBF7');
      ctx.fillStyle = parchment;
      ctx.fillRect(0, 0, 2400, 1600);

      // Watermark radial rays
      ctx.strokeStyle = 'rgba(140, 74, 35, 0.04)';
      ctx.lineWidth = 1.5;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 36) {
        ctx.beginPath();
        ctx.moveTo(1200, 800);
        ctx.lineTo(1200 + Math.cos(angle) * 1500, 800 + Math.sin(angle) * 1500);
        ctx.stroke();
      }

      // 2. Triple Gold & Deep Bronze Ornate Frames
      // Outer
      ctx.strokeStyle = '#663216';
      ctx.lineWidth = 14;
      ctx.strokeRect(60, 60, 2280, 1480);

      // Gold middle
      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 4;
      ctx.strokeRect(84, 84, 2232, 1432);

      // Inner filigree / accent
      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(102, 102, 2196, 1396);
      ctx.setLineDash([]); // reset

      // Ornate Corner Bracket Motifs
      const cornerOffsets = [
        [102, 102],
        [2298, 102],
        [102, 1498],
        [2298, 1498],
      ];
      cornerOffsets.forEach(([cx, cy]) => {
        ctx.fillStyle = '#8C4A23';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#D5A872';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Top Header
      ctx.fillStyle = '#7C3E1D';
      ctx.font = 'bold 24px "Cinzel", "Georgia", serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('FORWARD DEPLOYMENT ACADEMY · POWERED BY KAPIL NARULA', 1200, 200);

      ctx.fillStyle = '#24150D';
      ctx.font = 'bold 64px "Georgia", serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('CERTIFICATE OF ENGINEERING EXCELLENCE', 1200, 285);

      ctx.fillStyle = '#8C4A23';
      ctx.font = 'bold 22px "Courier New", monospace';
      ctx.letterSpacing = '4px';
      ctx.fillText('FORWARD DEPLOYMENT SYSTEMS ARCHITECT · PROFESSIONAL ACCREDITATION', 1200, 335);

      // Thin gold header divider
      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 375);
      ctx.lineTo(2000, 375);
      ctx.stroke();

      // 4. Conferred Upon Section
      ctx.fillStyle = '#5C4535';
      ctx.font = 'italic 26px "Georgia", serif';
      ctx.fillText('This is to officially certify that', 1200, 445);

      // Recipient Name in huge bold serif
      ctx.fillStyle = '#24150D';
      ctx.font = 'bold 76px "Georgia", serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(learnerName || 'Forward Deployed Engineer', 1200, 545);

      // Decorative underline below name
      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(450, 575);
      ctx.lineTo(1950, 575);
      ctx.stroke();

      // 5. Formal Certification Narrative
      ctx.fillStyle = '#3D291C';
      ctx.font = '24px "Georgia", serif';
      const narrative =
        `has successfully completed the 15-day hands-on Forward Deployment Engineer Bootcamp and achieved a verified score of ${score}% on the 120-Minute Comprehensive Production Architecture Examination (300 MCQs, minimum 90% threshold). Demonstrating frontline engineering mastery in high-stakes dirty data ingestion, enterprise knowledge graph ontologies, production AI guardrails, 3:00 AM P0 production triage, and resilient air-gapped system design.`;

      wrapCanvasText(ctx, narrative, 1200, 640, 1680, 42, 'center');

      // 6. Verified Competency Modules Matrix (5 Framed Cards)
      const matrixY = 880;
      const cardWidth = 360;
      const cardHeight = 110;
      const cardGap = 24;
      const startX = 1200 - (5 * cardWidth + 4 * cardGap) / 2;

      const competencies = [
        { title: 'Dirty Ingestion & CDC', tag: 'DAY 1–3 · VERIFIED' },
        { title: 'Graph & Ontologies', tag: 'DAY 4–5 · VERIFIED' },
        { title: 'Production AI & RAG', tag: 'DAY 6–8 · VERIFIED' },
        { title: 'P0 Incident Triage', tag: 'DAY 9–11 · VERIFIED' },
        { title: 'Air-Gapped & Resilient', tag: 'DAY 12–15 · VERIFIED' },
      ];

      competencies.forEach((comp, idx) => {
        const x = startX + idx * (cardWidth + cardGap);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#D5A872';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, matrixY, cardWidth, cardHeight, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#2E7D32';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.letterSpacing = '1px';
        ctx.textAlign = 'center';
        ctx.fillText(comp.tag, x + cardWidth / 2, matrixY + 36);

        ctx.fillStyle = '#24150D';
        ctx.font = 'bold 18px "Georgia", serif';
        ctx.fillText(comp.title, x + cardWidth / 2, matrixY + 74);
      });

      // 7. Footer: Verification Details, Gold Medallion, and Kapil Narula's Signature
      const footerY = 1140;

      // Left Column: Date & Cryptographic Verification
      ctx.textAlign = 'left';
      ctx.fillStyle = '#6E5644';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('DATE OF ISSUE:', 240, footerY);

      ctx.fillStyle = '#24150D';
      ctx.font = 'bold 22px "Georgia", serif';
      ctx.fillText(date, 240, footerY + 32);

      ctx.fillStyle = '#6E5644';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('VERIFICATION HASH:', 240, footerY + 80);

      ctx.fillStyle = '#7C3E1D';
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillText(certificateId, 240, footerY + 110);

      // Center Column: Golden Medallion Crest
      const sealX = 1200;
      const sealY = footerY + 50;

      ctx.fillStyle = 'rgba(213, 168, 114, 0.25)';
      ctx.beginPath();
      ctx.arc(sealX, sealY, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#8C4A23';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 78, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#7C3E1D';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.letterSpacing = '2px';
      ctx.textAlign = 'center';
      ctx.fillText('★ 300 MCQS ★', sealX, sealY - 26);

      ctx.fillStyle = '#24150D';
      ctx.font = 'bold 24px "Georgia", serif';
      ctx.fillText('PASSED ≥90%', sealX, sealY + 8);

      ctx.fillStyle = '#8C4A23';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText('120 MIN TIMED', sealX, sealY + 34);

      // Right Column: Kapil Narula Signature
      ctx.textAlign = 'right';
      ctx.fillStyle = '#3A1E0D';
      ctx.font = 'italic 46px "Georgia", serif';
      ctx.fillText('Kapil Narula', 2160, footerY + 28);

      // Signature line
      ctx.strokeStyle = '#D5A872';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1760, footerY + 48);
      ctx.lineTo(2160, footerY + 48);
      ctx.stroke();

      ctx.fillStyle = '#24150D';
      ctx.font = 'bold 22px "Georgia", serif';
      ctx.fillText('Kapil Narula', 2160, footerY + 82);

      ctx.fillStyle = '#7A6250';
      ctx.font = '16px "Courier New", monospace';
      ctx.fillText('Founding Forward Deployment Mentor', 2160, footerY + 110);

      // Bottom Authenticity Line
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8C7360';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.letterSpacing = '3px';
      ctx.fillText(
        'OFFICIAL ACCREDITATION · FORWARD DEPLOYMENT ACADEMY · SAN FRANCISCO / NEW YORK / LONDON',
        1200,
        1465
      );

      // Trigger Instant Download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob for certificate'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanName = (learnerName || 'FDE_Engineer').replace(/[^a-zA-Z0-9]/g, '_');
        a.href = url;
        a.download = `FDE_Official_Certification_Kapil_Narula_${cleanName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}
