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
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `                 
            <section class="board" id="board-${board.id}\">
            <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button id="button-${board.id}"><i class="fas fa-chevron-down"></i></button>
                
            </div>
            <div class="board-columns hidden">
                <div class="board-column">
                    <div class="board-column-title">New</div>
                    <div class="board-column-content" id="board-${board.id}-new">


                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">In Progress</div>
                    <div class="board-column-content" id="board-${board.id}-progress">

                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Testing</div>
                    <div class="board-column-content" id="board-${board.id}-testing">

                    </div>
                </div>
                <div class="board-column">
                    <div class="board-column-title">Done</div>
                    <div class="board-column-content" id="board-${board.id}-done">

                    </div>
                </div>
            </div>
        </section> 
            `;

        }
        setTimeout(function() {
                for (let board of boards) {
                    dom.openBoards(board.id);
                    dom.loadCards(board.id)
                }
            },2000);

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
         dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards);
    })
    }
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        this._appendToElement(document.querySelector("#boards"), "card megjött");
    },

   openBoards: function(board_id) {
        let buttonId = `button-${board_id}`;
        let button = document.getElementById(buttonId);
        let actualBoardId = `board-${board_id}`;
        let columns = document.getElementById(actualBoardId).childNodes[3];

            button.addEventListener("click", function(){
                if (columns.classList.contains("hidden")) {
                    columns.classList.remove("hidden");
                    button.innerHTML = `<i class="fas fa-chevron-up"></i>`
                } else {
                    columns.classList.add("hidden");
                    button.innerHTML = `<i class="fas fa-chevron-down"></i>`
                }
            });
            
   }

    // here comes more features

};
