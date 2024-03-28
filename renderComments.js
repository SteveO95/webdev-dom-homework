import { fetchPost, toggleLike } from "./api.js";
import { getAPI } from "./main.js";
import { renderLoginComponent } from "./components/loginComponent.js";
import { getListComments } from "./listComments.js";

let token = null;
let name = null;

const renderApp = (comments, listComments) => {
  const appElement = document.getElementById("app");

  if (!token) {
    renderLoginComponent({
      comments,
      appEl: appElement,
      setToken: (newToken) => {
        token = newToken;
      },
      setName: (newName) => {
        name = newName;
      },
      getAPI,
    });
  } else {
    const commentsHtml = comments
      .map((comment, index) => listComments(comment, index))
      .join("");

    const appHTML = `<div class="container">

  <ul class="comments">
   ${commentsHtml}
  </ul>
  
  <div class="add-form">
    <input type="text" readonly class="add-form-name" value = "${name}" />
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш коментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button class="add-form-button">Написать</button>
    </div>
  </div>
  <div class="comment-loading">Comment is being loaded...</div>
</div>`;

    appElement.innerHTML = appHTML;

    const formCommentElement = document.querySelector(".add-form");
    const inputNameElement = document.querySelector(".add-form-name");
    const inputTextElement = document.querySelector(".add-form-text");
    const buttonElement = document.querySelector(".add-form-button");
    const commentsElement = document.querySelector(".comments");
    const commentLoadingElement = document.querySelector(".comment-loading");
    const currentDate =
      new Date().toLocaleDateString("default", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }) +
      " " +
      new Date().toLocaleTimeString().slice(0, -3);

    // //счетчик лайков у каждого комментария
    // function getLikeButton() {
    //   const likesButton = document.querySelectorAll(".like-button");
    //   for (const like of likesButton) {
    //     like.addEventListener("click", (event) => {
    //       event.stopPropagation();

    //       const likeIndex = like.dataset.index;
    //       const commentsElementLikeIndex = comments[likeIndex];
    //       like.classList.add("-loading-like");

    //       if (commentsElementLikeIndex.likeComment) {
    //         //commentsElementLikeIndex.likesNumber -= 1;
    //         commentsElementLikeIndex.likeComment = false;
    //         commentsElementLikeIndex.propertyColorLike =
    //           "like-button -no-active-like";
    //       } else {
    //         //commentsElementLikeIndex.likesNumber += 1;
    //         commentsElementLikeIndex.likeComment = true;
    //         commentsElementLikeIndex.propertyColorLike =
    //           "like-button -active-like";
    //       }

    //       const id = like.dataset.id;

    //       toggleLike({ id, token });

    //       delay(2000).then(() => {
    //         getAPI();
    //       });
    //     });
    //   }
    // }
    // getLikeButton();
    function delay(interval = 300) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, interval);
      });
    }

    function getLikeButton() {
      const likesButton = document.querySelectorAll(".like-button");

      for (const like of likesButton) {
        like.addEventListener("click", (event) => {
          event.stopPropagation();
          
          const likeIndex = like.dataset.index;
          const commentsElementLikeIndex = comments[likeIndex];

          if (commentsElement.currentLike) {
            commentsElement.likes -= 1;
            commentsElement.currentLike = false;
            like.classList.add("-no-active-like");
            like.classList.remove("-active-like");
            // renderComments(comments, getListComments);
          } else {
            commentsElement.likes += 1;
            commentsElement.currentLike = true;
            commentsElementLikeIndex.propertyColorLike =
              "like-button -active-like";
            // renderComments(comments, getListComments);
          }
          const id = like.dataset.id;

          toggleLike({ id, token });

          delay(2000).then(() => {
            getAPI();
          });
        });
      }
    }
    getLikeButton();

    buttonElement.addEventListener("click", () => {
      // добавление обработчика клика на кнопку добавления комментариев и установка даты
      const currentDate =
        new Date().toLocaleDateString("default", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) +
        " " +
        new Date().toLocaleTimeString().slice(0, -3);

      // nameInputElement.classList.remove("error");
      inputNameElement.classList.remove("error");
      if (inputNameElement.value === "") {
        inputNameElement.classList.add("error");
        return;
      }

      inputTextElement.classList.remove("error");
      if (inputTextElement.value === "") {
        inputTextElement.classList.add("error");
        return;
      }
    });

    getLikeButton();

    //отпраляем новые данные
    const postData = () => {
      return fetchPost(token, inputTextElement, inputNameElement)
        .then((response) => {
          return getAPI();
        })
        .then((data) => {
          commentLoadingElement.classList.add("comment-loading");
          formCommentElement.classList.remove("comment-loading");

          inputNameElement.value = "";
          inputTextElement.value = "";
        })
        .catch((error) => {
          // Упавший интернет
          // Если сервер сломался, то просим попробовать позже
          if (error.message === "Server error") {
            alert(
              "Ooops, the Server has just fallen down. Try a little later."
            );
            postData();
          }
          // Если пользователь ошибся с запросом, просим поправить
          else if (error.message === "Bad request") {
            alert(
              "The name and/or the comment are too short, minimum length is 3 symbols. Try again later."
            );
          } else {
            alert("Looks like, the Internet has broken down, try again later");
            // console.log(error);
          }

          buttonElement.removeAttribute("disabled");
          commentLoadingElement.classList.add("comment-loading");
          formCommentElement.classList.remove("comment-loading");

          // console.log(error);
        });
    };

    buttonElement.addEventListener("click", () => {
      commentLoadingElement.classList.remove("comment-loading");
      formCommentElement.classList.add("comment-loading");
      buttonElement.setAttribute("disabled", true);

      //отпраляем новые данные
      postData(fetchPost);
    });
  }
};
export default renderApp;
