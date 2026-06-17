const QRCode = require('qrcode')
const config = require('../../config.js')

exports.getQRCode = async () => {
    const IP = config.SERVER_URL;
    const URL = `http://${IP}/api/auth/QRCode`;
    try{
        const qrAsText = await QRCode.toString(URL,{
            type: 'terminal',
            small: true,
            margin: 1,
            errorCorrectionLevel: 'L',
        });
        console.log(qrAsText);
        return qrAsText;
    }catch(err){
        console.error(`Error while generating QR code ${err}`)
    }
};

