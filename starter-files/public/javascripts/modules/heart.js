import axios from 'axios'; 
import { $ } from './bling';
import { setTimeout } from 'timers';

function ajaxHeart(e) {
    e.preventDefault();

    axios
        .post(this.action)
        .then(res => {
            const isHearted = this.heart.classList.toggle('heart__button--hearted');
            $('.heart-count').textContent = res.data.bookmarked.length;

            if(isHearted) {
                this.heart.classList.add('heart__button--float');
                setTimeout(() => this.heart.classList.remove('heart__button--float'),
                2500)
            }
        })
        .catch(console.err);
}

export default ajaxHeart;