var Handlebars = require('handlebars');

class DogList{
    constructor(data, options){
        this.data = data;
        this.template = Handlebars.compile(document.querySelectorAll(options.itemTemplate)[0].text);
        this.el = document.querySelectorAll(options.el)[0];
        this.el.addEventListener('webkitTransitionEnd', this.onTransitionEnd, false);
    }

    onTransitionEnd(e) {
        initialClass = {
            in: 'selected',
            out: 'show'
        };
        initalProperty = {
            in: 'top',
            out: 'height'
        };

        if (e.target.classList.contains(initialClass.in) && e.propertyName === initalProperty.in) {
            var infocontainer = e.target.querySelectorAll('.infocontainer')[0];
            infocontainer.classList.add(initialClass.out);
            var height = infocontainer.offsetHeight;
            Array.prototype.forEach.call(infocontainer.children, function(child){
                height += child.offsetHeight;
            });
            infocontainer.style.height = height + 75 + 'px'; // meh
        } else if (e.propertyName === initalProperty.out && e.target.classList.contains('infocontainer') && ! e.target.style.height) {
            e.target.classList.remove(initialClass.out);
        } else if (e.propertyName === 'opacity' && e.target.classList.contains('infocontainer') && ! e.target.classList.contains(initialClass.out)) {
            e.target.parentNode.parentNode.classList.remove(initialClass.in);
        }
    }

    render() {
        var content = this.data.map((item) => {
            return this.template(item);
        });
        this.el.innerHTML = content.join('');
    }

    getItemByRotation(rotation) {
        return this.data.filter(function(item){
            return item.rotation.min < rotation && item.rotation.max >= rotation;
        })[0];
    }

    getElementByRotation(rotation) {
        return this.getElementByItem(this.getItemByRotation(rotation));
    }

    getElementByItem(item) {
        return this.getElementById(item.id);
    }

    getElementById(id) {
        return this.el.querySelectorAll('#' + id)[0];
    }

    select(rotation) {
        var selectedElement = this.getElementByRotation(rotation);
        selectedElement.classList.add('selected');
    }

    resetSelection() {
        Array.prototype.forEach.call(this.el.querySelectorAll('.selected'), function(element){
            element.querySelectorAll('.infocontainer')[0].style.height = '';
        });
    }
};

module.exports = DogList;
