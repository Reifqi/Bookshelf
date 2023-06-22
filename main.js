const books = [];
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP'
document.addEventListener('DOMContentLoaded', function(){
    const addForm = document.getElementById('form-input');
    const searchForm = document.getElementById('search-form');

    addForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBook();
    })

    searchForm.addEventListener('submit', function(e){
        e.preventDefault();
        searchBook();
    })

    if(isStorageExist){
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
})

function isStorageExist(){
    if(typeof (Storage) !== undefined){
        return true;
    }else{
        return false;
    }
}

function searchBook(){
    const searchInput = document.getElementById('search-input').value;
    const filteredBooks = books.filter(book => {
        return book.title.toLowerCase().includes(searchInput.toLowerCase());
    })

    if(searchInput.length !== 0){
        const searchResult = document.getElementById('search-results');
        searchResult.innerHTML = '';
        displayBook(filteredBooks);
    }else{
        const searchResult = document.getElementById('search-results');
        const resultMessage = document.createElement('p');
        resultMessage.innerText = 'No Result Found!';
        searchResult.append(resultMessage);
    }
}

function addBook(){
    const inputTitle = document.getElementById('title').value;
    const inputAuthor = document.getElementById('author').value;
    const inputYear = document.getElementById('year').value;

    const bookId = generateId();
    const bookObject = generateBookObject(bookId, inputTitle, inputAuthor, inputYear, false);
    books.push(bookObject);
    displayBook(books);
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isDone){
    return {
        id, 
        title,
        author,
        year,
        isDone
    }
}

function makeBook(arr){
    const textTitle = document.createElement('h3');
    textTitle.innerText = arr.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = arr.author;

    const textYear = document.createElement('p');
    textYear.innerText = arr.year;

    const bookContent = document.createElement('div');
    bookContent.classList.add('book-content');
    bookContent.append(textTitle, textAuthor, textYear);

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner', `book-${arr.id}`);
    textContainer.append(bookContent);

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(textContainer);

    if(!arr.isDone){
        const doneButton = document.createElement('button');
        doneButton.classList.add('done-button');
        doneButton.addEventListener('click', function(){
            addBooktoDone(arr.id);
        })

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function(){
            deleteBook(arr.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function(){
            editBook(arr.id);
        })

        const bookAction = document.createElement('div');
        bookAction.classList.add('book-button','action');
        bookAction.append(doneButton, deleteButton, editButton);
        textContainer.append(bookAction);
    }else{
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function(){
            deleteBook(arr.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function(){
            editBook(arr.id);
        })
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function(){
            undoBook(arr.id);
        })
        const bookAction = document.createElement('div');
        bookAction.classList.add('book-button','action');
        bookAction.append(undoButton, deleteButton, editButton);
        textContainer.append(bookAction);
    }

    return container;


}

function editBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget) {
        const inputTitle = prompt("Enter new title:", bookTarget.title);
        const inputAuthor = prompt("Enter new author:", bookTarget.author);
        const inputYear = prompt("Enter new year:", bookTarget.year);

        if (inputTitle && inputAuthor && inputYear) {
            bookTarget.title = inputTitle;
            bookTarget.author = inputAuthor;
            bookTarget.year = inputYear;

            displayBook(books);
        } else {
            alert("Invalid input. Book details not updated.");
        }
    }
}


function addBooktoDone(bookId){
    const bookTarget = findBook(bookId);
    bookTarget.isDone = true;
    displayBook(books);
}

function undoBook(bookId){
    const bookTarget = findBook(bookId);
    bookTarget.isDone = false;
    displayBook(books);
}

function deleteBook(bookId){
    const bookTarget = books.findIndex(book => book.id === bookId);
    if(bookTarget !== -1){
        const confirmation = confirm("Are You Sure?");
        if(confirmation){
            books.splice(bookTarget, 1);
        }
    }
    displayBook(books);
    saveData();
}

function findBook(bookId){
    for(const book of books){
        if(book.id === bookId){
            return book;
        }
    }
}

function displayBook(arr){
    const unreadBooks = document.getElementById('books');
    unreadBooks.innerHTML = '';

    const readBooks = document.getElementById('books-read');
    readBooks.innerHTML = '';

    for(const book of arr){
        const bookElement = makeBook(book);
        if(!book.isDone){
            unreadBooks.append(bookElement);
            saveData();
        }else{
            readBooks.append(bookElement);
            saveData();
        }
    }
}

function saveData(){
    if(isStorageExist){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    for(const book of serializedData){
        if(book !== null){
            books.push(book);
        }
    }
    displayBook(books);
}