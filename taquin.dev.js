(function($){
  $.fn.extend({ 
    //Nom du plugin : taquin
    // Par RemiB
    taquin: function(options) {

      /**
       * Reglages par defaut
       */
      var defaults = {
    		  nbCol : 4,
    		  nbRow : 4,
    		  removed : 16,
    		  bgColor : '#ffffff'
      };
      
      var options = $.extend(defaults, options);
    
      return this.each(function() {
        
        // Eventuelles variables statiques
    	  
    	  var srcImg = $(this);
    	  var trou = {}; // trou actuel
		  var elements = []; // Tableau des éléments avant mélange
    	  var $game;
    	  var clicked;
    	  var positions = [];
		  var melange = [];
    	  var o = options;
    	  var gameWidth = srcImg.width();
    	  var gameHeight = srcImg.height();
    	  var itemWidth = parseInt(gameWidth / o.nbCol);
    	  var itemHeight = parseInt(gameHeight / o.nbRow);
		  var cols = ['a','b','c','d','e','f','g','h','i','j','k'];
		      	  
        // Initialisation
        init();
        
        function init(){
        	srcImg.css('display','none'); // Masque l'image source
        	$game = $('<ul id="'+srcImg.attr('id')+'Game"/>');
        	$game.css({position:'relative', width:gameWidth+'px', height:gameHeight+'px', display:'block', backgroundColor:o.bgColor});
        	srcImg.after($game); // Ajout du conteneur
        	addItems();
        	
        }
        
        // Remplit le tableau d'éléments, leur assigne la position d'origine, les stock dans un tableau, les ajoute
        function addItems(){
        	var k = 1;
        	for (var i = 0; i < o.nbCol; i++) {
        		for (var j = 0; j < o.nbRow; j++) {
        			var $myItem = $('<li>');
        			var clef = cols[i] + j;
        			positions.push(clef);
        			positions[clef] = melange[k] = {ordre:k,left:i*itemWidth, top:j*itemHeight,col:i, row:j, idRef:clef};
					//$myItem.attr('id', clef + 'From' + clef).addClass('col'+i).addClass('row'+j);
        			$myItem.attr('id', 'From' + clef);
        			//$myItem.css({position:'absolute',left:positions[clef].left+'px', top:positions[clef].top+'px',display:'block',width: itemWidth+'px', height:itemHeight+'px'});
            		$myItem.css({background:'url('+srcImg.attr('src')+')', backgroundPosition:'-'+i*itemWidth+'px -'+j*itemHeight+'px'});
        			elements.push($myItem);
					//$game.append($myItem);
        			k++;
            	}
        	}
			
			shuffle();//Mélange

			for (var i = 0; i < elements.length; i++) {
				elements[i].css({position:'absolute',left:melange[i+1].left+'px', top:melange[i+1].top+'px',display:'block',width: itemWidth+'px', height:itemHeight+'px'});
				elements[i].addClass('col'+melange[i+1].col).addClass('row'+melange[i+1].row);
				elements[i].attr('id', melange[i+1].idRef + elements[i].attr('id')); 
				$game.append(elements[i]);
			}
			
			
        	var t = $game.children('li').eq(o.removed-1).attr('id'); // Recuperation de l'index du trou
			trou.current = t.split('From')[0];
			$game.children('li').eq(o.removed-1).remove(); // Ajout du trou
			bindItems();
        }
        
        
        function moveItem(){
        	clicked.animate({top:positions[trou.current].top,left:positions[trou.current].left }, function(){
				clicked.removeClass().addClass('col'+positions[trou.current].col).addClass('row'+positions[trou.current].row);
				var temp = clicked.attr('id').split('From')[0];
				clicked.attr('id', trou.current + 'From' +clicked.attr('id').split('From')[1]);
				trou.current = temp;
        		bindItems();
        	});
        }
        
        function bindItems(){
        	$('.movable').unbind().removeClass('movable');
         	$game.children('li.col'+positions[trou.current].col+'.row'+(parseInt(positions[trou.current].row)+1)+', li.col'+positions[trou.current].col+'.row'+(parseInt(positions[trou.current].row)-1)+', li.col'+(parseInt(positions[trou.current].col)+1)+'.row'+positions[trou.current].row+', li.col'+(parseInt(positions[trou.current].col)-1)+'.row'+positions[trou.current].row).addClass('movable');
        	// Ecouteur d'evenement sur les éléments déplacables
        	$('.movable').click(function(){ $('.movable').unbind(); clicked = $(this); moveItem();});
        };
        
		// Mélange des éléments
		function shuffle(){
			var cibleArray = [];
			
			for (var i = elements.length; i > 0; i--) {
				var rdm = parseInt(Math.random() * 2);
				rdm == 0 ? cibleArray.push(elements.pop()) : cibleArray.push(elements.shift());
			}
			
			elements = cibleArray;
			
			
		}
        
        
        
        
      }); // Fin du return
    } // Fin du taquin
  }); // Fin de l'extend
})(jQuery);