import React from 'react';
import PropTypes from 'prop-types';

import 'src/assets/stylesheets/base.scss';


function App() {
  return (
    <h1>Hello!</h1>
  );
};

App.propTypes = {
  name: PropTypes.string
};

export default App;
