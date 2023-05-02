import pdf from 'html-pdf';

export const createPDF = (
  html: any,
  options: pdf.CreateOptions | undefined
): Promise<string | NodeJS.ArrayBufferView> =>
  new Promise((resolve, reject) => {
    pdf.create(html, options).toBuffer(function (err: Error, res: any) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
