import dayjs from 'dayjs';
import { Request } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import Exception from './Exception';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    const {
      userId,
      tramiteId,
      transaccionId,
      informeId,
      expedienteId,
      procesoLegalesId,
      intimacionId,
      dictamenId,
      falloId,
      cedulaId,
      resolucionId,
      constatacionId,
      fiscalizacionId,
      informeFiscalizacionId,
      isDdjj
    } = req.body;
    let path;

    if (isDdjj) {
      path =
        './public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId +
        '/ddjj';
    } else if (transaccionId) {
      path = './public/archivos/' + userId + '/transacciones/' + transaccionId;
    } else if (dictamenId) {
      if (procesoLegalesId) {
        path =
          './public/archivos/' +
          userId +
          '/expedientes/' +
          expedienteId +
          '/procesos-legales/' +
          procesoLegalesId +
          '/dictamen/' +
          dictamenId;
      } else if (tramiteId) {
        path =
          './public/archivos/' +
          userId +
          '/tramites/' +
          tramiteId +
          '/dictamen/' +
          dictamenId;
      }
    } else if (intimacionId) {
      path =
        './public/archivos/' +
        userId +
        '/tramites/' +
        tramiteId +
        '/intimacion/' +
        intimacionId;
    } else if (informeFiscalizacionId) {
      path =
        './public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId +
        '/informes/' +
        informeFiscalizacionId;
    } else if (informeId) {
      if (tramiteId) {
        path =
          './public/archivos/' +
          userId +
          '/tramites/' +
          tramiteId +
          '/informes/' +
          informeId;
      } else if (procesoLegalesId) {
        path =
          './public/archivos/' +
          userId +
          '/expedientes/' +
          expedienteId +
          '/procesos-legales/' +
          procesoLegalesId +
          '/informes/' +
          informeId;
      } else if (expedienteId) {
        path =
          './public/archivos/' +
          userId +
          '/expedientes/' +
          expedienteId +
          '/informes/' +
          informeId;
      } else if (cedulaId) {
        path =
          './public/archivos/' +
          userId +
          '/cedulas/' +
          cedulaId +
          '/informes/' +
          informeId;
      }
    } else if (resolucionId) {
      if (tramiteId) {
        path =
          './public/archivos/' +
          userId +
          '/tramites/' +
          tramiteId +
          '/resoluciones/' +
          resolucionId;
      } else if (procesoLegalesId) {
        path =
          './public/archivos/' +
          userId +
          '/expedientes/' +
          expedienteId +
          '/procesos-legales/' +
          procesoLegalesId +
          '/resoluciones/' +
          resolucionId;
      }
    } else if (falloId) {
      path =
        './public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId +
        '/fallos/' +
        falloId;
    } else if (constatacionId) {
      path =
        './public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId +
        '/constataciones/' +
        constatacionId;
    } else if (fiscalizacionId) {
      path =
        './public/archivos/' +
        userId +
        '/expedientes/' +
        expedienteId +
        '/fiscalizaciones/' +
        fiscalizacionId;
    } else if (cedulaId) {
      path = './public/archivos/' + userId + '/cedulas/' + cedulaId;
    } else if (tramiteId) {
      path =
        './public/archivos/' + (userId || 'cucicba') + '/tramites/' + tramiteId;
    } else if (procesoLegalesId) {
      path =
        './public/archivos/' +
        (userId || 'cucicba') +
        '/expedientes/' +
        expedienteId +
        '/procesos-legales/' +
        procesoLegalesId;
    } else if (expedienteId) {
      path =
        './public/archivos/' +
        (userId || 'cucicba') +
        '/expedientes/' +
        expedienteId;
    }

    if (path) {
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    } else {
      cb(new Exception('El path es requerido'), '');
    }
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const { inputNombre } = req.body;
    cb(
      null,
      (inputNombre ? inputNombre + '-' : '') +
        dayjs().format('YYYY-MM-DD_HH.mm.ss.SSS') +
        file.originalname.substring(file.originalname.lastIndexOf('.'))
    );
  }
});

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'audio/wav' ||
    file.mimetype === 'audio/mpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage: fileStorage });
