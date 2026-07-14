import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { setUserInfo, setSubUserInfo} from '../../dataStore/actions';
import male from '../../assets/images/other/man2.png';
import female from '../../assets/images/other/woman2.png';
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdSearch } from 'react-icons/io';
import { RiUserAddFill } from 'react-icons/ri';
import { exist } from '../../helper';
import { serverURL, s, listRefreshQty } from '../../srcSet';

class ModalTeam extends Component{

	state = {
		w: document.body.clientWidth,
		searchUsers: '',
		searchMember: [],
		userAccessList: [],
	}

	componentDidMount = async () => {
		window.addEventListener("resize", this.onResize)
		this.startSearch()
	}

	// componentDidUpdate = async(prevProps) => {
	// 	if (this.props.toggleTeam && !this.state.getTeam) {
	// 		console.log('teamArr: ', this.props.team)
	// 	}
	// }

	changeUsername = (e) => {
		this.setState({
			searchUsers: e.target ? e.target.value.toLowerCase() : e,
			n:0,
		})
	}

	scrollSearch = async () => {
		this.setState({
				loadingData: true,
		})

		var data = {
				username: this.state.searchUsers,
				n:this.state.n,
				q:listRefreshQty //this.state.w<s ? listRefreshQtySmall : listRefreshQtyBig
		}

		// console.log(res.data)
		await axios.post(`${serverURL}/user/findUser`, data).then( async res => {
			delete res.data.password
			// console.log('nnn', res.data)
			var x2 = res.data
			this.setState(
				(prevState) => ({
					searchData: [...prevState.searchData, ...x2], // اضافه کردن x2 به searchData
					finishData: res.data.length < listRefreshQty, // شرط ساده‌تر
					n: prevState.n + 1, // افزایش مقدار n
				}),
				() => {
					// انجام عملیات وابسته به searchData در callback
					this.searchMemberMap(this.state.searchData);
				}
			);
		});

	}

	searchMemberMap = async (x) => {
		var addUser, countryCode, userCountry, userImage, tableInfo
		const {w, n,} = this.state
		const {rtl, setLT} = this.props
		var dataRv = x.map (
				(item, i) => (
						//console.log(55555555, item),
						userImage = (
								<div>
										<img
											className={`C${item.fc>=0 ? item.fc : ''} btnShadow`}
											style={{objectFit: 'contain', minWidth:"50px", minHeight:"50px", width:"50px", height:"50px", borderRadius:item.businessType>0 ? '3px' : '100px', margin:'0px', border:'2px solid #ffffff40', padding:'2px', cursor:'pointer'}}
											src={ exist(item.profileIndex)
													? `https://www.pix.shiningpage.com/whoraly/profile/small/${item._id}-${item.profileIndex}.jpeg`
													: item.genderValue===0 ? female : male
											}
											alt="user"
										/>
								</div>
						),
						countryCode = item.countryCode ? item.countryCode.toLowerCase() : '',
						userCountry = (
							<div className='d-flex' style={{flexDirection:'column', textAlign:rtl ? 'right' : 'left'}}>
									<div className='d-flex' style={{margin: '0px 0px 5px', alignItems:'center', direction:rtl ? 'rtl' : 'ltr'}}>
											<span className={`flag-icon flag-icon-${countryCode}`}></span> &nbsp;
											<div className='d-flex ' style={{fontSize:'12px'}}>{item.country}{item.city && ( ' - ' + item.city)}</div>
									</div>
									<div className='d-flex' style={{justifyContent:'space-between', flexWrap:'wrap'}}>
											{item.username
													? (
													<div>
															<span style={{color:'', fontWeight:'bold'}}>{item.username}</span>&nbsp;
													</div>
													)
													: <span style={{color:'#999999', fontWeight:450}}>{setLT.unknown} ({item.view})</span>
											}
									</div>
							</div>
						),
						addUser = (
							<div className='center btnShadow' onClick={() => this.onAddUser(item)}
									style={{width:'', height:'20px', margin: w<300 ? '0px' : '0px 20px', padding:'0px 10px', fontSize:'13px', fontWeight:450,
												borderRadius:'100px', alignItems:'center', border:'1px solid #00CCFF', color:'#00CCFF'}}>
									<RiUserAddFill style={{fontSize:w<300 ? '20px' : '20px', marginTop:'-10px', color:'#59b9ff', cursor:'pointer'}}/>
							</div>
						),
						tableInfo = (
								<div className='' style={{backgroundColor:'#ffffff99', textDecoration:'none', padding:'10px', width:'100%'}}>
										<table className="table table-borderless" style={{margin:'0px'}}>
												<tbody>
														<tr>
																<td style={{padding:'0px', verticalAlign:'middle', width:'50px'}}>{userImage}</td>
																<td style={{padding:'0px 10px', verticalAlign:'middle', width:'100%'}}>{userCountry}</td>
																<td align='left' style={{padding:'0px', verticalAlign:'middle'}}>{addUser}</td>
														</tr>
												</tbody>
										</table>
								</div>
						),
						<div key={i}
								className={`animated fadeInUpX`}
								style={{width:'800px', margin:'2px', borderBottom: '0px solid'}}
						>
								{tableInfo}
								<hr />

						</div>
				)
		)

		this.setState({
			searchMember: dataRv,
			loadingData:false,
		})
	}

