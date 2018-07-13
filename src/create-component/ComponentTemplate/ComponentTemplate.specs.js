import React from 'react';
import renderer from 'react-test-renderer';
import ComponentTemplate from './ComponentTemplate';

describe('ComponentTemplate', () => {
  xit('renders correctly', () => {
    const props = { exampleProp: true };
    const component = renderer.create(<ComponentTemplate {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
