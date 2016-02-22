//returns mdl cell element
function create_cell(cell_col) {
	var cell = document.createElement('div');
	cell.className = 'mdl-cell mdl-cell--' + cell_col + '-col';
	return cell;
}
//returns mdl card element
function create_card(shadow_dp) {
	var card = document.createElement('div');
	card.className = 'mdl-card mdl-shadow--' + shadow_dp + 'dp img-tile';
	return card;
}
//[img_link, alt, type, custom..]
function addCardHere(content_array) {
    "use strict";
    var parent = document.getElementById(exec_img_id).parentElement,
        img_link = content_array[0],
        img_alt = content_array[1],
        type = content_array[2],
        array_next = 3,
        cell = create_cell(4),
        card = create_card(2),
        img = document.createElement('img');
    img.src = img_link;
    img.alt = img_alt;
    card.appendChild(img);
    switch (type) {
        case 'image'://custom -> title, link
            var title = content_array[array_next++],
                link = content_array[array_next++],
                a = document.createElement('a');
            a.href = link;
            a.appendChild(card);
            cell.appendChild(a);
            //TODO:wip
            /* in card:
            <div class="mdl-card__title mdl-card--expand"></div>
            <div class="mdl-card__actions">
                <span class="demo-card-image__filename">Image.jpg</span>
            </div>
            */
            break;
        case 'info'://custom -> supporting_text, [action_name, action_link]...
            var supporting_text = content_array[array_next++],
                supporting_div = document.createElement('div'),
                supporting_p = document.createElement('p');
            supporting_div.className = 'mdl-card__supporting-text';
            supporting_p.style.margin = '0';
            supporting_p.style.fontSize = '13px';
            supporting_p.style.lineHeight = '18px';
            supporting_p.innerHTML = supporting_text;
            resize_elements = resize_elements.concat(cell);
            img.addEventListener("load", function () {
                expandToWindow();
            }, false);
            cell.addEventListener("unresize", function () {
                supporting_p.style.removeProperty('height');
            }, false);
            cell.addEventListener("doresize", function () {
                var cell_height = cell.offsetHeight,
                    card_height = card.offsetHeight,
                    support_height = supporting_p.offsetHeight;
                supporting_p.style.height = (support_height + cell_height - card_height) + "px";
            }, false);
            supporting_div.appendChild(supporting_p);
            card.appendChild(supporting_div);
        case 'actions'://custom -> [action_name, action_link]...
            var action = content_array.slice(array_next++),
                action_div = document.createElement('div');
            action_div.className = 'mdl-card__actions mdl-card--border';
            for (var i = 0; i < action.length; i++) {
                var action_a = document.createElement('a');
                action_a.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
                action_a.innerHTML = action[i][0];
                action_a.href = action[i][1];
                action_div.appendChild(action_a);
            }
            card.appendChild(action_div);
            cell.appendChild(card);
            break;
        default:
            console.error('unknown type ' + type);
    }
    parent.appendChild(cell);
    componentHandler.upgradeDom();
    expandToWindow();
}
