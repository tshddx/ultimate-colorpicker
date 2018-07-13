import React from 'react';
import renderer from 'react-test-renderer';
import HomePage from './HomePage';

describe('HomePage', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<HomePage {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
