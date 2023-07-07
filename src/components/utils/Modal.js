import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
function ModalwithConfirmation(
  translations,
  confirmFunction,
  iconType,
  dismissFunction
) {
  return Swal.fire({
    title: translations.modal_title,
    text: translations.modal_text,
    icon: iconType,
    allowOutsideClick: false,
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: "#1976d2",
    cancelButtonColor: "#616161",
    footer: translations.modal_footer,
    confirmButtonText: translations.modal_confirm_button,
    cancelButtonText: translations.modal_cancel_button,
  }).then((result) => {
    if (result.isConfirmed) {
      confirmFunction();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      dismissFunction();
    }
  });
}

export { ModalwithConfirmation };

function ErrorModal(translations, iconType) {
  return Swal.fire({
    title: translations.modal_title,
    html: translations.modal_text,
    allowOutsideClick: false,
    icon: iconType,
    confirmButtonColor: "#1976d2",
    confirmButtonText: translations.modal_close_button,
  });
}
export { ErrorModal };

function SuccessModal(translations, iconType, dismissFunction) {
  return Swal.fire({
    title: translations.modal_title,
    html: translations.modal_text,
    allowOutsideClick: false,
    icon: iconType,
    confirmButtonColor: "#1976d2",
    confirmButtonText: translations.modal_confirm_button,
  }).then((result) => {
    if (result.isConfirmed) {
      dismissFunction();
    }
  });
}
export { SuccessModal };
