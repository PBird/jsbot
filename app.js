

/*----------BetCOntroller------------------*/

var BetController = function (strategy) {



	const strategies = {
		straight_2_6: strategy_2_6,
		// straight_2_3: strategy_2_3,
		// level_4_acc: strategy_4level
	};

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
			Bettor= BetCtrl('straight_2_6').Bettor;
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

*/



