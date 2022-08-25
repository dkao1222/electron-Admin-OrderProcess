/*document.getElementById('btnStart').addEventListener('click', async () => {
    
    console.log('get text area data')
    await window.callSAP.asyncGetTextAreaValue();

    console.log('try startup SAP')
    await window.callSAP.checkSAPlogin();

    
         
})*/

document.getElementById('changeHost').addEventListener('click', async () => {
    
    console.log('get change host')
    await window.callSAP.changeHost();

    
         
})

document.getElementById('createInvoice').addEventListener('click', async () => {
    console.log('start create invoice')
    await window.callSAP.createInvoice();
})

console.log('👋 This message is being logged by "renderer.js", included via webpack');