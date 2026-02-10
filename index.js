// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// const nodemailer = require('nodemailer');

// puppeteer.use(StealthPlugin());
// async function checkIrctc() {
//     const browser = await puppeteer.launch({
//         headless: false,
//         defaultViewport: null
//     });
//     const page = await browser.newPage();

//     try {
//         console.log("Checking irctc for charts....");
//         await page.goto('https://www.irctc.co.in/online-charts/', { waitUntil: 'networkidle2' });

//         console.log("Entering train number");
//         await page.waitForSelector('input[id$="-input"]');
//         await page.type('input[id$="-input"]', '22660', { delay: 100 });
//         // const optionSelector='div[id^="react-select-"][id$="-option-0"]'
//         // await page.waitForSelector(optionSelector);
//         // await page.click(optionSelector);
//         //await page.waitForSelector('div[class*="-menu"]', { visible: true });

//         // 3. Use Keyboard to select (Bulletproof method)
//         await page.keyboard.press('ArrowDown');
//         await page.keyboard.press('Enter');

//         console.log("Train selected!");

//         // console.log("Setting Date...")
//         // await page.$eval('input.js466', el => el.removeAttribute('readonly'));
//         // await page.click('input.js466', { clickCount: 3 });
//         // await page.keyboard.press('backspace');
//         // await page.type('input.jss466', '10-02-2026');

//         // console.log("Setting Date...");

//         // // 1. Find the input that is 'readonly' and contains the date pattern
//         // const dateInputSelector = 'input[readonly][value*="-202"]'; 
//         // await page.waitForSelector(dateInputSelector);

//         // // 2. Remove the readonly attribute so we can edit it
//         // await page.$eval(dateInputSelector, el => el.removeAttribute('readonly'));

//         // // 3. Clear the field and type the new date
//         // await page.click(dateInputSelector, { clickCount: 3 });
//         // await page.keyboard.press('Backspace');
//         // await page.type(dateInputSelector, '10-02-2026', { delay: 100 });

//         // console.log("Date set successfully!");

//         // console.log("Setting Boarding Station...");
//         // await page.waitForTimeout(1000);
//         // await page.click('#react-select-5-input');
//         // await page.type('#react-select-5-input', 'CLT', { delay: 150 });
//         // await page.waitForSelector('div[id^="react-select-5-option-0"]');
//         // await page.click('div[id^="react-select-5-option-0"]');

//         // 4. Boarding Station
//         console.log("Selecting Station...");
//         // After selecting the train, a second input appears. 
//         // We target the second one specifically.
//         const inputs = await page.$$('input[id$="-input"]');
//         if (inputs.length > 1) {
//             await inputs[1].type('CLT', { delay: 150 });
//             //await page.waitForSelector(optionSelector);
//             //await page.click(optionSelector);
//             await page.keyboard.press('Enter');
//             console.log("Station selected");
//         }

//         // --- ACTION 4: CLICK BUTTON ---
//         console.log("Clicking Get Train Chart...");
//         // await page.evaluate(() => {
//         //     const buttons = Array.from(document.querySelectorAll('button'));
//         //     const target = buttons.find(btn => btn.innerText.includes('Get Train Chart'));
//         //     if (target){ 
//         //         target.click();
//         //         console.log("Button clicked!")
//         //     }
//         // });
//         await page.evaluate(() => {
//             const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Get Train Chart'));
//             console.log(btn);

//             if (btn){
//                 btn.click();
//                 console.log("Button clicked!");
//             }
//         });

//         // --- ACTION 5: CHECK RESPONSE ---
//         //    await new Promise(r => setTimeout(r, 5000));
//         //     const content = await page.content();

//         //     if (content.includes("Chart not prepared")) {
//         //         console.log("Result: Chart not prepared yet.");
//         //         // Optional: sendEmail("Status Update", "Not ready yet.");
//         //     } else {
//         //         console.log("Result: CHART PREPARED!");
//         //     }

//         // We wait for either the 'Chart not prepared' snackbar OR a 'Coach/Class' result
//         const result = await Promise.race([
//             // Option 1: The error snackbar appears
//             page.waitForSelector('span#client-snackbar', { timeout: 10000 }).then(() => 'NOT_READY'),

//             // Option 2: The actual chart data table/headers appear (using 'Coach' text as a marker)
//             page.waitForFunction(() => document.body.innerText.includes('Coach'), { timeout: 10000 }).then(() => 'READY')
//         ]);

