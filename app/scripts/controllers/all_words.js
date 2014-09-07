'use strict';

/**
 * @ngdoc function
 * @name tallytextApp.controller:AllWordsCtrl
 * @description
 * # AllWordsCtrl
 * Controller of the tallytextApp
 */
angular.module('tallytextApp')
  .controller('AllWordsCtrl', ['$scope', 'lexer', function ($scope, lexer) {
		var self = this;
    
		this.tokenCollectionName = 'demo';

		this.totalWordCount = 0;
		this.words = [];
		this.wordCounts = {};
				
		lexer.onTokenChange(this.tokenCollectionName, function() {
			// retrieve stats from lexer			
			self.totalWordCount = lexer.getTokens(self.tokenCollectionName).length;
			self.wordCounts = lexer.getTokenCounts(self.tokenCollectionName);
			self.words = lexer.getUniqueTokens(self.tokenCollectionName);
		});

  }]);