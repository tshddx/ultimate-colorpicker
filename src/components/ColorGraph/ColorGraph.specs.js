import React from 'react';
import renderer from 'react-test-renderer';
import ColorGraph from './ColorGraph';

describe('ColorGraph', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ColorGraph {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
