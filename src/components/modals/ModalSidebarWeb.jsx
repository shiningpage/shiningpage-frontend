import React, { forwardRef } from 'react';

const ModalSidebar = forwardRef(({ 
    rtl, aboutImgSrc, logoSide, sections, themeSub, shareSub, profileBox,
    QRCode, loginNav, version, updateVersion, isOpen, toggleSidebar, mobile
}, ref) => {

    function onOutside (e) {
        if(e.target.id==='outside') {
            toggleSidebar()
        }
    }

    const currentVersion = (
        <div className='center' style={{paddingTop:'10px'}}>
            Current Version: {version}
        </div>
    )

    const versionSection = (
        <div style={{ backgroundColor: '#ffffff' }}>
            {/* loginNav */}
            {currentVersion}
            {updateVersion}
        </div>
    )

    return (
        <div id='outside'
            ref={ref} // مرجع برای سایدبار
            style={{ backgroundColor: mobile ? '' : '#00000050' }}
            className={`sidebar ${rtl ? 'sidebar-right' : 'sidebar-left'} ${isOpen ? 'open' : ''}`}
            onClick={(e) => onOutside(e)}
        >
            <div
                className='cardShadow'
                style={{
                    backgroundImage: `url(${aboutImgSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    width:'300px', 
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <div style={{ width: '100%', backgroundColor: '#ffffff99' }}>
                    <div style={{ width: '100%', backgroundColor: '#ffffff50' }}>
                        <div id='sidebar-header' className='center'
                            style={{ height: '72px', padding: '10px', borderBottom: '1px solid #99999999',
                                backgroundColor: '#ffffff50', position: 'sticky', top: 0, zIndex: 1000 }}
                        >
                            {profileBox}
                            {/* logoSide */}
                            <div className='close-btn'
                                style={{ position: 'fixed', left: rtl ? 'initial' : 10,
                                    right: rtl ? 10 : 'initial', top: 10, zIndex: 1001 }}
                                onClick={toggleSidebar}
                            >×</div>
                        </div>
                        <div style={{ height: 'calc(100vh - 72px)', overflow: 'auto' }}>
                            {sections}
                            {versionSection}
                            {shareSub}
                            {QRCode}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ModalSidebar;