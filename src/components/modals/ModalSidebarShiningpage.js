import React, { forwardRef } from 'react';
import { setToggleSidebar } from '../../dataStore/actions';

const ModalSidebarShiningpage = forwardRef(({ rtl, content, isOpen, dispatch }, ref) => {

    function onOutside (e) {
        if(e.target.id==='outside') {
            dispatch(setToggleSidebar(false))
        }
    }

    return (
        <div id='outside'
            ref={ref} // مرجع برای سایدبار
            className={`sidebar sidebar-left ${isOpen ? 'open' : ''}`}
            style={{
                direction: '',
                height: '100vh',
                overflow: 'auto'
            }}
            onClick={(e) => onOutside(e)}
        >
            <div className='cardShadow sidebarBack' style={{width:'300px', backgroundSize: 'cover',}}>
                {content}
            </div>
        </div>
    );
});

export default ModalSidebarShiningpage;