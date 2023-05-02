import server from './app';

const version = 'v1.1.10';

server.listen(8000, () =>
  console.log(
    `> Server listening on ${process.env.SERVER_URL}
                                 __________
                                 [ ${version} ]
                                 ¯¯¯¯¯¯¯¯¯¯`
  )
);
