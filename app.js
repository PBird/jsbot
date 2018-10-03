

/*----------BetCOntroller------------------*/

var BetController = function (strategy) {



	const strategies = {
		straight_2_6: strategy_2_6,
		// straight_2_3: strategy_2_3,
		level_4_acc: strategy_4level
	};

	/*xxxxxxx______strategy_2_6_______xxxxxxxxxxx*/

	function strategy_2_6() { // index kaçıncı tur olduğu; lastState ise son bette win mi lost mu
		
		const seriesAmount = [1, 2, 4, 6, 8, 13];
		var index = -1;
		var winAmount = 0;
		var winLimit = 2;
		var times = 2;

		function allReset () {
			index = -1;
			winAmount = 0;
		}

		function reset() {
				index = 0;
				winAmount = 0;
				return seriesAmount[index];
		};

		function win () {
			index++;
			winAmount++;
			var status = (index > (seriesAmount.length-1) || winAmount == winLimit) ? false : true;

			if(status){
				return seriesAmount[index];
			}else{
				return reset();
			}
			
		};

		function lost () {
			index++;
			var status = index > (seriesAmount.length-1) ? false : true;
			if(status){
				return seriesAmount[index];
			}else{
				return reset();
				
			}
		}

		function calcAmountOfBet(lastStatus){
			if(index == -1){
				return reset();
			}
			if(lastStatus == 1) // Win 
			{
				return win();

			}else if(lastStatus == 0){ // lost
				return lost();
			}
		}

		return {
			getAmountOfBet: calcAmountOfBet, // parametre olarak son betin win mi lost mu olduğunu alır. win ise 1 , lost 0 , ilk ise  0 veya 1 den farklı değer
			getTimes: function () {
				 return times;
			},
			allReset: allReset
		};


	};

	/*xxxxxxx_____strategy_4level_____xxxxxxxxxxx*/

	function strategy_4level () {
		const LEVELS = [1, 2, 4, 6];

		const LEVEL_LIMITS = [7, 6, 5, 4];

		
		var levels_profits = [0, 0, 0, 0]; // profits


		var indexOfLevel = -1;
		var index = -1;
		var streakOn = false;
		var streakProfit = 0;
		var times = 2;

		function allReset () {
			indexOfLevel = 0;
			index = -1;
			levels_profits = [0, 0, 0, 0];
			streakProfit = 0;
			streakOn = false;
			streakProfit = 0;
		}

		function reset() {
			indexOfLevel = 0;
			index = 0;
			levels_profits = [0, 0, 0, 0];
			streakProfit = 0;
			streakOn = false;
			streakProfit = 0;


			return LEVELS[indexOfLevel];
		}

		function win() {

			if(streakOn){
				index++;
				streakProfit += LEVELS[indexOfLevel];
				levels_profits[indexOfLevel] += LEVELS[indexOfLevel];

				if(streakProfit >= 0){
					index = 0;
					streakOn = false;
					streakProfit = 0;

					if(indexOfLevel > 0){

						if(	levels_profits[indexOfLevel] + levels_profits[indexOfLevel-1] > 0  ){ 
							levels_profits[indexOfLevel] = 0;
							indexOfLevel--;
							levels_profits[indexOfLevel] = 0;
							return LEVELS[indexOfLevel];
						}else{
							return LEVELS[indexOfLevel];
						}

					}else{
						return LEVELS[indexOfLevel];
					}
				}else {

					if(index > (LEVEL_LIMITS[indexOfLevel] -1)){

						if (levels_profits[indexOfLevel] >= 0) {
							index = 0;
							streakOn = false;
							streakProfit = 0;
							return LEVELS[indexOfLevel];
						}else {
							indexOfLevel++;
							if(indexOfLevel > (LEVELS.length-1)){
								console.log('System over ');
								return reset();
							}else{
								index = 0;
								streakOn = false;
								streakProfit = 0;
								return LEVELS[indexOfLevel];
							}
							
							
						}

					}else {
						return LEVELS[indexOfLevel];
					}

					
				}


			}else{
				if(indexOfLevel >0){
					levels_profits[indexOfLevel] += LEVELS[indexOfLevel];

					if(levels_profits[indexOfLevel] + levels_profits[indexOfLevel-1] > 0){ 
						levels_profits[indexOfLevel] = 0;
						indexOfLevel--;
						levels_profits[indexOfLevel] = 0;
						return LEVELS[indexOfLevel];
					}else {
						return LEVELS[indexOfLevel];
					}


				}else {
					return LEVELS[indexOfLevel];
				}
			}


			// index++;

			// if(streakOn){ // Lost streak var ise
				
			// 	levels_profits[indexOfLevel] += LEVELS[indexOfLevel];
			// 	streakProfit +=  LEVELS[indexOfLevel];

			// 	if(levels_profits[indexOfLevel] >= 0){ // eğer win losta eşit veya fazlaysa  
			// 		index = 0;
			// 		expectedProfit =  indexOfLevel > 0  ? -levels_profits[indexOfLevel-1] : 0;
			// 		if(levels_profits[indexOfLevel] > expectedProfit ){ // eğer önceki levelin zararını karşılamış ve biraz kar etmişse 
			// 			if(indexOfLevel > 0 ){ // 0 levelden büyükse düşür.
			// 				levels_profits[indexOfLevel] = 0;
			// 				indexOfLevel--;
			// 				levels_profits[indexOfLevel] = 0;
			// 				return LEVELS[indexOfLevel];
			// 			}else { // 0 ise  karı sıfırla
			// 				levels_profits[indexOfLevel] = 0;
			// 				return LEVELS[indexOfLevel];
			// 			}
						

			// 		}else{
			// 			if(expectedProfit == 0 && indexOfLevel)


			// 		}


			// 	}else{


			// 	}

			// }else{ // Lost streak yok
			// 	index = 0;

			// 	if(indexOfLevel> 0){ // lost streak yok ve level 0 değilse
			// 		levels_profits[indexOfLevel] += LEVELS[indexOfLevel];
				
			// 		expectedProfit = -levels_profits[indexOfLevel-1];

			// 		if(levels_profits[indexOfLevel] > expectedProfit ){
			// 			levels_profits[indexOfLevel] = 0;
			// 			indexOfLevel--;
			// 			levels_profits[indexOfLevel] = 0;
			// 			return LEVELS[indexOfLevel];

			// 		}else{

			// 			return LEVELS[indexOfLevel];

			// 		}


			// 	}else{ // lost streak yok ve level 0 sa
			// 		return LEVELS[indexOfLevel];
			// 	}
			// }

		
			
		};

		function lost () {

			streakOn = true;
			streakProfit -= LEVELS[indexOfLevel];
			levels_profits[indexOfLevel] -= LEVELS[indexOfLevel];
			index++;

			if( index > (LEVEL_LIMITS[indexOfLevel] - 1) ){

				if(indexOfLevel > 0){
					if(levels_profits[indexOfLevel] >= 0){
						streakOn = false;
						streakProfit = 0;
						index = 0;

						return LEVELS[indexOfLevel];

					}else{
						indexOfLevel++;
						if(indexOfLevel > (LEVELS.length-1)){
							console.log('System over ');
							return reset();
						}else{
							streakOn = false;
							streakProfit = 0;
							index = 0;
							return LEVELS[indexOfLevel];
						}
						
					}

				}else{
					indexOfLevel++;
					if(indexOfLevel > (LEVELS.length-1)){
						console.log('System over ');
						return reset();
					}else{
						streakOn = false;
						streakProfit = 0;
						index = 0;
						return LEVELS[indexOfLevel];
					}
					
				}

			}else {
				return LEVELS[indexOfLevel];
			}


			// streakOn = true;
			// index++;
			// levels_profits[indexOfLevel] -= LEVELS[indexOfLevel];

			// if(index > LEVEL_LIMITS[indexOfLevel]){

			// 	if(indexOfLevel > 0 && levels_profits[indexOfLevel] >= 0){

			// 		index = 0;
			// 		streakOn = false;
			// 		return LEVELS[indexOfLevel];

			// 	}else{

			// 		indexOfLevel++;
			// 		index = 0;
			// 		return LEVELS[indexOfLevel];

			// 	}

			// }else{

			// 	return LEVELS[indexOfLevel];

			// }

		}

		function calcAmountOfBet(lastStatus) {
			
			if(index == -1){
				return reset();
			}else{
				if(lastStatus == 1) // Win 
				{
					return win();

				}else if(lastStatus == 0){ // lost
					return lost();
				}

			}

		
		}

		return {
			getAmountOfBet: calcAmountOfBet, // parametre olarak son betin win mi lost mu olduğunu alır. win ise 1 , lost 0 , ilk ise  0 veya 1 den farklı değer
			getTimes: function () {
				 return times;
			},
			allReset: allReset,
			testing: function () {
				console.log('Level Profits : ', levels_profits);
				console.log('streakOn : ', streakOn);
				console.log('streakProfit: ', streakProfit);
				console.log('indexOfLevel: ', indexOfLevel);
				console.log('index: ', index);
			}
		};


		
	}



	return {
		Bettor: strategies[strategy](), 
	};
	
};

