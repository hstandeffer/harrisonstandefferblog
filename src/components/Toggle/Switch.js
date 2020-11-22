import React from 'react'
import './Switch.css'

const Switch = ({ isOn, handleToggle, onColor  }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <div style={{ marginLeft: `2px`}}>
          <span aria-label="moon" role="img">🌙</span>
        </div>
        <div style={{ marginRight: `2px`}}>
          <span aria-label="sun" role="img">☀️</span>
        </div>
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;