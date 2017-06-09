
import querystring from 'querystring';

function isLocalStorageSupported() {
    let testKey = 'test', storage = window.localStorage;
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    }
    catch (error) {
        return false;
    }
}

const canUseLocalStorage = isLocalStorageSupported();

class WebSessionCounter {
    constructor() {
        this.update();
    }

    get count() {
        if (canUseLocalStorage) {
            return Number(window.localStorage.getItem('user_web_session_count'));
        }else{
            return NaN;
        }
    }

    set count(val) {
        window.localStorage.setItem('user_web_session_count', val);
    }

    get lastActive() {
        const time = window.localStorage.getItem('user_web_session_last_active');

        if (time) {
            return new Date(time);
        }else{
            return new Date();
        }
    }

    set lastActive(time) {
        window.localStorage.setItem('user_web_session_last_active', time.toISOString());
    }

    get lastUtmCampaign() {
        return window.localStorage.getItem('user_web_session_utm_campaign');
    }

    set lastUtmCampaign(val) {
        window.localStorage.setItem('user_web_session_utm_campaign', val);
    }

    get currentUtmCampaign() {
        const [ path, query = '' ] = window.location.href.split('?'),
              { utm_campaign = '' } = querystring.parse(query);

        return utm_campaign;
    }

    update() {
        if (canUseLocalStorage) {
            let count = this.count,
                time = this.lastActive;

            if (count === 0 || this.isNewSession()) {
                this.count = count + 1;
                this.lastActive = new Date();
                this.lastUtmCampaign = this.currentUtmCampaign;
            }
        }
    }

    isNewSession() {
        // use definition from https://support.google.com/analytics/answer/2731565?hl=en

        const time = this.lastActive,
              now = new Date();

        return [
            (now - time)/1000/60 > 30,
            now.toDateString() !== time.toDateString(),
            this.lastUtmCampaign !== this.currentUtmCampaign
        ].some(b => b);
    }
}

export default new WebSessionCounter();
