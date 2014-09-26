module.exports = function(item, index, items) {
    var arc = 360/(items.length);
    var center = arc*index;
    var max = center + arc/2;
    var min = center - arc/2;

    return Object.assign({}, item, {
        id: 'item-' + item.index,
        description: item.description,
        rotation: {
            center: center,
            max: max,
            min: min
        },
        image: {
            src: '/images/profiles/' + item.index + '.jpg',
            width: '25',
            height: '33'
        }
    });
}
