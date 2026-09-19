import { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';

import type { RootState } from '../store/store';

type AddressUser = {
    bizName?: string;
    username?: string;
    businessType?: number;
};

type Address = {
    content: unknown[];
    user?: AddressUser;
    fix: string;
};

type AddressbarProps = {
    isAuthenticated: boolean;
    setLT: Record<string, string>;
    lang: string;
    address: Address;
};

class Addressbar extends Component<AddressbarProps> {
    render() {
        const {
            setLT,
            address,
        } = this.props;

        const {
            user,
            fix,
        } = address;

        const UN = user?.bizName
            ? user.bizName
            : user?.username;

        const indicator = (
            <FaAngleRight
                style={{ margin: '0px 5px' }}
            />
        );

        const homeNav = (
            <div
                className="d-flex"
                style={{ alignItems: 'center' }}
            >
                <Link
                    to="/"
                    className="link-underline"
                >
                    {setLT.home}
                </Link>

                {indicator}
            </div>
        );

        const root =
            user?.businessType && user.businessType > 0
                ? 'publisher'
                : 'user';

        const userNav = (
            <div
                className="d-flex"
                style={{ alignItems: 'center' }}
            >
                <Link
                    to={`/${root}/${user?.username}`}
                    className="link-underline-white"
                    style={{ color: '#ffffff' }}
                >
                    {UN}
                </Link>

                {indicator}
            </div>
        );

        return (
            <div>
                <div
                    style={{
                        padding: '10px',
                        fontWeight: 450,
                        color: '#ffffff',
                        backgroundColor: '#ffffff00',
                    }}
                >
                    <Container>
                        <div className="d-flex">
                            {homeNav}

                            {user && userNav}

                            <span
                                className="white-nav font-light"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                {fix}
                            </span>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): AddressbarProps => {
    return {
        setLT: state.app.setLT,
        lang: state.app.lang,
        isAuthenticated: state.auth.isAuthenticated,
        address: state.app.address,
    };
};

export default connect(mapStateToProps)(Addressbar);