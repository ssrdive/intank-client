import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { getDate } from '../../helpers/date';
import { apiAuth } from '../../basara-api';
import { getLoggedInUser } from '../../helpers/authUtils';
import Flatpickr from 'react-flatpickr';

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



const Entry = ({ idx, entriesState, handleItemChange, handleItemDelete, setAccount }) => {
    const [models, setModels] = useState([]);

    useEffect(() => {
        apiAuth
            .get('/dropdown/model')
            .then(response => {
                setModels(prevModels => {
                    return response.data;
                });
                if (response.data.length > 0) setAccount(idx, response.data[0].id);
            })
            .catch(err => {
                console.log(err);
            });
        // eslint-disable-next-line
    }, []);

    return (
        <Form key={idx} inline>
            <Label>Model [To be developed]</Label>
            {/* <FormInput idx={idx} name="account" type="select" options={models} handleOnChange={handleItemChange} /> */}
            &nbsp;&nbsp;&nbsp;
            <Input
                type="number"
                data-idx={idx}
                name="debit"
                placeholder="Primary Number"
                value={entriesState[idx].debit}
                onChange={handleItemChange}
            />
            &nbsp;&nbsp;&nbsp;
            {/* <Input
                type="number"
                data-idx={idx}
                name="credit"
                placeholder="Secondary Number"
                value={entriesState[idx].credit}
                onChange={handleItemChange}
            /> */}
            <Label>Secondary Number [To be developed]</Label>
            &nbsp;&nbsp;&nbsp;
            <Button color="warning" onClick={handleItemDelete}>
                X
            </Button>
            <br />
            <br />
        </Form>
    );
};


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

const GoodsIn = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        warehouse_type: DROPDOWN_DEFAULT,
        date: { value: getDate('-') },
    });

    const setDate = value => {
        setForm(prevForm => {
            const updatedForm = { ...prevForm, date: { ...prevForm.date } };
            updatedForm.date.value = value;
            return updatedForm;
        });
    };

    const handleItemChange = e => {
        const updatedEntries = [...entriesState];
        updatedEntries[e.target.dataset.idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const setAccount = (idx, account) => {
        const updatedEntries = [...entriesState];
        updatedEntries[idx].account = account;
        setEntriesState(updatedEntries);
    };

    const handleItemDelete = (e, idx) => {
        e.preventDefault();
        const updatedEntries = [...entriesState];
        updatedEntries.splice(idx, 1);
        setEntriesState(updatedEntries);
    };

    const blankEntry = { account: 0, debit: '', credit: '' };
    const [entriesState, setEntriesState] = useState([blankEntry]);

    const addEntry = () => {
        setEntriesState([...entriesState, { ...blankEntry }]);
    };

    const handleOnChange = e => {
        e.persist();
        setForm(prevForm => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    useEffect(() => {
        loadDropdownGeneric('warehouse', 'warehouse_type', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        apiAuth
            .post(
                '/warehouse/create',
                qs.stringify({
                    warehouse_type_id: form.warehouse_type.value,
                    name: form.name.value,
                    address: form.address.value,
                    contact: form.contact.value,
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `Warehouse created with number ${response.data}` });
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
                            Issue Goods Out
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Goods Out</h4>

                <Row>
                    <Col md={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                    <Label for="text">From</Label>
                                        <FormInput
                                            {...form['warehouse_type']}
                                            name="warehouse_type"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                    <Label for="text">To</Label>
                                        <FormInput
                                            {...form['warehouse_type']}
                                            name="warehouse_type"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label for="text">Date</Label>
                                <Flatpickr
                                    value={form.date.value}
                                    onChange={(e, date) => {
                                        setDate(date);
                                    }}
                                    className="form-control"
                                />
                            </FormGroup>
                            <Button color="info" onClick={addEntry}>
                                Add
                            </Button>
                            <br />
                            <br />
                            {entriesState.map((val, idx) => {
                                return (
                                    <div key={idx} xs={12} sm={12} md={12}>
                                        <Entry
                                            idx={idx}
                                            entriesState={entriesState}
                                            handleItemChange={handleItemChange}
                                            handleItemDelete={e => handleItemDelete(e, idx)}
                                            setAccount={setAccount}
                                        />
                                    </div>
                                );
                            })}
                            <br />
                            <SubmitComponent />
                        </Form>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

const Warehouses = ({ history }) => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={12}>
                    <PageTitle
                        breadCrumbItems={[{ label: 'Transactions', path: '/transactions', active: true }]}
                        title={'Transactions'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <GoodsIn />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Warehouses;
