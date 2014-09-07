'use strict';

/**
 * @ngdoc function
 * @name tallytextApp.controller:PersonalPronounCtrl
 * @description
 * # PersonalPronounCtrl
 * Controller of the tallytextApp
 */
angular.module('tallytextApp')
  .controller('PersonalPronounCtrl', ['$scope', 'lexer', function ($scope, lexer) {
		var self = this;
    
		this.tokenCollectionName = 'demo';
		this.knownWords = ['i', 'me', 'he', 'she', 'we', 'us', 'them', 'they', 'you', 'yal', 'her', 'him', 'it'];

		this.totalWordCount = 0;
		this.words = [];
		this.wordCounts = {};
		this.pronouns = [];
				
		lexer.onTokenChange(this.tokenCollectionName, function() {
			self.wordCounts = lexer.getTokenCountsForTargetTokens(self.tokenCollectionName, self.knownWords);
			self.words = lexer.getUniqueTokensFromTokenCounts(self.wordCounts, true);
			self.totalWordCount = lexer.getTotalTokenCountFromTokenCounts(self.wordCounts);
		});

  }]);