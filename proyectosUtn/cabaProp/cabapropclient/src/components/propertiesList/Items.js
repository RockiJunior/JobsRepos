import React from 'react'

const Items = ({ currentItems }) => {
    return (
      <>
        {currentItems &&
          currentItems.map((item) => (
            <div>
              <h3>Item #{item._id}</h3>
            </div>
          ))}
      </>
    );
  }

  export default Items