import React, { useEffect } from 'react';

// Reusable hook for loading Google Ads
const useGoogleAds = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Ad loading error:", e);
    }
  }, []);
};

const AdsHorizontalSmall = ({ id, format = 'auto' }) => {
  useGoogleAds();

  return (
    <div style={{ width: '100%', height: '100px', overflow: 'hidden' }}>
      <ins
        id={id}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100px', // 👈 ارتفاع ثابت
        }}
        data-ad-client="ca-pub-1289188214513795"
        data-ad-slot="8856359950"
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

const AdsHorizontal = ({ id, format = 'auto' }) => {
  useGoogleAds();
  return (
    <div>
      <ins
        id={id}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1289188214513795"
        data-ad-slot="8856359950"
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

const AdsMultiplex = ({ id }) => {
  useGoogleAds();
  return (
    <div>
      <ins
        id={id}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-1289188214513795"
        data-ad-slot="6901142852"
      ></ins>
    </div>
  );
}

const AdsInArticle = ({ id }) => {
  useGoogleAds();
  return (
    <div>
      <ins
        id={id}
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-format="fluid"
        data-ad-layout="in-article"
        data-ad-client="ca-pub-1289188214513795"
        data-ad-slot="5588892736"
      ></ins>
    </div>
  );
};

const AdsInFeedTextOnly = ({id}) => {
  useGoogleAds();
  return (
    <div>
      <ins
        id={id}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-client="ca-pub-1289188214513795"
        data-ad-slot="5800474281"
      ></ins>
    </div>
  );
};

export { AdsHorizontalSmall, AdsHorizontal, AdsMultiplex, AdsInArticle,
  AdsInFeedTextOnly, 
 };