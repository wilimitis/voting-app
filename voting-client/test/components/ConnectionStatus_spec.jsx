import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  Simulate
} from 'react-addons-test-utils';
import {List, Map} from 'immutable';
import {ConnectionStatus, ConnectionStatusEnum} from '../../src/components/ConnectionStatus';
import {expect} from 'chai';

describe('ConnectionStatus', () => {

  it('renders a check icon when connected', () => {
    const connectionStatus = ConnectionStatusEnum.Connect;
    const component = renderIntoDocument(
      <ConnectionStatus connectionStatus={connectionStatus} />
    );
    const checkIcon = scryRenderedDOMComponentsWithClass(component, 'checkIcon');

    expect(checkIcon.length).to.equal(1);
  });

  it('renders a cancel icon when disconnected', () => {
    const connectionStatus = ConnectionStatusEnum.Disconnect;
    const component = renderIntoDocument(
      <ConnectionStatus connectionStatus={connectionStatus} />
    );
    const cancelIcon = scryRenderedDOMComponentsWithClass(component, 'cancelIcon');

    expect(cancelIcon.length).to.equal(1);
  });

});
