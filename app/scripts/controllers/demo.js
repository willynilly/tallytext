'use strict';

/**
 * @ngdoc function
 * @name tallytextApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the tallytextApp
 */
angular.module('tallytextApp')
  .controller('DemoCtrl', ['$scope', 'lexer', function($scope, lexer) {
    this.tokenCollectionName = 'demo';
		this.demoText = '';
		this.words = [];
		this.totalWordCount = 0;
 		this.wordCounts = {};
				
		this.appendText = function(s) {
			this.demoText += s;
		};
		
		this.analyzeText = function() {
			console.log('analyze text');
			// update the lexer with demo text
			lexer.setTokensFromString(this.tokenCollectionName, this.demoText);
		};
		
  }]);
