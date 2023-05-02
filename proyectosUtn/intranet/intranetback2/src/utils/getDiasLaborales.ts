import axios from 'axios';
import dayjs from 'dayjs';

export const getDiasLaborales = async (days: number, date: Date) => {
  const dateObj = dayjs(date);
  const año = dateObj.year();

  try {
    const { data: feriados } = await axios.get(
      'http://nolaborables.com.ar/api/v2/feriados/' + año + '?formato=mensual'
    );
    let acc = days;

    for (let i = 0; i < days; i++) {
      const fecha = dateObj.add(i, 'day');
      if (
        feriados[fecha.month()][fecha.date()] ||
        fecha.day() === 0 ||
        fecha.day() === 6
      ) {
        acc++;
      }
    }

    return acc;
  } catch (error) {
    console.log(error);
  }

  return days;
};

export const isFeriado = async (fecha: Date) => {
  try {
    const { data: feriados } = await axios.get(
      'http://nolaborables.com.ar/api/v2/feriados/' + fecha.getFullYear() + '?formato=mensual'
    );

    let isFeriado = false

    if(feriados[fecha.getMonth()][fecha.getDate()]){
      isFeriado = true
    }

    return isFeriado
  } catch (error) {
    return false
  }
};
