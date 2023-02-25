import React from 'react';
import RunningProjects from './RunningProjects';
import TopBarrios from './TopBarrios';
import TotalSales from './TotalSales';
import UserStats from './UserStats';

const totalSales = [
    [60, 80, 60, 80, 65, 130, 120, 100, 30, 40, 30, 70],
    [100, 70, 80, 50, 120, 100, 130, 140, 90, 100, 40, 50],
    [80, 50, 60, 40, 60, 120, 100, 130, 60, 80, 50, 60],
    [70, 80, 100, 70, 90, 60, 80, 130, 40, 60, 50, 80],
    [90, 40, 80, 80, 100, 140, 100, 130, 90, 60, 70, 50],
    [80, 60, 80, 60, 40, 100, 120, 100, 30, 40, 30, 70],
    [20, 40, 20, 50, 70, 60, 110, 80, 90, 30, 50, 50],
    [60, 70, 30, 40, 80, 140, 80, 140, 120, 130, 100, 110],
    [90, 90, 40, 60, 40, 110, 90, 110, 60, 80, 60, 70],
    [50, 80, 50, 80, 50, 80, 120, 80, 50, 120, 110, 110],
    [60, 90, 60, 70, 40, 70, 100, 140, 30, 40, 30, 70],
    [20, 40, 20, 50, 30, 80, 120, 100, 30, 40, 30, 70]
  ];
  

const GestionarEstadisticas = () => {

    const mockupAlquileres = [
        {
            color: "primary", 
            quantity: 32, 
            amount: "2.880.000", 
            title: "Patiño"
        },
        {
            color: "success", 
            quantity: 23, 
            amount: "1.800.000", 
            title: "Robles" 
        },
        {
            color: "warning", 
            quantity: 19, 
            amount: "1.750.000", 
            title: "Remax"
        },
        {
            color: "danger", 
            quantity: 15, 
            amount: "1.200.000", 
            title: "Gimenez-Gonzalez" 
        },
        {
            color: "info", 
            quantity: 14, 
            amount: "1.300.000", 
            title: "Sztajnszrajber"
        }
    ]

    const mockupVentas = [
        {
            color: "primary", 
            quantity: 12, 
            amount: "1.250.000", 
            title: "Remax"
        },
        {
            color: "success", 
            quantity: 11, 
            amount: "1.300.000", 
            title: "Sztajnszrajber" 
        },
        {
            color: "warning", 
            quantity: 8, 
            amount: "970.000", 
            title: "Remax"
        },
        {
            color: "danger", 
            quantity: 7, 
            amount: "1.100.000", 
            title: "Perez" 
        },
        {
            color: "info", 
            quantity: 7, 
            amount: "890.000", 
            title: "Robles"
        }
    ]

    const barriosPopulares = [
        ['product', 'Ventas', 'Alquileres'],
        ['Palermo', 43, 135],
        ['Recoleta', 50, 98],
        ['Belgrano', 20, 167],
        ['Nuñez', 33, 77],
        ['Puerto Madero', 45, 87],
        ['Montserrat', 42, 85],
        ['Saavedra', 50, 60],
        ['Villa Urquiza', 12, 97],
        ['San Telmo', 22, 48],
        ['Colegiales', 28, 34]
    ];


    return (
        <div>
            <div className='d-flex mx-5'>
                <RunningProjects alquileres={mockupAlquileres} ventas={mockupVentas}/>
                <TotalSales data={totalSales}/>
            </div>
            <div className='mx-7 w-90'>
                <TopBarrios className='w-100' data={barriosPopulares}/>
            </div>
            <div className='mx-7 my-4 w-90'>
                <UserStats className='w-100'/>
            </div>
        </div>
    )
}

export default GestionarEstadisticas