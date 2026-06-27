class Grid {
    /////////////////////////////////
    constructor(_w, _h)
    {
        this.gridWidth = _w;
        this.gridHeight = _h;
        this.noteSize = 40;
        this.notePos = [];
        this.noteState = [];

        // initalise grid structure and state
        for (var x = 0; x < _w; x += this.noteSize)
        {
            var posColumn = [];
            var stateColumn = [];
            for (var y = 0; y < _h; y += this.noteSize)
            {
                posColumn.push(createVector(x + this.noteSize/2, y + this.noteSize/2));
                stateColumn.push(0);
            }
            this.notePos.push(posColumn);
            this.noteState.push(stateColumn);
        }
    }
    /////////////////////////////////
    run(img)
    {
        img.loadPixels();
        this.findActiveNotes(img);
        this.drawActiveNotes(img);
    }
    /////////////////////////////////
    drawActiveNotes(img)
    {
        // draw active notes
        push();
        fill(255);
        noStroke();
        colorMode(HSB);
        for (var i = 0; i < this.notePos.length; i++)
        {
            for (var j = 0; j < this.notePos[i].length; j++)
            {
                var x = this.notePos[i][j].x;
                var y = this.notePos[i][j].y;
                if (this.noteState[i][j] > 0)
                {
                    // further development:
                    // - changed calculation for colours of notes:
                    //   now moving through a hue range of 0 to 300 degrees
                    //   (red to purple) using HSB colour mode
                    // - added secondary graphics effect: other than the
                    //   circles becoming smaller and more transparent,
                    //   the notes also fade to grey (gradual desaturation)
                    // in HSB mode, alpha range is 0...1 instead of 0...255
                    var alpha = this.noteState[i][j] * 4 / 5;
                    var mix = color(map(i, 0, this.notePos.length, 0, 300),
                                     100*alpha, 100, alpha);
                    fill(mix);
                    var s = this.noteState[i][j];
                    ellipse(x, y, this.noteSize*s, this.noteSize*s);
                }   // if
            this.noteState[i][j] -= 0.05;
            this.noteState[i][j] = constrain(this.noteState[i][j], 0, 1);
            }   // for j
        }   // for i
        pop();
    }   // drawActiveNotes
    /////////////////////////////////
    findActiveNotes(img)
    {
        for (var x = 0; x < img.width; x += 1)
        {
            for (var y = 0; y < img.height; y += 1)
            {
                var index = (x + (y * img.width)) * 4;
                var state = img.pixels[index + 0];
                if (state == 0) // if pixel is black (ie there is movement)
                {
                    // find which note to activate
                    var screenX = map(x, 0, img.width, 0, this.gridWidth);
                    var screenY = map(y, 0, img.height, 0, this.gridHeight);
                    var i = int(screenX/this.noteSize);
                    var j = int(screenY/this.noteSize);
                    this.noteState[i][j] = 1;
                }   // if
            }   // for y
        }   // for x
    }   // findActiveNotes
}   // class Grid
