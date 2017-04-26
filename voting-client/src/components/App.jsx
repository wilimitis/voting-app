import React from 'react';
import {ConnectionStatusContainer} from './ConnectionStatus';

export default React.createClass({
  render: function() {
    return <div>
      <ConnectionStatusContainer/>
      {this.props.children}
    </div>
  }
});
