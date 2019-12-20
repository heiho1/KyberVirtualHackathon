import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

const Confirmed = () => (
  <div className="container loading">
    <div className="row">
      <div className="col-md-12 text-center pt-4">
        <FontAwesomeIcon size='2x' color='green' icon={faCheckCircle} />
      </div>
    </div>
  </div>
);

export default Confirmed;
