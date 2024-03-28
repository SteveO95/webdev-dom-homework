"use strict";

import { getCurrentDate } from "./date.js";
import renderApp from "./renderComments.js";
import { fetchGet } from "./api.js";
import { getListComments } from "./listComments.js";
const commentsLoading = document.querySelector(".data-loading");

let comments = [];

export function getAPI() {
  return fetchGet()
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          id: comment.id,
          name: comment.author.name,
          dateСreation: getCurrentDate(new Date(comment.date)),
          text: comment.text,
          likeComment: comment.isLiked,
          likesNumber: comment.likes,
          propertyColorLike: "like-button no-active-like",
        };
      });
      comments = appComments;
      return renderApp(comments, getListComments);
    })
    .then((response) => {
      commentsLoading.style.display = "none";
    })
    .catch((error) => {
      if (error.message === "Server error") {
        alert("Server has broken down, please try again later");
        fetchArrPromise();
      } else if (error.message === "No authorization") {
        console.log(error);
      } else {
        alert("Looks like your Internet has gone, try again later");
        console.log(error);
      }
    });
}

getAPI();
