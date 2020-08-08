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
            <FormInput idx={idx} name="model" type="select" options={models} handleOnChange={handleItemChange} />
            &nbsp;&nbsp;&nbsp;
            <Input
                type="text"
                data-idx={idx}
                name="primary_number"
                placeholder="Primary Number"
                value={entriesState[idx].debit}
                onChange={handleItemChange}
            />
            &nbsp;&nbsp;&nbsp;
            <Input
                type="text"
                data-idx={idx}
                name="secondary_number"
                placeholder="Secondary Number"
                value={entriesState[idx].credit}
                onChange={handleItemChange}
            />
            &nbsp;&nbsp;&nbsp;
            <Input
                type="number"
                data-idx={idx}
                name="price"
                placeholder="Price"
                value={entriesState[idx].credit}
                onChange={handleItemChange}
            />
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
        supplier: DROPDOWN_DEFAULT,
        to_warehouse: DROPDOWN_DEFAULT,
        date: { value: getDate('-') },
    });

    const setDate = value => {
        setForm(prevForm => {
            const updatedForm = { ...prevForm, date: { ...prevForm.date } };
            updatedForm.date.value = value;
            return updatedForm;
        });
    };

    const handleItemChange = (e, idx) => {
        const updatedEntries = [...entriesState];
        updatedEntries[idx][e.target.name] = e.target.value;
        setEntriesState(updatedEntries);
    };

    const setAccount = (idx, account) => {
        const updatedEntries = [...entriesState];
        updatedEntries[idx].model = account;
        setEntriesState(updatedEntries);
    };

    const handleItemDelete = (e, idx) => {
        e.preventDefault();
        const updatedEntries = [...entriesState];
        updatedEntries.splice(idx, 1);
        setEntriesState(updatedEntries);
    };

    const blankEntry = { model: '', primary_number: '', secondary_number: '', price: 0 };
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
        loadDropdownGeneric('warehouse', 'supplier', setForm);
        loadDropdownGeneric('warehouse', 'to_warehouse', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        if (form.supplier.value == form.to_warehouse.value) {
            setLoading(prevLoading => false);
            setSubmitStatus({ status: 'failure', message: 'From and To location cannot be the same' });
            return
        }
        apiAuth
            .post(
                '/transactions/goodsin',
                qs.stringify({
                    warehouse_id: form.to_warehouse.value,
                    from_warehouse_id: form.supplier.value,
                    date: form.date.value,
                    goods: JSON.stringify(entriesState),
                    document_type: 1,
                })
            )
            .then(response => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'success', message: `Goods in issued with document number ${response.data}` });
            })
            .catch(err => {
                setLoading(prevLoading => false);
                setSubmitStatus({ status: 'failure', message: 'Something went wrong\n1. Check for duplicate number\n2. Check if stock is present in the selected warehouse' });
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
                            Issue Goods In
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Goods In</h4>

                <Row>
                    <Col md={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Label for="text">Supplier</Label>
                            <FormGroup>
                                <FormInput
                                    {...form['supplier']}
                                    name="supplier"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
                            <Label for="text">To Warehouse</Label>
                            <FormGroup>
                                <FormInput
                                    {...form['to_warehouse']}
                                    name="to_warehouse"
                                    handleOnChange={handleOnChange}
                                />
                            </FormGroup>
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
                                            handleItemChange={e => handleItemChange(e, idx)}
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
