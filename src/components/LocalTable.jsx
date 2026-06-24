import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Form, Table } from 'react-bootstrap';
import '../assets/css/table.css';
import { FaList, FaArrowUp } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import { getPos, checkArea } from '../helper';
import { serverURL, s, googleAds } from '../srcSet';

class LocalTable extends Component {

  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    totalRow: this.props.data.length,
    selectedRow: 0,
    headerDone: 0,
    bodyDone: 0,
    hiddenArr: [],
    searchValue: '',
    columnSearchValue: '',
    columnFilters: {},
    filteredRowCount: this.props.data.length,
    containsFilters: {},
  }

  componentDidMount = async() => {
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.onAction)
    this.setTable()
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onAction);
  }

  componentDidUpdate = async(prevProps) => {
    if (this.props.data !== prevProps.data) {
      this.setState({
        totalRow: this.props.data.length,
        selectedRow: 0,
        headerDone: 0,
        bodyDone: 0,
      }, async () => {
        await this.setTable()
        var headerCheckbox = document.getElementById('headerCheckbox')
        headerCheckbox.checked = false

        var bodyData = this.state.bodyData
        for(let i=0; i<bodyData.length; i++) {
          var elm = document.getElementById(`row${i}`)
          var checkCell = document.getElementById(`checkCell${i}`)
          var checkbox = document.getElementById(`checkbox${i}`)
  
          // elm.style.backgroundColor = '#ffffff'
          // checkCell.style.backgroundColor = '#ffffff'
          checkbox.checked = false
        }
      })
    }
  }

  handleScroll = async () => {
    this.setPosition('moreListRow', this.state.selectedRowId);
    // this.setPosition('columnList', 'columnShowBtn');
  }

  setPosition = (elementId, referenceId) => {
    const element = document.getElementById(elementId);
    const reference = document.getElementById(referenceId);
    if (element && reference) {
      const rect = reference.getBoundingClientRect();
      element.style.top = `${rect.bottom + 5}px`;
    }
  }

  setTable = async () => {
    const { hiddenArr } = this.state
    const { data, checkbox, hiddenColumn=[] } = this.props
    // console.log(data)
    var headerData = Object.keys(data[0])

    if(!checkbox) hiddenArr.push(0)
    if(hiddenColumn.length>0) {
      for(let x=0; x<hiddenColumn.length; x++) {
        hiddenArr.push(hiddenColumn[x])
      }
    }

    this.setHeader(headerData)
    this.setBody(data, headerData)
    this.setState({
      headerData,
      originalData: data,
      bodyData: data, 
      dataLength: headerData.length
    })
  }

  setHeader = async (headerData) => {
    // headerData.shift()
    const { headerDone, hiddenArr, columnFilters } = this.state
    const { costomWidth } = this.props
    // console.log(1, columnFilters)
    if(headerDone===0) {
      const checkboxHeader = <Form.Check id='headerCheckbox' type="checkbox" onChange={(e) => this.setSelectAll(e)}/>
      // console.log('headerData: ', headerData)
      headerData.unshift(checkboxHeader)
    }

    const header = headerData.map(
      (item, i) => {
        // console.log('item: ', item)
        const visibility = hiddenArr.includes(i) ? false : true;
        const isFiltered = columnFilters && columnFilters[i] && columnFilters[i].length > 0;
        return (
          <th key={i} className={i===0 ? 'cardShadow' : ''}
            style={{
              // width: (item in costomWidth) ?  costomWidth[item] : 'auto',
              minWidth: costomWidth ? costomWidth[item] : '',
              maxWidth: costomWidth ? costomWidth[item] : '',
              overflow: 'hidden',
              // textOverflow: 'ellipsis', // نمایش "..." در صورت طولانی بودن متن
              // whiteSpace: 'nowrap', // جلوگیری از شکستن متن در چند خط
              // wordBreak: 'break-all', // شکستن متن‌های بدون فاصله
              
              // whiteSpace:'wrap',
              position:i===0 ? 'sticky' : '',
              left: i===0 ? 0 : '',
              zIndex: i === 0 ? 60 : '',
              fontWeight: 900,
              // backgroundColor:'#ffffff',
              // borderBottom:'2px solid #99999950',
              borderRadius:'0px',
              verticalAlign:'top',
              padding:'15px 20px',
              display:visibility ? '' : 'none',
            }}
          >
            <div className='d-flex' style={{alignItems:'center', marginLeft:i!==0 ? '-20px' : '', gap:'5px'}}>
              { i!==0 &&
                <div className='d-flex' style={{alignItems:'center'}}>
                  <div id={`column-more-${i}`} className='center column-menu-btn'
                    onClick={(e) => this.onMoreColumn(e, `column-more-${i}`, i, headerData)}>
                    {isFiltered ? <MdFilterAlt /> : <BsThreeDotsVertical />}
                  </div>
                </div>
              }
              <div style={{whiteSpace:'nowrap'}}>{item}</div>
            </div>
          </th>
        )
      });
    this.setState({
      header,
      headerDone: this.state.headerDone + 1,
    })
  }

  setBody = (bodyData, headerData) => {

    const { bodyDone, hiddenArr, searchValue } = this.state
    const { costomWidth, alignCenterOff } = this.props

    var highlightArr = []

    function highlight(checkValue, id) {
      if(checkValue) highlightArr.push(id)
    }

    const body = bodyData.map((item, i) => (
      <tr key={`${item._id}-${i}`} id={`row${i}`} className='obj-parent'>

        {headerData.map((col, ix) => {

          let value = ix === 0 ? null : item[col]   // مقدار ستون
          let checkValue = searchValue && value && typeof value === 'string' && value.toLowerCase().includes(searchValue)
          highlight(checkValue, `body-${i}-${ix}`)

          let visibility = !hiddenArr.includes(ix)

          if (ix === 0) {
            return (
              <td key={ix} id={`checkCell${i}`} className='cardShadow sticky-first-col'
                style={{
                  position: 'sticky',
                  left: 0,
                  borderRadius: '0px',
                  padding: '15px 20px',
                  display: visibility ? '' : 'none',
                }}>
                <div className='d-flex' style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                  <Form.Check
                    id={`checkbox${i}`}
                    className='checkboxX'
                    type="checkbox"
                    onChange={(e) => this.setSelected(e, bodyData, i)}
                  />
                  &nbsp;&nbsp;

                  <div
                    id={`row-more-${i}`}
                    className='table-more obj-child'
                    onClick={(e) => this.onMoreRow(e, `row-more-${i}`, i, bodyData)}
                  >
                    <BsThreeDots />
                  </div>
                </div>
              </td>
            )
          }

          return (
            <td key={ix}
              style={{
                fontSize: '14px',
                // overflowWrap: 'break-word',
                borderRadius: '0px',
                padding: '15px 20px',
                display: visibility ? '' : 'none',
                verticalAlign: 'middle',
                maxWidth: costomWidth ? costomWidth[col] : '200px'
              }}>
              <span id={`body-${i}-${ix}`} className="cell-ellipsis" title={value}>{value}</span>
            </td>
          )

        })}

      </tr>
    ))

    this.setState({
      body,
      bodyDone: this.state.bodyDone + 1
    })

    this.setHighlight(highlightArr)
  }

  setSelected = (e, bodyData, i) => {
    const row = document.getElementById(`row${i}`);
    const checked = e.target.checked;

    if (checked) {
      row.classList.add('table-row-selected');
      this.setState(prev => ({ selectedRow: prev.selectedRow + 1 }));
    } else {
      row.classList.remove('table-row-selected');
      this.setState(prev => ({ selectedRow: prev.selectedRow - 1 }));
    }
  };

  setSelectAll = (e) => {
    const checked = e.target.checked;
    const { bodyData } = this.state;

    for (let i = 0; i < bodyData.length; i++) {
      const row = document.getElementById(`row${i}`);
      const checkbox = document.getElementById(`checkbox${i}`);

      checkbox.checked = checked;

      if (checked) {
        row.classList.add('table-row-selected');
      } else {
        row.classList.remove('table-row-selected');
      }
    }

    this.setState({ selectedRow: checked ? bodyData.length : 0 });
  };

  onMoreRow = (e, id, i, bodyData) => {
    e.stopPropagation();

    const { data } = this.props;
    const { selectedRowId } = this.state;

    // اگر همان دکمه دوباره زده شد، popup را ببند
    if (selectedRowId === id) {
      this.onCloseMoreListRow();
      this.setState({ selectedRowId: null });
      return;
    }

    /* =========================
      1️⃣ بستن popup ستون اگر باز است
    ========================== */
    this.onCloseColumnList();
    this.onCloseMoreListColumn();

    /* =========================
      2️⃣ ریست کردن active های قبلی
    ========================== */

    // ریست ردیف فعال
    document.querySelectorAll('.row-active-tr')
      .forEach(tr => tr.classList.remove('row-active-tr'));

    // ریست دکمه فعال قبلی
    const prevBtn = document.querySelector('.more-row-active');
    if (prevBtn) {
      prevBtn.classList.add('obj-child');      // برگرداندن حالت سه‌نقطه
      prevBtn.classList.remove('more-row-active');
    }

    /* =========================
      3️⃣ فعال کردن ردیف جدید
    ========================== */

    const rowElm = document.getElementById(`row${i}`);
    if (rowElm) rowElm.classList.add('row-active-tr');

    const moreBtn = document.getElementById(id);
    if (!moreBtn) return;

    moreBtn.classList.remove('obj-child');
    moreBtn.classList.add('more-row-active');

    /* =========================
      4️⃣ باز کردن popup
    ========================== */

    const moreList = document.getElementById('moreListRow');
    if (!moreList) return;

    const rect = moreBtn.getBoundingClientRect();

    moreList.style.display = "block";
    moreList.style.position = "fixed";
    moreList.style.borderRadius = "5px";
    moreList.style.top = `${rect.bottom + 5}px`;
    moreList.style.left = `${rect.left}px`;

    // ریست انیمیشن
    moreList.classList.remove('zoomInTopLeft');
    void moreList.offsetWidth;
    moreList.classList.add('zoomInTopLeft');

    // جلوگیری از بیرون زدن از صفحه
    const rectMoreList = moreList.getBoundingClientRect();
    if (rectMoreList.bottom + 40 > window.innerHeight) {
      const diff = rectMoreList.bottom - 40 - window.innerHeight;
      moreList.style.top = `${rect.bottom + 5 + diff}px`;
    }

    /* =========================
      5️⃣ ذخیره state
    ========================== */

    this.setState({
      row: bodyData[i],
      rowIndex: i,
      selectedRowId: id
    });
  };

  onMoreColumn = async (e, id, i, headerData) => {
    e.stopPropagation();

    this.setState({
      columnSearchValue: ''
    })

    const { bodyData, selectedColumnId, originalData, columnFilters } = this.state;

    if (!bodyData || !Array.isArray(bodyData)) {
      return;
    }

    // اگر دوباره روی همان ستون کلیک شد → popup بسته شود
    if (selectedColumnId === id) {
      this.onCloseMoreListColumn();
      this.setState({ selectedColumnId: null });
      return;
    }

    const columnKey = headerData[i];

    // اگر ستون قبلاً فیلتر شده
    const isFiltered = columnFilters && columnFilters[i];

    const sourceData = isFiltered ? originalData : bodyData;

    const uniqueValues = [
      ...new Set(
        sourceData.map(row => row[columnKey])
      )
    ];

    // تبدیل برای نمایش
    const displayValues = uniqueValues.map(val => {
      if (val === null) return { value: val, label: "null" };
      if (val === "") return { value: val, label: '""' };
      return { value: val, label: val };
    });

    // مرتب سازی
    displayValues.sort((a, b) => {

      if (a.value === null) return -1;
      if (b.value === null) return 1;

      if (a.value === "") return -1;
      if (b.value === "") return 1;

      if (typeof a.label === "string" && typeof b.label === "string") {
        return a.label.localeCompare(b.label);
      }

      return 0;
    });

    this.setState({

      column: columnKey,
      columnIndex: i,
      columnUniqueValues: displayValues,

      selectedColumnFilters: columnFilters[i]
        ? displayValues
            .filter(v => columnFilters[i].includes(v.value))
            .map(v => v.value)
        : displayValues.map(v => v.value)

    });

    const more = document.getElementById(id);

    // پاک کردن active قبلی
    document.querySelectorAll('.more-column-active')
      .forEach(el => el.classList.remove('more-column-active'));

    more.classList.add('more-column-active');

    // هایلایت ستون در جدول
    const tableWrapper = document.querySelector('.table-wrapper table tbody');

    if (tableWrapper) {

      document.querySelectorAll('.column-active-td')
        .forEach(td => td.classList.remove('column-active-td'));

      Array.from(tableWrapper.rows).forEach(row => {

        if (row.cells[i]) {
          row.cells[i].classList.add('column-active-td');
        }

      });

    }

    // popup
    const rect = more.getBoundingClientRect();
    const moreList = document.getElementById('moreListColumn');

    moreList.style.display = "block";
    moreList.style.borderRadius = "5px";
    moreList.style.position = 'fixed';
    moreList.style.top = `${rect.bottom + 5}px`;
    moreList.style.left = `${rect.left}px`;

    moreList.classList.remove('zoomInTopLeft');
    void moreList.offsetWidth;
    moreList.classList.add('zoomInTopLeft');

    const rectMoreList = moreList.getBoundingClientRect();

    if (rectMoreList.bottom + 40 > window.innerHeight) {

      const diff = rectMoreList.bottom - 40 - window.innerHeight;

      moreList.style.top = `${rect.bottom + 5 + diff}px`;

    }

    this.setState(prevState => ({
      preSelectedColumnId: prevState.selectedColumnId,
      selectedColumnId: id
    }));

    this.onCloseColumnList();
    this.onCloseMoreListRow();
  };

  onAction = async (e) => {
    const { columnShowPos, columnListPos, columnListDisplay } = this.state
    this.onCloseMoreListRow(e)
    if((columnShowPos)) {
      checkArea(columnListPos).then(res => {
        if(res===false && columnListDisplay) this.onCloseColumnList()
      })
    }

    // CloseMoreListColumn
    const moreListColumn = document.getElementById('moreListColumn');
    const columnBtn = document.getElementById(this.state.selectedColumnId);
    // اگر کلیک روی خود popup یا دکمه column بود، کاری نکن
    if (moreListColumn && moreListColumn.contains(e.target)) return;
    if (columnBtn && columnBtn.contains(e.target)) return;
    this.onCloseMoreListColumn(e)
  }

  onCloseMoreListRow = () => {
    const moreList = document.getElementById('moreListRow');
    if (moreList) moreList.style.display = "none";

    // ریست ردیف
    document.querySelectorAll('.row-active-tr')
      .forEach(tr => tr.classList.remove('row-active-tr'));

    // ریست دکمه
    const activeBtn = document.querySelector('.more-row-active');
    if (activeBtn) {
      activeBtn.classList.add('obj-child');
      activeBtn.classList.remove('more-row-active');
    }

    this.setState({ selectedRowId: null });
  };

  onCloseMoreListColumn = async (e) => {
    const moreList = document.getElementById('moreListColumn');
    if(moreList) moreList.style.display = "none";

    // پاک کردن رنگ سلول‌های ستون
    document.querySelectorAll('.column-active-td').forEach(td => td.classList.remove('column-active-td'));

    // پاک کردن رنگ دکمه
    document.querySelectorAll('.more-column-active').forEach(el => el.classList.remove('more-column-active'));
  }

  onCloseColumnList = async () => {
    const columnList = document.getElementById('columnList');
    if(columnList) columnList.style.display = "none";
    this.setState({
      columnListDisplay: false,
    })
  }

  columnListMap = async (headerData) => {
    const { hiddenArr } = this.state
    var visibility
    const columnList = headerData.map(
      (item, i) => (
        // console.log('item: ', item.label, item.visible, ),
        visibility = hiddenArr.includes(i) ? false : true,
        <div key={i} className='d-flex hoverGreyColumnList'
          style={{
            fontSize:'14px',
            fontWeight: 400,
            alignItems:'flex-start',
            padding:'10px'
          }}
          onClick={() => this.setVisibility(i)}
        >
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={visibility}
              id="11"
              style={{ width: '30px', height: '17px', backgroundColor:visibility ? '#0273F0' : '' }}
              onChange={() => null}
            />
          </div>
          <span style={{margin:'3px 10px'}}>{item}</span>
        </div>
      )
    )
    this.setState({
      columnList,
    })
  }

  toggleColumnShow = async () => {
    const columnShowPos = await getPos('columnShowBtn');
    const {columnListDisplay} = this.state
    var headerData = this.state.headerData
    // console.log(8787, headerData)
    await this.columnListMap(headerData)
    // console.log(1)

    this.setState({
      columnShowPos,
    })

    if(!columnListDisplay) {
      // const mainHeader = document.getElementById('mainHeader');
      const modalColumnList = document.getElementById('columnList');
      const columnShow = document.getElementById('columnShowBtn');  
      // const rectMainHeader = mainHeader.getBoundingClientRect();

      modalColumnList.style.display = "block";
      modalColumnList.style.borderRadius = "5px";
      modalColumnList.style.position = 'fixed';
      modalColumnList.style.bottom = '10px';
      // modalColumnList.style.top = `${rectMainHeader.bottom+10}px`;
      modalColumnList.style.right = '10px';
      modalColumnList.style.overflow = 'scroll';
      modalColumnList.style.zIndex = '10000';

      var columnListPos = await getPos('columnList');
      // set position
      var transform = -40 // css: fadeInTopLeft
      columnListPos.top = columnListPos.top - transform
      columnListPos.bottom = columnListPos.bottom - transform
      columnListPos.left = columnListPos.left + transform
      columnListPos.right = columnListPos.right + transform

      this.setState({
        columnListDisplay: true,
        columnListPos
      })

    } else {
      // this.onCloseColumnList()
    }
  }

  setVisibility = async (i) => {
    const { headerData, bodyData, hiddenArr } = this.state
    // console.log(12345, hiddenArr)
    if(i>=0) {
      if(!hiddenArr.includes(i)) {
        hiddenArr.push(i)
      } else {
        let index = hiddenArr.indexOf(i);
        if (index !== -1) {
          hiddenArr.splice(index, 1);
        }
      }
    }

    this.columnListMap(headerData)
    this.setHeader(headerData)
    this.setBody(bodyData, headerData)
  }

  onShowAll = async () => {
    this.setState({
      hiddenArr: []
    })
    this.setVisibility()
  }

  onHideAll = async () => {
    let x = this.state.dataLength;
    let array = [];
    for (let i = 1; i <= x; i++) {
        array.push(i);
    }
    await this.setState({
      hiddenArr: array
    })
    this.setVisibility()
  }

  searchHandler = async (e) => {
    // var tx = e.target.value
    // await this.setState({
    //     searchValue: e.target ? tx.toLowerCase() : e,
    // })

    // const { bodyData } = this.state

    // var data = []
    // for (let i = 0; i < bodyData.length; i++) {
    //   for (let j = 0; j < bodyData[i].length; j++) {
    //     const obj = bodyData[i][j];
    //     const objV = getObjValue(obj.value)
    //     if (objV && objV.toLowerCase().includes(tx)) {
    //       data.push(bodyData[i])
    //       break;
    //     }
    //   }
    // }

    // this.setBody(data)

  }

  setHighlight = async (arr) => {
    const { searchValue } = this.state
    // console.log(11, searchValue)
    for(let i=0; i<arr.length; i++) {
      const textElement = document.getElementById(arr[i]);
      if(textElement) {
        const text = textElement.textContent;
        const highlightedText = text.replace(new RegExp(`\\b(${searchValue})\\b`, 'g'), '<span class="highlight">$1</span>');
        textElement.innerHTML = highlightedText

        // const range = document.createRange();
        // range.selectNodeContents(textElement);
        // range.deleteContents();
        // const fragment = range.createContextualFragment(highlightedText);
        // textElement.appendChild(fragment);
        // console.log(66, textElement, text, fragment, range)
        // console.log(77, text, highlightedText)

      }
    }
  }

  toggleColumnFilter = (value) => {

    this.setState(prevState => {

      const exists = prevState.selectedColumnFilters.includes(value);

      const newFilters = exists
        ? prevState.selectedColumnFilters.filter(v => v !== value)
        : [...prevState.selectedColumnFilters, value];

      return { selectedColumnFilters: newFilters };

    }, () => {

      this.applyColumnFilter();

    });

  };

  applyColumnFilter = () => {

    const {
      columnIndex,
      selectedColumnFilters = [],
      columnFilters = {},
      containsFilters = {},
      originalData,
      headerData,
      columnUniqueValues = []
    } = this.state;

    const newColumnFilters = { ...columnFilters };

    // ===== فیلترهای exact (قبلی خودت)
    if (columnIndex !== undefined) {
      if (
        selectedColumnFilters.length === 0 ||
        selectedColumnFilters.length === columnUniqueValues.length
      ) {
        delete newColumnFilters[columnIndex];
      } else {
        newColumnFilters[columnIndex] = selectedColumnFilters;
      }
    }

    // ===== بررسی وجود هر نوع فیلتر
    const hasFilter =
      Object.keys(newColumnFilters).length > 0 ||
      Object.keys(containsFilters).length > 0;

    // ===== فیلتر نهایی
    const filteredData = hasFilter
      ? originalData.filter(row =>

          // ✅ exact filters
          Object.entries(newColumnFilters).every(([colIndex, values]) => {
            const columnKey = headerData[colIndex];
            return values.includes(row[columnKey]);
          })

          &&

          // ✅ contains filters
          Object.entries(containsFilters).every(([colIndex, values]) => {
            const columnKey = headerData[colIndex];

            if (!row[columnKey]) return false;

            const cellValue = String(row[columnKey]).toLowerCase();

            return values.some(v =>
              cellValue.includes(v.toLowerCase())
            );
          })

        )
      : originalData;

    this.setState({
      columnFilters: newColumnFilters,
      bodyData: filteredData,
      filteredRowCount: filteredData.length
    }, () => {
      this.setHeader(headerData);
      this.setBody(filteredData, headerData);
    });
  };

  resetColumnFilter = () => {
    const { columnIndex, columnFilters, originalData, headerData } = this.state;

    const newColumnFilters = { ...columnFilters };
    delete newColumnFilters[columnIndex]; // حذف فیلتر همین ستون

    const filteredData = originalData.filter(row =>
      Object.entries(newColumnFilters).every(([colIndex, values]) =>
        values.includes(row[colIndex])
      )
    );

    this.setState({
      columnFilters: newColumnFilters,
      bodyData: filteredData,
      filteredRowCount: filteredData.length
    }, () => {
      this.setHeader(headerData);
      this.setBody(filteredData, headerData);
      console.log('columnFilters: ', this.state.columnFilters)

    });

    this.onCloseMoreListColumn();
  };

  resetAllColumnFilter = () => {
    const { originalData, headerData } = this.state;

    this.setState({
      bodyData: originalData,
      columnFilters: {},
      containsFilters: {}, // 👈 اضافه کن
      filteredRowCount: originalData.length,
      selectedRow: 0
    }, () => {

      this.setHeader(headerData);
      this.setBody(originalData, headerData);

      const headerCheckbox = document.getElementById('headerCheckbox');
      if (headerCheckbox) headerCheckbox.checked = false;

      for (let i = 0; i < originalData.length; i++) {
        const row = document.getElementById(`row${i}`);
        const checkbox = document.getElementById(`checkbox${i}`);

        if (checkbox) checkbox.checked = false;
        if (row) row.classList.remove('table-row-selected');
      }

    });

    this.onCloseMoreListColumn();
  };

  // toggleSelectAllColumnFilters = () => {
  //   const { columnUniqueValues, selectedColumnFilters } = this.state;

  //   const allSelected = selectedColumnFilters.length === columnUniqueValues.length;

  //   this.setState({
  //     selectedColumnFilters: allSelected ? [] : [...columnUniqueValues]
  //   });
  // };

  handleSelectAllToggle = () => {
    const { columnUniqueValues, selectedColumnFilters } = this.state;

    if (selectedColumnFilters.length === columnUniqueValues.length) {
      // همه انتخاب شده‌اند → همه را پاک کن
      this.setState({ selectedColumnFilters: [] }, () => this.applyColumnFilter());
    } else {
      // همه را انتخاب کن
      this.setState({ selectedColumnFilters: columnUniqueValues.map(v => v.value) }, () => this.applyColumnFilter());
    }
  };

  confirmDelete = async (id) => {
    const { deleteUrl } = this.props
    const { originalData, headerData } = this.state

    try {

      await axios.post(deleteUrl, { id })

      const newData = originalData.filter(row => row._id !== id)

      this.setState({
        originalData: newData,
        bodyData: newData,
        totalRow: newData.length,
        filteredRowCount: newData.length,
        row: null,
        rowIndex: null,
        selectedRowId: null
      }, () => {

        this.setHeader(headerData)
        this.setBody(newData, headerData)
        this.onCloseMoreListRow()

      })

    } catch (err) {
      console.error(err)
    }
  }

  deleteSelections = async () => {
    const { bodyData, originalData, headerData } = this.state
    const { deleteSelectionsUrl } = this.props

    const selectedIds = []

    // گرفتن ردیف های انتخاب شده از داده‌های فعلی (filtered)
    for (let i = 0; i < bodyData.length; i++) {
      const checkbox = document.getElementById(`checkbox${i}`)
      if (checkbox && checkbox.checked) {
        selectedIds.push(bodyData[i]._id)
      }
    }

    if (selectedIds.length === 0) return

    try {
      await axios.post(deleteSelectionsUrl, { ids: selectedIds })

      // حذف از originalData
      const newOriginalData = originalData.filter(row => !selectedIds.includes(row._id))
      // حذف از bodyData فعلی
      const newBodyData = bodyData.filter(row => !selectedIds.includes(row._id))

      this.setState({
        originalData: newOriginalData,
        bodyData: newBodyData,
        totalRow: newOriginalData.length,
        filteredRowCount: newBodyData.length,
        selectedRow: 0
      }, () => {
        this.setHeader(headerData)
        this.setBody(newBodyData, headerData)

        const headerCheckbox = document.getElementById('headerCheckbox')
        if (headerCheckbox) headerCheckbox.checked = false
      })

    } catch (err) {
      console.error(err)
    }
  }

  filterLocalViews = () => {
    const { headerData, originalData, columnFilters } = this.state;

    const siteNameIndex = headerData.findIndex(h => h === 'siteName');
    if (siteNameIndex === -1) return;

    const values = ['local - ShiningPage', 'local - SelfSheet'];

    // 🔥 ساخت uniqueValues مثل onMoreColumn
    const uniqueValues = [
      ...new Set(originalData.map(row => row['siteName']))
    ].map(val => ({
      value: val,
      label: val === null ? 'null' : val === '' ? '""' : val
    }));

    this.setState(prev => ({
      columnFilters: {
        ...prev.columnFilters,
        [siteNameIndex]: values
      },
      selectedColumnFilters: values,
      columnIndex: siteNameIndex,
      column: 'siteName',
      columnUniqueValues: uniqueValues // ✅ خیلی مهم
    }), () => {
      this.applyColumnFilter();
    });
  };

  filterSystems = () => {
    const { headerData } = this.state;

    const userAgentIndex = headerData.findIndex(h => h === 'userAgent');
    if (userAgentIndex === -1) return;

    const botPatterns = [
      'bot',
      'crawler',
      'spider',
      'mediapartners',
      'googleother',
      'adsbot',
      'apis-google',
      'googlebot',
      'Google-InspectionTool'
    ];

    this.setState(prev => ({
      containsFilters: {
        ...prev.containsFilters,
        [userAgentIndex]: botPatterns
      }
    }), () => {
      this.applyColumnFilter();
    });
  };

  onUpdateData = () => {
    this.props.updateData()
    this.resetAllColumnFilter()
  }

  changeHandler = (e) => {
    const value = e.target.value.toLowerCase();

    this.setState({
      columnSearchValue: value
    });
  };

  onResize = () => {
    this.setState({
      w: document.body.clientWidth,
      h: document.body.clientHeight
    })
  }

  render() {
    const { w, searchValue, header, body, totalRow, selectedRow, columnList, hiddenArr,
      dataLength, row, filteredRowCount, originalData, columnSearchValue, 
      columnUniqueValues } = this.state
    const { editUrl, loadingData, controls, updateData, searchBox, controlColumn } = this.props
    const loader13 = <div className='loader-13' style={{margin: '0px', fontSize:'9px'}}></div>

    const filteredColumnValues = columnUniqueValues
      ? columnUniqueValues.filter(item => {
          if (!columnSearchValue) return true;

          return String(item.label)
            .toLowerCase()
            .includes(columnSearchValue);
        })
      : [];

    const localCount = originalData
      ? originalData.filter(row =>
          row.siteName === 'local - ShiningPage' ||
          row.siteName === 'local - SelfSheet'
        ).length
      : 0;

    const localViewsBtn = (
      <button className="btnShadow normal-btn" onClick={this.filterLocalViews}>
        Local views ({localCount})
      </button>
    );

    const botPatterns = [
      'bot',
      'crawler',
      'spider',
      'mediapartners',
      'googleother',
      'adsbot',
      'apis-google',
      'googlebot',
      'Google-InspectionTool'
    ];
    const systemCount = originalData
      ? originalData.filter(row =>
          row.userAgent &&
          botPatterns.some(p =>
            row.userAgent.toLowerCase().includes(p)
          )
        ).length
      : 0;

    const systemBtn = (
      <button className="btnShadow normal-btn" onClick={this.filterSystems}>
        Systems ({systemCount})
      </button>
    );

    const updateDataBtn = (
      <button className="btnShadow normal-btn" style={{width:'100px'}} onClick={() => this.onUpdateData()}>
        {loadingData ? loader13 : 'Update Data'}
      </button>
    );

    const moreListRow = (
      <div id='moreListRow' className='popupContainer zoomInTopLeft table-more-list'>
        <div><Link to={`${editUrl}${row ? row._id : ''}`}><div style={{width:'100%', height:'100%'}}>Edit</div></Link></div>
        <div style={{color:'red'}} onClick={() => this.confirmDelete(row?._id)}>Delete</div>
      </div>
    )

    const moreListColumn = (
      <div id='moreListColumn' className='popupContainer zoomInTopLeft' style={{padding:'10px', width:'200px'}}>
        {/* ===== نمایش نام ستون ===== */}
        {this.state.column && (
          <div style={{
            fontWeight: 400,
            fontSize: '16px',
            marginBottom: '10px',
            paddingBottom: '5px',
            borderBottom: '1px solid #ddd',
            color: '#0273F0'
          }}>
            {this.state.column}
          </div>
        )}
        <div style={{ position:'relative' }}>
          <input 
            className='form-control'
            style={{ height:'30px', fontSize:'13px', marginBottom:'10px', paddingLeft:'35px' }} 
            value={columnSearchValue}
            autoComplete="off"
            placeholder='search'
            onChange={this.changeHandler}
          />
          <IoMdSearch className='' color='' size="1.4em" style={{position:'absolute', top:5, left:5}}/>
        </div>

        {/* wrapper برای scroll */}
        <div className="column-filter-wrapper">
          <div className="column-filter-list">
            <label className="filter-item">
              <input
                type="checkbox"
                ref={el => {
                  if (el) {
                    const total = this.state.columnUniqueValues ? this.state.columnUniqueValues.length : 0;
                    const selected = this.state.selectedColumnFilters ? this.state.selectedColumnFilters.length : 0;
                    el.indeterminate = selected > 0 && selected < total;
                  }
                }}
                checked={
                  this.state.columnUniqueValues?.length > 0 &&
                  this.state.selectedColumnFilters.length === this.state.columnUniqueValues.length
                }
                onChange={() => this.handleSelectAllToggle()}
              />
              (Select All)
            </label>
            {filteredColumnValues.map((item, index) => (
              <label key={index} className="filter-item">
                <input
                  type="checkbox"
                  checked={this.state.selectedColumnFilters.includes(item.value)}
                  onChange={() => this.toggleColumnFilter(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        <div className="clear-filter">
          <button onClick={this.resetColumnFilter}>Clear Filter</button>
        </div>
      </div>
    )

    const disableStyle = { color: '#959595', cursor: 'default' }
    const modalColumnList = (
      <div id='columnList'
        className='popupContainer animated fadeInTopRight'>
        <div className='column-list-header'>
          <div style={hiddenArr.length===dataLength ? disableStyle : {}}
            onClick={() => this.onHideAll()}>
            HIDE ALL
          </div>
          <div style={hiddenArr.length===0 ? disableStyle : {}}
            onClick={() => this.onShowAll()}>
            SHOW ALL
          </div>
        </div>
        {columnList}
      </div>
    )

    const searchTape = (
      <div style={{ position:'relative', width:'150px', margin:'0px 10px', padding:'0px', fontSize:'13px', borderRadius:'3px' }}>
          <input id='searchInput' type="text" value={searchValue} placeholder='search' name='searchValue' autoComplete="off"
            className="form-control"
            style={{textAlign:'left', paddingLeft:'35px', mainrg:'', width:'100%', height:'30px', fontSize:'12px'}}
            onChange={this.searchHandler} onKeyDown={this.startSearch} onFocus={this.startSearch}/>
          <IoMdSearch className='' color='' size="1.6em" style={{position:'absolute', top:5, left:5}}/>
      </div>
    )

    const controlColumnIcon = (
      <div id='columnShowBtn' name='columnShowBtn' className='hoverGrey' onClick={() => this.toggleColumnShow()}>
        <FaList/>
      </div>
    )

    const controlsSection = (
      <div className='d-flex justify-content-end' style={{height:'', margin:'10px 0px', alignItems:'center', fontSize:'14px'}}>
        <div className='d-flex' style={{alignItems:'center'}}>
          {updateDataBtn}
          {searchBox && searchTape}
          {controlColumn && controlColumnIcon}
        </div>
      </div>
    )

    const deleteSelectionsBtn = (
      <button
        className='delete-selections-btn'
        disabled={selectedRow === 0}
        onClick={this.deleteSelections}
      >
        Delete Selections
      </button>
    )

    const resetAllColumnFilterBtn = (
      <button
        className='clear-All-filter-btn'
        disabled={Object.keys(this.state.columnFilters || {}).length === 0}
        onClick={this.resetAllColumnFilter}
      >
        Clear All Filters
      </button>
    )

    const tableInfo = (
      <div className="d-flex" style={{marginBottom:'10px', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
        <div className='d-flex' style={{gap:'12px', marginBottom:w<s ? '10px' : ''}}>
          {selectedRow > 0 && (
            <span className="selected-count">
              {selectedRow} {`selected`}
            </span>
          )}

          <span className="row-count">
            Showing <b>{filteredRowCount}</b> of <b>{totalRow}</b> rows
          </span>
        </div>

        <div className='d-flex' style={{gap:'10px'}}>
          {resetAllColumnFilterBtn}
          {deleteSelectionsBtn}
        </div>
        <div className='d-flex' style={{gap:'10px'}}>
          {localViewsBtn}
          {systemBtn}
        </div>
      </div>
    );

    return (
      <div style={{color:'#000000'}}>
        {controls && controlsSection}
        {tableInfo}
        <div className='cardShadow table-wrapper' style={{backgroundColor:'#ffffff'}}>
          <Table responsive className='sticky-header' style={{ margin:'0px', }}>
            <thead>
              <tr>
                {header}
              </tr>
            </thead>
            <tbody>
              {body}
            </tbody>
          </Table>
        </div>
        {moreListRow}
        {moreListColumn}
        {modalColumnList}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

export default connect (mapStateToProps)(LocalTable);
