import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CardDropdown from 'components/common/CardDropdown';
import { Card, Form } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
//import original es "import * as echarts from 'echarts/core'" pero no funcionaba, no está bien declarada la carpeta
import * as echarts from 'echarts/dist/echarts.js';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { LineChart } from 'echarts/charts';

import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { capitalize, getColor, rgbaColor } from 'helpers/utils';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  LegendComponent
]);

const getOptions = (month, data) => ({
  color: getColor('100'),
  tooltip: {
    trigger: 'axis',
    padding: [7, 10],
    backgroundColor: getColor('100'),
    borderColor: getColor('100'),
    textStyle: { color: getColor('dark') },
    borderWidth: 1,
    formatter: params => {
      const { name, value } = params[0];
      return `${month} ${name} : ${value}`;
    },
    transitionDuration: 0
  },
  xAxis: {
    type: 'category',
    data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    boundaryGap: false,
    axisPointer: {
      lineStyle: {
        color: getColor('300'),
        type: 'dashed'
      }
    },
    splitLine: { show: false },
    axisLine: {
      lineStyle: {
        color: getColor('300'),
        type: 'dashed'
      }
    },
    axisTick: { show: false },
    axisLabel: {
      color: getColor('400'),
      formatter: value => `${capitalize(month.slice(0, 3))} ${value}`,
      margin: 15
    }
  },
  yAxis: {
    type: 'value',
    axisPointer: { show: false },
    splitLine: {
      lineStyle: {
        color: getColor('300'),
        type: 'dashed'
      }
    },
    boundaryGap: false,
    axisLabel: {
      show: true,
      color: getColor('400'),
      margin: 15
    },
    axisTick: { show: false },
    axisLine: { show: false }
  },
  series: [
    {
      type: 'line',
      data,
      lineStyle: { color: getColor('primary') },
      itemStyle: {
        borderColor: getColor('primary'),
        borderWidth: 2
      },
      symbol: 'circle',
      symbolSize: 10,
      smooth: false,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: rgbaColor(getColor('primary'), 0.2)
            },
            {
              offset: 1,
              color: rgbaColor(getColor('primary'), 0)
            }
          ]
        }
      }
    }
  ],
  grid: { right: 10, left: 0, bottom: 0, top: 10, containLabel: true }
});

const TotalSales = ({ data }) => {
  const [month, setMonth] = useState(0);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];
  return (
    <Card className="h-100 w-50 m-4">
      <FalconCardHeader
        title="Ventas mensuales"
        titleTag="h6"
        className="pb-0"
        endEl={
          <Flex>
            <Form.Select
              size="sm"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="me-2"
            >
              {months.map((month, index) => (
                <option value={index} key={month}>
                  {month}
                </option>
              ))}
            </Form.Select>
            <CardDropdown />
          </Flex>
        }
      />

      <Card.Body>
        <ReactEChartsCore
          echarts={echarts}
          option={getOptions(months[month], data[month])}
          style={{ height: '18.4375rem' }}
        />
      </Card.Body>
    </Card>
  );
};

TotalSales.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number).isRequired)
    .isRequired
};

export default TotalSales;
