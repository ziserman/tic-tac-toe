import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';

import { App } from './components/App/App';


configure({
    enforceActions: (process.env.NODE_ENV !== 'development')
        ? 'never'
        : 'always',
    isolateGlobalState: true
});

ReactDOM.render(
    <App />,
    document.getElementById('app-root')
);
