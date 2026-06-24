import React from 'react';
import { s } from '../srcSet';

import {
  AdsHorizontalSmall,
  AdsHorizontal,
  AdsMultiplex,
  AdsInArticle,
  AdsInFeedTextOnly
} from './GoogleAds';

const RenderContent = (dbHtml) => {
  if (!dbHtml) return null;

  const w = document.body.clientWidth
  const parser = new DOMParser();
  const formattedHtml = dbHtml
  .split('\n\n')
  .map(p => `<p>${p}</p>`)
  .join('');

const doc = parser.parseFromString(formattedHtml, 'text/html');

  let keyIndex = 0;
  const elements = [];
  const tagElements = []; // برای span.tag

  const walk = (node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        let text = child.textContent;

        if (!text || !text.replace(/\s/g, '').length) return;

        // فاصله اول و آخر رو normalize کن
        text = text.replace(/\s+/g, ' ');

        elements.push(
          <span key={keyIndex++}>
            {text}
          </span>
        );
        return;
      }

      if (child.nodeType !== 1) return;

      // adsbox
      if (child.classList.contains('adsbox')) {
        const type = child.getAttribute('data-ad');
        const id = child.getAttribute('data-id') || `ads_${Date.now()}_${keyIndex++}`;
        switch (type) {
          case 'small': elements.push(<AdsHorizontalSmall key={id} id={id} />); break;
          case 'horizontal': elements.push(<AdsHorizontal key={id} id={id} />); break;
          case 'multiplex': elements.push(<AdsMultiplex key={id} id={id} />); break;
          case 'in-article': elements.push(<AdsInArticle key={id} id={id} />); break;
          case 'in-feed': elements.push(<AdsInFeedTextOnly key={id} id={id} />); break;
          default: elements.push(<div key={id}>Unknown ad</div>);
        }
        return;
      }

      // span.tag → جمع آوری در tagElements
      if (child.tagName === 'SPAN' && child.classList.contains('tag')) {
        tagElements.push(
          <span
            key={keyIndex++}
            className="tag"
            contentEditable={false}
            dangerouslySetInnerHTML={{ __html: child.innerHTML }}
          />
        );
        return;
      }

      // UL/OL → unwrap span/div داخل li ولی structure را نگه دار
      if (child.tagName === 'UL' || child.tagName === 'OL') {
        [...child.querySelectorAll('li span, li div')].forEach((el) => {
          while (el.firstChild) {
            el.parentNode.insertBefore(el.firstChild, el);
          }
          el.remove();
        });
        elements.push(
          <div key={keyIndex++} dangerouslySetInnerHTML={{ __html: child.outerHTML }} />
        );
        return;
      }

      // LI standalone
      if (child.tagName === 'LI') {
        elements.push(
          <div key={keyIndex++} dangerouslySetInnerHTML={{ __html: child.outerHTML }} />
        );
        return;
      }

      if (child.tagName === 'BR') {
        elements.push(<br key={keyIndex++} />);
        return;
      }

      // IMG
      if (child.tagName === 'IMG') {
        elements.push(
          <div
            key={keyIndex++}
            className="rendered-image"
            style={{ padding: w<s ? '0px' : '0px 50px' }}
            dangerouslySetInnerHTML={{ __html: child.outerHTML }}
          />
        );
        return;
      }

      if (child.tagName === 'TABLE') {
        elements.push(
          <div key={keyIndex++} className='table-wrapper' style={{width:w < s ? `${w}px` : ''}}>
            <div dangerouslySetInnerHTML={{ __html: child.outerHTML }} />
          </div>
        );
        return;
      }

      // block-level elements → کل ساختار حفظ شود
      const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'PRE', 'HR'];
      if (blockTags.includes(child.tagName)) {
        elements.push(
          <div
            key={keyIndex++}
            dangerouslySetInnerHTML={{ __html: child.outerHTML }}
          />
        );
        return;
      }

      const inlineTags = ['B', 'STRONG', 'I', 'EM', 'A', 'SPAN'];
      if (inlineTags.includes(child.tagName)) {

        // اگر داخلش ads هست، unwrap کن
        if (child.querySelector('.adsbox')) {
          walk(child);
          return;
        }

        elements.push(
          <span
            key={keyIndex++}
            dangerouslySetInnerHTML={{ __html: child.outerHTML }}
          />
        );
        return;
      }

      // سایر تگ‌ها
      if (child.children.length) {
        walk(child);
      }
    });
  };

  walk(doc.body);

  // در نهایت span.tag ها را در یک wrapper افقی قرار می‌دهیم
  if (tagElements.length > 0) {
    elements.push(
      <div
        key={keyIndex++}
        className="tags-wrapper"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
      >
        {tagElements}
      </div>
    );
  }

  return (
    <div className="rendered-content" style={{fontFamily:'Vazir'}}>
      {elements}
    </div>
  )
};

export default RenderContent;
