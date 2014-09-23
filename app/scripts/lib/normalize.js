module.exports = function(item, index, items) {
    var splitName = item.name.split('–');
    var description = item.description.split('\n').map(function(sentence){
        var trimmed = sentence.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }).filter(function(sentence){
        return typeof sentence !== 'undefined';
    });

    var arc = 360/(items.length);
    var center = arc*index;
    var max = center + arc/2;
    var min = center - arc/2;

    return Object.assign({}, item, {
        id: 'item-' + index,
        name: splitName[0].trim(),
        title: splitName[1].split('(')[0].trim(),
        description: description,
        rotation: {
            center: center,
            max: max,
            min: min
        },
        image: {
            src: item.image,
            width: parseInt(item.image.split('?')[1].split('w=')[1], 10),
            height: parseInt(item.image.split('?')[1].split('h=')[1], 10)
        }
    })
}
