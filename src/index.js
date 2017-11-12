import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';

const MOUNT_NODE = document.getElementById('root')

render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), MOUNT_NODE);
