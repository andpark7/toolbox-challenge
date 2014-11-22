
$(document).ready(function(){
    var tiles = [];
    var idx;
    var flip = [];
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }
    function startUp(tiles) {
        var shuffledTiles = _.shuffle(tiles);

        var selectedTiles = shuffledTiles.slice(0, 8);

        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });

        tilePairs = _.shuffle(tilePairs);
    }

    //console.log(tilePairs);

    $('#start').click(function() {
        var matchesLeft = 8;
        var matchesMade = 0;
        var matchesMissed = 0;
        $('#matches-left').text('Matches Left: ' + matchesLeft);
        $('#matches-missed').text('Matches Missed: ' + matchesMissed);
        $('#matches-made').text('Matches Made: ' + matchesMade);
        var gameBoard = $('#game-board');
        //gameBoard.empty();
        //startUp(tiles);
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function (tile, elemIndex) {
            if (elemIndex > 0 && 0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'image of tile' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);
        var startTime = _.now();
        var timer = window.setInterval(function () {
            elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text('Timer: ' + elapsedSeconds + 's');
            if (matchesMade === 8) {
                window.clearInterval(timer);
                $('#game-board img').fadeOut(1000);
                $('#congrats').fadeIn(3000);
            }
        }, 1000);

        $('#game-board img').click(function () {
            var img = $(this);
            var tile = img.data('tile');
            flipTiles(tile, img);
            if (flip.length == 0) {
                flip.push(img);
            } else {
                var prev = flip[0];
                var prev2 = prev.data('tile');
                if (tile.tileNum == prev2.tileNum) {
                    matchesLeft--;
                    matchesMade++;
                    $('#matches-left').text('Matches Left: ' + matchesLeft);
                    $('#matches-made').text('Matches Made: ' + matchesMade);
                } else {
                    matchesMissed++;
                    $('#matches-missed').text('Matches Missed: ' + matchesMissed);
                    setTimeout(function () {
                        flipTiles(tile, img);
                        flipTiles(prev2, prev);
                    }, 1000);
                }
                flip.length = 0;
            }
        });

        function flipTiles(tile, img) {
            img.fadeOut(100, function() {
                if (tile.flipped) {
                    img.attr('src', 'img/tile-back.png');
                } else {
                    img.attr('src', tile.src);
                }
                tile.flipped = !tile.flipped;
                img.fadeIn(100);
            });//after fadeOut
        }
    });
}); //jQuery Ready Function