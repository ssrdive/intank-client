import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Spinner, Card, CardBody } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import PageTitle from '../../components/PageTitle';


const Search = ({ location }) => {

    const params = new URLSearchParams(location.search);
    const model = params.get('model');
    const age = params.get('age');

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/agewise?model=${model}&age=${age}`)
                .then(res => {
                    if (res.data === null) setWarehouses(prevReceipts => []);
                    else setWarehouses(prevReceipts => res.data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchDetails();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Warehouses', path: '/warehouses' },
                            { label: 'All', path: '/warehouses/all', active: true },
                        ]}
                        title={'Agewise'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Age-wise</h4>

                            {warehouses !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                        <tr>
                                            <th>Document ID</th>
                                            <th>Primary ID</th>
                                            <th>Secondary ID</th>
                                            <th>In Stock For</th>
                                            <th>Price</th>
                                            <th>Model</th>
                                            <th>Date</th>
                                            <th>Document Type</th>  
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouses.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.document_id}</td>
                                                    <td>{item.primary_id}</td>
                                                    <td>{item.secondary_id}</td>
                                                    <td>{item.in_stock_for} days</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.model}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.delivery_document_type}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                    <Spinner type="grow" color="primary" />
                                )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Search;
