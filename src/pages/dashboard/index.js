import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, Card, Form, FormGroup, Input, Label, Button, Table, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import { apiAuth } from '../../basara-api';
import PageTitle from '../../components/PageTitle';
import { TEXT_INPUT_REQUIRED, DROPDOWN_DEFAULT, NUMBER_INPUT_REQUIRED } from '../../constants/formValues';

import { loadDropdownGeneric } from '../../helpers/form';

import Orders from './SalesChart';
import Statistics from './TargetChart';

const FormInput = props => {
    return (
        <>
            {props.type === 'select' ? (
                <Input type="select" name={props.name} onChange={props.handleOnChange}>
                    {props.options.map(option => {
                        return (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        );
                    })}
                </Input>
            ) : (
                    <Input
                        type={props.type}
                        value={props.value}
                        onChange={props.handleOnChange}
                        name={props.name}
                        placeholder={props.placeholder}
                        required={props.required}
                    />
                )}
        </>
    );
};

export default ({ history }) => {

    const [form, setForm] = useState({
        search: TEXT_INPUT_REQUIRED,
        warehouses: DROPDOWN_DEFAULT,
        model: DROPDOWN_DEFAULT,
        age: NUMBER_INPUT_REQUIRED,
    })

    const handleFormSubmitSearch = e => {
        e.persist();
        e.preventDefault();
        history.push(`/search?search=${form.search.value}`);
    }

    const handleFormSubmitWarehouseStock = e => {
        e.persist();
        e.preventDefault();
        history.push(`/stock?warehouse=${form.warehouses.value}`);
    }

    const handleFormSubmitAgeWise = e => {
        e.persist();
        e.preventDefault();
        history.push(`/agewise?model=${form.model.value}&age=${form.age.value}`);
    }

    const handleOnChange = e => {
        e.persist();
        setForm(prevForm => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    const [warehouses, setWarehouses] = useState(null);

    useEffect(() => {
        loadDropdownGeneric('warehouse', 'warehouses', setForm);
        loadDropdownGeneric('model', 'model', setForm);
        const fetchDetails = () => {
            apiAuth
                .get(`/docs/recent`)
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
                            { label: 'Dashboard', path: '/', active: true },
                        ]}
                        title={'Dashboard'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Orders />
                </Col>
                <Col md={6}>
                    <Statistics />
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Search</h4>

                            <Form onSubmit={handleFormSubmitSearch}>
                                <FormGroup>
                                    <Label>Search Keyword</Label>
                                    <FormInput
                                        {...form['search']}
                                        name="search"
                                        placeholder="Search"
                                        handleOnChange={handleOnChange}
                                    />
                                </FormGroup>
                                <Button color="primary" type="submit">
                                    Search
                            </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Select Warehouse</h4>

                            <Form onSubmit={handleFormSubmitWarehouseStock}>
                                <FormGroup>
                                    <Label>Search Warehouse</Label>
                                    <FormInput
                                        {...form['warehouses']}
                                        name="warehouses"
                                        handleOnChange={handleOnChange}
                                    />
                                </FormGroup>
                                <Button color="primary" type="submit">
                                    Search
                            </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Age-wise Analysis Report</h4>

                            <Form onSubmit={handleFormSubmitAgeWise}>
                                <FormGroup>
                                    <Label>Select Model</Label>
                                    <FormInput
                                        {...form['model']}
                                        name="model"
                                        handleOnChange={handleOnChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Age</Label>
                                    <FormInput
                                        {...form['age']}
                                        name="age"
                                        placeholder="Age in Days"
                                        handleOnChange={handleOnChange}
                                    />
                                </FormGroup>
                                <Button color="primary" type="submit">
                                    Search
                            </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card>
                        <CardBody>
                            <h4 className="header-title mt-0">Recent Documents</h4>

                            {warehouses !== null ? (
                                <Table className="mb-0" responsive={true} striped>
                                    <thead>
                                        <tr>
                                            <th>Document ID</th>
                                            <th>Document Type</th>
                                            <th>Date</th>
                                            <th>From</th>
                                            <th>To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warehouses.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.document_id}</td>
                                                    <td>{item.delivery_document_type}</td>
                                                    <td>{item.date}</td>
                                                    <td><Link to={'/stock?warehouse=' + item.from_warehouse_id}>{item.from_warehouse}</Link></td>
                                                    <td><Link to={'/stock?warehouse=' + item.to_warehouse_id}>{item.to_warehouse}</Link></td>
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