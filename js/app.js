$(document).ready(function(){
    var tiles = [];
    var idx;
    var flip = [];
    var startTime;
    var timer;
    var tile;
    var count = 0;
    var gameBoard = $('#game-board');
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            up: false
        });
    }

    //shuffles the tiles so random tiles appear on the board
    function startUp() {
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0, 8);
        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
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
            img.data('matched', false);
            row.append(img);
        });
        gameBoard.append(row);
    }//startUp

    //sets up the board when the start button is clicked
    $('#start').click(function() {
        var matchesLeft = 8;
        var matchesMade = 0;
        var matchesMissed = 0;
        $('#matches-left').text('Matches Left: ' + matchesLeft);
        $('#matches-missed').text('Matches Missed: ' + matchesMissed);
        $('#matches-made').text('Matches Made: ' + matchesMade);
        gameBoard.empty();
        startUp();
        $('#msg').fadeIn(500);
        $('#msg').fadeOut(3000);

        startTime = _.now();
        var timer = window.setInterval(function () {
            var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text('Timer: ' + elapsedSeconds + 's');
            if (matchesMade === 8) {
                window.clearInterval(timer);
                $('#game-board img').fadeOut(1000);
                $('#congrats').fadeIn(3000);
                $('#congrats').fadeOut(1000);
            }
        }, 1000);

        //flips a tile when clicked, and compares the two tiles
        $('#game-board img').click(function () {
            var img = $(this);
            tile = img.data('tile');
            if(tile.up) {
                return;
            }
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
                flip = [];
            }
        });//click function

        //flips tiles
        function flipTiles(tile, img) {
            img.fadeOut(100, function() {
                if (tile.flipped) {
                    img.attr('src', 'img/tile-back.png');
                    img.css('cursor', 'pointer');
                    tile.up = false;
                } else {
                    img.attr('src', tile.src);
                    img.css('cursor', 'not-allowed');
                    tile.up = true;
                }
                tile.flipped = !tile.flipped;
                img.fadeIn(100);
            });//after fadeOut
        }//flipTiles
    });//click function
}); //jQuery Ready Function

