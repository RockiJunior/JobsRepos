import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function mergePdfs(pdfsToMerges: any) {
  const mergedPdf = await PDFDocument.create();
  const actions: any[] = [];
  const pageOfInputs: any = {};
  let acc = 1;

  for (const { arrayBuffer, input } of pdfsToMerges) {
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

    copiedPages.forEach(async (page) => {
      const pageHeight = page.getHeight();
      const pageWidth = page.getWidth();

      input &&
        page.drawText(input, {
          x: 10,
          y: pageHeight - 25,
          size: 16,
          font: await mergedPdf.embedFont(StandardFonts.HelveticaBold)
        });

      page.drawText(`${acc++}`, {
        x: pageWidth - 20,
        y: 10,
        size: 10,
        font: await mergedPdf.embedFont(StandardFonts.Helvetica)
      });

      mergedPdf.addPage(page);
    });

    if (input) {
      pageOfInputs[input] = acc;
    }
  }

  await Promise.all(actions);

  return { pdf: await mergedPdf.save(), pageOfInputs };
}
