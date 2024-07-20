import { Injectable } from "@angular/core";
import { NbComponentStatus, NbDialogService, NbToastrService } from "@nebular/theme";
import { DialogComponent } from "../../@theme/components/dialog/dialog.component";


declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class PopupNotifService {
    constructor(private toastrService: NbToastrService, private dialog:NbDialogService) {

    }
    errorData(message: string, type=null) {
        if(type == 'popup')
            this.showCustomPopup("Error", message, 'close-circle-outline', null, 'danger', false)
        else
            return this.showNotification('top', 'center', message, 'error_outline', 'danger')
    }
    succesData(message: string, timer=2000, type=null) {
        if(type == 'popup')
            this.showCustomPopup("Error", message, 'check_circle', null, 'success', false)
        else
            return this.showNotification('top', 'center', message, 'check_circle', 'success', timer)
    }

    infoData(message: string) {
        return this.showNotification('top', 'center', message, 'error_outline', 'info')
    }

    showDeletePopup(message = "Apakah kamu yakin ingin menghapus data ini?") {
        return this.dialog.open(DialogComponent, {
                context:{
                   title: "Konfirmasi Hapus", 
                   message: message, 
                   isDblBtn: true, 
                   icon: 'warning'
                }
            })
    }

    showCustomPopup(title, message = "no message", icon, custom, status, isDblBtn = true) {
        return this.dialog.open(DialogComponent, {
                context:{
                   title: title, 
                   message: message, 
                   isDblBtn: isDblBtn, 
                   icon: icon,
                   custom:custom,
                   status:status
                }
            })
    }

    showNotification(from, align, message, icon = 'notifications', color:NbComponentStatus = "info", timer = 2000) {
        const type = ['', 'info', 'success', 'warning', 'danger'];

        // $.notify({
        //     icon: icon,
        //     message: message,
        //     alert: color

        // }, {
        //     type: type[color],
        //     timer: timer,
        //     placement: {
        //         from: from,
        //         align: align
        //     },
        //     template: `
        //         <nb-alert status="${type[color]}">
        //             ${message}
        //         </nb-alert>
        //     `
        // });

        // this.toastrService.show(color || 'Success', message, { status:color});
     
        return {
                status:color,
                message:message,
                show:true
            }
    }

    showToast(from, align, message, icon = 'notifications', color:NbComponentStatus = "info", timer = 2000) {
        this.toastrService.show(color || 'Success', message, { status:color});
    }
}