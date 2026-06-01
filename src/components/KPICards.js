import React from 'react';

const KPICards = ({ icon, title, value, width, loader }) => {
  const loader13 = <div className='loader-13' style={{margin: '-20px 20px 0px', color:'', fontSize:'14px'}}></div>

  return (
    <div className='d-flex cardShadow' style={{width, backgroundColor:'#ffffff', borderRadius:'10px', padding:'20px'}}>
      <div style={{marginRight:'15px'}}>
        {icon}
      </div>
      <div>
        <div style={{fontWeight:450, marginBottom:'10px'}}>
          {title}
        </div>
        <h3 style={{margin:'0px'}}>
          {!loader ? value : loader13}
        </h3>
      </div>
    </div>
  );
};

export default KPICards;