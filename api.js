import { getCurrentDate } from "./date.js";

const host = "https://wedev-api.sky.pro/api/v2/sergey-syomin/comments/";
const mainUser = "https://wedev-api.sky.pro/api/user/login";
const newUser = "https://wedev-api.sky.pro/api/user";

export const fetchGet = () => {
  return fetch(host, {
    method: "GET",
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("No authorization");
    } else if (response.status === 500) {
      throw new Error("Server error");
    } else {
      return response.json();
    }
  });
};

//отпраляем новые данные
export const fetchPost = (token, inputTextElement, inputNameElement) => {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      name: inputNameElement.value,
      date: getCurrentDate(new Date()),
      text: inputTextElement.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='comment-quote'><b>")
        .replaceAll("QUOTE_END", "</b></div>"),
      isLiked: false,
      likes: 0,
      propertyColorLike: "like-button no-active-like",
      forceError: true,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Server error");
    } else if (response.status === 400) {
      throw new Error("Bad request");
    } else {
      return response.json();
    }
  });
};

//https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md
export const userLogin = ({ login, password }) => {
  return fetch(mainUser, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Server error");
    } else if (response.status === 400) {
      throw new Error("No authorization");
    } else {
      return response.json();
    }
  });
};

export const registerUser = ({ login, password, name }) => {
  return fetch(newUser, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
    }),
  }).then((response) => {
    if (response.status === 500) {
      throw new Error("Server error");
    } else if (response.status === 400) {
      throw new Error("This user already exists");
    } else {
      return response.json();
    }
  });
};

//likes
export const toggleLike = ({ id, token }) => {
  return fetch(
    `https://wedev-api.sky.pro/api/v2/sergey-syomin/comments/${id}/toggle-like`,
    {
      method: "POST",
      headers: {
        Authorization: token,
      },
    }
  ).then((response) => {
    return response.json();
  });
};
