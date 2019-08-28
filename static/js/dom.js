// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
    },


    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
        let wholeBoard = document.getElementById("boards");
        wholeBoard.addEventListener("click",function (e) {

            if (e.target && e.target.matches("i.fa-trash-alt")) {

                let cardId = e.target.id;
                dom.deleteCard(cardId);

            }
            if (e.target && e.target.matches("button.board-delete")) {
                let boardId = e.target.id.split("-")[2];
                dom.deleteBoard(boardId);
            }
        });

    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardDiv = document.getElementById('boards');

        let newButton= `
            <form id="create-board">
            <input id="user-input" type="text" name="title">
            <button type="submit" class="add-new">Create board</button>
            </form>
            `;
        boardDiv.innerHTML += newButton;
        let createBoardBtn = document.getElementById("create-board");
        createBoardBtn.addEventListener("submit",function (e) {
            e.preventDefault();
            let title = document.getElementById("user-input").value;
            dom.createNewBoard(title,boards);

        });
        let boardList = '';

        for(let board of boards){
            boardList += `
            <section class="board" id="board-${board.id}">
            <div class="board-header"><span class="board-title" id="board-${board.id}-title" >${board.title}</span>
                <button class="board-delete" id="delete-board-${board.id}">Delete board</button>
                <button class="board-add" id="add-card-button-${board.id}">Add Card</button>
                <button class="board-toggle" id="button-${board.id}"><i class="fas fa-chevron-down"></i></button>

            </div>
            <div class="board-columns hidden">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content" id="board-${board.id}-1"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">In Progress</div>
                    <div class="board-column-content" id="board-${board.id}-2"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div class="board-column-content" id="board-${board.id}-3"></div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Done</div>
                    <div class="board-column-content" id="board-${board.id}-4"></div>
                </div>
            </div>
        </section>
            `;

        }
        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;
        this._appendToElement(document.querySelector('#boards'), outerHtml);
        for (let board of boards) {
            dom.openBoards(board.id);
            dom.loadCards(board.id);
            dom.editTitle(board.id);
            let button = document.getElementById(`add-card-button-${board.id}`);
            button.addEventListener("click", function () {
                dom.createNewCard(board.id);
            });
        }
    },
    showBoard: function(title,callback,boards){
            console.log(boards);

        // let newBoard = `
        //     <section class="board" >
        //     <div class="board-header"><span class="board-title" >${title}</span>
        //         <button class="board-add">Add Card</button>
        //         <button class="board-toggle" ><i class="fas fa-chevron-down"></i></button>
        //
        //     </div>
        //     <div class="board-columns hidden">
        //         <div class="board-column">
        //             <div class="board-column-title">New</div>
        //             <div class="board-column-content" ></div>
        //         </div>
        //         <div class="board-column">
        //             <div class="board-column-title">In Progress</div>
        //             <div class="board-column-content" ></div>
        //         </div>
        //         <div class="board-column">
        //             <div class="board-column-title">Testing</div>
        //             <div class="board-column-content" ></div>
        //         </div>
        //         <div class="board-column">
        //             <div class="board-column-title">Done</div>
        //             <div class="board-column-content" ></div>
        //         </div>
        //     </div>
        // </section>`;

        // this._appendToElement(document.querySelector("#boards"), newBoard);
        // // boardDiv.appendChild(newBoard);
        // callback();


    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        // console.log("before calling getcards");
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);

        });

    },

    showCard: function (card) {
        console.log(document.getElementById(`board-${card.board_id}-${card.status_id}`));
        let newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
        let cardOpenClose = document.createElement("div");
        cardOpenClose.setAttribute("class", "card-remove");
        let iElement = document.createElement("i");
        iElement.setAttribute("class", "fas fa-trash-alt");
        iElement.setAttribute("id",`${card.id}`);
        cardOpenClose.appendChild(iElement);
        let cardTitle = document.createElement("div");
        cardTitle.setAttribute("class", "card-title");
        cardTitle.setAttribute("id", `board-${card.board_id}-card-${card.id}`);
        cardTitle.textContent = card.title;
        newCard.appendChild(cardOpenClose);
        newCard.appendChild(cardTitle);
        document.getElementById(`board-${card.board_id}-${card.status_id}`).appendChild(newCard);
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        for (let card of cards) {
            this.showCard(card);
            dom.editCardTitle(card);
        }
        //this._appendToElement(document.querySelector("#boards"), );
    },

   openBoards: function(board_id) {
        let buttonId = `button-${board_id}`;
        let button = document.getElementById(buttonId);
        let actualBoardId = `board-${board_id}`;
        let columns = document.getElementById(actualBoardId).childNodes[3];

        button.addEventListener("click", function () {
            button.innerHTML = `<i class="fas fa-chevron-${columns.classList.contains("hidden") ? 'up' : 'down'}"></i>`;
            columns.classList.toggle("hidden");
        });

    },

   editTitle: function(board_id) {
       let titleId = `board-${board_id}-title`;
       let title = document.getElementById(titleId);
       let oldTitle = title.textContent;
       let clickEvent = function() {
                          title.innerHTML = `<form action=/change-title method="POST">
                                <input type="text" name="newTitle" value="${oldTitle}">
                                <input type="hidden" name="board_id" value="${board_id}">
                                <button type="submit">Save</button>  
                              </form>`;
            title.removeEventListener("click", clickEvent);
        };
        title.addEventListener("click", clickEvent);


    },
    editCardTitle: function(card) {
       let titleId = `board-${card.board_id}-card-${card.id}`;
       let title = document.getElementById(titleId);
       let oldTitle = title.textContent;
       let idForQuery = titleId.split("-")[3];
       let clickEvent = function() {
                          title.innerHTML = `<form action=/change-card-title method="POST">
                                <input type="text" name="newCardTitle" value="${oldTitle}">
                                <input type="hidden" name="card_id" value="${idForQuery}">
                                <button type="submit">Save</button>  
                              </form>`;
            title.removeEventListener("click", clickEvent);
        };
        title.addEventListener("click", clickEvent);


    },


    createNewCard: function (boardId) {

        let card = {
            board_id: boardId,
            status_id: 1,
            title: 'New card'
        };

        dataHandler.createNewCard(boardId, function(){ dom.showCard(card)});

        //
        // let newCard = document.createElement("div");
        // newCard.setAttribute("class", "card");
        // let cardOpenClose = document.createElement("div");
        // cardOpenClose.setAttribute("class", "card-remove");
        // let iElement = document.createElement("i");
        // iElement.setAttribute("class", "fas fa-trash-alt");
        // cardOpenClose.appendChild(iElement);
        // let cardTitle = document.createElement("div");
        // cardTitle.setAttribute("class", "card-title");
        // cardTitle.setAttribute("id", `board-${boardId}-card-X`);
        // cardTitle.textContent = "New card";
        // newCard.appendChild(cardOpenClose);
        // newCard.appendChild(cardTitle);
        // let boardActual = document.getElementById(`board-${boardId}-1`);
        // boardActual.appendChild(newCard);

        /*let title = document.getElementById(`board-${boardId}-card-X`);
        let oldTitle = cardTitle.textContent;
        let clickEvent = function () {
            title.innerHTML = `<input type="text" name="newTitle" value="${oldTitle}">
                            <button type="submit">Save</button>`;
            title.removeEventListener("click", clickEvent);
        };
        title.addEventListener("click", clickEvent);*/


        //}

    },
    createNewBoard: function (title,boards) {
        let boardDiv = document.getElementById("boards");
        console.log(boards);
        dataHandler.createNewBoard(title,function () {

            boardDiv.innerHTML = "";
            dom.loadBoards();
        });

    },
    deleteCard: function(cardId) {
        dataHandler.deleteCard(cardId, function () {
            let card = document.getElementById(cardId).parentNode.parentNode;
            card.remove();
        });
    },
    deleteBoard: function(boardId) {
        dataHandler.deleteBoard(boardId, function () {
            let board = document.getElementById(`board-${boardId}`);
            board.remove();
        });
    }
};
