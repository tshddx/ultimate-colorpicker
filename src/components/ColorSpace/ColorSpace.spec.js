import React from 'react';
import renderer from 'react-test-renderer';
import ColorSpace from './ColorSpace';

describe('ColorSpace', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ColorSpace {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
