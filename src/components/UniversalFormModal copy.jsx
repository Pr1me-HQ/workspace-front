import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import AsyncSelect from 'react-select/async';

function DynamicForm({ show, name, handleClose, fields, data, onSuccess, url, formType, showConfirmation, setShowConfirmation }) {

  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  console.log(formData);

  useEffect(() => {
    setFormData(data || {});
    setErrors({});
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Remove the roles property from the formData object
      const { roles, ...formDataWithoutRoles } = formData;
  
      if (!data.id) {
        const result = await axiosClient.post(url, formDataWithoutRoles);
        console.log(result);
        setNotification("Успешно добавлено");
      } else {
        await axiosClient.put(url + formData.id, formDataWithoutRoles);
        setNotification("Успешно обновлено");
      }
  
      // Reset form data
      const newFormData = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, null]));
      setFormData(newFormData);
  
      onSuccess();
      handleClose();
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  };
  
  
  const getParent = (id, data) => {
    const object = data.find((c) => c.id === id);
    return object;
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(url + formData.id);
      onSuccess();
      handleClose();
      setShowConfirmation(false); // close confirmation modal
      setNotification("Успешно удалено");
    } catch (error) {
      console.log(error);
    }
  };

  const renderChildren = (data, depth = 0) => {
    return data.map((object) => {
      const indentation = " ".repeat(depth * 2);
      if (object.childrens && object.childrens.length > 0) {
        return [
          <option key={object.id} value={object.id}>
            {indentation + object.title || object.name}
          </option>,
          renderChildren(object.childrens, depth + 1),
        ];
      } else {
        return (
          <option key={object.id} value={object.id}>
            {indentation + object.title || object.name}
          </option>
        );
      }
    });
  };
  
  const getAllChildren = (object, allChildren = []) => {
    object.childrens.forEach((child) => {
      allChildren.push(child);
      getAllChildren(child, allChildren);
    });
    return allChildren;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: [] });
  };

  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <Form.Group key={field.name} controlId={field.name} id="form">
            <Form.Label>{field.label}</Form.Label>
            <Form.Select
              name={field.name}
              value={formData[field.name] ? formData[field.name] : data[field.name]}
              onChange={handleChange}
            >
              { 
              //  if data has id, then set selected the option with the same id else set the first option as selected
              data.parent_id ? (
                // set title or name of the parent category as text of the option
                <option value={data.parent_id}>
                  {getParent(data.parent_id, field.options)?.title ||
                    getParent(data.parent_id, field.options)?.name}
                </option>
              ) : (
                <option value="0">Выберите {field.label}</option>
              )
              }
              {field.options &&
                field.options.map((object) => {
                  if (object.childrens && object.childrens.length > 0) {
                    return [
                      <option key={object.id} value={object.id}>
                        {object.title || object.name}
                      </option>,
                      renderChildren(object.childrens),
                    ];
                  } 
                  else {
                    return (
                      <option key={object.id} value={object.id}>
                        {object.title || object.name}
                      </option>
                    );
                  }
                })}
            </Form.Select>
            {errors[field.name] &&
              errors[field.name].length > 0 &&
              errors[field.name].map((error, index) => (
                <Form.Text key={index} className="text-danger">
                  {error}
                </Form.Text>
              ))}
          </Form.Group>
        );
      default:
        return (
          <Form.Group key={field.name} controlId={field.name} >
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type || "text"}
              name={field.name}
              autoFocus={field.name === fields[0].name}
              value={
                formData[field.name] !== null
                  ? formData[field.name]
                  : data[field.name]
              }
              onChange={handleChange}
              
            />
            {errors[field.name] &&
              errors[field.name].length > 0 &&
              errors[field.name].map((error, index) => (
                <Form.Text key={index} className="text-danger">
                  {error}
                </Form.Text>
              ))}
          </Form.Group>
        );
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {fields.map((field) => renderField(field))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {formType === "edit" && (
            <Button variant="danger" onClick={() => setShowConfirmation(true)}>
              Удалить
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmationModal
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleDelete={handleDelete}
        name={data.name || data.title}
        url={url}
        id={data.id}
      />
    </>
  );
};

export default DynamicForm;