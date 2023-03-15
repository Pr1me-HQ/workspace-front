import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";

function DynamicTable({ headers, data, actions, columns, updateUrl, page, limit }) {
  const [tableData, setTableData] = useState(data.map((d, index) => ({...d, rowNum: index + 1})));

  const handleSwitch = async (d, index) => {
    const newData = [...tableData];
    newData[index].status = !d.status;
    setTableData(newData);
    try {
      await axiosClient.put(updateUrl + d.id, { status: newData[index].status });
    } catch (error) {
      console.log(error);
    } finally {
      setTableData(data);
    }
  };

  useEffect(() => {
    setTableData(data.map((d, index) => ({...d, rowNum: index + 1})));
  }, [data]);

  useEffect(() => {
    setTableData(tableData.map((d, index) => ({...d, rowNum: index + 1})));
  }, [tableData]);

  useEffect(() => {
    const newTableData = tableData.filter(d => d.status);
    setTableData(newTableData.map((d, index) => ({...d, rowNum: index + 1})));
  }, [tableData]);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((d, index) => (
          <tr key={d.id}>
            <td>{d.rowNum + (page - 1) * limit}</td>
            {columns.map((column) => (
              <td key={column.key}>{column.render(d[column.key])}</td>
            ))}
            <td>
              <div className="form-check">
                
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                  {d.status ? 
                  <span 
                    className="badge bg-success"
                    onClick={() => handleSwitch(d, index)}
                      >Активен</span> :
                  <span 
                    className="badge bg-danger"
                    onClick={() => handleSwitch(d, index)}
                      >Неактивен</span>}
                </label>
              </div>
            </td>
            <td className="d-flex justify-content-md-end">
              {actions.map((action) => (
                <button
                  key={action.icon}
                  onClick={() => action.onClick(d)}
                  className="btn btn-sm btn-primary mx-1 my-1"
                  title={action.title}
                >
                  {action.icon}
                </button>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DynamicTable;