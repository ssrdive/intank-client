import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { apiAuth } from '../../basara-api';
import { getLoggedInUser } from '../../helpers/authUtils';
import {
    Badge,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    UncontrolledAlert,
    Spinner,
    UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem
} from 'reactstrap';
import { ChevronDown } from 'react-feather';
import { loadDropdownGeneric } from '../../helpers/form';

import PageTitle from '../../components/PageTitle';

import {
    TEXT_INPUT_REQUIRED,
    NUMBER_INPUT_REQUIRED,
    DROPDOWN_DEFAULT,
} from '../../constants/formValues';

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

const CreateModel = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        name: TEXT_INPUT_REQUIRED,
        country: TEXT_INPUT_REQUIRED,
        primary_name: TEXT_INPUT_REQUIRED,
        secondary_name: TEXT_INPUT_REQUIRED,
    });

    const handleOnChange = e => {
        e.persist();
        setForm(prevForm => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    useEffect(() => {
        // loadDropdownGeneric('model', 'model', setForm);
        // loadDropdownGeneric('item_category', 'category', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        apiAuth
            .post(
                '/model/create',
                qs.stringify({
                    name: form.name.value,
                    country: form.country.value,
                    primary_name: form.primary_name.value,
                    secondary_name: form.secondary_name.value,
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `Item created with number ${response.data}` });
            })
            .catch(err => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'failure', message: 'Something went wrong' });
            });
    };

    const SubmitComponent = () => {
        return (
            <>
                {submitStatus.status !== null ? (
                    submitStatus.status === 'success' ? (
                        <UncontrolledAlert color="success">{submitStatus.message}</UncontrolledAlert>
                    ) : (
                            <UncontrolledAlert color="warning">{submitStatus.message}</UncontrolledAlert>
                        )
                ) : null}
                {loading ? (
                    <Spinner className="m-2" type="grow" color="success" />
                ) : (
                        <Button color="success" type="submit">
                            Create Model
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Create Model</h4>

                <Row>
                    <Col lg={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Label for="text">Name</Label>
                            <FormGroup>
                                <FormInput
                                    {...form['name']}
                                    name="name"
                                    placeholder="Name"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Country</Label>
                                <FormInput
                                    {...form['country']}
                                    name="country"
                                    placeholder="Country"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Primary Name</Label>
                                <FormInput
                                    {...form['primary_name']}
                                    name="primary_name"
                                    placeholder="Primary Name"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Secondary Name</Label>
                                <FormInput
                                    {...form['secondary_name']}
                                    name="secondary_name"
                                    placeholder="Secondary Name"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <SubmitComponent />
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

const ItemReports = ({ history }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Model Reports</h4>
                <UncontrolledDropdown className="d-inline">
                    <DropdownToggle color="info">
                        Reports{' '}
                        <i className="icon">
                            <ChevronDown></ChevronDown>
                        </i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                history.push(`/models/all`);
                            }}>
                            All
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </CardBody>
        </Card>
    );
};

const Models = ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Models', path: '/models', active: true }]}
                        title={'Models'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <ItemReports history={history} />
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <CreateModel />
                </Col>
            </Row>

            {/* <Row>
                <Col>
                    <ContractSearch />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Commitments />
                </Col>
            </Row>

            <Row>
                <Col>
                    <NewContract />
                </Col>
            </Row> */}
        </React.Fragment>
    );
};

export default Models;
