import React from 'react';
import {connect} from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {MdCancel, MdCheck} from 'react-icons/lib/md';
import * as actionCreators from '../action_creators';

export const ConnectionStatusEnum = {
  Connect: 'connect',
  ConnectError: 'connect_error',
  ConnectTimeout: 'connect_timeout',
  Reconnect: 'reconnect',
  Reconnecting: 'reconnecting',
  ReconnectError: 'reconnect_error',
  ReconnectFailed: 'reconnect_failed',
  Disconnect: 'disconnect',
};

export class ConnectionStatus extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <div className="connectionStatus">
      Connection: {
        this.props.connectionStatus === ConnectionStatusEnum.Connect ?
          <MdCheck className='checkIcon' color='green'/> : <MdCancel className='cancelIcon' color='red'/>
      }
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    connectionStatus: state.get('connectionStatus')
  };
}

export const ConnectionStatusContainer = connect(
  mapStateToProps
)(ConnectionStatus);
