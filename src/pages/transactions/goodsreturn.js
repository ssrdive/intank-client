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

const MoveItem = ({ idx, itemState, handleItemChange, handleItemDelete, handleEnterPressed }) => {

    return (
        <Form key={idx} inline>
            <label style={{ color: 'green' }}>{itemState[idx].model}</label>
            &nbsp;&nbsp;&nbsp;
            <Input
                type="text"
                data-idx={idx}
                name="primaryNumber"
                className="primaryNumber"
                placeholder="Primary Number"
                value={itemState[idx].primaryNumber}
                onChange={(e) => {handleItemChange(e, idx)}}
                onKeyDown={handleEnterPressed}
            />
            &nbsp;&nbsp;&nbsp;
            <label style={{ color: 'green' }}>{itemState[idx].secondaryNumber}</label>
            &nbsp;&nbsp;&nbsp;
            <Input
                type="number"
                data-idx={idx}
                name="price"
                className="price"
                placeholder="Price"
                value={itemState[idx].price}
                onChange={(e) => {handleItemChange(e, idx)}}
            />
            &nbsp;&nbsp;&nbsp;
            <Button color='warning'
                onClick={handleItemDelete}>Remove</Button>
            <br /><br />
        </Form>
    );
};

const GoodsIn = () => {
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ status: null, message: '' });

    const [form, setForm] = useState({
        from: DROPDOWN_DEFAULT,
        to: DROPDOWN_DEFAULT,
        date: { value: getDate('-') },
    });

    const blankItem = { model: 'Model', primaryNumber: '', secondaryNumber: 'Primary Number', price: '' };
    const [itemState, setItemState] = useState([
        { model: 'Model', primaryNumber: '', secondaryNumber: 'Primary Number', price: '' }
    ]);

    const handleEnterPressed = (e, idx) => {
        if (e.keyCode === 13) {
            setPrimaryNumberModelHandler(idx, 'Loading...', 'Loading...');
            apiAuth.post('/getSecondaryNumberModelName', qs.stringify({ primaryNumber: itemState[idx].primaryNumber }))
                .then(response => {
                    const { secondaryNumber, model } = response.data;
                    console.log(secondaryNumber);
                    console.log(response.data);
                    setPrimaryNumberModelHandler(idx, secondaryNumber, model);
                })
                .catch(error => {
                    setPrimaryNumberModelHandler(idx, 'Error', 'Error');
                })
        }
    }

    const setPrimaryNumberModelHandler = (idx, primaryNumber, model) => {
        const updatedItems = [...itemState];
        updatedItems[idx].secondaryNumber = primaryNumber;
        updatedItems[idx].model = model;
        setItemState(prevItemState => updatedItems);
    }


    const setDate = value => {
        setForm(prevForm => {
            const updatedForm = { ...prevForm, date: { ...prevForm.date } };
            updatedForm.date.value = value;
            return updatedForm;
        });
    };

    const handleItemChange = (e, idx) => {
        const updatedItems = [...itemState];
        updatedItems[idx][e.target.name] = e.target.value;
        setItemState(updatedItems);
    }

    const handleItemDelete = (e, idx) => {
        e.preventDefault();
        const updatedItems = [...itemState];
        updatedItems.splice(idx, 1);
        setItemState(updatedItems);
    }

    useEffect(() => {
        loadDropdownGeneric('warehouse', 'from', setForm);
        loadDropdownGeneric('warehouse', 'to', setForm);
    }, []);

    const handleFormSubmit = e => {
        setLoading(prevLoading => true);
        setSubmitStatus({ status: null, message: '' });
        e.persist();
        e.preventDefault();
        if (form.to.value == form.from.value) {
            setLoading(prevLoading => false);
            setSubmitStatus({ status: 'failure', message: 'From and To location cannot be the same' });
            return
        }
        apiAuth
            .post(
                '/transactions/movement',
                qs.stringify({
                    document_type: 4,
                    warehouse_id: form.from.value,
                    from_warehouse_id: form.to.value,
                    date: form.date.value,
                    goods: JSON.stringify(itemState)
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

    const handleOnChange = e => {
        e.persist();
        setForm(prevForm => {
            const updatedForm = { ...prevForm, [e.target.name]: { ...prevForm[e.target.name] } };
            updatedForm[e.target.name].value = e.target.value;
            return updatedForm;
        });
    };

    const addItem = () => {
        setItemState([...itemState, { ...blankItem }]);
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
                            Issue Goods Return
                        </Button>
                    )}
            </>
        );
    };

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0">Goods Return</h4>

                <Row>
                    <Col md={12}>
                        <Form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="text">From</Label>
                                        <FormInput
                                            {...form['from']}
                                            name="from"
                                            handleOnChange={handleOnChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="text">To</Label>
                                        <FormInput
                                            {...form['to']}
                                            name="to"
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
                            <Button color="info" onClick={addItem}>
                                Add
                            </Button>
                            <br />
                            <br />
                            {
                                itemState.map((val, idx) => {
                                    return (
                                        // <GridItem key={idx} xs={12} sm={12} md={12}>
                                        <MoveItem
                                            idx={idx}
                                            itemState={itemState}
                                            handleItemChange={handleItemChange}
                                            handleEnterPressed={(e) => handleEnterPressed(e, idx)}
                                            handleItemDelete={(e) => handleItemDelete(e, idx)}
                                        />
                                        // </GridItem>
                                    );
                                })
                            }
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
