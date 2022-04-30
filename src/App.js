import React, { useState, useEffect, useRef } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Input from "./containers/input.jsx";
import { GetToken, GetMembers, InsertMember } from "./containers/request.jsx";

import BootstrapTable from "react-bootstrap-table-next";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Notification } from "./containers/Notification.jsx";

function App() {
  const [Data, setData] = useState({
    FirstName: {
      value: null,
      attributes: { readOnly: false, label: "First Name", id: "FirstName" },
    },
    LastName: {
      value: "",
      attributes: { readOnly: false, label: "Last Name", id: "LastName" },
    },
    Address: {
      value: "",
      attributes: { readOnly: false, label: "Address", id: "Address" },
    },
    SSN: {
      value: "",
      attributes: { readOnly: false, label: "SSN", id: "SSN" },
    },
  });

  const [token, setToken] = useState(null);
  const [persons, setPersons] = useState([]);

  const columns = [
    {
      dataField: "firstName",
      text: "First Name",
    },
    {
      dataField: "lastName",
      text: "Last Name",
    },
    {
      dataField: "address",
      text: "Address",
    },
    {
      dataField: "ssn",
      text: "SSN",
    },
  ];

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let newAttributes = Data[name].attributes;
    let _Data = Object.assign({}, Data, {
      [name]: { value: value, attributes: newAttributes },
    });

    setData(_Data);
  };

  const onResetClick = () => {
    const _Data = { ...Data };

    _Data.FirstName.value = "";
    _Data.LastName.value = "";
    _Data.Address.value = "";
    _Data.SSN.value = "";

    setData(_Data);
  };

  const validateData = (showAlert = true) => {
    try {
      if (Data.FirstName.value.trim().length == 0) {
        showAlert && Notification.warning("First Name is required");
        return false;
      }

      if (Data.LastName.value.trim().length == 0) {
        showAlert && Notification.warning("Last Name is required");
        return false;
      }

      if (Data.Address.value.trim().length == 0) {
        showAlert && Notification.warning("Address is required");
        return false;
      }

      if (Data.SSN.value.trim().length == 0) {
        showAlert && Notification.warning("SSN is required");
        return false;
      }

      const regex = /^\d{3}-\d{2}-\d{4}$/;

      if (!regex.test(Data.SSN.value)) {
        showAlert &&
          Notification.warning("Invalid SSN, expected format: ###-##-####");
        return false;
      }

      const p = persons.findIndex((m) => m.ssn === Data.SSN.value);
      if (p !== -1) {
        showAlert && Notification.warning("Can't duplicate SSN");
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const onSaveClick = async () => {
    try {
      if (validateData()) {
        let _persons = [...persons];

        const item = {
          firstName: Data.FirstName.value,
          lastName: Data.LastName.value,
          address: Data.Address.value,
          ssn: Data.SSN.value,
        };

        const response = await InsertMember(token, item);

        if (response) {
          _persons.push(item);
          setPersons(_persons);
          Notification.success("Data added successfully");
        }
      }
    } catch (e) {
      Notification.error(e.response.data.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadData();
    };
    load();
  }, []);

  const getTokenRequest = async () => {
    const response = await GetToken();
    if (response !== null) {
      setToken(response.token);
      return response.token;
    }
  };

  const getMembersRequest = async (pToken) => {
    const response = await GetMembers(pToken);

    if (response !== null) {
      setPersons(response);
    } else {
      Notification.error("Error loading members");
    }
  };

  const loadData = async () => {
    const _token = await getTokenRequest();
    await getMembersRequest(_token);
  };

  const onComplete = async () => {
    await getMembersRequest(token);
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Test
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-2">
        <div className="row">
          <div className="col">
            <div className="row mt-2 mb-2">
              <Input
                id={Data.FirstName.attributes.id}
                placeholder={Data.FirstName.attributes.label}
                value={Data.FirstName.value}
                readOnly={Data.FirstName.attributes.readOnly}
                onChange={onChange}
              />

              <Input
                id={Data.LastName.attributes.id}
                placeholder={Data.LastName.attributes.label}
                value={Data.LastName.value}
                readOnly={Data.LastName.attributes.readOnly}
                onChange={onChange}
              />

              <Input
                id={Data.Address.attributes.id}
                placeholder={Data.Address.attributes.label}
                value={Data.Address.value}
                readOnly={Data.Address.attributes.readOnly}
                onChange={onChange}
              />

              <Input
                id={Data.SSN.attributes.id}
                placeholder={Data.SSN.attributes.label}
                value={Data.SSN.value}
                readOnly={Data.SSN.attributes.readOnly}
                onChange={onChange}
              />

              <div className="row">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onResetClick}
                  >
                    Reset
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSaveClick}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col mt-2">
            <BootstrapTable keyField="SSN" data={persons} columns={columns} />
          </div>
        </div>
      </div>
      <div className="d-none">
        <CountdownCircleTimer
          isPlaying
          duration={120}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => {
            onComplete();
            return { shouldRepeat: true, delay: 1.5 };
          }}
        ></CountdownCircleTimer>
      </div>
    </div>
  );
}

export default App;
