import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Spinner, Card, CardBody } from 'reactstrap';
import { apiAuth } from '../../basara-api';

import PageTitle from '../../components/PageTitle';


const AllModels = () => {

    const [items, setItems] = useState(null);

    useEffect(() => {
        const fetchDetails = () => {
            apiAuth
                .get(`/model/all`)
                .then(res => {
                    if (res.data === null) setItems(prevReceipts => []);
                    else setItems(prevReceipts => res.data);
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
                            { label: 'Models', path: '/models' },
                            { label: 'All', path: '/models/all', active: true },
                        ]}
                        title={'All Models'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">All Models</h4>

                            {items !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                        <tr>
                                            <th>Model ID</th>
                                            <th>Name</th>
                                            <th>Country</th>
                                            <th>Primary Name</th>
                                            <th>Secondary Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.country}</td>
                                                    <td>{item.primary_name}</td>
                                                    <td>{item.secondary_name}</td>
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

export default AllModels;
