const baseUrl = 'http://localhost:3030/jsonstore/collections/books';
const loadBtn = document.getElementById('loadBooks');
const tBody = document.querySelector('tbody');
const form = document.querySelector('form');
const inputTitle = document.querySelector('input[name="title"]');
const inputAuthor = document.querySelector('input[name="author"]');
const submitBtn = form.querySelector('button');
let currentEditId = null;

loadBtn.addEventListener('click',loadBooks);
form.addEventListener('submit',onSubmit);

async function loadBooks(){
     const res = await fetch(baseUrl);
     if (!res.ok) {
        throw new Error('Failed to load books');
     }
     const data = await res.json();
     const books =  Object.entries(data);
     tBody.innerHTML = '';

     for(const [id,book] of books){
        const tr = document.createElement('tr');
        const title = document.createElement('td');
        const author = document.createElement('td');
        const actions = document.createElement('td');
        title.textContent = book.title;
        author.textContent = book.author;
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        editBtn.addEventListener('click',onEdit);
        deleteBtn.addEventListener('click',onDelete);


        editBtn.dataset.id = id;
        deleteBtn.dataset.id = id;

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        tr.appendChild(title);
        tr.appendChild(author);
        tr.appendChild(actions);
        tBody.appendChild(tr);

     }
  
}
   async function onDelete(e){
        const id = e.target.dataset.id;

        const res = await fetch(baseUrl + '/' + id,{
            method:'DELETE',
        });
        if(!res.ok){
            throw new Error('Failed to delete');
        }
        await loadBooks();
     }
     async function onEdit(e){
       const id = e.target.dataset.id;
       const row = e.target.parentElement.parentElement;

       const title = row.children[0].textContent;
       const author = row.children[1].textContent;
       inputTitle.value = title;
       inputAuthor.value = author;
       currentEditId = id;
       submitBtn.textContent = 'Save';

     }

     async function onSubmit(e){
        e.preventDefault();
        const title = inputTitle.value;
        const author = inputAuthor.value;

        if (!title.trim() || !author.trim()) {
            return;
        }
        if (currentEditId === null) {
            const res = await fetch(baseUrl,{
                method:'POST',
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({ 
                    title: title,
                    author: author
                })
            });
            if (!res.ok) {
              throw new Error('Failed to create book');
            }

        } else {
            const res = await fetch(baseUrl +  '/' + currentEditId,{
                method:'PUT',
                headers:{ "Content-Type": "application/json" },
                body: JSON.stringify({
                    title:title,
                    author:author
                })
            });
            if(!res.ok){
            throw new Error('Failed to update');
           }
        }
        form.reset();
        currentEditId = null;
        submitBtn.textContent = 'Submit';
        await loadBooks();
     }
     loadBooks();
