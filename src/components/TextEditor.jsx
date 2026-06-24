import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import ModalAddImageToContent from './modals/ModalAddImageToContent';
import '../assets/css/textEditor.css';
import EditBtn from './EditBtn';
import { serverURL, s, } from '../srcSet';

const TextEditor = ({
  value = '',
  onChange,
  maxChars = 10000,
  placeholder = 'Start typing...',
	adsInfo,
	fullAccess
}) => {
	const [toggleModalAddImage, setToggleModalAddImage] = useState(false);
	const [linkValue, setLinkValue] = useState('');
	const [redBorder, setRedBorder] = useState(false);
	const [adsCommentArr, setAdsCommentArr] = useState(['', '']);
	const [imageArray, setImageArray] = useState([]);
  const editorRef = useRef(null);
	const caretRangeRef = useRef(null);

  // اعمال auto-grow
  const autoGrow = () => {
    const el = editorRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  // ارسال محتوا به والد
  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    const textLength = editorRef.current.innerText.length;

    if (textLength <= maxChars) {
      onChange(html);
    } else {
      document.execCommand('undo');
    }

    autoGrow();
  };

  // اجرای اکشن‌ها
  const exec = (command) => {
    editorRef.current.focus();
    document.execCommand(command, false, null);
    handleInput();
  };

	const isSelectionInsideLink = () => {
		const sel = window.getSelection();
		if (!sel.rangeCount) return false;

		let node = sel.getRangeAt(0).commonAncestorContainer;
		if (node.nodeType === 3) node = node.parentNode;

		return !!(node.closest && node.closest('a'));
	};

	const removeLink = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		let node = selection.getRangeAt(0).commonAncestorContainer;
		if (node.nodeType === 3) node = node.parentNode;

		// پیدا کردن نزدیک‌ترین <a>
		const link = node.closest && node.closest('a');
		if (!link) return;

		const textNode = document.createTextNode(link.textContent);
		link.replaceWith(textNode);

		editorRef.current.focus();
		handleInput();
		setRedBorder(false)
	};

	// Link
	const makeLink = () => {
		if (!linkValue) {
			setRedBorder(true)
		} else {
			const selection = window.getSelection();
			if (!selection.rangeCount) return;

			const range = selection.getRangeAt(0);
			const text = selection.toString();
			if (!text.trim()) return;

			const a = document.createElement('a');
			a.href = linkValue;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = text;

			range.deleteContents();
			range.insertNode(a);

			// انتقال کرسر بعد از لینک
			const newRange = document.createRange();
			newRange.setStartAfter(a);
			newRange.collapse(true);

			selection.removeAllRanges();
			selection.addRange(newRange);

			editorRef.current.focus();
			handleInput();
			setLinkValue('')
			setRedBorder(false)
		}
	};

	// لیست
	const makeList = () => {
		exec('insertUnorderedList');
	};

	const fixListFormatting = () => {
		const el = editorRef.current;
		if (!el) return;

		let html = el.innerHTML;

		// 1. حذف newline قبل از <li>
		html = html.replace(/\n\s*(?=<li>)/g, '');

		// 2. تبدیل <li> چندخطی به تک‌خطی
		html = html.replace(/<li>\s*([\s\S]*?)\s*<\/li>/g, (match, content) => {
			return `<li>${content.trim()}</li>`;
		});

		el.innerHTML = html;

		handleInput();
	};

	const fixTableStructure = () => {
		const el = editorRef.current;
		if (!el) return;

		const temp = document.createElement('div');
		temp.innerHTML = el.innerHTML;

		const tables = temp.querySelectorAll('table');

		tables.forEach((table) => {
			const headers = [];

			// گرفتن header ها از thead
			const ths = table.querySelectorAll('thead th');
			ths.forEach(th => headers.push(th.textContent.trim()));

			const rows = [];

			// row های tbody
			const trs = table.querySelectorAll('tbody tr');

			trs.forEach(tr => {
			const tds = tr.querySelectorAll('td');
			const row = [];
			tds.forEach(td => row.push(td.textContent.trim()));
			rows.push(row);
			});

			// ساخت tbody جدید
			const newTbody = document.createElement('tbody');

			// header row
			const headerTr = document.createElement('tr');
			headers.forEach(h => {
			const td = document.createElement('td');
			td.textContent = h;
			headerTr.appendChild(td);
			});
			newTbody.appendChild(headerTr);

			// data rows
			rows.forEach(r => {
			const tr = document.createElement('tr');
			r.forEach(cell => {
				const td = document.createElement('td');
				td.textContent = cell;
				tr.appendChild(td);
			});
			newTbody.appendChild(tr);
			});

			// replace table
			table.innerHTML = '';
			table.removeAttribute('class');

			table.appendChild(newTbody);
		});

		el.innerHTML = temp.innerHTML;

		handleInput();
	};

	// حذف فرمت
	const clearFormat = () => {
		exec('removeFormat');
	};

	const makeBlock = (tagName) => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const text = selection.toString();
		if (!text.trim()) return;

		// اگر انتخاب داخل همان تگ بود، کاری نکن
		let parent = range.commonAncestorContainer;
		if (parent.nodeType === 3) parent = parent.parentNode;
		if (parent.tagName === tagName.toUpperCase()) return;

		const block = document.createElement(tagName);
		block.textContent = text;

		range.deleteContents();
		range.insertNode(block);

		// کرسر بعد از بلاک
		selection.removeAllRanges();
		editorRef.current.focus();

		handleInput();
	};

	const replaceBlock = (tagName) => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		let node = selection.getRangeAt(0).commonAncestorContainer;
		if (node.nodeType === 3) node = node.parentNode;

		// اگر داخل H1-H6 یا P بود
		if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P') {
			if (node.tagName === tagName.toUpperCase()) return;

			const newBlock = document.createElement(tagName);
			newBlock.innerHTML = node.innerHTML;

			node.replaceWith(newBlock);
		} else {
			// اگر داخل بلاک نبود
			makeBlock(tagName);
		}

		editorRef.current.focus();
		handleInput();
	};
	const makeTag = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const text = selection.toString().trim();
		if (!text) return;

		// ساخت تگ
		const tag = document.createElement('span');
		tag.className = 'tag';
		tag.textContent = text;
		tag.setAttribute('contenteditable', 'false');

		// حذف متن انتخاب‌شده
		range.deleteContents();

		// درج تگ
		range.insertNode(tag);

		// فاصله بعد از تگ
		const space = document.createTextNode(' ');
		tag.after(space);

		selection.removeAllRanges();
		editorRef.current.focus();

		handleInput();
	};

	const makeCommaTags = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const text = selection.toString().trim();
		if (!text) return;

		// جدا کردن با ویرگول
		const items = text
			.split(',')
			.map(t => t.trim())
			.filter(Boolean);

		if (!items.length) return;

		const frag = document.createDocumentFragment();

		items.forEach(item => {
			const tag = document.createElement('span');
			tag.className = 'tag';
			tag.textContent = item;
			tag.setAttribute('contenteditable', 'false');

			frag.appendChild(tag);
			frag.appendChild(document.createTextNode(' '));
		});

		range.deleteContents();
		range.insertNode(frag);

		selection.removeAllRanges();
		editorRef.current.focus();

		handleInput();
	};

	const savedRange = useRef(null);

	const saveSelection = () => {
		const sel = window.getSelection();
		if (sel.rangeCount > 0) {
			savedRange.current = sel.getRangeAt(0);
		}
	};

	const restoreSelection = () => {
		const sel = window.getSelection();
		if (savedRange.current) {
			sel.removeAllRanges();
			sel.addRange(savedRange.current);
		}
	};

	const makeFontSize = (size) => {
		restoreSelection();

		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const text = selection.toString();
		if (!text.trim()) return;

		const span = document.createElement('span');
		span.className = `fs-${size}`;
		span.textContent = text;

		range.deleteContents();
		range.insertNode(span);

		selection.removeAllRanges();
		editorRef.current.focus();
		handleInput();
	};

	const insertHR = () => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);

		const hr = document.createElement('hr');
		hr.setAttribute('contenteditable', 'false'); // جلوگیری از ادیت اشتباه
		hr.className = 'editor-hr';

		// درج hr در مکان انتخاب‌شده
		range.deleteContents();
		range.insertNode(hr);

		// افزودن فاصله بعد از hr برای کرسر
		const space = document.createTextNode(' ');
		// hr.after(space);

		// کرسر بعد از hr
		const newRange = document.createRange();
		// newRange.setStartAfter(space);
		newRange.collapse(true);

		selection.removeAllRanges();
		selection.addRange(newRange);

		editorRef.current.focus();
		handleInput();
	};

	const fixHrTags = () => {
		const el = editorRef.current;
		if (!el) return;

		let html = el.innerHTML;

		html = html.replace(/\n<hr>\n/g, '<hr contenteditable="false" class="editor-hr">');

		el.innerHTML = html;

		handleInput(); // برای sync با state
	};

	const getAdsCommentArrFromCaret = () => {
		const el = editorRef.current;
		if (!el) return ['', ''];

		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) {
			return [el.innerHTML, ''];
		}

		const range = sel.getRangeAt(0);

		// کپی range برای بخش قبل
		const beforeRange = range.cloneRange();
		beforeRange.selectNodeContents(el);
		beforeRange.setEnd(range.startContainer, range.startOffset);

		// کپی range برای بخش بعد
		const afterRange = range.cloneRange();
		afterRange.selectNodeContents(el);
		afterRange.setStart(range.startContainer, range.startOffset);

		// تبدیل range به HTML
		const getHTMLFromRange = (r) => {
			const div = document.createElement('div');
			div.appendChild(r.cloneContents());
			return div.innerHTML;
		};

		return [
			getHTMLFromRange(beforeRange),
			getHTMLFromRange(afterRange),
		];
	};

	const onToggleModalAddImage = () => {
		console.log(adsInfo)
		const arr = getAdsCommentArrFromCaret();
		console.log('arr: ', arr)
  	setAdsCommentArr(arr);
		setToggleModalAddImage(!toggleModalAddImage)
		setImageArray([])
	}

	const modalAddImageToContent = (
		<ModalAddImageToContent
			adsInfo={adsInfo}
			serverURL={serverURL}
			toggleModalAddImage={toggleModalAddImage}
			onToggle={onToggleModalAddImage}
			adsCommentArr={adsCommentArr}
		/>
	)

	const insertAd = (type) => {
		const selection = window.getSelection();
		if (!selection.rangeCount) return;

		const range = selection.getRangeAt(0);

		const adId = `ads_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

		const adBox = document.createElement('div');
		adBox.className = 'adsbox';
		adBox.setAttribute('data-ad', type);
		adBox.setAttribute('data-id', adId);
		adBox.setAttribute('contenteditable', 'false');

		// متن داخل adsbox مطابق نوع تبلیغ
		const typeLabel = type.replace(/-/g, ' ');
		adBox.textContent = `📢 ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`;

		// درج node بدون ایجاد اینتر اضافی
		range.deleteContents();
		range.insertNode(adBox);

		// کرسر بعد از adBox
		const space = document.createTextNode(' ');
		adBox.after(space);

		// انتخاب را پاک کن و کرسر را بعد از adsbox قرار بده
		const newRange = document.createRange();
		newRange.setStartAfter(space);
		newRange.collapse(true);

		selection.removeAllRanges();
		selection.addRange(newRange);

		editorRef.current.focus();
		handleInput();
	};

  // مقدار اولیه
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      autoGrow();
    }
  }, [value]);

	const LinkBtn = (
		<div style={{ height:'31px', margin:'2px 5px 3px 0px', padding:'2.5px', paddingRight:'3px', display: 'inline-flex', alignItems: 'center', gap: '4px', borderRadius:'5px', border:'1px solid #ccc', backgroundColor:'#F5F5F5' }}>
			<Button className="btnShadow" variant="outline-dark" size="sm"
				style={{height:'24px', margin:'0px', padding:'0px 7px 0px 5px'}}
				onMouseDown={(e) => { e.preventDefault();
					if (isSelectionInsideLink()) {
						removeLink();
					} else {
						makeLink();
					}
				}}
			>
				{isSelectionInsideLink() ? '❌ Unlink' : '🔗 Link'}
			</Button>
			<input type="text" className="editor-link-input" placeholder="https://example.com" value={linkValue}
				style={{borderColor: redBorder ? 'red' : ''}}
				onChange={(e) => setLinkValue(e.target.value)}
			/>
		</div>
	)

	const fontSize = (
		<select 
			onMouseDown={saveSelection}
			onChange={(e) => makeFontSize(e.target.value)}
			defaultValue=""
			className="editor-size-select btnShadow"
		>
			<option value="" disabled>Size</option>
			<option value="12">12</option>
			<option value="14">14</option>
			<option value="16">16</option>
			<option value="18">18</option>
			<option value="24">20</option>
			<option value="24">22</option>
			<option value="24">24</option>
			<option value="32">32</option>
		</select>
	)

	const Toolbar = (
		<div className="editor-toolbar sticky-toolbar">
			<div className='d-flex' style={{flexWrap:'wrap'}}>
				<Button className="btnShadow" variant="outline-dark" size="sm" onClick={() => exec('bold')}><b>B</b></Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onClick={clearFormat}>Tx</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onClick={makeList}>• List</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeTag(); }}>Tag</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeCommaTags(); }}>Tags</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); onToggleModalAddImage(); }}>🖼 Image</Button>
				{LinkBtn}
				{fontSize}
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); insertHR(); }}>⎯</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); replaceBlock('p'); }}>P</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h1'); }}>H1</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h2'); }}>H2</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h3'); }}>H3</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h4'); }}>H4</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h5'); }}>H5</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); makeBlock('h6'); }}>H6</Button>
			</div>
			<div style={{display: fullAccess ? '' : 'none'}}>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => { e.preventDefault(); insertAd('horizontal'); }}>Horizontal</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => { e.preventDefault(); insertAd('small'); }}>H Small</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => { e.preventDefault(); insertAd('multiplex'); }}>Multiplex</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => { e.preventDefault(); insertAd('in-article'); }}>In-Article</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => { e.preventDefault(); insertAd('in-feed'); }}>In-Feed</Button>
			</div>
			<div style={{display: fullAccess ? '' : 'none'}}>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); fixHrTags(); }}>fixHr</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); fixListFormatting(); }}>fixList</Button>
				<Button className="btnShadow" variant="outline-dark" size="sm" onMouseDown={(e) => {e.preventDefault(); fixTableStructure(); }}>fixTable</Button>
			</div>
		</div>
	)

  return (
    <div className="text-editor">
			{Toolbar}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="editor-area"
        placeholder={placeholder}
        onInput={handleInput}
        suppressContentEditableWarning
      />

      {/* Counter */}
      <div className="editor-counter">
        {editorRef.current?.innerText.length || 0}/{maxChars}
      </div>
			{modalAddImageToContent}
    </div>
  );
};

const mapStateToProps = (state) => {
		return {
				mainUser: state.userInfo,
				subUserInfo: state.subUserInfo,
				userId: state.subUserInfo._id,
				auth: state.auth,
				rtl: state.rtl,
				lang: state.lang,
				geo: state.geo,
				page: state.page,
				adsInfo: state.adsInfo,
				fullAccess: state.fullAccess,
		};
};

export default connect(mapStateToProps)(TextEditor);
