const inputSearch = document.getElementById('input_search');
const tableHTML = document.getElementById('tableHTML')


inputSearch.addEventListener('keyup', () => {
    let searchText = inputSearch.value.toLowerCase()
     

    if(searchText.length === 1){
        return;
    }

    let line = tableHTML.getElementsByTagName('tr')
    
    console.log(line)
    for(let position in line ) {
       if(true === isNaN(position)) {
        continue;
       }

       let containerLine = line[position].innerHTML.toLowerCase();

       if( true === containerLine.includes(searchText)) {
        line[position].style.display = '';
       }
     
    else { line[position].style.display ='none';}
      
    } 
})