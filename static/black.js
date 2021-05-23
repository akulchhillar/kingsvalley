var b = jsboard.board({ attach: "game", size: "5x5",style: "checkerboard",stylePattern: ["#ffffff","#ffffff"]});

b.cell([2,2]).style({background:"#B6C1FF"})

var black_pawn = jsboard.piece({text:"BP", textIndent:"-9999px", background:"url('https://i.ibb.co/NKfXsrs/bP.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var red_pawn = jsboard.piece({text:"WP", textIndent:"-9999px", background:"url('https://i.ibb.co/bN064jX/wP.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var black_king = jsboard.piece({text:"BK", textIndent:"-9999px", background:"url('https://i.ibb.co/DCzq9HR/bK.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });
var red_king = jsboard.piece({text:"WK", textIndent:"-9999px", background:"url('https://i.ibb.co/C1FVyzW/wK.png') no-repeat", width:"50px", height:"50px", margin:"0 auto" });

var firstmove = false; // keeps a track whether the first move has been played or not

var k_pos = [0,2]; //white kings position


var cbm = false; //a variable which ensures if black can move or not
unclickable_board()

var pieces = [

black_pawn.clone(),
black_pawn.clone(),
black_king.clone(),
black_pawn.clone(),
black_pawn.clone(),
red_pawn.clone(),
red_pawn.clone(),
red_king.clone(),
red_pawn.clone(),
red_pawn.clone()

]

var from,where; // locations for tracking the movement of a piece


for (let i=0; i<5;i++){
	
	// pieces.push(black_pawn.clone())
	b.cell([0,i]).place(pieces[i])
}

for (let i=5; i<10;i++){
	// pieces.push(red_pawn.clone())
	b.cell([4,i-5]).place(pieces[i])
}

var bindMoveLocs,bindMovePiece;


for (var i=0; i<pieces.length; i++)
		if (pieces[i].textContent == "BP" || pieces[i].textContent == "BK"){
		pieces[i].addEventListener("click", function() { showMoves(this); });
	}


let socket = io.connect(window.origin +"/black")
let room = window.location.pathname.split("/")[2]


socket.on("connect",()=>{socket.send(room)})

socket.on("cbm",(data)=>{
	cbm = true;
	blackcheck()
})



socket.on("wm",(data)=>{movePieceSocket(data[0],data[1])}) //gets the move from white

socket.on("result",(data)=>{
		document.getElementById("results").firstElementChild.innerHTML = data;
		document.getElementById("results").style.display="block"
})





function showMoves(piece){



	resetBoard()
	var thisPiece = b.cell(piece.parentNode).get();
	var newLocs = [];
	var dummyLocs = [];
	var loc;



	
	loc = b.cell(piece.parentNode).where();
	from = loc




	if (thisPiece){
		var current_row = loc[0] // current row of the token
		var current_col = loc[1] //current colum of the token
		// var text = b.cell([current_row, current_col]).get()

		moveup([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		dummyLocs.length = 0;

		movedown([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
				
		dummyLocs.length = 0;

		moveleft([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;

		moveright([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;

		moveur([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;

		moveul([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;

		movedr([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;

		movedl([current_row,current_col],dummyLocs,thisPiece)
		if(dummyLocs.length>0){newLocs.push(dummyLocs[dummyLocs.length-1])}
		
		dummyLocs.length = 0;




}



bindMoveLocs = newLocs.slice()
bindMovePiece = piece
bindMoveEvents(bindMoveLocs)





}

function moveup(current_tile,arr,thisPiece){ //move a piece up

	var cr = current_tile[0];
	var cc = current_tile[1];
	
	
	if (b.cell([cr-1,cc]) && b.cell([cr-1,cc]).get()==null) {
		
		arr.push([cr-1,cc])
		moveup([cr-1,cc],arr)
	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

	
}

function movedown(current_tile,arr,thisPiece){ //move a piece down

	var cr = current_tile[0];
	var cc = current_tile[1];

	if (b.cell([cr+1,cc]) && b.cell([cr+1,cc]).get()==null) {

		arr.push([cr+1,cc])
		movedown([cr+1,cc],arr)

	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}
}


function moveleft(current_tile,arr,thisPiece){ //move a piece left

	var cr = current_tile[0];
	var cc = current_tile[1];

	if(b.cell([cr,cc-1]) && b.cell([cr,cc-1]).get()==null){
		arr.push([cr,cc-1])
		moveleft([cr,cc-1],arr)

	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}

function moveright(current_tile,arr,thisPiece){ //move a piece left

	var cr = current_tile[0];
	var cc = current_tile[1];

	if(b.cell([cr,cc+1]) && b.cell([cr,cc+1]).get()==null){
		arr.push([cr,cc+1])
		moveright([cr,cc+1],arr)

	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}


function moveur(current_tile,arr,thisPiece){ //move a piece up right

	var cr = current_tile[0];
	var cc = current_tile[1];

	if (b.cell([cr-1,cc+1]) && b.cell([cr-1,cc+1]).get()==null){
		arr.push([cr-1,cc+1])
		moveur([cr-1,cc+1],arr)
	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}

function moveul(current_tile,arr,thisPiece){ //move a piece up left

	var cr = current_tile[0];
	var cc = current_tile[1];

	if (b.cell([cr-1,cc-1]) && b.cell([cr-1,cc-1]).get()==null){
		arr.push([cr-1,cc-1])
		moveul([cr-1,cc-1],arr)
	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}

function movedr(current_tile,arr,thisPiece){ //move a piece down right

	var cr = current_tile[0];
	var cc = current_tile[1];

	if (b.cell([cr+1,cc+1]) && b.cell([cr+1,cc+1]).get()==null){
		arr.push([cr+1,cc+1])
		movedr([cr+1,cc+1],arr)
	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}

function movedl(current_tile,arr,thisPiece){ //move a piece down left

	var cr = current_tile[0];
	var cc = current_tile[1];

	if (b.cell([cr+1,cc-1]) && b.cell([cr+1,cc-1]).get()==null){
		arr.push([cr+1,cc-1])
		movedl([cr+1,cc-1],arr)
	}

	if (thisPiece == "BP" || thisPiece == "WP"){

		for (let i = 0; i<arr.length; i++){
			if (arr[i][0]==2 && arr[i][1]==2){
				arr.splice(i,1)
				
			}
		}

	}

}




function bindMoveEvents(locs) { //shows available squares for a piece
	for (var i=0; i<locs.length; i++) {
		b.cell(locs[i]).DOM().classList.add("green")
		 b.cell(locs[i]).on("click", movePiece);
		 


	}
}

function movePiece() {
    var userClick = b.cell(this).where();
    if (bindMoveLocs.indexOf(userClick)) {
        b.cell(userClick).place(bindMovePiece);
        
      	if (userClick[0]==2 && userClick[1]==2){
      		if (bindMovePiece.textContent=="WK"){
		document.getElementById("results").firstElementChild.innerHTML = "White Won!";
		document.getElementById("results").style.display="block"
		unclickable_board()
      		}
  			if (bindMovePiece.textContent=="BK"){
			document.getElementById("results").firstElementChild.innerHTML = "You Won!";
		document.getElementById("results").style.display="block"
		unclickable_board()
  			}
      	}






      	where = userClick
      	socket.emit("bm",[from,where,room]) //sends the move to the server
        resetBoard();
        highlight();
        
        if (bindMovePiece.textContent=="BK"){k_pos=where}
    	checkmate(k_pos[0],k_pos[1])
        
    }
	



}

function resetBoard() { //resets the board and remove green squares
    for (var r=0; r<b.rows(); r++) {
        for (var c=0; c<b.cols(); c++) {
            b.cell([r,c]).DOM().classList.remove("green");
             b.cell([r,c]).removeOn("click", movePiece);

           
        }
    }
}

function highlight() {

	    for (var r=0; r<b.rows(); r++) {
        for (var c=0; c<b.cols(); c++) {
            b.cell([r,c]).DOM().classList.remove("orange");
             

           
        }
    }

	b.cell(from).DOM().classList.add("orange");
	b.cell(where).DOM().classList.add("orange");






	 

unclickable_board()
firstmove = true; // after making the move it makes the board unclickable for the player

}

function movePieceSocket(from_s,where_s) {

    b.cell(where_s).place(b.cell(from_s).DOM().firstElementChild)
    highlightSocket(from_s,where_s)

          	if (where_s[0]==2 && where_s[1]==2){
      		if (b.cell(where_s).get()=="WK"){
		document.getElementById("results").firstElementChild.innerHTML = "White Won!";
		document.getElementById("results").style.display="block"
		unclickable_board()
      		}
  			if (b.cell(where_s).get()=="BK"){
			document.getElementById("results").firstElementChild.innerHTML = "You Won!";
		document.getElementById("results").style.display="block"
		unclickable_board()
  			}
      	}



	checkmate(k_pos[0],k_pos[1])

    //moves piece when a move is received from the opponent
}

function highlightSocket(from_s,where_s){
	//highlights the piece when a move is received from the opponent
		    for (var r=0; r<b.rows(); r++) {
        for (var c=0; c<b.cols(); c++) {
            b.cell([r,c]).DOM().classList.remove("orange");
        }
    }
	b.cell(from_s).DOM().classList.add("orange");
	b.cell(where_s).DOM().classList.add("orange");


clickable_board() // after receiving the move makes the board clickable

}

function unclickable_board(){
	for (let r = 0;r<5;r++){
		for (let c = 0 ; c<5; c++){
			b.cell([r,c]).DOM().classList.add("notclickable")
		}
	}
}

function clickable_board(){
	for (let r = 0;r<5;r++){
		for (let c = 0 ; c<5; c++){
			b.cell([r,c]).DOM().classList.remove("notclickable")
		}
	}
}

function blackcheck(){
if (cbm){
	clickable_board()
if (firstmove == false){
	b.cell([0,2]).DOM().classList.add("notclickable")

}
}
}

function checkmate(r,c){

	//check of the king is checkmated or not
	let score = 0 
	if (b.cell([r-1,c]) && b.cell([r-1,c]).get()==null){score +=1} //up square
	if (b.cell([r+1,c]) && b.cell([r+1,c]).get()==null){score +=1} //bottom square
	if (b.cell([r,c-1]) && b.cell([r,c-1]).get()==null){score +=1} //left square
	if (b.cell([r,c+1]) && b.cell([r,c+1]).get()==null){score +=1} //right square
	if (b.cell([r-1,c+1]) && b.cell([r-1,c+1]).get()==null){score +=1} //upper right square
	if (b.cell([r-1,c-1]) && b.cell([r-1,c-1]).get()==null){score +=1} //upper left square
	if (b.cell([r+1,c+1]) && b.cell([r+1,c+1]).get()==null){score +=1} //bottom right square
	if (b.cell([r+1,c-1]) && b.cell([r+1,c-1]).get()==null){score +=1} //bottom left square
	if (score==0){

		unclickable_board()
		socket.emit("result",["Black is Checkmated. You Win!",room])
		document.getElementById("results").firstElementChild.innerHTML = "You got checkmated!";
		document.getElementById("results").style.display="block" 


	}

	
}