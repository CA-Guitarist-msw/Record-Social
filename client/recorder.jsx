const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleRecord = (e, onRecordAdded) => {
    e.preventDefault();
    helper.hideError();

    const albumTitle = e.target.querySelector('#recordAlbumTitle').value;
    const comments = e.target.querySelector('#recordComments').value;
    const rating = e.target.querySelector('#recordRating').value;

    if (!albumTitle || !comments || !rating) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { albumTitle, comments, rating }, onRecordAdded);
    return false;
};

const RecordForm = (props) => {
    return (
        <form id="recordForm"
            onSubmit={(e) => handleRecord(e, props.triggerReload)}
            name="recordForm"
            action="/recorder"
            method="POST"
            className="mainForm"
        >
            <lable htmlFor="albumTitle">Album Title: </lable>
            <input id="recordAlbumTitle" type="text" name="albumTitle" placeholder="Record Name" />
            <lable htmlFor="comments">Comments: </lable>
            <input id="recordComments" type="text" name="age" />
            <lable htmlFor="rating">Rating: </lable>
            <input id="recordRating" type="number" min="0" max="10" name="rating" />
            <input className="createRecordSubmit" type="submit" value="Create Record" />
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
                <img src="/assets/img/record.png" alt="record" className="record" />
                <h3 className="recordAlbumTitle">Album Title: {record.albumTitle}</h3>
                <h3 className="recordComments">Comments: {record.comments}</h3>
                <h3 className="recordRating">Rating: {record.rating}</h3>
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

const handlePlaylist = (e) => {
    e.preventDefault();
    helper.hideError();
}

const PlaylistsWindow = (props) => {
    return (
        <form id="playlistForm"
            name="playlistForm"
            onSubmit={handlePlaylist}
            action="/playlist"
            method="POST"
            className="mainForm"
        >
            <lable htmlFor="playlistTitle">Playlist Title: </lable>
            <input id="playlistTitle" type="text" name="playlistTitle" placeholder="Playlist Title" />
            <lable htmlFor="songs">Songs: </lable>
            <input id="songs" type="text" name="songs" placeholder="Playlist Songs" />
            <input className="formSubmit" type="submit" value="Create Playlist" />
        </form>
    );
}

const handlePremium = (e) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action);

    return false;
}

const PremiumWindow = (props) => {
    return (
        <form id="premiumForm"
            name="premiumForm"
            onSubmit={handlePremium}
            action="/premium"
            method="POST"
            className="mainForm"
        >
            <lable htmlFor="premium">Toggle Premium: </lable>
            <input className="formSubmit" type="submit" value="Toggle Premium" />
        </form>
    );
}

const App = () => {
    const [reloadRecords, setReloadRecords] = useState(false);

    return (
        <div>
            <div id="createRecord">
                <RecordForm triggerReload={() => setReloadRecords(!reloadRecords)} />
            </div>
            <div id="records">
                <RecordList records={[]} reloadRecords={reloadRecords} />
            </div>
        </div>
    );
};

const init = () => {
    const homeButton = document.getElementById('homeButton');
    const recordsButton = document.getElementById('recordsButton');
    const createButton = document.getElementById('createButton');
    const playlistsButton = document.getElementById('playlistsButton');
    const premiumButton = document.getElementById('premiumButton')
    const changePasswordButton = document.getElementById('changePasswordButton');

    const root = createRoot(document.getElementById('app'));

    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < App /> );
        return false;
    });

    recordsButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < App /> );
        return false;
    });

    createButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < RecordForm /> );
        return false;
    });

    playlistsButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < PlaylistsWindow /> );
        return false;
    });

    premiumButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( < PremiumWindow /> );
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