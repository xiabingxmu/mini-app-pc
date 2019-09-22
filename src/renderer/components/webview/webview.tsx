import { Component } from 'react';
import * as React from 'react';
import { WebviewTag } from 'electron';

export interface Props {
    src: string;
}

declare module JSX {
  interface IntrinsicElements {
      webview: WebviewTag;
  }
}

export default class webview extends Component<Props> {
    state = {
        count: 0
    };
    componentDidMount() {
      const webview: WebviewTag | null = document.querySelector('webview');
      if (webview) {
        webview.addEventListener('dom-ready', () => {
          webview.openDevTools();
          webview.send('start', { count: this.state.count });
          webview.addEventListener('ipc-message', event => {
      // ipc-message监听，被webview加载页面传来的信息
            console.log(event);
            if (event.channel === 'start') {
              const data = event.args[0];
              this.setState({
                count: data.count
            });
              this.sendMsgToWebView({
                count: data.count
            });
          }
        });
      });
    }
  }
    sendMsgToWebView = (data: any) => {
        const webview: WebviewTag | null = document.querySelector('webview');
        if (webview) {
          console.log('send start');
          webview.send('start', data);
      }
    };
    handleSendMsgClick = () => {
        this.sendMsgToWebView({ count: 1 });
    };
    render() {
      const { src } = this.props;
      return (
      <div>
        <a href="#" onClick={this.handleSendMsgClick}>
          发送消息
        </a>
        <div>{this.state.count}</div>
        <webview
          nodeintegration="true"
          src={src}
          style={{ width: '80vw', height: '100vh' }}
        />
      </div>
    );
  }
}