/*----------UIController------------------*/

var UIController = (function (argument) {

	const DOMSTRINGS = {
		betInput: 'bet-input',
		btn_2x: 'bet-btn-2x',
		btn_3x: 'bet-btn-3x',
		btn_5x: 'bet-btn-5x',
		btn_50x: 'bet-btn-50x',
		hash: 'hash'
	};
	

	return {
		setBetValue:function (amount) {
			document.getElementById(DOMSTRINGS.betInput).value = amount;
		},
		clickBtn: function (times) {
			var type_string = '';
			
			document.getElementById(this.getDOMBtn(times)).click()
		},
		getDOMBtn: function (times) {
			switch (times) {
				case 2:
					return DOMSTRINGS.btn_2x;
					break;
				case 3:
					return DOMSTRINGS.btn_3x;
					break;
				case 5:
					return DOMSTRINGS.btn_5x;
					break;
				case 50:
					return DOMSTRINGS.btn_50x;
					break;
				default:
					console.log('hata times');
					return -1;
					break;
			}
		},
		getDOMSTRINGS: function () {
			return DOMSTRINGS;
		}
	};

})();


/*----------AppController------------------*/

var AppController = (function (UICtrl,BetCtrl) {

	var  startBet, Bettor, targetBtn, observer, DOM; 

	/*
		startBet : başlangıç beti 
		Bettor: strategiye geöre bet control objesi
		targetBtn: Bet butonu 2x 3x 5x 50x 
		observer: Bet roundunun başlaması için MutationObserver objesi
	*/
	const NUMBERS = {
		x2: 0,
		x3: 1,
		x5: 2,
		x50: 3

	}

	function DoBet(amount,times) {
		console.log('bet amount : ', amount);
		UICtrl.setBetValue(amount);
		UICtrl.clickBtn(times);
		console.log('Bet yapıldı');
		console.log('------------info---------');
		Bettor.testing();
	}

	function setupEventListener () {
		var targetBtnId = UICtrl.getDOMBtn(Bettor.getTimes());
		var number = NUMBERS['x'+Bettor.getTimes()];
		targetBtn = document.getElementById(targetBtnId);

		observer = new MutationObserver(function(){

  			if(targetBtn.style.display !='none' ){ 

  				var lastStatus = (winner.choice == number);
				console.log('Winner Choice : ',winner.choice );
				console.log('Number : ', number);
				console.log('lastStatus : ' , lastStatus);

  				console.log('Bet yapılıyor');
  				var amount = startBet * Bettor.getAmountOfBet(lastStatus);
  				console.log('amount : ', amount);
  				DoBet(amount, Bettor.getTimes());

  			}
		});
		
	}

	return {
		init: function (strategy) {
			DOM = UICtrl.getDOMSTRINGS();
			// Bettor= BetCtrl('straight_2_6').Bettor;
			Bettor= BetCtrl('level_4_acc').Bettor
			setupEventListener();


		},
		start: function (strtBet) {
			console.log('Bet Starting');
			startBet = strtBet;
			observer.observe(document.getElementById(DOM.hash),  { childList: true });
			console.log('Started');
		},
		pause: function () {
			observer.disconnect();
		},
		resume: function () {
			observer.observe(targetBtn,  { attributes: true, childList: true });
		},
		stop: function () {
			observer.disconnect();
			Bettor.allReset();
		},
		testing: function () {
			return observer;
		},
		testSystem: function (stg,wallet,round) {

			//level_4_acc  
			//straight_2_6 
			Bettor= BetCtrl(stg).Bettor
			var results = [];
			var trues = 0;
			var falses = 0;
			var rand = false;
			var indexon = true;
			var indexOver = 0;
			var bets = [];
			for(let i= 0; i< round;i++){
				var amount = 10 * Bettor.getAmountOfBet(rand);
				bets.push(amount);
				// console.log('Amount: ', amount);
				rand = Math.random() >= 0.5;
				results.push(rand);
				if(rand){
					trues++;
					wallet += amount;
				}else{
					falses++;
					wallet -= amount;
				}
				// console.log('Wallet :', wallet);

				if(wallet < 0 && indexon){
					indexOver = i;
					indexon = false;
				}

			}

			Bettor.allReset();

			//console.log('Wallet : ', wallet);


			return [wallet,indexOver,results,bets];
			
		}


	}
})(UIController,BetController);

AppController.init();


/*

observer = new MutationObserver(function(){

			if(document.getElementById('bet-btn-2x').style.display !='none' ){ 

				console.log('triggered');

			}
		});

observer.observe(document.getElementById('hash'),  {  childList: true });



var bt = new BetController('level_4_acc').Bettor;


var win=0, loss = 0; 
for(var i = 0; i< 1000; i++){
	var a = AppController.testSystem('straight_2_6',2040,10000);
	if (a >= 2040){
		win++;
	}
	else{
    	loss ++;	
	}
};

*/



