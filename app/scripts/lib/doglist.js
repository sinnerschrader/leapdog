var Handlebars = require('handlebars');

class DogList{
    constructor(data, options){
        this.data = data;
        this.template = Handlebars.compile(document.querySelectorAll(options.itemTemplate)[0].text);
        this.el = document.querySelectorAll(options.el)[0];
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
        if (! item ) {
            return;
        };
        return this.getElementById(item.id);
    }

    getElementById(id) {
        if (! id ) {
            return;
        }
        return this.el.querySelectorAll('#' + id)[0];
    }

    select(rotation) {
        var selectedElement = this.getElementByRotation(rotation);
        if (! selectedElement) {
            return;
        }
        selectedElement.classList.add('selected');
    }

    resetSelection() {
        Array.prototype.forEach.call(this.el.querySelectorAll('.selected'), function(element){
            element.classList.remove('selected');
        });
    }
};

module.exports = DogList;
