

document.getElementById('createInvoice').addEventListener('click', async () => {
    console.log('start create invoice')
    await window.callSAP.createInvoice();
})
console.log('👋 This message is being logged by "renderer.js", included via webpack');