
import puppeteer from 'puppeteer-core';

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function automate(browser) {

    console.log('task begin');

    const pages = await browser.pages();
    const page = await pages.find(page => page.url().includes('discord'));

    if (!page) {
        console.log('discord tab not open');
        return;
    }

    if (!(await page.$('#search-results-0'))) {
        console.log('search results unavailable');
        return;
    }

    const page_buttons = await page.$$('div[aria-label^="Page "]');
    const last_page = await page_buttons.at(-1);

    if (last_page) {
        await last_page.click();
        await wait(3000);
    }

    let page_number = 1;
    let msgs_deleted = 0

    for (; ;) {

        const elements = await page.$$('li[id^="search-results-"]');

        for (let msg_number = 0; msg_number < elements.length; ++msg_number) {

            const click_target = await elements[elements.length - msg_number - 1].$('h2[class^="header_"]');
            await click_target.click()
            await wait(600);

            await click_target.click({ button: 'right' });
            await wait(200);

            const message_delete_id = '#message-delete';
            try {
                await page.waitForSelector(message_delete_id, { timeout: 2000, visible: true });
                await page.keyboard.down('Shift');
                await page.click(message_delete_id);
                await page.keyboard.up('Shift');
                ++msgs_deleted;
                console.log(`(total | page | msg): ${msgs_deleted} | ${page_number} | ${msg_number + 1}`);
            }
            catch {
                continue;
            }
            await wait(200);
        }
        const prev_button = await page.$('button[rel="prev"]');
        if (!prev_button) {
            break;
        }
        const is_disabled = await (await prev_button.getProperty('disabled')).jsonValue();
        if (is_disabled) {
            break;
        }
        prev_button.click();
        ++page_number
        await wait(3000);
    }
    console.log('task complete');
}

(async () => {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null,
    });
    await automate(browser);
    browser.disconnect();
})();

