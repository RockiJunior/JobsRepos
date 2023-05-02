const request = require('request').defaults({ encoding: null });

const getBase64ImageFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    try {
      request.get(url, function (err: Error, res: any, body: any) {
        if (err) {
          reject(err);
        } else {
          resolve(
            'data:' +
              res.headers['content-type'] +
              ';base64,' +
              body.toString('base64')
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export default getBase64ImageFromURL;
