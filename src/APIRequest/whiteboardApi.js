import axiosInstance from "../utils/axios/axios";
import {
  errorToast,
  successToast,
} from "../utils/notificationAlert/notificationAlert";

export const createWhiteboardRequest = async (title, objects) => {
  let url = `/create-drawing`;
  let postBody = {
    title: title,
    objects: {
      objects: objects,
    },
  };

  try {
    let res = await axiosInstance.post(url, postBody);
    if (res.data.status === "success") {
      return res.data.data;
    } else if (res.data.status === "fail") {
      return false;
    } else {
      errorToast("Request fail. Please try again");
      return false;
    }
  } catch (error) {
    errorToast("Something went wrong. Please try again");
    return false;
  }
};

export const getAllWhiteboardRequest = async (
  pageNo,
  perPage,
  searchKeyword
) => {
  let url = `/get-all-drawing/${pageNo}/${perPage}/${searchKeyword}`;
  try {
    let res = await axiosInstance.get(url);
    if (res.data.status === "success") {
      if (res.data.data?.[0].total?.length > 0) {
        return res.data.data[0];
      } else {
        successToast("No Project Found!");
        return [];
      }
    } else if (res.data.status === "fail") {
      return [];
    } else {
      errorToast("Request fail. Please try again");
      return [];
    }
  } catch (error) {
    errorToast("Something went wrong. Please try again 1100");
    return [];
  }
};

export const updateWhiteboardRequest = async (id, title, objects) => {
  let url = `/update-drawing/${id}`;
  let postBody = {
    title: title,
    objects: {
      objects: objects,
    },
  };

  try {
    let res = await axiosInstance.post(url, postBody);
    if (res.status === 200 && res.data.status === "success") {
      return true;
    } else if (res.status === 200 && res.data.status === "fail") {
      return false;
    } else {
      errorToast("Request fail. Please try again");
      return false;
    }
  } catch (error) {
    errorToast("Something went wrong. Please try again");
    return false;
  }
};

export const deleteWhiteboardRequest = async (id) => {
  let url = `/delete-drawing/${id}`;
  try {
    let res = await axiosInstance.get(url);
    if (res.data.status === "success" && res.data.data.deletedCount > 0) {
      successToast("Drawing deleted successfully");
      return true;
    } else {
      errorToast("Drawing deletion failed. Please try again");
      return false;
    }
  } catch (error) {
    errorToast("Something went wrong. Please try again");
    return [];
  }
};
