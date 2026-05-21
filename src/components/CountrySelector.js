import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { setCountry } from '../dataStore/actions';
import setLangText from '../modules/setLangText';
import { BsChevronCompactDown } from 'react-icons/bs';
import { FaCaretDown } from "react-icons/fa";
import { s, countryArr } from '../srcSet';

class CountrySelector extends Component {

  state = {
    w: window.innerWidth,
    country:this.props.auth ? this.props.userInfo.country : this.props.setLT.select,
    countryCode:this.props.auth ? this.props.userInfo.countryCode.toLowerCase() : '',
  }

  componentDidMount () {
    this.countryMap(countryArr)
  }

  changeCountry = async (e) => {
    var searchCountry = e.target.value.toLowerCase()
    var data = countryArr.filter(x => x.country.toLowerCase().includes(searchCountry))
    this.setState({ searchCountry })
    await this.countryMap(data)
  }

  selectCountry = async (codeX, countryX, continentX) => {
    // console.log(codeX, countryX)
    this.setState({
      countryCode: codeX.toLowerCase(),
      country: countryX,
    })
    this.props.dispatch(setCountry({countryCode: codeX, country: countryX, continent: continentX}))
    // console.log(this.props.country)
  }

  countryMap = async (x) => {
    const {w, countryCode} = this.state
    const {rtl, setLT} = this.props
    var dataRv = x.map (
        (item, i) => (
            // console.log(55555555, item),
            <div key={i} className="dropdown-item" style={{padding:'3px 5px', minWidth:'150px'}}
                onClick={() => this.selectCountry(item.code, item.country, item.continent)}>
                <span className={`flag-icon flag-icon-${item.code.toLowerCase()} cardShadow`}></span>&nbsp;
                {item.country}
            </div>
        )
    )
    this.setState({
      countryList: dataRv,
    })
  }

  render() {
    const {w, country, countryCode, countryList, searchCountry} = this.state
    const {rtl, lang, setLT} = this.props

    const langBox = (
      <div className={ w<s ? "dropleft" : 'dropdown'} style={{padding:'0px', fontSize:'15px', margin:'3px 10px 0px', cursor:'pointer',}}>
        <div className='d-flex' color=''
            type="" id="dropdownMenuButton" data-bs-toggle="dropdown"
            aria-haspopup="false" aria-expanded="false"
            style={{margin:'0px', padding:'0px', borderRadius:'3px'}}>
            <div className='d-flex' style={{flexDirection:'column', alignItems:'center', fontSize:'15px'}}>
                <div className='d-flex' style={{marginBottom:'-5px', alignItems:'flex-start'}}>
                    {countryCode && <span className={`flag-icon flag-icon-${countryCode} cardShadow`}></span>} &nbsp;
                    {country}
                </div>
                {!countryCode && <BsChevronCompactDown/>}
            </div>&nbsp;
            <FaCaretDown />

        </div>
        <div className="dropdown-menu animated fadeIn" aria-labelledby="dropdownMenuButton"
              style={{fontSize:'13px', cursor:'pointer', margin:rtl ? '30px 0px 0px -50px' : '30px 0px 0px 0px', padding:'5px', height:'200px', overflow:'scroll'}}>

            <input type="text" value={searchCountry} placeholder='search ...' name='searchCountry' autoComplete="off"
                  className="form-control sticky-top"
                  style={{fontSize:'15px', textAlign:'center', margin:'0px 0px 5px', width:'100%', minWidth:'150px', height:'35px', direction:rtl ? 'rtl' : 'ltr'}}
                  onChange={this.changeCountry}/>
            {countryList}
        </div>
      </div>
    )

    return (
        <div>
          {langBox}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      mainUserId: state.userInfo['_id'],
      userInfo: state.userInfo,
      rtl: state.rtl,
      lang: state.lang,
      auth: state.auth, 
      page: state.page, 
      setLT: state.setLT,
      country: state.country,
  }
}

export default connect (mapStateToProps)(CountrySelector);
