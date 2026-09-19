import axios from 'axios';
import date from 'date-and-time';
import { getFingerprint } from '../helper';
import { serverURL, siteName } from '../srcSet';
import { exist } from '../helper';

type MainUser = {
    genderValue: number;
    username: string;
};

type SiteViewProps = {
    geo: {
        continent: string;
        countryCode: string;
        country: string;
        city: string;
    };
    mainUser?: MainUser;
    subject: string;
    lang: string;
};

type SiteViewItem = {
    countryCode: string;
    country: string;
    view: number;
};

type CountryView = {
    _id: string;
    country: string;
    count: number;
};

const siteView = async (
    props: SiteViewProps
): Promise<void> => {
    const today = date.format(new Date(), 'YYYY/MM/DD');

    const visitorId = await getFingerprint();

    const local =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    const siteViewInfo = {
        visitorId,
        continent: props.geo.continent,
        countryCode: props.geo.countryCode,
        country: props.geo.country,
        city: props.geo.city,
        genderValue: props.mainUser
            ? props.mainUser.genderValue
            : '',
        username: props.mainUser
            ? props.mainUser.username
            : '',
        subject: props.subject !== ''
            ? props.subject
            : window.location.pathname.split('/')[2],
        lang: props.lang,
        viewDate: today,
        view: 1,
        version: import.meta.env.VITE_VERSION,
        siteName: local
            ? 'local - ' + siteName
            : siteName,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screen: `height: ${window.screen.height}, width: ${window.screen.width}`,
    };

    axios.post(
        `${serverURL}/view/addSiteView/`,
        siteViewInfo
    ).then(async res => {
        const result = res.data;

        if (exist(result.countryCode)) {
            axios.post(
                `${serverURL}/view/addSiteViewMain/`,
                result
            );
        }
    });

    const dataView = {
        option: 1000000000,
        dx: 0,
    };

    axios.post(
        `${serverURL}/view/getSiteViewMain`,
        dataView
    ).then(async res => {
        const data = res.data as SiteViewItem[];

        const accumulation = data.reduce<SiteViewItem[]>(
            (total, val) => {
                const foundItemIndex = total.findIndex(
                    obj => obj.country === val.country
                );

                if (foundItemIndex < 0) {
                    total.push(val);
                } else {
                    total[foundItemIndex].view = 1;
                }

                return total;
            },
            []
        );

        const vx = accumulation;
        const vxArr: CountryView[] = [];

        for (let i = 0; i < vx.length; i++) {
            vxArr.push({
                _id: vx[i].countryCode,
                country: vx[i].country,
                count: vx[i].view,
            });
        }

        const total = vxArr;

        const tSum = total
            .map(n => n.count)
            .reduce((a, b) => a + b, 0);

        const fn = Math.floor(Math.random() * 10);
        const tl = total.length;

        for (let x = 0; x < fn; x++) {
            const ti = Math.floor(
                Math.random() * tSum
            ) + 1;

            let q = 0;
            let finish = false;

            for (
                let a = 0;
                a < tl && !finish;
                a++
            ) {
                q = q + total[a].count;

                if (ti <= q) {
                    const fakeViewInfo = {
                        countryCode: total[a]._id,
                        country: total[a].country,
                        viewDate: today,
                        view: 1,
                    };

                    finish = true;

                    if (
                        fakeViewInfo.countryCode !== 'AF'
                    ) {
                        axios.post(
                            `${serverURL}/view/addSiteViewMain/`,
                            fakeViewInfo
                        );
                    }
                }
            }
        }
    });
};

export default siteView;