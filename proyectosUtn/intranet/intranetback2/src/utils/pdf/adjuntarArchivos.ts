import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { mergePdfs } from './mergePdfs';
import { ITramite } from '../../interfaces/tramite.interface';

export const adjuntarArchivos = async (tramite: ITramite, file: any) => {
  const bufferPdfs = [];

  for (const seccion of tramite.tipo.secciones) {
    for (const input of seccion.inputs) {
      if (input.InputValues && input.InputValues.archivos?.length) {
        const archivosUbicacion = input.InputValues.archivos.map(
          (archivo) => archivo.archivoUbicacion
        );
        for (const archivoUbicacion of archivosUbicacion) {
          let arrayBuffer;

          try {
            arrayBuffer = await axios(archivoUbicacion, {
              responseType: 'arraybuffer'
            }).then((res) => res.data);
          } catch (e) {
            continue;
          }

          const extension = archivoUbicacion.substring(
            archivoUbicacion.lastIndexOf('.')
          );

          if (extension === '.pdf') {
            const pdfDoc = await PDFDocument.create();
            const sourcePdf = await PDFDocument.load(arrayBuffer);

            sourcePdf.getPages().forEach((page) => {
              page.scale(0.9, 0.9);
            });

            const pagesToEmbed = await pdfDoc.embedPdf(sourcePdf);

            //embed pages and center it
            pagesToEmbed.forEach((page) => {
              const newPage = pdfDoc.addPage();
              newPage.drawPage(page, {
                x: newPage.getWidth() / 2 - page.width / 2,
                y: newPage.getHeight() / 2 - page.height / 2
              });
            });

            const newArrayBuffer = await pdfDoc.save();

            bufferPdfs.push({
              input: input.titulo,
              arrayBuffer: newArrayBuffer
            });
          } else if (extension === '.jpg' || extension === '.jpeg') {
            const pdfDoc = await PDFDocument.create();
            const jpgImage = await pdfDoc.embedJpg(arrayBuffer);

            let jpgDims = jpgImage.scale(1);

            const page = pdfDoc.addPage();
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();

            if (jpgDims.width > pageWidth || jpgDims.height > pageHeight) {
              const ratio = Math.min(
                pageWidth / jpgDims.width,
                pageHeight / jpgDims.height
              );
              jpgDims = jpgImage.scale(ratio);
            }

            page.drawImage(jpgImage, {
              x: page.getWidth() / 2 - jpgDims.width / 2 + 48,
              y: page.getHeight() / 2 - jpgDims.height / 2 + 48,
              width: jpgDims.width - 96,
              height: jpgDims.height - 96
            });

            const pdfBytes = await pdfDoc.save();
            bufferPdfs.push({ input: input.titulo, arrayBuffer: pdfBytes });
          } else if (extension === '.png') {
            const pdfDoc = await PDFDocument.create();
            const pngImage = await pdfDoc.embedPng(arrayBuffer);

            let pngDims = pngImage.scale(1);

            const page = pdfDoc.addPage();
            const pageWidth = page.getWidth();
            const pageHeight = page.getHeight();

            if (pngDims.width > pageWidth || pngDims.height > pageHeight) {
              const ratio = Math.min(
                pageWidth / pngDims.width,
                pageHeight / pngDims.height
              );
              pngDims = pngImage.scale(ratio);
            }

            page.drawImage(pngImage, {
              x: pageWidth / 2 - pngDims.width / 2 + 48,
              y: pageHeight / 2 - pngDims.height / 2 + 48,
              width: pngDims.width - 96,
              height: pngDims.height - 96
            });

            const pdfBytes = await pdfDoc.save();

            bufferPdfs.push({ input: input.titulo, arrayBuffer: pdfBytes });
          }
        }
      }
    }
  }

  let { pdf: newPdf, pageOfInputs } = await mergePdfs([
    { arrayBuffer: file },
    ...bufferPdfs
  ]);

  return { pageOfInputs, newPdf, bufferPdfs };
};
