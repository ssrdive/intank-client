import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
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
        username: TEXT_INPUT_REQUIRED,
        password: TEXT_INPUT_REQUIRED,
        name: TEXT_INPUT_REQUIRED,
        type: { value: 'Admin', type: 'select', options: [{ id: 'Admin', name: 'Admin' }, { id: 'Standard User', name: 'Standard User' }] },
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
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(form.password.value, salt);
        apiAuth
            .post(
                '/user/create',
                qs.stringify({
                    username: form.username.value,
                    password: hash,
                    name: form.name.value,
                    type: form.type.value,
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `User created with number ${response.data}` });
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
                            Create User
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Create User</h4>

                <Row>
                    <Col lg={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Label for="text">Username</Label>
                            <FormGroup>
                                <FormInput
                                    {...form['username']}
                                    name="username"
                                    placeholder="Username"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Password</Label>
                                <FormInput
                                    {...form['password']}
                                    name="password"
                                    placeholder="Password"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Name</Label>
                                <FormInput
                                    {...form['name']}
                                    name="name"
                                    placeholder="Name"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="text">Type</Label>
                                <FormInput
                                    {...form['type']}
                                    name="type"
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

const Models = ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Transactions', path: '/transactions', active: true }]}
                        title={'Create User'}
                    />
                </Col>
            </Row>

            {/* <Row>
                <Col md={4}>
                    <ItemReports history={history} />
                </Col>
            </Row> */}

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