//         if (result === 'NOT_READY') {
//             console.log("Result: Chart not prepared yet (Snackbar detected).");
//         } else {
//             console.log("Result: CHART PREPARED! (Coach data detected).");
//             await sendEmail("ALERT: IRCTC Chart Ready", "The chart is now available!");
//         }
//     }
//     catch (error) {
//         console.error("Script Error:", error);
//     } finally {
//         await browser.close();
//     }
// }

// checkIrctc();




const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const nodemailer = require('nodemailer');
//require('dotenv').config();

puppeteer.use(StealthPlugin());

async function checkIrctc() {
    const browser = await puppeteer.launch({
        headless: "new", // Set to true once you verify it works
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-http2', // Force HTTP/1.1 to avoid the Protocol Error
            '--window-size=1920,1080'
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    try {
        console.log("Checking IRCTC for charts....");
        await page.goto('https://www.irctc.co.in/online-charts/', { waitUntil: 'networkidle2', timeout: 60000 });

        // 1. Enter Train Number
        console.log("Entering train number...");
        const trainInput = 'input[id$="-input"]';
        await page.waitForSelector(trainInput);
        await page.click(trainInput);
        await page.type(trainInput, '22660', { delay: 100 });
        await new Promise(r => setTimeout(r, 1000)); // Wait for search results
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        console.log("Train selected!");

        // 2. Handle Journey Date
        console.log("Verifying Date...");
        // const dateSelector = 'input[readonly][value*="-202"]';
        // await page.waitForSelector(dateSelector);
        // // We ensure the date is correct. Even if default is fine, clicking it helps trigger React state.
        // await page.click(dateSelector); 
        const targetDate = "11-02-2026";

        console.log(`Changing date to ${targetDate}...`);

        await page.evaluate((date) => {
            const dateInput = document.querySelector('input[readonly][value*="-202"]');
            if (dateInput) {
                // 1. Force the value
                dateInput.value = date;

                // 2. Trigger "Input" and "Change" events so React sees the update
                dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                dateInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, targetDate);

        console.log("Date updated successfully!");

        // 3. Selecting Station
        console.log("Selecting Station...");
        await new Promise(r => setTimeout(r, 1500)); // Crucial wait for station API
        const inputs = await page.$$('input[id$="-input"]');
        if (inputs.length > 1) {
            await inputs[1].click();
            await inputs[1].type('CLT', { delay: 150 });
            await new Promise(r => setTimeout(r, 1000));
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            console.log("Station selected");
        }

        // 4. Click Submit
        console.log("Clicking Get Train Chart...");
        // await page.evaluate(() => {
        //     const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Get Train Chart'));
        //     if (btn) btn.click();
        // });
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');

        // 5. THE RACE (Catching the snackbar before it disappears)
        console.log("Waiting for response...");
        const result = await Promise.race([
            page.waitForSelector('span#client-snackbar', { timeout: 15000 }).then(() => 'NOT_READY'),
            page.waitForFunction(() => document.body.innerText.includes('Coach') || document.body.innerText.includes('Vacant Berths'), { timeout: 15000 }).then(() => 'READY')
        ]);

        if (result === 'NOT_READY') {
            const msg = await page.$eval('span#client-snackbar', el => el.innerText);
            console.log(`Result: ${msg}`);
            //await sendEmail("ALERT: IRCTC Chart Not Ready", "The chart for 22660 is not available.");
        } else {
            console.log("Result: CHART PREPARED!");
            await sendEmail("ALERT: IRCTC Chart Ready", "The chart for 22660 is now available.");
        }

    } catch (error) {
        console.error("Script Error:", error.message);
        // Take a screenshot to see why it timed out
        if (!page.isClosed()) {
        try {
            await page.screenshot({ path: 'error_debug.png' });
            console.log("Screenshot saved as error_debug.png");
        } catch (screenshotError) {
            console.error("Could not capture screenshot:", screenshotError.message);
        }
    }
    } finally {
        // Keep browser open for a few seconds to see the result visually
        await new Promise(r => setTimeout(r, 3000));
        await browser.close();
    }
}

async function sendEmail(subject, text) {
    // Add your nodemailer transporter config here
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: `"IRCTC Monitor" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: subject,
        text: text
    });
    console.log(`Email Sent: ${subject}`);
}

checkIrctc();