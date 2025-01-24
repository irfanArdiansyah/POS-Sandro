import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { AttachmentService } from '../../../../services/attachment/attachment.service';
import * as moment from 'moment';
import { ExcelService } from '../../../../services/excel/excel.service';
import { PopupNotifService } from '../../../../services/notifications/popup-notif.service';


@Component({
  selector: 'ngx-smart-table-shared',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnChanges {
  @Input() data;
  @Input() columns;
  @Input() title = 'Smart Table';
  @Input() calculate = false
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  dateReport
  settings:any = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    }
  };
  source: any = new LocalDataSource();
  reportData: any = [];

  constructor(
    private service: SmartTableData,
    private attachmentServ:AttachmentService,
    public excelServ:ExcelService,
    private popup:PopupNotifService

  ) {
    if (this.columns) {
      this.settings.columns = this.columns
    }
    if(this.calculate)
      this.settings.actions = {
        custom: [
          {
            name: 'view',
            title: 'View ',
          },
          {
            name: 'edit',
            title: 'Edit ',
          },
          {
            name: 'delete',
            title: 'Delete ',
          },
          {
            name: 'duplicate',
            title: 'Duplicate ',
          },
        ],
    }


    // const data = this.service.getData();
    // this.source.load(data);

    if (this.data)
      this.source.load(this.data);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data)
      if (this.data)
        this.source.load(this.data);
    if (changes.calculate)
      if(this.calculate)
        this.settings.actions = {
          custom: [
            {
              name: 'view',
              title: 'View ',
            },
            {
              name: 'edit',
              title: 'Edit ',
            },
            {
              name: 'delete',
              title: 'Delete ',
            },
            {
              name: 'duplicate',
              title: 'Duplicate ',
            },
          ],
      }
    if (changes.columns)
      if (this.columns) {
      const settings = {...this.settings}
      settings.columns = this.columns
      this.settings = settings
    }
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      this.onDelete.emit(event)
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    this.onCreate.emit(event)
  }


  onEditConfirm(event) {
    this.onEdit.emit(event)
  }

  downloadReport(){
    if(this.dateReport == null)return this.popup.errorData("Please select start end date first", 'popup')
    if(this.reportData.length == 0) return this.popup.errorData("No Report Found", 'popup')
    let startDate='';
    let endDate='';
    if(this.dateReport.start)
     startDate = moment(this.dateReport.start).format("_DD_MM_YYYY")
    if(this.dateReport.end)
      endDate = moment(this.dateReport.end).format("_DD_MM_YYYY")
    this.attachmentServ.downloadExcel(this.reportData, "Data " + this.title + startDate + endDate)
  }


  downloadReportPDF(){
    if(this.dateReport == null)return this.popup.errorData("Please select start end date first", 'popup')
    if(this.reportData.length == 0) return this.popup.errorData("No Report Found", 'popup')
    let param = this.reportData.map(x => {
      let arr:any = Object.keys(this.columns)
      let fields = {}
      arr.filter(y=>{
        fields[y] = x[y]
      })
      return fields
    })
    this.getReportPDFReady(param);
    setTimeout(() => {
      let startDate='';
      let endDate='';
      if(this.dateReport.start)
       startDate = moment(this.dateReport.start).format("_DD_MM_YYYY")
      if(this.dateReport.end)
        endDate = moment(this.dateReport.end).format("_DD_MM_YYYY")
      this.excelServ.downloadReport(this.reportData, "Data " + this.title + startDate + endDate)
    }, 1000);
  }

  private getReportPDFReady(param: any) {
    this.excelServ.trs = []
    this.excelServ.ths = []
    this.excelServ.title = this.title
    param.forEach((item, index) => {
      let tds = [];
      let newths = [];
      let customThs = []
      if(this.title ==  'Invoices Table')
        customThs = ['key', 'saleDate', 'cashierName', 'paymentMethod', 'netAmount', 'status']
      else if(this.title == 'Product Table')
        customThs = ['productName', 'quantityPerUnit', 'unitPrice', 'unitInStock', 'taxRate', 'discount', 'status']
      else{
        if (index == 0)
          Object.keys(param[index]).forEach((key, index) => {
            this.excelServ.ths.push(key);
            newths.push(key);
          }, param);
        if (index > 0)
          Object.keys(param[index]).forEach((key, index) => {
            newths.push(key);
          }, param);
      }
      
      if(customThs.length > 0)
        newths = customThs

      if (newths.length > this.excelServ.ths.length) { this.excelServ.ths = newths; }
      newths.forEach((key, index) => {
        let value:any= item[key]
        if(value?.length == 20 && value?.includes("-"))
          value = "#"+value.substring(value.length, value.length - 6)
        else if(value?.length == 28){
          value = "#"+value.substring(value.length, value.length - 6)
        }
        else if(value?.length > 40){
          value = value.substring(value.length, value.length - 6) + '...'
        }
        tds.push(value);
      }, param);
      this.excelServ.trs.push(tds);
    }); 
    
  }

  updateValue(){
    if(this.source.data?.length > 0){
      if(this.source.data.filter(x=>x.dateUpdated).length > 0){
        if(this.dateReport.start && this.dateReport.end)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.dateUpdated)) >= moment(this.dateReport.start) && moment(new Date(x.dateUpdated)) <= moment(this.dateReport.end))
        if(this.dateReport.start)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.dateUpdated)).format("DD/MMM/YYYY") == moment(this.dateReport.start).format("DD/MMM/YYYY"))
        if(this.dateReport.end)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.dateUpdated)).format("DD/MMM/YYYY") == moment(this.dateReport.end).format("DD/MMM/YYYY"))
      }else if(this.source.data.filter(x=>x.saleDate).length > 0){
        if(this.dateReport.start && this.dateReport.end)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.saleDate)) >= moment(this.dateReport.start) && moment(new Date(x.saleDate)) <= moment(this.dateReport.end))
        if(this.dateReport.start)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.saleDate)).format("DD/MMM/YYYY") == moment(this.dateReport.start).format("DD/MMM/YYYY"))
        if(this.dateReport.end)
          return this.reportData = this.source.data.filter(x=>moment(new Date(x.saleDate)).format("DD/MMM/YYYY") == moment(this.dateReport.end).format("DD/MMM/YYYY"))
      }else{
        this.reportData = this.source.data
      }
    }

  }

}
