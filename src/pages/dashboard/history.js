import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Spinner, Card, CardBody } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import PageTitle from '../../components/PageTitle';


const Search = ({ location }) => {

    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/history/${id}`)
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
                        title={'Stock History'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Stock History</h4>

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
                                            <th>Warehouse</th>
                                            <th>Date In</th>
                                            <th>Date Out</th>
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
                                                    <td><Link to={'/stock?warehouse=' + item.warehouse_id}>{item.warehouse}</Link></td>
                                                    <td>{item.date_in}</td>
                                                    <td>{item.date_out}</td>
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
