import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Spinner, Card, CardBody } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import PageTitle from '../../components/PageTitle';


const Search = ({ location }) => {

    const params = new URLSearchParams(location.search);
    const search = params.get('search');

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/search?search=${search}`)
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
                        title={'Search'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Search</h4>

                            {warehouses !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                        <tr>
                                            <th>Document ID</th>
                                            <th>Model</th>
                                            <th>Warehouse</th>
                                            <th>Primary ID</th>
                                            <th>Secondary ID</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouses.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.document_id}</td>
                                                    <td><Link to={'/search?search=' + item.model}>{item.model}</Link></td>
                                                    <td><Link to={'/stock?warehouse=' + item.warehouse_id}>{item.warehouse}</Link></td>
                                                    <td><Link to={'/history?id=' + item.primary_id}>{item.primary_id}</Link></td>
                                                    <td>{item.secondary_id}</td>
                                                    <td>{item.price}</td>
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
