require('dotenv').config()
const sgMail = require('@sendgrid/mail')
const nigthmare = require('nightmare')()
const { pricesToBeChecked } = require('./priceChecks')
const { promisify } = require('util');

priceArray = pricesToBeChecked

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function checkPrice(url, minPrice) {
    try {
        const priceString = await nigthmare.goto(url).wait('#priceblock_ourprice').evaluate(
            () => document.getElementById('priceblock_ourprice').innerText).end()
        const priceNumber = parseFloat(priceString.replace('£', ''))

        if (priceNumber <= minPrice) {
            await sendEmail('Price is Right',
                `The price on ${url} has dropped below ${minPrice}.`)
            console.log(`The price on ${url} has dropped below ${minPrice}.`)

        } else {
            console.log(`Price is not right yet, currently at £${priceNumber}!`)

        }

    } catch (e) {
        await sendEmail('Email Price Checker Error', e.message)
        throw e

    }
}


function sendEmail(subject, body) {
    const email = {
        to: process.env.EMAIL_TO_SEND,
        from: 'price-checker@example.com',
        subject: subject,
        text: body,
        html: body,
    }
    console.log('Sending email...')
    return sgMail.send(email)
}

const promisfifiedCheckPrice = promisify(checkPrice);

async function allPrices(array) {
    console.log('Checking prices...')
    for (let i = 0; i < array.length; i++) {
        let uri = array[i].uri
        let price = array[i].price

        /**************************************************************************/
        /**************************************************************************/

        // checkPrice(uri, price)

        await promisfifiedCheckPrice(uri, price).then(() => {
            console.log(array[i])
            console.log(`Checked price ${i + 1}.`)
        })

        /**************************************************************************/
        /**************************************************************************/
    }
    console.log('All price checks completed...')
}

allPrices(priceArray);

