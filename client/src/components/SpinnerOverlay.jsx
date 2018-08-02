import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './SpinnerOverlay.css';

const SpinnerOverlay = ({ className, show, ...props }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={cn('spinner_overlay', className)} {...props}>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

SpinnerOverlay.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool,
};

SpinnerOverlay.defaultProps = {
  className: undefined,
  show: true,
};

export default SpinnerOverlay;
