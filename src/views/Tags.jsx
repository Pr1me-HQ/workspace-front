import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import loading_icon from "../assets/icons/loading.svg";
import DynamicTable from "../components/GenericTable.jsx";
import DynamicForm from "../components/UniversalFormModal.jsx";
import { Pagination } from "../components/Pagination.jsx";

export default function Tags() {
  const [showForm, setShowForm] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = '/tags/'
  const keys = ['name']
  const headers = keys.map(key => key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));
  
  function getTags() {
    setLoading(true);
    axiosClient.get(baseUrl, 
      {
        params: {
          search: search ? search : null,
          page: currentPage ? currentPage : 1,
          limit: 10
        }
      })
      .then(({data}) => { 
        setTags(data.data);
        setCurrentPage(data.meta.current_page);
        setLoading(false);
      }
    )
   
     .catch((error) => {
        console.log(error)
        setLoading(false);
      }
    )
  }
  
  useEffect(() => {
    getTags();
  }, [])

  const tagsFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      required: true,
    }
  ]

  const onDeleteClick = (tag) => {
      setSelectedTag(tag);
      setShowConfirmation(true);
  }
    
  const generateColumns = () => {
    let columns = keys.map(key => {
      if (key === 'branch') {
        return {
          key: key,
          render: (value) => <>{value?.name}</>,
        }
      } else if (key === 'region') {
        return {
          key: key,
          render: (value) => <>{value?.title}</>,
        }
      } else {
        return {
          key: key,
          render: (value) => <>{value}</>,
        }
      }
    });
      
    return columns;
  }
    

  const columns = generateColumns();

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTag({});
  }
  
  const handleEditClick = (tag) => {
    setSelectedTag(tag);
    console.log('selected tag', tag)
    setShowForm(true);
  }
  

  const handleAddTag = () => {
      setSelectedTag({});
      setShowForm(true);
      clearForm();
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">Tags</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
        <div className="form-group">
        <input type="text" className="form-control" placeholder="Search" onChange={handleSearchChange} />
      </div>
        <Button variant="primary" onClick={handleAddTag}> 
            Add Tag
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {loading ? (
            <table className="table table-striped">
            <tbody>
              <tr>
                <td colSpan={headers.length} className="text-center">
                  <img src={loading_icon} width="40px" alt="Loading" />
                </td>
              </tr>
            </tbody>
          </table>
          ) : (
            <DynamicTable
              headers={headers}
              data={tags}
              columns={columns}
              actions={[
                {
                  icon: "Изменить",
                  onClick: handleEditClick,
                },
                {
                  icon: "Удалить",
                  onClick: onDeleteClick,
                },
              ]}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            setCurrentPage={setCurrentPage}
            getTags={getTags}
          />
        </div>
      </div>
      <DynamicForm
        show={showForm}
        handleClose={handleCloseForm}
        fields={tagsFields}
        data={selectedTag}
        onSuccess={getTags}
        formType={selectedTag.id ? "Edit" : "Add"}
        url={baseUrl}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}