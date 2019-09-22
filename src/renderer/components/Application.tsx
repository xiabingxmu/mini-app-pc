import { hot } from 'react-hot-loader/root';
import webview from './webview/webview';
import * as React from 'react';

const Application = () => (
  <div>
    <WebView src="http://localhost:3000/"/>
  </div>
);

export default hot(Application);
