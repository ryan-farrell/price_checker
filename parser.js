require('dotenv').config()
const sgMail = require('@sendgrid/mail')
const nigthmare = require('nightmare')()
const priceChecker = require('./priceChecks')

priceArray = priceChecker.pricesToBeChecked

// console.log(priceArray)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const args = priceArray
// const url = args[0].url
// const minPrice = args[0].price

// const elementID = 'priceblock_ourprice'
// const elementWait = `#${elementID}`


async function checkPrice(url,minPrice) {
    try {
        const priceString = await nigthmare.goto(url).wait('#priceblock_ourprice').evaluate(
            () => document.getElementById('priceblock_ourprice').innerText).end()
            
            const priceNumber = parseFloat(priceString.replace('£', ''))
            
            if (priceNumber <= minPrice) {
                await sendEmail('Price is Right',
                `The price on ${url} has dropped below ${minPrice}.`
                )
            } else {
                console.log('Price is not right yet!')
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
        console.log('Running...')
        return sgMail.send(email)
    }
    
    async function allPrices(array) {
        for (i = 0; i < array.length; i++)
        await checkPrice(array[i].uri,array[i].price)
        .then(
        console.log(array),
        console.log('Checked...')
        )
        
    }

    allPrices(priceArray);
    
    