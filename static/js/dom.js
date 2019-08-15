// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

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
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `                 
            <section class="board" id="board-${board.id}\">
            <div class="board-header"><span id="board-${board.id}-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button id="button-${board.id}"><i class="fas fa-chevron-down"></i></button>
                
            </div>
            <div class="board-columns hidden">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content" id="board-${board.id}-1">


                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">In Progress</div>
                    <div class="board-column-content" id="board-${board.id}-2">

                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div class="board-column-content" id="board-${board.id}-3">

                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Done</div>
                    <div class="board-column-content" id="board-${board.id}-4">

                    </div>
                </div>
            </div>
        </section> 
            `;

        }
        setTimeout(function () {
            for (let board of boards) {
                dom.openBoards(board.id);
                dom.loadCards(board.id);
                dom.editTitle(board.id);
            }
        }, 1000);

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        console.log("before calling getcards");
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            console.log(cards);
            dom.showCards(cards);
        })
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also

        for (let card of cards) {
            let newCard = document.createElement("div")
            newCard.setAttribute("class", "card");
            let cardOpenClose = document.createElement("div");
            cardOpenClose.setAttribute("class", "card-remove");
            let iElement = document.createElement("i");
            iElement.setAttribute("class", "fas fa-trash-alt");
            cardOpenClose.appendChild(iElement);
            let cardTitle = document.createElement("div");
            cardTitle.setAttribute("class", "card-title");
            cardTitle.setAttribute("id", `board-${card.board_id}-card-${card.id}`);
            cardTitle.textContent = card.title;
            newCard.appendChild(cardOpenClose);
            newCard.appendChild(cardTitle);
            document.getElementById(`board-${card.board_id}-${card.status_id}`).appendChild(newCard);


        }
        ;
        //this._appendToElement(document.querySelector("#boards"), );

    },

    openBoards: function (board_id) {
        let buttonId = `button-${board_id}`;
        let button = document.getElementById(buttonId);
        let actualBoardId = `board-${board_id}`;
        let columns = document.getElementById(actualBoardId).childNodes[3];

        button.addEventListener("click", function () {
            if (columns.classList.contains("hidden")) {
                columns.classList.remove("hidden");
                button.innerHTML = `<i class="fas fa-chevron-up"></i>`
            } else {
                columns.classList.add("hidden");
                button.innerHTML = `<i class="fas fa-chevron-down"></i>`
            }
        });

    },

    editTitle: function (board_id) {
        let titleId = `board-${board_id}-title`;
        let title = document.getElementById(titleId);
        let oldTitle = title.textContent;
        let clickEvent = function () {
            title.innerHTML = `<form action=/change-title/${board_id}>
                                <input type="text" name="newTitle" value="${oldTitle}">
                                <button type="submit">Save</button>  
                              </form>`;
            title.removeEventListener("click", clickEvent);
        };
        title.addEventListener("click", clickEvent);


    }

    // here comes more features

};
