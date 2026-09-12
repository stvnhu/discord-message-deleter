
import puppeteer from 'puppeteer-core';

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function automate(browser) {
    const pages = await browser.pages();
    const page = await pages.find(page => page.url().includes('discord'));

    if (!page) {
        console.log('0 or more than 1 discord tabs are open');
        return;
    }

    if (!(await page.$('#search-results-0'))) {
        console.log('search results are not open');
        return;
    }

    let page_number = 1;
    let msgs_deleted = 0;
    let msgs_deleted_prev_loop = 100; // any number other than 0

    for (; ;) {
        try {
            const page_buttons = await page.$$('div[aria-label^="Page "]');
            const last_page = await page_buttons.at(-1);
            await last_page.click();
            if (msgs_deleted === msgs_deleted_prev_loop) {
                return;
            }
            msgs_deleted_prev_loop = msgs_deleted;
            await wait(2000);
        }
        catch { }

        for (; ;) {

            const elements = await page.$$('li[id^="search-results-"]');

            for (let msg_number = 0; msg_number < elements.length; ++msg_number) {
                try {
                    const click_target = await elements[elements.length - msg_number - 1].$('h2[class^="header_"]');
                    await click_target.click()
                    await wait(1200);

                    await click_target.click({ button: 'right' });
                    await wait(200);

                    const message_delete_id = '#message-delete';
                    await page.waitForSelector(message_delete_id, { timeout: 2000, visible: true });
                    await page.keyboard.down('Shift');
                    await page.click(message_delete_id);
                    await page.keyboard.up('Shift');
                    ++msgs_deleted;
                    console.log(`(total | page | msg): ${msgs_deleted} | ${page_number} | ${msg_number + 1}`);
                    await wait(600);
                }
                catch {
                    continue;
                }
            }
            try {
                const prev_button = await page.$('button[rel="prev"]');
                const disabled_property = await prev_button.getProperty('disabled');
                const is_disabled = await disabled_property.jsonValue();
                if (is_disabled) {
                    break;
                }
                prev_button.click();
                ++page_number
                await wait(2000);
            }
            catch {
                return;
            }
        }
    }
}

(async () => {
    console.log('task begin');
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null,
    });
    await automate(browser);
    browser.disconnect();
    console.log('task complete');
})();
