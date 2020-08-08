import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { apiAuth } from '../../basara-api';
import { Card, CardBody, Spinner } from 'reactstrap';

const TargetChart = () => {
    const [labelData, setLabelData] = useState([]);
    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: labelData,
            axisBorder: {
                show: false,
            },
        },
        legend: {
            show: false,
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f3f4f7',
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return '$ ' + val + ' thousands';
                },
            },
        },
    };

    // const data = [
    //     {
    //         name: 'Net Profit',
    //         data: [35, 44, 55, 57, 45, 32, 24],
    //     },
    // ];

    const [data, setData] = useState([{name:'Stocks', data:[]}]);

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/stock/bywarehouse`)
                .then(res => {
                    if (res.data === null) setWarehouses(prevReceipts => []);
                    else {
                        console.log(res.data)
                        let darr = []
                        let larr = []
                        for (let i = 0; i < res.data.length; i++) {
                            darr.push(res.data[i].count);
                            larr.push(res.data[i].model);
                        }
                        setData(prevData => [{name:'Stocks', data: darr}]);
                        setLabelData(prevData => larr);
                        setWarehouses(prevReceipts => res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchDetails();
    }, []);

    return (
        <Card>
            <CardBody className="pb-0">
                <h5 className="card-title header-title">Stocks by Warehouse</h5>

                {warehouses !== null ? <>
                    <Chart options={options} series={data} type="bar" className="apex-charts mt-3" height={296} />
                </> : (
                        <Spinner type="grow" color="primary" />
                    )}
            </CardBody>
        </Card>
    );
};

export default TargetChart;
