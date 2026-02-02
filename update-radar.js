const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } = require("docx");
const fs = require("fs");
const path = require("path");

// All protocols have been moved to 01-shortlist, so radar is now empty
const doc = new Document({
  sections: [{
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "NOMAD RESEARCH — RADAR LIST", bold: true })] }),
      new Paragraph({ children: [new TextRun("Last Updated: 2026-01-27")] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun("═══════════════════════════════════════════════════════════════════")] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "All protocols have been moved to 01-shortlist for deep dive research.", italics: true })] }),
      new Paragraph({ spacing: { before: 100 }, children: [new TextRun("")] }),
      new Paragraph({ children: [new TextRun("Moved to shortlist (2026-01-27):")] }),
      new Paragraph({ children: [new TextRun("• Ethereum ($ETH) → 01-shortlist/layer-1/")] }),
      new Paragraph({ children: [new TextRun("• Solana ($SOL) → 01-shortlist/layer-1/")] }),
      new Paragraph({ children: [new TextRun("• Hyperliquid ($HYPE) → 01-shortlist/perp-dex/")] }),
      new Paragraph({ children: [new TextRun("• Lighter ($LIGHT) → 01-shortlist/perp-dex/")] }),
      new Paragraph({ children: [new TextRun("• DeepBook ($DEEP) → 01-shortlist/spot-dex/")] }),
      new Paragraph({ children: [new TextRun("• Walrus ($WAL) → 01-shortlist/decentralized-storage/")] }),
      new Paragraph({ children: [new TextRun("• Alkimi ($ADS) → 01-shortlist/advertising/")] }),
      new Paragraph({ children: [new TextRun("• Zeus Network ($ZEUS) → 01-shortlist/cross-chain/")] }),
      new Paragraph({ children: [new TextRun("• Umbra (TBD) → 01-shortlist/privacy/")] }),
      new Paragraph({ children: [new TextRun("• MetaDAO ($META) → 01-shortlist/governance/")] }),
      new Paragraph({ spacing: { before: 100 }, children: [new TextRun("")] }),
      new Paragraph({ children: [new TextRun("Previously moved:")] }),
      new Paragraph({ children: [new TextRun("• Sui ($SUI) → 01-shortlist/layer-1/")] }),
      new Paragraph({ children: [new TextRun("• IKA ($IKA) → 01-shortlist/cross-chain/")] }),
    ]
  }]
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, "00-radar/radar-list.docx"), buffer);
  console.log("✅ Updated radar-list.docx — all protocols moved to shortlist");
}
main().catch(console.error);
