import React from 'react';
import { Card } from 'react-bootstrap';
import { Noticia } from './Noticia';

const noticias = [
  {
    id: 1,
    titulo: 'Noticia 1',
    descripcion: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet non sapien at semper. Curabitur luctus, elit vel tincidunt interdum, purus mi vestibulum lectus, eu fringilla eros dolor accumsan lectus. Ut neque magna, mattis in efficitur eu, scelerisque sit amet massa. Mauris sit amet semper nulla, et posuere sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam rutrum pulvinar orci eu accumsan. Aliquam at ultrices nisl. Morbi tincidunt auctor dolor, lobortis maximus ligula mattis vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam interdum, enim eget molestie tincidunt, tortor lorem vulputate lacus, quis cursus leo dolor et sem. Donec porta ultrices mauris, pretium accumsan magna luctus molestie. Suspendisse sagittis at urna suscipit imperdiet. Ut a elementum libero. Mauris blandit vitae neque id convallis. Sed vel fermentum elit.

    Phasellus quam tellus, eleifend eu libero et, consectetur semper purus. In vitae molestie urna, placerat efficitur sapien. In ex dui, imperdiet non bibendum nec, ornare id libero. Donec maximus congue diam a faucibus. Curabitur vehicula elit vitae odio ultrices, vitae condimentum mauris dignissim. Integer vitae arcu nulla. Ut vehicula et ipsum in maximus. Quisque ultrices nulla eget convallis suscipit. Etiam nibh felis, fringilla a nisi et, tincidunt fringilla tellus. Pellentesque vestibulum fringilla diam sit amet pellentesque. Mauris vitae enim ante. In quam justo, consequat et accumsan ac, suscipit ut ex. Morbi scelerisque ac eros sit amet vestibulum. Sed ut neque aliquet, pulvinar ex et, ullamcorper tellus. Etiam nec pellentesque lacus.
    
    Integer in libero a magna ornare dapibus. Quisque venenatis neque ut ex lacinia mollis. Nunc fringilla nisl et mauris finibus ultrices. Aliquam tristique ligula eget tempor molestie. Morbi dictum, mauris nec imperdiet aliquam, mi elit lobortis lorem, sit amet commodo felis odio sit amet nulla. Mauris tincidunt lorem egestas lorem posuere interdum. Proin euismod urna est, vitae faucibus magna pulvinar nec. Nam consectetur tristique posuere. Nunc quis nisi neque. Donec id porta lacus.
    
    Nulla est risus, tincidunt ut imperdiet vitae, dignissim vel est. Curabitur ut pretium lorem, vel rutrum lorem. Phasellus ut ex vitae ligula laoreet consequat nec vel mauris. Morbi at vulputate sem, nec lacinia nisi. Integer et libero ut lacus vehicula aliquet consequat a arcu. Maecenas aliquet urna a tempor euismod. Cras eu consequat velit.
    
    Curabitur eget mattis elit. Donec feugiat finibus eros, nec fermentum sem. Fusce blandit ornare fermentum. Etiam sit amet nisi mauris. Mauris id sem ac quam efficitur convallis vitae vitae dolor. Curabitur lacinia metus enim, in consectetur enim aliquet iaculis. Suspendisse pretium convallis purus vel elementum.`,
    fecha: '2020-01-01',
    imagen: 'https://picsum.photos/200/300',
    link: '/home',
    verified: false
  },
  {
    id: 2,
    titulo: 'Noticia 2',
    descripcion: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
    fecha: '2020-01-01',
    imagen: 'https://picsum.photos/200/100',
    link: '/home',
    verified: false
  },
  {
    id: 2,
    titulo: 'Noticia 2',
    descripcion: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Phasellus quam tellus, eleifend eu libero et, consectetur semper purus. In vitae molestie urna.  
    `,
    fecha: '2020-01-01',
    imagen: 'https://picsum.photos/100/100',
    link: '/home',
    verified: false
  }
];

export const Noticias = () => (
  <Card.Body className="fs--1">
    {noticias.map((noticia, index) => (
      <Noticia
        key={noticia.id}
        noticia={noticia}
        isLast={index === noticias.length - 1}
      />
    ))}
  </Card.Body>
);
