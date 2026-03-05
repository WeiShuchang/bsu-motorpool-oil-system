import Swal from 'sweetalert2';

export const useToast = () => {
    const showToast = (message, type = 'success') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        let icon = 'info';
        let title = message;

        switch(type) {
            case 'success':
                icon = 'success';
                break;
            case 'error':
                icon = 'error';
                break;
            case 'warning':
                icon = 'warning';
                break;
            case 'info':
                icon = 'info';
                break;
            default:
                icon = 'info';
        }

        Toast.fire({
            icon: icon,
            title: title
        });
    };

    return { showToast };
};