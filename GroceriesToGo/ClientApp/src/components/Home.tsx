import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
    <div>
        <br />
        <h2>Thank you for choosing GroceriesToGo!</h2>
        <br/>
    <p>Click "Shop" to find items by category.</p>
    
  </div>
);

export default connect()(Home);
