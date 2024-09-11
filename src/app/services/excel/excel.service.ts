import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import JSPDF, { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  content;
  ths: any = []
  trs: any = []
  desc: any = []
  title:string = ""
  constructor() { }

  async exportToPDF(filename) {
    {
      let DATA: any = document.getElementById('printWrapper');
      let options = {
        fileName: filename,
        scale: 2,
        // allowTaint:true
      };
      html2canvas(DATA, options).then((canvas) => {
        const img = canvas.toDataURL("image/png");
        var doc = new jsPDF('p', 'mm');
        const bufferX = 3;
        const bufferY = 3;
        const imgProps = (<any>doc).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

        return doc;
      }).then((doc) => {
        doc.save(filename + '.pdf');
      });;


    }
  }

  downloadReport(data, name) {
    let DATA: any = document.getElementById('print-wrapper');
    html2canvas(DATA, { scale: 2, allowTaint: true }).then((canvas) => {

      const image = { type: 'jpeg', quality: 1.3 };
      const margin = [0.5, 0.5];
      const filename = name;

      var imgWidth = 8.5;
      var pageHeight = 11;

      var innerPageWidth = imgWidth - margin[0] * 2;
      var innerPageHeight = pageHeight - margin[1] * 2;

      // Calculate the number of pages.
      var pxFullHeight = canvas.height;
      var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth));
      var nPages = Math.ceil(pxFullHeight / pxPageHeight);

      // Define pageHeight separately so it can be trimmed on the final page.
      var pageHeight = innerPageHeight;

      // Create a one-page canvas to split up the full image.
      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Initialize the PDF.
      var pdf = new jsPDF('p', 'in', [8.5, 11]);


      for (var page = 0; page < nPages; page++) {
        // Trim the final page to reduce file size.
        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
          pageCanvas.height = pxFullHeight % pxPageHeight;
          pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width;
        }

        // Display the page.
        var w = pageCanvas.width;
        var h = pageCanvas.height;
        pageCtx.fillStyle = 'white';
        pageCtx.fillRect(0, 0, w, h);
       
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);
        

        // Add the page to the PDF.
        if (page > 0) pdf.addPage();
        var imgData = pageCanvas.toDataURL('image/' + image.type, image.quality);
        pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight);
        pdf.setFontSize(10)
        pdf.text('' + pdf.getNumberOfPages(), 8, 10.5); //print number bottom right
      }

      pdf.save(filename + '.pdf');
    });

    // html2canvas(DATA, { scale: 2 }).then((canvas) => {
    //   const filename = name;
    //   let fileWidth = 208;
    //   let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //   const FILEURI = canvas.toDataURL('image/png');
    //   let PDF = new jsPDF('p', 'mm', 'a4');
    //   let position = 0;
    //   PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //   PDF.save(filename + '.pdf');
    // });
  }

}


