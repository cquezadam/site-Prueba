import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

toastr.options = {
    positionClass: 'toast-bottom-right',
    showDuration: 1000,
    hideDuration: 1000,
    timeOut: 4000
};

export const Notification = toastr;