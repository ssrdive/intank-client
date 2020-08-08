import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { apiAuth } from '../../basara-api';
import { Card, CardBody, Spinner } from 'reactstrap';

const SalesChart = () => {
    const [labelData, setLabelData] = useState([]);

    const options = {
        chart: {
            height: 302,
            type: 'donut',
            toolbar: {
                show: false,
            },
            parentHeightOffset: 0,
        },
        grid: {
            borderColor: '#f1f3fa',
            padding: {
                left: 0,
                right: 0,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                },
                expandOnClick: false
            }
        },
        legend: {
            show: true,
            position: 'right',
            horizontalAlign: 'left',
            itemMargin: {
                horizontal: 6,
                vertical: 3
            }
        },
        labels: labelData,
        responsive: [{
            breakpoint: 480,
            options: {

                legend: {
                    position: 'bottom'
                }
            }
        }],
        tooltip: {
            y: {
                formatter: function (value) { return value + "k" }
            },
        }
    };

    const [data, setData] = useState([]);

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/stock/bymodel`)
                .then(res => {
                    if (res.data === null) setWarehouses(prevReceipts => []);
                    else {
                        console.log(res.data)
                        let darr = []
                        let larr = []
                        for(let i = 0; i < res.data.length; i++) {
                            darr.push(res.data[i].count);
                            larr.push(res.data[i].model);
                        }
                        setData(prevData => darr);
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
            <CardBody className="">
                <h5 className="card-title mt-0 mb-0 header-title">Stock By Models</h5>

                {warehouses !== null ? <>
                    <Chart
                        options={options}
                        series={data}
                        type="donut"
                        className="apex-charts mb-0 mt-4"
                        height={302}
                    />
                </> : (
                        <Spinner type="grow" color="primary" />
                    )}
            </CardBody>
        </Card>
    );
};

export default SalesChart;
