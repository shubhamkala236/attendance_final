const pdfDocument = require('pdfkit');
// const pdfDocument = require("pdfkit-table");


function sendPdf(dataCallback,endCallback,data){
    console.log(data);
    const doc = new pdfDocument();

    
    doc.on('data',dataCallback);
    doc.on('end',endCallback);


    doc
    .fontSize(25)
    .text('Some text with an embedded font! data');


    doc.end();
  
}

module.exports = {sendPdf};

  
    

    
