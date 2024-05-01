const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleRecord = (e, onRecordAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#recordName').value;
    const age = e.target.querySelector('#recordAge').value;
    const level = e.target.querySelector('#recordLevel').value;

    if (!name || !age || !level) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, level }, onRecordAdded);
    return false;
};

const RecordForm = (props) => {
    return (
        <form id="recordForm"
            onSubmit={(e) => handleRecord(e, props.triggerReload)}
            name="recordForm"
            action="/maker"
            method="POST"
            className="recordForm"
        >
            <lable htmlFor="name">Name: </lable>
            <input id="recordName" type="text" name="name" placeholder="Record Name" />
            <lable htmlFor="age">Age: </lable>
            <input id="recordAge" type="number" min="0" name="age" />
            <lable htmlFor="level">Level: </lable>
            <input id="recordlevel" type="number" min="0" name="level" />
            <input className="makeRecordSubmit" type="submit" value="Make Record" />
        </form>
    );
};

const RecordList = (props) => {
    const [records, setRecords] = useState(props.records);

    useEffect(() => {
        const loadRecordsFromServer = async () => {
            const response = await fetch('/getRecords');
            const data = await response.json();
            setRecords(data.records);
        };
        loadRecordsFromServer();
    }, [props.reloadRecords]);

    if (records.length === 0) {
        return (
            <div className="recordList">
                <h3 className="emptyRecord">No Records Yet!</h3>
            </div>
        );
    }

    const recordNodes = records.map(record => {
        return (
            <div key={record.id} className="record">
                <img src="/assets/img/recordface.jpeg" alt="record face" className="recordFace" />
                <h3 className="recordName">Name: {record.name}</h3>
                <h3 className="recordAge">Age: {record.age}</h3>
                <h3 className="recordLevel">Level: {record.level}</h3>
            </div>
        );
    });

    return (
        <div className="recordList">
            {recordNodes}
        </div>
    );
};

const handlePasswordChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { pass, pass2 });

    return false;
}

const PasswordChangeWindow = (props) => {
    return (
        <form id="passwordChangeForm"
            name="passwordChangeForm"
            onSubmit={handlePasswordChange}
            action="/changePassword"
            method="POST"
            className="mainForm"
        >
            <lable htmlFor="pass">New Password: </lable>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <lable htmlFor="pass">New Password: </lable>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
}

const App = () => {
    const [reloadRecords, setReloadRecords] = useState(false);

    return (
        <div>
            <div id="makeRecord">
                <RecordForm triggerReload={() => setReloadRecords(!reloadRecords)} />
            </div>
            <div id="records">
                <RecordList records={[]} reloadRecords={reloadRecords} />
            </div>
        </div>
    );
};

const init = () => {
    const recordsButton = document.getElementById('recordsButton');
    const changePasswordButton = document.getElementById('changePasswordButton');

    const root = createRoot(document.getElementById('app'));

    recordsButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < App /> );
        return false;
    });

    changePasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < PasswordChangeWindow /> );
        return false;
    });

    root.render( < App /> );
}

window.onload = init;