	startSearch = async (e) => {
		if (!e || e.keyCode === 13 || e.keyCode === undefined || e.which === 13 || e.which === undefined) {
			this.setState({
				n:1,
				searchData: [],
				searchMember: [],
				loadingData:true,
			})
			await this.searchMemberMap([])
			await this.scrollSearch()
		}
	}

	onAddUser = async (user) => {
		const { mainUser } = this.props
		var Arr = mainUser.team ? mainUser.team : []
		if(Arr.includes(user._id)) {
			this.props.onToggle()
			return
		}
		Arr.push(user._id)
		const info = {
			userId: mainUser._id,
			team: Arr,
		}
		await axios.post(`${serverURL}/userPanel/update`, info)
		.then(async (res) => {
			delete res.data.password
			this.props.dispatch(setUserInfo(res.data))
			this.props.dispatch(setSubUserInfo(res.data))
			await this.props.onGetTeam(res.data.team)
			this.props.onToggle()
		})
	}

	onResize = async () => {
			this.setState({ 
					w: document.body.clientWidth
			})
	}

	render () {
			const {w, searchUsers, searchMember, userAccessList, } = this.state
			const {mainUser, toggleTeam, onToggle, } = this.props

			const searchTape = (
				<div className='center' style={{width:'100%', zIndex:'1'}}>
					<div style={{marginBottom: (searchUsers && w<s) ? '10px' : '20px', borderRadius:'3px',
						width:w<s ? '100%' : '800px', padding:'10px'}}>

						<input type="text" value={searchUsers} placeholder='Search a member ...' name='searchUsers' autoComplete="off"
							className="form-control"
							style={{textAlign:'center', marginBottom:'-33px', width:'100%', height:'35px', fontSize:'14px'}}
							onChange={this.changeUsername} onKeyPress={this.startSearch} onFocus={this.startSearch}/>
						<div className='btnShadow center'
							style={{marginRight:'2px', width:'35px', height:'31px', borderRadius:'3px', alignItems:'center'}}
							onClick={this.startSearch}>
							<IoMdSearch color="" size="1.6em"/>
						</div>
					</div>
				</div>
			)
			
			return (
				<Modal show={toggleTeam} onHide={onToggle}>
					<Modal.Header className="d-flex justify-content-between">
						<Modal.Title>Our Team</Modal.Title>
						<AiOutlineCloseCircle className='sidebarIcon' onClick={onToggle} style={{ fontSize: 30 }} />
					</Modal.Header>
					<Modal.Body>
						Add a team member
						{searchTape}
						<div className="center" style={{flexWrap:'wrap'}}>
							{searchMember}
						</div>
					</Modal.Body>
				</Modal>
			);
	}
}

const mapStateToProps = (state) => {
	return {
		mainUser: state.userInfo,
		mainUserId: state.userInfo['_id'],
		userInfo: state.subUserInfo,
		userId: state.subUserInfo._id,
		rtl: state.rtl,
		lang: state.lang,
		geo: state.geo,
		page: state.page,
		setLT: state.setLT,
		fullAccess: state.fullAccess,
	}
}

export default connect (mapStateToProps)(ModalTeam);
