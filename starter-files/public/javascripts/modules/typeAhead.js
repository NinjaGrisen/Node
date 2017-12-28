import axios from 'axios';
import dompurify from 'dompurify';


function searchResultsHTML(stores) {
    return stores.map(store => {
        console.log(store.location.city)
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join("");
}

function searchCityResultsHTML(stores) {
    //Make this more rubust if there is more than one city hit
    if(stores.length > 1) {
        return `
            <a href="/store/${stores[0].location.city}" class="search__result">
                <strong>${stores[0].location.city}</strong>
            </a>
        `;
    }
}

function typeAhead(search) {
    if(!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResult = search.querySelector('.search__results');

    searchInput.on('input', function() {
        if(!this.value) {
            searchResult.style.display = 'none';
            return;
        }

        searchResult.style.display = 'block';

        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if(res.data.length) {                   
                    searchResult.innerHTML = 
                    dompurify.sanitize(searchCityResultsHTML(res.data));
                     
                    searchResult.innerHTML += 
                    dompurify.sanitize(searchResultsHTML(res.data));
                    
                    return;
                }
                searchResult.innerHTML = dompurify.sanitize(`
                    <div class="search__result">No results for <strong>${this.value} found!</strong></div>
                    `);

            })
            .catch(err => {
                console.error(err);
            });
    });
    searchInput.on('keyup', (e) => {
        if (![13, 38, 40].includes(e.keyCode)) {
          return;
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        if (e.keyCode === 40 && current) {
          next = current.nextElementSibling || items[0];
        } else if (e.keyCode === 40) {
          next = items[0];
        } else if (e.keyCode === 38 && current) {
          next = current.previousElementSibling || items[items.length - 1]
        } else if (e.keyCode === 38) {
          next = items[items.length - 1];
        } else if (e.keyCode === 13 && current.href) {
          window.location = current.href;
          return;
        }
        if (current) {
          current.classList.remove(activeClass);
        }
        next.classList.add(activeClass);
      });
}

export default typeAhead;