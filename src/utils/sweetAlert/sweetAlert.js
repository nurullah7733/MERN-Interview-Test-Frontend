import Swal from "sweetalert2";
export const randomSweetAlert = async (title) => {
  return await Swal.fire({
    title: title,
    width: 500,
    icon: "question",
    customClass: {
      title: "custom-swal-title",
      confirmButton: "custom-swal-confirm-button",
      cancelButton: "custom-swal-cancel-button",
    },
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    // confirmButtonText: "Yes, delete it!",
  });
};
