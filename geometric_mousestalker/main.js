window.addEventListener("load", function(event) {

    $(function ($) {

        $("body").append($('<canvas>').attr('width', $(window.document).width()).attr('height', $(window.document).height()).attr('id', 'stalker').css('position', 'absolute').css('top', '30px').css('left', '0px').css('margin', '0').css('padding', '0'))
        
        function Stalker() {
            this.x = 0; // マウスストーカーのX座標
            this.y = 0; // マウスストーカーのY座標
            this.mx = 0; // マウスのX座標
            this.my = 0; // マウスのY座標
            this.p = 0.90; // 慣性の係数(小さいほど素早く追いつく)
            this.r = 0; // マウスストーカーの大きさ
            //$( '#stalker' ).get( 0 ).width = $( "#window" ).width();
            //$( '#stalker' ).get( 0 ).height = $( "#window" ).height();
            this.w = $( "#stalker" ).attr('width'); // マウスストーカーの描画幅
            this.h = $( "#stalker" ).attr('height'); // マウスストーカーの描画高さ
            this.tr = Math.min(this.w / 6, this.h / 6); // マウスストーカーの最終的な大きさ
            this.pr = 0.95; // マウスストーカーの大きさ変更用
            this.n = 4; // 頂点数
            this.count = 0; // 経過フレーム数
            this.angle = 0; // formation 用
            this.tangle = 0; // formation 用
            this.pangle = 0.97; // formation 用
            this.canvas = document.getElementById('stalker');
            this.ctx = this.canvas.getContext('2d');
        }
        Stalker.prototype.drawTriangle = function(x1, y1, x2, y2, x3, y3, angle) {
            var gx = (x1 + x2 + x3) / 3;
            var gy = (y1 + y2 + y3) / 3;
            var x = [x1, x2, x3];
            var y = [y1, y2, y3];
            angle = angle / 180 * 3.1415926535;
            for (var i = 0; i < x.length; i++) {
                x[i] = x[i] - gx;
                y[i] = y[i] - gy;
                var x_ = x[i] * Math.cos(angle) - y[i] * Math.sin(angle); 
                var y_ = x[i] * Math.sin(angle) + y[i] * Math.cos(angle);
                x[i] = x_ + gx;
                y[i] = y_ + gy;
            }
            this.ctx.moveTo(x[0], y[0]);
            this.ctx.lineTo(x[1], y[1]);
            this.ctx.lineTo(x[2], y[2]);
            this.ctx.lineTo(x[0], y[0]);
        }
        Stalker.prototype.moveStalker = function() {
            this.x = this.p * this.x + (1 - this.p) * this.mx; //慣性
            this.y = this.p * this.y + (1 - this.p) * this.my;
            this.r = this.pr * this.r + (1 - this.pr) * this.tr;
            this.count++;
            if (this.count % 360 == 0) {
                this.tangle = 180 - this.tangle;
            }
            this.angle = this.pangle * this.angle + (1 - this.pangle) * this.tangle;
        }
        Stalker.prototype.drawStalker = function() {

            if (clickedflag) return;
            this.ctx.beginPath();
            var TORAD = 1.0 / 180 * 3.1415926535;
            var cx = this.x; // 中心の座標
            var cy = this.y; // 中心の座標
            for(var i = 0; i < this.n; i++) {
                var rad1 = (this.count + (360 / this.n) * i) * TORAD;
                var rad2 = (this.count + (360 / this.n) * i + (360 / this.n)) * TORAD;
                /*this.ctx.moveTo(cx + this.r * Math.cos(rad1), cy + this.r * Math.sin(rad1) * 0.5);
                this.ctx.lineTo(cx + this.r * Math.cos(rad2), cy + this.r * Math.sin(rad2) * 0.5);
                this.ctx.moveTo(cx, cy - this.r);
                this.ctx.lineTo(cx + this.r * Math.cos(rad1), cy + this.r * Math.sin(rad1) * 0.5);
                this.ctx.lineTo(cx, cy + this.r);*/
                var x1 = cx + this.r * Math.cos(rad1);
                var y1 = cy + this.r * Math.sin(rad1) * 0.5;
                var x2 = cx + this.r * Math.cos(rad2);
                var y2 = cy + this.r * Math.sin(rad2) * 0.5;
                
                if (i % 2 == 0) {
                    this.drawTriangle(x1, y1, x2, y2, cx, cy - this.r, this.angle);
                } else {
                    this.drawTriangle(x1, y1, x2, y2, cx, cy + this.r, this.angle);
                }
            }
            
            this.ctx.stroke();
        }

        function Line(id_, x_, y_, vx_, vy_, r_, angle_) {
            this.id = id_;
            this.x = x_;
            this.y = y_;
            this.r = r_;
            this.angle = angle_;
            this.vangle = Math.random() * 10 - 5;
            this.vx = vx_;
            this.vy = vy_;
            this.w = parseInt($('#stalker').css('width'));
            this.h = parseInt($('#stalker').css('height'));
            this.canvas = document.getElementById('stalker');
            this.ctx = this.canvas.getContext('2d');
        }

        Line.prototype.draw = function() {
            this.ctx.beginPath();
            var TORAD = 1.0 / 180 * 3.1415926535;
            this.ctx.moveTo(this.x + this.r * Math.cos(this.angle * TORAD), this.y + this.r * Math.sin(this.angle * TORAD));
            this.ctx.lineTo(this.x - this.r * Math.cos(this.angle * TORAD), this.y - this.r * Math.sin(this.angle * TORAD));
            this.ctx.stroke();
        }

        Line.prototype.move = function() {
            this.angle += this.vangle;
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.999;
            this.vy += 0.8;
        }

        var stalker = new Stalker();
        var lines = [];
        var clickedflag = false;

        $('#stalker').mousemove(function(e) {
            stalker.mx = e.pageX;
            stalker.my = e.pageY - 30;
            //console.log(stalker);
        });
        $('#stalker').click(function(e) {
            var mx = e.pageX;
            var my = e.pageY;
            if (clickedflag) return;
            clickedflag = true;
            for (var i = 0; i < 3 * stalker.n; i++) {
                lines.push(new Line(i, stalker.x + Math.random() * stalker.r - stalker.r / 2, stalker.y + Math.random() * stalker.r - stalker.r / 2, Math.random() * 20 - 10, -Math.random() * 20, Math.random() * stalker.r / 2 + stalker.r / 2, Math.random() * 360));
            }
            setTimeout(function() {
                clickedflag = false;
                lines = [];
                stalker.r = 0;
                $('.lines').remove();
            }, 3000);
        });
        
        $('#n').change(function() {
            stalker.n = $('#n').val();
        });
        
        setInterval(function() {
            stalker.ctx.clearRect(0, 0, stalker.w, stalker.h);
            stalker.moveStalker();
            stalker.drawStalker();
            for(var i = 0; i < lines.length; i++) {
                lines[i].move();
                lines[i].draw();
            }
        }, 17);
    });

}, false);



