const addButton = document.querySelector('#button');
addButton.addEventListener('click', newRow);

const sort = `<svg id = "top-sort"  width="25" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="15" width="2.5" height="12.5" transform="rotate(-180 5 15)" fill="#C4C4C4" />
    <rect x="10" y="3.75" width="2.5" height="7.5" transform="rotate(-90 10 3.75)" fill="#C4C4C4" />
    <rect x="10" y="8.75" width="2.5" height="10" transform="rotate(-90 10 8.75)" fill="#C4C4C4" />
    <rect x="10" y="13.75" width="2.5" height="15" transform="rotate(-90 10 13.75)" fill="#C4C4C4" />
    <path d="M3.75 6.55671e-07L6.99759 4.6875L0.502404 4.6875L3.75 6.55671e-07Z" fill="#C4C4C4" />
</svg>`

const reverseSort =  `<svg id="reverse-sort" width="25" height="15" viewBox="0 0 25 15" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" width="2.5" height="12.5" fill="#C4C4C4"/>
        <rect x="10" y="3.75" width="2.5" height="7.5" transform="rotate(-90 10 3.75)" fill="#C4C4C4" />
        <rect x="10" y="8.75" width="2.5" height="10" transform="rotate(-90 10 8.75)" fill="#C4C4C4" />
        <rect x="10" y="13.75" width="2.5" height="15" transform="rotate(-90 10 13.75)" fill="#C4C4C4" />
        <path d="M3.75 15L0.502405 10.3125L6.9976 10.3125L3.75 15Z" fill="#C4C4C4" />
    </svg>`

const moverSvg = '<svg class="move-area" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle draggable="true" cx="2" cy="2" r="2" fill="#C4C4C4" /><circle draggable="true" cx="2" cy="10" r="2" fill="#C4C4C4" /><circle draggable="true" cx="10" cy="2" r="2" fill="#C4C4C4" /><circle draggable="true" cx="10" cy="10" r="2" fill="#C4C4C4" /></svg>';
const deleteSvg = '<svg class="delete" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C4C4C4" /><path d="M6 6L14 14" stroke="#C4C4C4" /><path d="M6 14L14 6" stroke="#C4C4C4" /></svg>';

const changeSortSvg = (type) => {
    if (type == reverseSort) {
        sortingWrapper.innerHTML = sort;
    }
    else if (type == sort) {
        sortingWrapper.innerHTML = reverseSort;
    }
}

const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((item) => {
    item.addEventListener('click', deleteRow);
});

function deleteRow(e) {
    if (!e.target.matches('.delete')) return;
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
}
function newRow() {
    const block = document.querySelector('#block-to-do');
    const newRow = document.createElement('li');
    newRow.innerHTML = `${moverSvg}<input class="row-info" type="text">${deleteSvg}`;
    newRow.className = 'row-to-do';
    newRow.draggable = 'true';
    block.appendChild(newRow);
    newRow.childNodes[2].addEventListener('click', deleteRow);
    dragDrop();
}

const SetButtonSymbol = () => {
    const svg = document.querySelector('svg');
    if (svg.id == 'top-sort') {
        changeSortSvg(sort);
        return true;
    } else {
        changeSortSvg(reverseSort);
        return false;
    }
}

sortingClick = (e) => {
    const sortIndex = SetButtonSymbol(e);
    const doList = document.querySelectorAll('li .row-info');
    const list = [];
    doList.forEach((item) => list.push(item.value));
    list.sort();
    if (sortIndex == true) {
        let i = 0;
        doList.forEach((item) => item.value = list[i++]);
    } else if (sortIndex == false) {
        let i = list.length - 1;
        doList.forEach((item) => item.value = list[i--]);
    }
}

let sortingWrapper = document.querySelector('.sorting');
sortingWrapper.innerHTML = sort;
sortingWrapper.addEventListener('click', sortingClick);

function getDragElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.row-to-do:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function dragDrop() {
    const container = document.querySelector('#block-to-do');
    const draggables = document.querySelectorAll('.move-area circle');
    draggables.forEach(draggable => {
        draggable.parentNode.parentNode.addEventListener('dragstart', () => {
            draggable.parentNode.parentNode.classList.add('dragging');
        })

        draggable.parentNode.parentNode.addEventListener('dragend', () => {
            draggable.parentNode.parentNode.classList.remove('dragging');
        })
    })

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!e.target.matches('.move-area')) return
        const afterElement = getDragElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
}

dragDrop();
newRow();