import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import 'antd/dist/antd.css';

export default () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => <Redirect to="/information" push />} />
            <Route path="/" component={App} />  
        </Switch>
    </Router>
);
